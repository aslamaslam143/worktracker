# from datetime import datetime
# from django.db.models import Sum, Count, Q
# from rest_framework import viewsets, permissions, filters, status
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from django_filters.rest_framework import DjangoFilterBackend
# from .models import Task
# from .serializers import TaskSerializer

# class TaskViewSet(viewsets.ModelViewSet):
#     serializer_class = TaskSerializer
#     permission_classes = [permissions.IsAuthenticated]
#     filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
#     filterset_fields = ['status', 'priority', 'project_name', 'work_date']
#     search_fields = ['title', 'description', 'project_name', 'technologies']
#     ordering_fields = ['work_date', 'priority', 'status', 'created_at']
#     ordering = ['-work_date', '-created_at']

#     def get_queryset(self):
#         user_id = self.request.user.clerk_id
#         qs = Task.objects.filter(clerk_user_id=user_id)
        
#         # Date range support
#         start_date = self.request.query_params.get('start_date')
#         end_date = self.request.query_params.get('end_date')
#         if start_date:
#             qs = qs.filter(work_date__gte=start_date)
#         if end_date:
#             qs = qs.filter(work_date__lte=end_date)
            
#         return qs

# class DashboardStatsView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request):
#         user_id = request.user.clerk_id
#         now = datetime.now()
#         year = int(request.query_params.get('year', now.year))
#         month = int(request.query_params.get('month', now.month))

#         user_tasks = Task.objects.filter(clerk_user_id=user_id)
#         monthly_tasks = user_tasks.filter(work_date__year=year, work_date__month=month)

#         total_tasks = monthly_tasks.count()
#         completed = monthly_tasks.filter(status=Task.Status.COMPLETED).count()
#         in_progress = monthly_tasks.filter(status=Task.Status.IN_PROGRESS).count()
#         pending = monthly_tasks.filter(status=Task.Status.PENDING).count()
#         on_hold = monthly_tasks.filter(status=Task.Status.ON_HOLD).count()
#         yet_to_start = monthly_tasks.filter(status=Task.Status.YET_TO_START).count()
#         total_hours = monthly_tasks.aggregate(Sum('hours_worked'))['hours_worked__sum'] or 0.0

#         completion_pct = round((completed / total_tasks * 100), 1) if total_tasks > 0 else 0

#         # Project distribution
#         projects_summary = monthly_tasks.values('project_name').annotate(
#             count=Count('id'),
#             hours=Sum('hours_worked')
#         ).order_by('-count')

#         # Recent Tasks
#         recent_tasks = TaskSerializer(user_tasks.order_by('-work_date', '-created_at')[:6], many=True).data

#         # Daily activity for the month
#         daily_activity = monthly_tasks.values('work_date').annotate(
#             completed=Count('id', filter=Q(status=Task.Status.COMPLETED)),
#             in_progress=Count('id', filter=Q(status=Task.Status.IN_PROGRESS)),
#             pending=Count('id', filter=Q(status=Task.Status.PENDING))
#         ).order_by('work_date')

#         return Response({
#             'total_tasks': total_tasks,
#             'completed': completed,
#             'in_progress': in_progress,
#             'pending': pending,
#             'on_hold': on_hold,
#             'yet_to_start': yet_to_start,
#             'total_hours': float(total_hours),
#             'completion_percentage': completion_pct,
#             'projects_summary': list(projects_summary),
#             'recent_tasks': recent_tasks,
#             'daily_activity': list(daily_activity),
#         })

# class CalendarEventsView(APIView):
#     permission_classes = [permissions.IsAuthenticated]

#     def get(self, request):
#         user_id = request.user.clerk_id
#         start = request.query_params.get('start')
#         end = request.query_params.get('end')

#         qs = Task.objects.filter(clerk_user_id=user_id)
#         if start:
#             qs = qs.filter(work_date__gte=start)
#         if end:
#             qs = qs.filter(work_date__lte=end)

#         status_colors = {
#             'Completed': '#10B981',
#             'In Progress': '#3B82F6',
#             'Pending': '#F59E0B',
#             'On Hold': '#EF4444',
#             'Yet to Start': '#6B7280'
#         }

#         events = []
#         for t in qs:
#             events.append({
#                 'id': str(t.id),
#                 'title': f"{t.project_name}: {t.title}",
#                 'start': t.work_date.isoformat(),
#                 'backgroundColor': status_colors.get(t.status, '#3B82F6'),
#                 'borderColor': status_colors.get(t.status, '#3B82F6'),
#                 'extendedProps': {
#                     'project_name': t.project_name,
#                     'status': t.status,
#                     'priority': t.priority,
#                     'hours_worked': float(t.hours_worked),
#                     'description': t.description,
#                     'technologies': t.technologies,
#                     'remarks': t.remarks,
#                 }
#             })

#         return Response(events)

from datetime import datetime
from django.db.models import Sum, Count, Q
from rest_framework import viewsets, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task, Project
from .serializers import TaskSerializer, ProjectSerializer

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'project_name', 'work_date']
    search_fields = ['title', 'description', 'project_name', 'technologies']
    ordering_fields = ['work_date', 'priority', 'status', 'created_at']
    ordering = ['-work_date', '-created_at']

    def get_queryset(self):
        user_id = self.request.user.clerk_id
        qs = Task.objects.filter(clerk_user_id=user_id)
        
        # Date range support
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        if start_date:
            qs = qs.filter(work_date__gte=start_date)
        if end_date:
            qs = qs.filter(work_date__lte=end_date)
            
        return qs


# --- PROJECT API VIEWS (Persistent DB Create, Read, Update, Delete) ---
class ProjectListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.clerk_id
        projects = Project.objects.filter(clerk_user_id=user_id).order_by('created_at')
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProjectSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProjectDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        user_id = request.user.clerk_id
        try:
            project = Project.objects.get(id=pk, clerk_user_id=user_id)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

        old_name = project.name
        serializer = ProjectSerializer(project, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            updated_project = serializer.save()
            
            # Project rename aanaal adhoda associated tasks-aiyum new project name-kku sync pannuvom
            new_name = request.data.get('name')
            if new_name and new_name != old_name:
                Task.objects.filter(clerk_user_id=user_id, project_name=old_name).update(project_name=new_name)

            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        user_id = request.user.clerk_id
        try:
            project = Project.objects.get(id=pk, clerk_user_id=user_id)
            project_name = project.name
            
            # 1. Project record-ai delete seigirom
            project.delete()

            # 2. Andha project-la irukura tasks-aiyum serthu delete seigirom
            # (Irundha thaan refresh pannumbodhu thirumba project name extract aagadhu)
            Task.objects.filter(clerk_user_id=user_id, project_name=project_name).delete()

            return Response({'message': 'Project and associated tasks deleted permanently'}, status=status.HTTP_204_NO_CONTENT)
        except Project.DoesNotExist:
            return Response({'error': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)


# --- DASHBOARD & CALENDAR VIEWS ---
class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.clerk_id
        now = datetime.now()
        year = int(request.query_params.get('year', now.year))
        month = int(request.query_params.get('month', now.month))

        user_tasks = Task.objects.filter(clerk_user_id=user_id)
        monthly_tasks = user_tasks.filter(work_date__year=year, work_date__month=month)

        total_tasks = monthly_tasks.count()
        completed = monthly_tasks.filter(status=Task.Status.COMPLETED).count()
        in_progress = monthly_tasks.filter(status=Task.Status.IN_PROGRESS).count()
        pending = monthly_tasks.filter(status=Task.Status.PENDING).count()
        on_hold = monthly_tasks.filter(status=Task.Status.ON_HOLD).count()
        yet_to_start = monthly_tasks.filter(status=Task.Status.YET_TO_START).count()
        total_hours = monthly_tasks.aggregate(Sum('hours_worked'))['hours_worked__sum'] or 0.0

        completion_pct = round((completed / total_tasks * 100), 1) if total_tasks > 0 else 0

        # Project distribution
        projects_summary = monthly_tasks.values('project_name').annotate(
            count=Count('id'),
            hours=Sum('hours_worked')
        ).order_by('-count')

        # Recent Tasks
        recent_tasks = TaskSerializer(user_tasks.order_by('-work_date', '-created_at')[:6], many=True).data

        # Daily activity for the month
        daily_activity = monthly_tasks.values('work_date').annotate(
            completed=Count('id', filter=Q(status=Task.Status.COMPLETED)),
            in_progress=Count('id', filter=Q(status=Task.Status.IN_PROGRESS)),
            pending=Count('id', filter=Q(status=Task.Status.PENDING))
        ).order_by('work_date')

        return Response({
            'total_tasks': total_tasks,
            'completed': completed,
            'in_progress': in_progress,
            'pending': pending,
            'on_hold': on_hold,
            'yet_to_start': yet_to_start,
            'total_hours': float(total_hours),
            'completion_percentage': completion_pct,
            'projects_summary': list(projects_summary),
            'recent_tasks': recent_tasks,
            'daily_activity': list(daily_activity),
        })

class CalendarEventsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.clerk_id
        start = request.query_params.get('start')
        end = request.query_params.get('end')

        qs = Task.objects.filter(clerk_user_id=user_id)
        if start:
            qs = qs.filter(work_date__gte=start)
        if end:
            qs = qs.filter(work_date__lte=end)

        status_colors = {
            'Completed': '#10B981',
            'In Progress': '#3B82F6',
            'Pending': '#F59E0B',
            'On Hold': '#EF4444',
            'Yet to Start': '#6B7280'
        }

        events = []
        for t in qs:
            events.append({
                'id': str(t.id),
                'title': f"{t.project_name}: {t.title}",
                'start': t.work_date.isoformat(),
                'backgroundColor': status_colors.get(t.status, '#3B82F6'),
                'borderColor': status_colors.get(t.status, '#3B82F6'),
                'extendedProps': {
                    'project_name': t.project_name,
                    'status': t.status,
                    'priority': t.priority,
                    'hours_worked': float(t.hours_worked),
                    'description': t.description,
                    'technologies': t.technologies,
                    'remarks': t.remarks,
                }
            })

        return Response(events)