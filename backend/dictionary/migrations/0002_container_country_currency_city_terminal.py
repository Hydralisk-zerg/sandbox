# Generated by Django 5.1.3 on 2024-11-14 11:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dictionary', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Container',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('size', models.CharField(max_length=50, verbose_name='Container size')),
                ('container_type', models.CharField(max_length=50, verbose_name='Container type')),
                ('length', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Length (m)')),
                ('width', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Width (m)')),
                ('height', models.DecimalField(decimal_places=2, max_digits=8, verbose_name='Height (m)')),
                ('internal_volume', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='Internal volume (m³)')),
            ],
            options={
                'verbose_name': 'Container',
                'verbose_name_plural': 'Containers',
            },
        ),
        migrations.CreateModel(
            name='Country',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_en', models.CharField(max_length=100, verbose_name='Name (English)')),
                ('name_uk', models.CharField(blank=True, max_length=100, null=True, verbose_name='Name (Ukrainian)')),
                ('alpha2', models.CharField(max_length=2, unique=True, verbose_name='Alpha-2 code')),
                ('alpha3', models.CharField(max_length=3, unique=True, verbose_name='Alpha-3 code')),
                ('numeric_code', models.CharField(max_length=3, unique=True, verbose_name='Numeric code')),
            ],
            options={
                'verbose_name': 'Country',
                'verbose_name_plural': 'Countries',
            },
        ),
        migrations.CreateModel(
            name='Currency',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='Currency name')),
                ('code', models.CharField(max_length=3, unique=True, verbose_name='Currency code')),
            ],
            options={
                'verbose_name': 'Currency',
                'verbose_name_plural': 'Currencies',
            },
        ),
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_en', models.CharField(max_length=100, verbose_name='Name (English)')),
                ('name_uk', models.CharField(blank=True, max_length=100, null=True, verbose_name='Name (Ukrainian)')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='cities', to='dictionary.country')),
            ],
            options={
                'verbose_name': 'City',
                'verbose_name_plural': 'Cities',
            },
        ),
        migrations.CreateModel(
            name='Terminal',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_en', models.CharField(max_length=100, verbose_name='Name (English)')),
                ('name_uk', models.CharField(blank=True, max_length=100, null=True, verbose_name='Name (Ukrainian)')),
                ('terminal_type', models.CharField(choices=[('SEAPORT', 'Sea Port'), ('AIRPORT', 'Airport'), ('TERMINAL', 'Terminal'), ('RIVER_PORT', 'River Port'), ('WAREHOUSE', 'Warehouse')], max_length=20)),
                ('description', models.TextField(blank=True, null=True)),
                ('city', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='terminals', to='dictionary.city')),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='terminals', to='dictionary.country')),
            ],
            options={
                'verbose_name': 'Terminal',
                'verbose_name_plural': 'Terminals',
            },
        ),
    ]