from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import json

@csrf_exempt
def get_users(request):
    if request.method == 'POST':
        try:
            # Парсинг JSON из тела запроса
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        # Аутентификация пользователя
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Получение списка пользователей из базы данных
            users = list(User.objects.values('id', 'username'))
            return JsonResponse(users, safe=False)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    return JsonResponse({'error': 'Invalid request method'}, status=400)