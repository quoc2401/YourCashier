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


class GroupIncomeSerializer(serializers.ModelSerializer):
    income = serializers.SerializerMethodField(method_name="get_income")

    def get_income(self, group_income):
        e = IncomeSerializer(group_income.income).data
        return e

    class Meta:
        model = GroupIncome
        fields = "__all__"


class CreateGroupIncomeSerializer(serializers.ModelSerializer):
    income = IncomeSerializer()

    class Meta:
        model = GroupIncome
        fields = "__all__"
