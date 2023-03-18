from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from .models import Expense, GroupExpense
from .serializers import ExpenseSerializer, GroupExpenseSerializer


class ExpenseViewSet(
    viewsets.ViewSet,
    generics.CreateAPIView,
    generics.DestroyAPIView,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.UpdateAPIView,
):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer


class GroupExpenseViewSet(
    viewsets.ViewSet,
    generics.CreateAPIView,
    generics.DestroyAPIView,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.UpdateAPIView,
):
    queryset = GroupExpense.objects.all()
    serializer_class = GroupExpenseSerializer
