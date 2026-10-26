from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Count, Sum
from .models import Task

COLORS = [
    'bg-blue-500', 'bg-emerald-500', 'bg-amber-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
]


class ProjectListCreateView(APIView):
    """
    GET  /api/projects/  → list unique projects for the logged-in user
    POST /api/projects/  → create a task placeholder so the project name exists
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_id = request.user.clerk_id
        projects = (
            Task.objects
            .filter(clerk_user_id=user_id)
            .values('project_name')
            .annotate(task_count=Count('id'), total_hours=Sum('hours_worked'))
            .order_by('project_name')
        )
        result = []
        for idx, p in enumerate(projects):
            result.append({
                'name': p['project_name'],
                'color': COLORS[idx % len(COLORS)],
                'task_count': p['task_count'],
                'total_hours': float(p['total_hours'] or 0),
            })
        return Response(result)

    def post(self, request):
        name = request.data.get('name', '').strip()
        if not name:
            return Response(
                {'error': 'Project name is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        color = request.data.get('color', COLORS[0])
        return Response({'name': name, 'color': color}, status=status.HTTP_201_CREATED)
