from .models import Income, GroupIncome
from rest_framework import serializers


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = "__all__"


class GroupIncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GroupIncome
        fields = "__all__"
