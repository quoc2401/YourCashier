from .models import Expense, GroupExpense
from rest_framework import serializers
from user.models import User
from user.serializers import RebuildUrlUserSerializer


class ExpenseSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(method_name="get_user")

    def get_user(self, user_expense):
        u = RebuildUrlUserSerializer(user_expense.user.__dict__).data
        return u

    class Meta:
        model = Expense
        fields = "__all__"


class CreateExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ["amount", "description", "is_active"]
        extra_kwargs = {"is_active": {"read_only": True}}


class GroupExpenseSerializer(serializers.ModelSerializer):
    expense = serializers.SerializerMethodField(method_name="get_expense")

    def get_expense(self, group_expense):
        e = ExpenseSerializer(group_expense.expense).data
        return e

    class Meta:
        model = GroupExpense
        fields = "__all__"


class CreateGroupExpenseSerializer(serializers.ModelSerializer):
    expense = CreateExpenseSerializer()

    class Meta:
        model = GroupExpense
        fields = ["expense", "cashier_group"]
