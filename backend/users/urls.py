# users/urls.py
from django.urls import path
from .views import SignupView, LoginView, GetMeView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', GetMeView.as_view(), name='me')
]
