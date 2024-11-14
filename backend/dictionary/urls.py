from django.urls import path
from . import views

app_name = 'dictionaries'

urlpatterns = [
    path('list/', views.get_dictionaries_list, name='dictionaries_list'),
    path('countries/', views.get_countries, name='countries'),
    path('cities/', views.get_cities, name='cities'),
    path('terminals/', views.get_terminals, name='terminals'),
    path('currencies/', views.get_currencies, name='currencies'),
    path('containers/', views.get_containers, name='containers'),
    path('danger-classes/', views.get_danger_classes, name='danger_classes'),
    path('incoterms/', views.get_incoterms, name='incoterms'),
    path('packaging-types/', views.get_packaging_types, name='packaging_types'),
    path('delivery-types/', views.get_delivery_types, name='delivery_types'),
    path('cargos/', views.get_cargos, name='cargos'),
    path('all/', views.get_all_dictionaries, name='all_dictionaries'),
]
