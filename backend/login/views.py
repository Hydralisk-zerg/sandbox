from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required, user_passes_test
import json
from django.contrib.auth import logout
from django.views.decorators.csrf import ensure_csrf_cookie
from dictionary.models import Employee

@require_GET
def csrf_token_view(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})

@require_POST
def login_view(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'detail': 'Вход выполнен успешно'})
        else:
            return JsonResponse({'detail': 'Неверные учетные данные'}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({'detail': 'Неверный формат JSON'}, status=400)

@require_POST
@ensure_csrf_cookie
def logout_view(request):
    try:
        logout(request)
        return JsonResponse({'detail': 'Выход выполнен успешно'})
    except Exception as e:
        return JsonResponse({'detail': 'Ошибка при выходе из системы'}, status=500)
    

@login_required
@require_GET
def get_current_user(request):
    user = request.user
    try:
        employee = user.employee  # Используем related_name 'employee' для доступа к модели Employee
        employee_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'additionalEmail': employee.additional_email,
            'phone': employee.phone,
            'additionalPhone': employee.additional_phone,
            'birthDate': employee.birth_date.isoformat() if employee.birth_date else None,
            'department': employee.department.name,
            'position': employee.position.name,
            'hireDate': employee.hire_date.isoformat() if employee.hire_date else None,
            'terminationDate': employee.termination_date.isoformat() if employee.termination_date else None,
            'avatar': employee.avatar.url if employee.avatar and employee.avatar.name else None,
            'registrationAddress': employee.registration_address,
            'livingAddress': employee.living_address,
            'groups': list(user.groups.values_list('name', flat=True)),
            'permissions': list(user.user_permissions.values_list('codename', flat=True)),
        }
    except Employee.DoesNotExist:
        return JsonResponse({'error': 'Employee profile not found.'}, status=404)

    return JsonResponse(employee_data)