from enum import Enum
from django.db import models
from cashier_backend.abstract_models import BaseModel
from user.models import User, CashierGroup



class WarningLevel(Enum):
    WARN_OFF = "WARN_OFF"
    WARN_SIMPLE = "WARN_SIMPLE"
    WARN_MEDIUM = "WARN_MEDIUM"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)


class Expense(BaseModel):
    user = models.ForeignKey(User, related_name="expenses", on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=0)
    description = models.CharField(max_length=255)


class GroupExpense(models.Model):
    expense = models.ForeignKey(Expense, related_name="group_expense", on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    cashier_group = models.ForeignKey(CashierGroup, related_name="groups_expenses", on_delete=models.PROTECT)


class ExpenseWarning(BaseModel):
    user = models.OneToOneField(User, related_name="expense_warnings", on_delete=models.CASCADE)
    warn_level = models.CharField(max_length=255, choices=WarningLevel.choices())
