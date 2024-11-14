from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import (
    Employee, Department, Position, 
    Country, City, Terminal, Currency, Container,
    DangerClass, Incoterms, PackagingType, DeliveryType, Cargo
)
from django.http import JsonResponse
from django.urls import path

# Существующие классы
class EmployeeInline(admin.StackedInline):
    model = Employee
    can_delete = False
    
    class Media:
        js = ('js/employee_admin.js',)

@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ('name', 'department')
    list_filter = ('department',)

@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_uk', 'alpha2', 'alpha3', 'numeric_code')
    search_fields = ('name_en', 'name_uk', 'alpha2', 'alpha3')
    list_filter = ('alpha2', 'alpha3')

@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_uk', 'country')
    search_fields = ('name_en', 'name_uk')
    list_filter = ('country',)

@admin.register(Terminal)
class TerminalAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_uk', 'terminal_type', 'city', 'country')
    search_fields = ('name_en', 'name_uk')
    list_filter = ('terminal_type', 'city', 'country')

@admin.register(Currency)
class CurrencyAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')

@admin.register(Container)
class ContainerAdmin(admin.ModelAdmin):
    list_display = ('size', 'container_type', 'length', 'width', 'height', 'internal_volume')
    search_fields = ('size', 'container_type')
    list_filter = ('container_type',)

# Новые классы для грузов
@admin.register(DangerClass)
class DangerClassAdmin(admin.ModelAdmin):
    list_display = ('class_number', 'sub_class', 'un_code', 'description')
    search_fields = ('class_number', 'un_code')
    list_filter = ('class_number',)

@admin.register(Incoterms)
class IncotermsAdmin(admin.ModelAdmin):
    list_display = ('abbreviation', 'description')
    search_fields = ('abbreviation',)

@admin.register(PackagingType)
class PackagingTypeAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_uk', 'description')
    search_fields = ('name_en', 'name_uk')

@admin.register(DeliveryType)
class DeliveryTypeAdmin(admin.ModelAdmin):
    list_display = ('short_name', 'full_name', 'description')
    search_fields = ('short_name', 'full_name')

@admin.register(Cargo)
class CargoAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'name_uk', 'cargo_code', 'is_dangerous', 'danger_class')
    search_fields = ('name_en', 'name_uk', 'cargo_code')
    list_filter = ('is_dangerous', 'danger_class')
    
    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not obj or not obj.is_dangerous:
            form.base_fields['danger_class'].disabled = True
        return form

# Настройка CustomUserAdmin
class CustomUserAdmin(UserAdmin):
    inlines = (EmployeeInline,)
    
    def get_list_display(self, request):
        return ('username', 'first_name', 'last_name', 'phone_number', 'email', 'position_info')
    
    def phone_number(self, obj):
        try:
            return obj.employee.phone
        except Employee.DoesNotExist:
            return '-'
    phone_number.short_description = 'Телефон'

    def position_info(self, obj):
        try:
            return f"{obj.employee.position} ({obj.employee.department})"
        except Employee.DoesNotExist:
            return '-'
    position_info.short_description = 'Должность и отдел'

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
