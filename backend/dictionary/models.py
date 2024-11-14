# dictionary/models.py
from django.db import models
from django.contrib.auth.models import User

class Department(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название отдела")
    
    class Meta:
        verbose_name = "Отдел"
        verbose_name_plural = "Отделы"
        ordering = ['name']

    def __str__(self):
        return self.name

class Position(models.Model):
    name = models.CharField(max_length=100, verbose_name="Название должности")
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='positions', verbose_name="Отдел")
    
    class Meta:
        verbose_name = "Должность"
        verbose_name_plural = "Должности"
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