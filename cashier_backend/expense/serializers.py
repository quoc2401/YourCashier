from .models import Expense, GroupExpense
from rest_framework import serializers


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"


class GroupExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupExpense
        fields = "__all__"
