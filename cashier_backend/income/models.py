from django.db import models
from cashier_backend.abstract_models import BaseModel
from user.models import User, CashierGroup


class Income(BaseModel):
    user = models.ForeignKey(User, related_name="incomes", on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=0)
    description = models.CharField(max_length=255)


class GroupIncome(BaseModel):
    income = models.ForeignKey(Income, related_name="group_income", on_delete=models.CASCADE)
    cashier_group = models.ForeignKey(CashierGroup, related_name="group_incomes", on_delete=models.PROTECT)
