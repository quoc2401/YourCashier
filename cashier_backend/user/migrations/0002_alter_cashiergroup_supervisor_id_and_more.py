# Generated by Django 4.1.7 on 2023-03-15 09:41

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="cashiergroup",
            name="supervisor_id",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="supervised_cashier_groups",
                related_query_name="supervised_cashier_groups",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="cashiergroup",
            name="users",
            field=models.ManyToManyField(
                related_name="cashier_groups", to=settings.AUTH_USER_MODEL
            ),
        ),
    ]