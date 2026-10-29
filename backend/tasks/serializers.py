# from rest_framework import serializers
# from .models import Task

# class TaskSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Task
#         fields = [
#             'id', 'title', 'description', 'project_name',
#             'work_date', 'due_date', 'status', 'priority',
#             'hours_worked', 'technologies', 'remarks',
#             'created_at', 'updated_at'
#         ]
#         read_only_fields = ['id', 'created_at', 'updated_at']

#     def create(self, validated_data):
#         clerk_user = self.context['request'].user
#         validated_data['clerk_user_id'] = clerk_user.clerk_id
#         return super().create(validated_data)


from rest_framework import serializers
from .models import Task, Project

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'project_name',
            'work_date', 'due_date', 'status', 'priority',
            'hours_worked', 'technologies', 'remarks',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        clerk_user = self.context['request'].user
        validated_data['clerk_user_id'] = clerk_user.clerk_id
        return super().create(validated_data)


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ['id', 'name', 'color', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        clerk_user = self.context['request'].user
        validated_data['clerk_user_id'] = clerk_user.clerk_id
        return super().create(validated_data)