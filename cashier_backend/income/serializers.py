from .models import Income, GroupIncome
from rest_framework import serializers
from user.serializers import RebuildUrlUserSerializer


class IncomeSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(method_name="get_user")

    def get_user(self, user_income):
        u = RebuildUrlUserSerializer(user_income.user.__dict__).data
        return u

    class Meta:
        model = Income
        fields = "__all__"


class CreateIncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ["amount", "description", "is_active"]
        extra_kwargs = {"is_active": {"read_only": True}}


class GroupIncomeSerializer(serializers.ModelSerializer):
    income = serializers.SerializerMethodField(method_name="get_income")

    def get_income(self, group_income):
        e = IncomeSerializer(group_income.income).data
        return e

    class Meta:
        model = GroupIncome
        fields = "__all__"


class CreateGroupIncomeSerializer(serializers.ModelSerializer):
    income = CreateIncomeSerializer()

    class Meta:
        model = GroupIncome
        fields = "__all__"
