import uuid
from django.db import models

class Task(models.Model):
    class Status(models.TextChoices):
        YET_TO_START = 'Yet to Start', 'Yet to Start'
        IN_PROGRESS = 'In Progress', 'In Progress'
        PENDING = 'Pending', 'Pending'
        ON_HOLD = 'On Hold', 'On Hold'
        COMPLETED = 'Completed', 'Completed'

    class Priority(models.TextChoices):
        LOW = 'Low', 'Low'
        MEDIUM = 'Medium', 'Medium'
        HIGH = 'High', 'High'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    clerk_user_id = models.CharField(max_length=255, db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    project_name = models.CharField(max_length=150, db_index=True)
    work_date = models.DateField(db_index=True)
    due_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.YET_TO_START, db_index=True)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM)
    hours_worked = models.DecimalField(max_digits=5, decimal_places=2, default=0.0)
    technologies = models.CharField(max_length=255, blank=True, default='')
    remarks = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-work_date', '-created_at']
        indexes = [
            models.Index(fields=['clerk_user_id', 'work_date']),
            models.Index(fields=['clerk_user_id', 'status']),
            models.Index(fields=['clerk_user_id', 'project_name']),
        ]

    def __str__(self):
        return f"{self.project_name}: {self.title} ({self.work_date})"