from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Task
from .serializers import TaskSerializer

# GET /api/users/<int:userid>/tasks/
# POST /api/users/<int:userid>/tasks/
class TaskListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, userid):
        if request.user.id != userid:
            return Response({"detail": "You are not authorized to view these tasks."}, status=status.HTTP_403_FORBIDDEN)
        
        tasks = Task.objects.filter(user=request.user)
        serializer = TaskSerializer(tasks, many=True)

        return Response(serializer.data)
    def post(self, request, userid):
        if request.user.id != userid:
            return Response({"detail": "You are not authorized to create tasks for this user."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# DELETE /api/users/<int:userid>/tasks/<int:pk>/
# PATCH /api/users/<int:userid>/tasks/<int:pk>/

class TaskDetailView(APIView):
   permission_classes = [IsAuthenticated]

   def delete(self, request, userid, pk):
       # Verifică dacă utilizatorul autentificat este cel cerut
       if request.user.id != userid:
           return Response(
               {"detail": "You are not authorized to delete this task."},
               status=status.HTTP_403_FORBIDDEN
           )
       
       # Caută task-ul
       try:
           task = Task.objects.get(id=pk, user_id=userid)
       except Task.DoesNotExist:
           return Response(
               {"detail": "Task not found."},
               status=status.HTTP_404_NOT_FOUND
           )

       task.delete()
       return Response(status=status.HTTP_204_NO_CONTENT)

   def patch(self, request, userid, pk):
       # Verifică dacă utilizatorul autentificat este cel cerut
       if request.user.id != userid:
           return Response(
               {"detail": "You are not authorized to update this task."},
               status=status.HTTP_403_FORBIDDEN
           )
       
       # Caută task-ul
       try:
           task = Task.objects.get(id=pk, user_id=userid)
       except Task.DoesNotExist:
           return Response(
               {"detail": "Task not found."},
               status=status.HTTP_404_NOT_FOUND
           )

       # Actualizează parțial task-ul
       serializer = TaskSerializer(task, data=request.data, partial=True)
       if serializer.is_valid():
           serializer.save()
           return Response(serializer.data, status=status.HTTP_200_OK)
       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)