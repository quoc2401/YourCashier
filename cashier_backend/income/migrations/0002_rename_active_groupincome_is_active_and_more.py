# Generated by Django 4.1.7 on 2023-03-15 10:01

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("income", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="groupincome",
            old_name="active",
            new_name="is_active",
        ),
        migrations.RenameField(
            model_name="income",
            old_name="active",
            new_name="is_active",
        ),
    ]
