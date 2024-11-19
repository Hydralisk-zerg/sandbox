from django.http import JsonResponse
from django.views.decorators.http import require_POST, require_GET
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required, user_passes_test
import json
from django.contrib.auth import logout
from django.views.decorators.csrf import ensure_csrf_cookie

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