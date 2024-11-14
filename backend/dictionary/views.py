from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_GET
from django.http import JsonResponse
from .models import Country, City, Terminal, Currency, Container, DangerClass, Incoterms, PackagingType, DeliveryType, Cargo

# Получение списка всех справочников (только названия)
@login_required
@require_GET
def get_dictionaries_list(request):
    dictionaries = [
        'countries',
        'cities',
        'terminals',
        'currencies',
        'containers',
        'danger_classes',
        'incoterms',
        'packaging_types',
        'delivery_types',
        'cargos'
    ]
    return JsonResponse({'dictionaries': dictionaries})

# Получение данных отдельных справочников
@login_required
@require_GET
def get_countries(request):
    countries = Country.objects.all().values('id', 'name_en', 'name_uk', 'alpha2', 'alpha3')
    return JsonResponse({'countries': list(countries)})

@login_required
@require_GET
def get_cities(request):
    cities = City.objects.all().values('id', 'name_en', 'name_uk', 'country__name_en')
    return JsonResponse({'cities': list(cities)})

@login_required
@require_GET
def get_terminals(request):
    terminals = Terminal.objects.all().values('id', 'name_en', 'name_uk', 'terminal_type')
    return JsonResponse({'terminals': list(terminals)})

@login_required
@require_GET
def get_currencies(request):
    currencies = Currency.objects.all().values('id', 'name', 'code')
    return JsonResponse({'currencies': list(currencies)})

@login_required
@require_GET
def get_containers(request):
    containers = Container.objects.all().values('id', 'size', 'container_type')
    return JsonResponse({'containers': list(containers)})

@login_required
@require_GET
def get_danger_classes(request):
    danger_classes = DangerClass.objects.all().values('id', 'class_number', 'description')
    return JsonResponse({'danger_classes': list(danger_classes)})

@login_required
@require_GET
def get_incoterms(request):
    incoterms = Incoterms.objects.all().values('id', 'abbreviation', 'description')
    return JsonResponse({'incoterms': list(incoterms)})

@login_required
@require_GET
def get_packaging_types(request):
    packaging_types = PackagingType.objects.all().values('id', 'name_en', 'name_uk')
    return JsonResponse({'packaging_types': list(packaging_types)})

@login_required
@require_GET
def get_delivery_types(request):
    delivery_types = DeliveryType.objects.all().values('id', 'short_name', 'full_name')
    return JsonResponse({'delivery_types': list(delivery_types)})

@login_required
@require_GET
def get_cargos(request):
    cargos = Cargo.objects.all().values('id', 'name_en', 'name_uk', 'cargo_code')
    return JsonResponse({'cargos': list(cargos)})

# Получение всех справочников одним запросом
@login_required
@require_GET
def get_all_dictionaries(request):
    data = {
        'countries': list(Country.objects.all().values()),
        'cities': list(City.objects.all().values()),
        'terminals': list(Terminal.objects.all().values()),
        'currencies': list(Currency.objects.all().values()),
        'containers': list(Container.objects.all().values()),
        'danger_classes': list(DangerClass.objects.all().values()),
        'incoterms': list(Incoterms.objects.all().values()),
        'packaging_types': list(PackagingType.objects.all().values()),
        'delivery_types': list(DeliveryType.objects.all().values()),
        'cargos': list(Cargo.objects.all().values()),
    }
    return JsonResponse(data)
