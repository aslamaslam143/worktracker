import csv
from datetime import datetime
from django.http import HttpResponse
from django.db.models import Sum, Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
import openpyxl
from tasks.models import Task
from tasks.serializers import TaskSerializer

class MonthlyReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.clerk_id
        now = datetime.now()
        year = int(request.query_params.get('year', now.year))
        month = int(request.query_params.get('month', now.month))

        tasks = Task.objects.filter(clerk_user_id=user_id, work_date__year=year, work_date__month=month)

        total_tasks = tasks.count()
        completed = tasks.filter(status=Task.Status.COMPLETED).count()
        pending = tasks.filter(status__in=[Task.Status.PENDING, Task.Status.YET_TO_START, Task.Status.IN_PROGRESS, Task.Status.ON_HOLD]).count()
        total_hours = tasks.aggregate(Sum('hours_worked'))['hours_worked__sum'] or 0.0
        completion_pct = round((completed / total_tasks * 100), 1) if total_tasks > 0 else 0

        project_summary = tasks.values('project_name').annotate(
            total_tasks=Count('id'),
            completed_tasks=Count('id', filter=Q(status=Task.Status.COMPLETED)),
            total_hours=Sum('hours_worked')
        )

        completed_tasks = TaskSerializer(tasks.filter(status=Task.Status.COMPLETED), many=True).data
        pending_tasks = TaskSerializer(tasks.exclude(status=Task.Status.COMPLETED), many=True).data

        return Response({
            'year': year,
            'month': month,
            'total_tasks': total_tasks,
            'completed_tasks_count': completed,
            'pending_tasks_count': pending,
            'total_hours': float(total_hours),
            'completion_percentage': completion_pct,
            'project_summary': list(project_summary),
            'completed_tasks': completed_tasks,
            'pending_tasks': pending_tasks,
            'all_tasks': TaskSerializer(tasks, many=True).data,
        })

class ExportCSVView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.clerk_id
        now = datetime.now()
        year = int(request.query_params.get('year', now.year))
        month = int(request.query_params.get('month', now.month))

        tasks = Task.objects.filter(clerk_user_id=user_id, work_date__year=year, work_date__month=month)

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="WorkTracker_Report_{year}_{month:02d}.csv"'

        writer = csv.writer(response)
        writer.writerow(['Task ID', 'Work Date', 'Project', 'Title', 'Status', 'Priority', 'Hours Worked', 'Technologies', 'Description', 'Remarks'])

        for t in tasks:
            writer.writerow([
                str(t.id), t.work_date, t.project_name, t.title, t.status, t.priority,
                t.hours_worked, t.technologies, t.description, t.remarks
            ])

        return response

class ExportExcelView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.clerk_id
        now = datetime.now()
        year = int(request.query_params.get('year', now.year))
        month = int(request.query_params.get('month', now.month))

        tasks = Task.objects.filter(clerk_user_id=user_id, work_date__year=year, work_date__month=month)

        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = f"{datetime(year, month, 1).strftime('%b %Y')}"

        headers = ['Task ID', 'Work Date', 'Project', 'Title', 'Status', 'Priority', 'Hours Worked', 'Technologies', 'Description', 'Remarks']
        ws.append(headers)

        for t in tasks:
            ws.append([
                str(t.id), str(t.work_date), t.project_name, t.title, t.status, t.priority,
                float(t.hours_worked), t.technologies, t.description, t.remarks
            ])

        response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        response['Content-Disposition'] = f'attachment; filename="WorkTracker_Report_{year}_{month:02d}.xlsx"'
        wb.save(response)
        return response