from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tasks.views import TaskViewSet, DashboardStatsView, CalendarEventsView
from tasks.project_views import ProjectListCreateView
from reports.views import MonthlyReportView, ExportCSVView, ExportExcelView
from integrations.views import GoogleSheetsStatusView, GoogleSheetsSyncView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # Projects
    path('api/projects/', ProjectListCreateView.as_view(), name='project-list-create'),
    # Dashboard & Calendar
    path('api/dashboard/stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('api/calendar/events/', CalendarEventsView.as_view(), name='calendar-events'),
    # Reports
    path('api/reports/monthly/', MonthlyReportView.as_view(), name='monthly-report'),
    path('api/reports/export/csv/', ExportCSVView.as_view(), name='export-csv'),
    path('api/reports/export/excel/', ExportExcelView.as_view(), name='export-excel'),
    # Integrations
    path('api/integrations/google-sheets/status/', GoogleSheetsStatusView.as_view(), name='sheets-status'),
    path('api/integrations/google-sheets/sync/', GoogleSheetsSyncView.as_view(), name='sheets-sync'),
]