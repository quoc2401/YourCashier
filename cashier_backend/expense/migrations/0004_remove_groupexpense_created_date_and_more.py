# Generated by Django 4.1.7 on 2023-03-19 06:59

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("expense", "0003_rename_user_id_expense_user_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="groupexpense",
            name="created_date",
        ),
        migrations.RemoveField(
            model_name="groupexpense",
            name="is_active",
        ),
        migrations.RemoveField(
            model_name="groupexpense",
            name="updated_date",
        ),
    ]
