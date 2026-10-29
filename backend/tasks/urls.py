from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TaskViewSet, 
    DashboardStatsView, 
    CalendarEventsView, 
    ProjectListCreateView, 
    ProjectDetailView
)

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('calendar/events/', CalendarEventsView.as_view(), name='calendar-events'),
    path('projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    path('projects/<uuid:pk>/', ProjectDetailView.as_view(), name='project-detail'),
]