from django.urls import path
from . import views

app_name = 'telegramBot'

urlpatterns = [
    path('some/', views.some, name='some'),
]