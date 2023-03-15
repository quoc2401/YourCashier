from enum import Enum
from django.db import models
from cashier_backend.abstract_models import BaseModel
from user.models import User, CashierGroup


class WarningLevel(Enum):
    WARN_ONLY = "WARN_ONLY"
    WARN_AND_STOP = "WARN_AND_STOP"
    WARN_WITH_INCOME = "WARN_WITH_INCOME"

    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)


class Expense(BaseModel):
    user_id = models.ForeignKey(User, related_name="expenses", on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=0)
    description = models.CharField(max_length=255)


class GroupExpense(BaseModel):
    expense_id = models.ForeignKey(Expense, related_name="group_expense", on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    cashier_group_id = models.ForeignKey(CashierGroup, related_name="groups_expenses", on_delete=models.PROTECT)


class ExpenseWarning(BaseModel):
    user_id = models.ForeignKey(User, related_name="expense_warnings", on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=0)
    warn_level = models.CharField(max_length=255, choices=WarningLevel.choices())
