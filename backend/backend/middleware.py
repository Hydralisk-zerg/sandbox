from django.utils import translation

class AdminLocaleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path.startswith('/admin'):
            translation.activate('uk')
        response = self.get_response(request)
        if request.path.startswith('/admin'):
            translation.deactivate()
        return response