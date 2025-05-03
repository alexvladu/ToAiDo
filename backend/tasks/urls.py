from django.urls import path
from .views import TaskListView, TaskDetailView

urlpatterns = [
    path('users/<int:userid>/tasks/', TaskListView.as_view(), name='task-list'),
    path('users/<int:userid>/tasks/<int:pk>/', TaskDetailView.as_view(), name='task-detail')
]