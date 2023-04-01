from .models import Expense, GroupExpense
from rest_framework import serializers
from user.models import User
from user.serializers import UserSerializer, RebuildUrlUserSerializer


class ExpenseSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(method_name="get_user")

    def get_user(self, user_expense):
        u = RebuildUrlUserSerializer(user_expense.user.__dict__).data
        return u

    class Meta:
        model = Expense
        fields = "__all__"


class GroupExpenseSerializer(serializers.ModelSerializer):
    supervisor = serializers.SerializerMethodField(method_name="get_supervisor")

    def get_supervisor(self, group):
        u = RebuildUrlUserSerializer(group.supervisor.__dict__).data
        return u

    class Meta:
        model = GroupExpense
        fields = "__all__"
