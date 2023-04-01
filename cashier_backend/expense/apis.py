from rest_framework import viewsets, generics, parsers, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Expense, GroupExpense
from user.models import User
from .serializers import ExpenseSerializer, GroupExpenseSerializer, CreateGroupExpenseSerializer
from django.db import transaction


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
    generics.DestroyAPIView,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.UpdateAPIView,
):
    queryset = GroupExpense.objects.all()
    serializer_class = GroupExpenseSerializer
    parser_classes = [parsers.JSONParser]

    @action(methods=["PATCH"], detail=True)
    def approve(self, request, pk):
        instance = self.get_object()
        instance.is_approved = True
        instance.save()

        return Response(status=200)

    @action(methods=["PATCH"], detail=True)
    def reject(self, request, pk):
        instance = self.get_object().expense
        instance.is_active = False
        instance.save()

        return Response(status=200)

    @action(methods=["POST"], detail=False, serializer_class=CreateGroupExpenseSerializer)
    def create_new(self, request):
        try:
            with transaction.atomic():
                u = User.objects.get(username="congsang")
                expense = Expense.objects.create(
                    amount=request.data["expense"]["amount"], description=request.data["expense"]["description"], user=u
                )
                group_expense = GroupExpense.objects.create(
                    expense=expense, cashier_group_id=request.data["cashier_group"]
                )

            transaction.commit()

        except Exception as e:
            transaction.rollback()

        return Response(data=GroupExpenseSerializer(group_expense).data, status=status.HTTP_200_OK)
