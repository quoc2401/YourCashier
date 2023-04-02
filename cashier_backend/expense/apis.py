from rest_framework import viewsets, permissions, generics, status
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
    permission_classes = [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        return Response(data={}, status=status.HTTP_200_OK)


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
