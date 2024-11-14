from django.urls import path
from . import views

urlpatterns = [
    # path('get_users/', views.get_users, name='get_users'),
    path('csrf-token/', views.csrf_token_view, name='csrf_token_view'),
    path('login/', views.login_view, name='login_view'),
]