# Generated by Django 4.1.7 on 2023-03-15 10:01

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("expense", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="expense",
            old_name="active",
            new_name="is_active",
        ),
        migrations.RenameField(
            model_name="expensewarning",
            old_name="active",
            new_name="is_active",
        ),
        migrations.RenameField(
            model_name="groupexpense",
            old_name="active",
            new_name="is_active",
        ),
    ]