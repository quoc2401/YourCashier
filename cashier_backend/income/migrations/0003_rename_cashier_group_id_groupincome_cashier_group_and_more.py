# Generated by Django 4.1.7 on 2023-03-19 05:39

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("income", "0002_rename_active_groupincome_is_active_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="groupincome",
            old_name="cashier_group_id",
            new_name="cashier_group",
        ),
        migrations.RenameField(
            model_name="groupincome",
            old_name="income_id",
            new_name="income",
        ),
        migrations.RenameField(
            model_name="income",
            old_name="user_id",
            new_name="user",
        ),
    ]