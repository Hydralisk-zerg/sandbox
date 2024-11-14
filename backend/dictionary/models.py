from django.db import models
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError


class DangerClass(models.Model):
    class_number = models.CharField(max_length=2, verbose_name="Class Number")
    sub_class = models.CharField(max_length=2, verbose_name="Sub Class", blank=True, null=True)
    un_code = models.CharField(max_length=4, verbose_name="UN Code")
    description = models.TextField(verbose_name="Description")

    class Meta:
        verbose_name = "Danger Class"
        verbose_name_plural = "Danger Classes"
        unique_together = ['class_number', 'sub_class', 'un_code']

    def __str__(self):
        if self.sub_class:
            return f"Class {self.class_number}.{self.sub_class} - UN{self.un_code}"
        return f"Class {self.class_number} - UN{self.un_code}"


class Department(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название отдела")
    
    class Meta:
        verbose_name = "Department"
        verbose_name_plural = "Departments"
        ordering = ['name']

    def __str__(self):
        return self.name


class Position(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название должности")
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='positions', verbose_name="Отдел")
    
    class Meta:
        verbose_name = "Position"
        verbose_name_plural = "Positions"
        ordering = ['name']

    def __str__(self):
        return self.name


class Employee(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee')
    additional_email = models.EmailField(verbose_name="Дополнительная почта", blank=True, null=True)
    phone = models.CharField(max_length=20, verbose_name="Телефон", blank=True, null=True)
    additional_phone = models.CharField(max_length=20, verbose_name="Дополнительный телефон", blank=True, null=True)
    birth_date = models.DateField(verbose_name="Дата рождения", blank=True, null=True)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, verbose_name="Отдел")
    position = models.ForeignKey(Position, on_delete=models.PROTECT, verbose_name="Должность")
    hire_date = models.DateField(verbose_name="Дата приема на работу", blank=True, null=True)
    termination_date = models.DateField(verbose_name="Дата увольнения", blank=True, null=True)
    avatar = models.ImageField(upload_to='avatars/', verbose_name="Аватарка", blank=True, null=True)
    registration_address = models.TextField(verbose_name="Адрес прописки", blank=True, null=True)
    living_address = models.TextField(verbose_name="Адрес проживания", blank=True, null=True)

    class Meta:
        verbose_name = "Сотрудник"
        verbose_name_plural = "Сотрудники"

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.position}"
    
    from django.db import models


class Country(models.Model):
    name_en = models.CharField(max_length=100, verbose_name="Name (English)")
    name_uk = models.CharField(max_length=100, blank=True, null=True, verbose_name="Name (Ukrainian)")
    alpha2 = models.CharField(max_length=2, unique=True, verbose_name="Alpha-2 code")
    alpha3 = models.CharField(max_length=3, unique=True, verbose_name="Alpha-3 code")
    numeric_code = models.CharField(max_length=3, unique=True, verbose_name="Numeric code")

    class Meta:
        verbose_name = "Country"
        verbose_name_plural = "Countries"

    def __str__(self):
        return self.name_en
    

class City(models.Model):
    name_en = models.CharField(max_length=100, verbose_name="Name (English)")
    name_uk = models.CharField(max_length=100, blank=True, null=True, verbose_name="Name (Ukrainian)")
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='cities')

    class Meta:
        verbose_name = "City"
        verbose_name_plural = "Cities"

    def __str__(self):
        return f"{self.name_en}, {self.country.name_en}"


class Terminal(models.Model):
    TERMINAL_TYPES = [
        ('SEAPORT', 'Sea Port'),
        ('AIRPORT', 'Airport'),
        ('TERMINAL', 'Terminal'),
        ('RIVER_PORT', 'River Port'),
        ('WAREHOUSE', 'Warehouse'),
    ]

    name_en = models.CharField(max_length=100, verbose_name="Name (English)")
    name_uk = models.CharField(max_length=100, blank=True, null=True, verbose_name="Name (Ukrainian)")
    terminal_type = models.CharField(max_length=20, choices=TERMINAL_TYPES)
    description = models.TextField(blank=True, null=True)
    city = models.ForeignKey(City, on_delete=models.CASCADE, related_name='terminals')
    country = models.ForeignKey(Country, on_delete=models.CASCADE, related_name='terminals')

    class Meta:
        verbose_name = "Terminal"
        verbose_name_plural = "Terminals"

    def __str__(self):
        return f"{self.name_en} ({self.get_terminal_type_display()})"


class Currency(models.Model):
    name = models.CharField(max_length=100, verbose_name="Currency name")
    code = models.CharField(max_length=3, unique=True, verbose_name="Currency code")

    class Meta:
        verbose_name = "Currency"
        verbose_name_plural = "Currencies"

    def __str__(self):
        return f"{self.code} - {self.name}"


class Container(models.Model):
    size = models.CharField(max_length=50, verbose_name="Container size")
    container_type = models.CharField(max_length=50, verbose_name="Container type")
    length = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Length (m)")
    width = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Width (m)")
    height = models.DecimalField(max_digits=8, decimal_places=2, verbose_name="Height (m)")
    internal_volume = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Internal volume (m³)")

    class Meta:
        verbose_name = "Container"
        verbose_name_plural = "Containers"

    def __str__(self):
        return f"{self.size} - {self.container_type}"


class Incoterms(models.Model):
    abbreviation = models.CharField(max_length=3, verbose_name="Abbreviation", unique=True)
    description = models.TextField(verbose_name="Description")

    class Meta:
        verbose_name = "Incoterms"
        verbose_name_plural = "Incoterms"

    def __str__(self):
        return self.abbreviation


class PackagingType(models.Model):
    name_en = models.CharField(max_length=100, verbose_name="Name (English)")
    name_uk = models.CharField(max_length=100, verbose_name="Name (Ukrainian)")
    description = models.TextField(verbose_name="Description")

    class Meta:
        verbose_name = "Packaging Type"
        verbose_name_plural = "Packaging Types"

    def __str__(self):
        return self.name_en


class DeliveryType(models.Model):
    short_name = models.CharField(max_length=50, verbose_name="Short Name")
    full_name = models.CharField(max_length=200, verbose_name="Full Name")
    description = models.TextField(verbose_name="Description")

    class Meta:
        verbose_name = "Delivery Type"
        verbose_name_plural = "Delivery Types"

    def __str__(self):
        return self.short_name


class Cargo(models.Model):
    name_en = models.CharField(max_length=200, verbose_name="Name (English)")
    name_uk = models.CharField(max_length=200, verbose_name="Name (Ukrainian)")
    cargo_code = models.CharField(
        max_length=10, 
        verbose_name="Cargo Code",
        validators=[
            RegexValidator(
                regex=r'^\d{4,10}$',
                message='Cargo code must be between 4 and 10 digits'
            )
        ]
    )
    is_dangerous = models.BooleanField(default=False, verbose_name="Is Dangerous")
    danger_class = models.ForeignKey(
        DangerClass, 
        on_delete=models.SET_NULL,
        null=True, 
        blank=True,
        verbose_name="Danger Class"
    )
    description = models.TextField(verbose_name="Description")

    class Meta:
        verbose_name = "Cargo"
        verbose_name_plural = "Cargoes"

    def __str__(self):
        return f"{self.name_en} ({self.cargo_code})"

    def clean(self):
        if self.is_dangerous and not self.danger_class:
            raise ValidationError({
                'danger_class': 'Danger class is required for dangerous cargo'
            })
        if not self.is_dangerous and self.danger_class:
            raise ValidationError({
                'danger_class': 'Danger class should be empty for non-dangerous cargo'
            })
