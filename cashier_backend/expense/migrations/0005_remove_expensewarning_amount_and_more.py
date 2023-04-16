# Generated by Django 4.1.7 on 2023-04-09 06:32

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("expense", "0004_remove_groupexpense_created_date_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="expensewarning",
            name="amount",
        ),
        migrations.AlterField(
            model_name="expensewarning",
            name="warn_level",
            field=models.CharField(
                choices=[("WARN_SIMPLE", "WARN_ONLY"), ("WARN_MEDIUM", "WARN_MEDIUM")],
                max_length=255,
            ),
        ),
    ]
