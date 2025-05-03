from django.urls import path
from .views import OpenAICompletionView  # importă view-ul OpenAI

urlpatterns = [
    path('completion/', OpenAICompletionView.as_view(), name='openai-completion'),
]
