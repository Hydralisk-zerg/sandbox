# dictionary/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Employee, Department, Position
from django.http import JsonResponse
from django.urls import path

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

class CustomUserAdmin(UserAdmin):
    inlines = (EmployeeInline,)
    
    def get_list_display(self, request):
        return ('username', 'first_name', 'last_name', 'phone_number', 'email', 'position_info')

    # def get_urls(self):
    #     urls = super().get_urls()
    #     custom_urls = [
    #         path('get_positions/', self.get_positions, name='get_positions'),
    #     ]
    #     return custom_urls + urls
    
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
