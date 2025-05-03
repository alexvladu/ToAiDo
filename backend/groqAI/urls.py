from django.urls import path
from .views import GroqCompletionView

urlpatterns = [
    path('complete/', GroqCompletionView.as_view(), name='groq-complete'),
]
