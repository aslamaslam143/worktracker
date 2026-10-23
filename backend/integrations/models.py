import uuid
from django.db import models
from tasks.models import Task

class GoogleSheetsSyncLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    clerk_user_id = models.CharField(max_length=255, db_index=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='sync_logs', null=True, blank=True)
    status = models.CharField(max_length=50)  # SUCCESS, FAILED
    sheet_name = models.CharField(max_length=100)
    error_message = models.TextField(blank=True, default='')
    synced_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-synced_at']