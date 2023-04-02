from rest_framework import viewsets, permissions, generics, status, parsers
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Expense, GroupExpense
from user.models import User
from .serializers import (
    ExpenseSerializer,
    GroupExpenseSerializer,
    CreateGroupExpenseSerializer,
    CreateExpenseSerializer,
)
from django.db import transaction
from cashier_backend.paginators import Paginator
from .perms import IsOwner


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
    permission_classes = [IsOwner()]
    pagination_class = Paginator

    def get_queryset(self):
        q = self.queryset
        kw = self.request.query_params.get("kw")
        new_page_size = self.request.query_params.get("page_size")

        if kw:
            q = q.filter(description__icontains=kw)
        if new_page_size:
            self.pagination_class.page_size = new_page_size

        return q

    def get_serializer_class(self):
        if self.action == "create":
            return CreateExpenseSerializer
        return self.serializer_class

    def get_permissions(self):
        return self.permission_classes

    def create(self, request, *args, **kwargs):
        u = request.user
        serializer = CreateExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data["user"] = u
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        return Response(data=serializer.error_messages, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
