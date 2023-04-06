from rest_framework import viewsets, status, generics, parsers, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Income, GroupIncome
from user.models import User
from .serializers import IncomeSerializer, GroupIncomeSerializer, CreateGroupIncomeSerializer, CreateIncomeSerializer
from django.db import transaction
from cashier_backend.paginators import Paginator
from expense.perms import IsOwner


class IncomeViewSet(
    viewsets.ViewSet,
    generics.CreateAPIView,
    generics.DestroyAPIView,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.UpdateAPIView,
):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer
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
            return CreateIncomeSerializer
        return self.serializer_class

    def get_permissions(self):
        return self.permission_classes

    def create(self, request, *args, **kwargs):
        u = request.user
        serializer = CreateIncomeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.validated_data["user"] = u
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        return Response(data=serializer.error_messages, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GroupIncomeViewSet(
    viewsets.ViewSet,
    generics.DestroyAPIView,
    generics.CreateAPIView,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.UpdateAPIView,
):
    queryset = GroupIncome.objects.all()
    serializer_class = GroupIncomeSerializer
    parser_classes = [parsers.JSONParser]

    def create(self, request, *args, **kwargs):
        try:
            u = request.user
            with transaction.atomic():
                income = Income.objects.create(
                    amount=request.data["income"]["amount"],
                    description=request.data["income"]["description"],
                    user=u,
                )
                group_income = GroupIncome.objects.create(income=income, cashier_group_id=request.data["cashier_group"])
                transaction.commit()

        except Exception as e:
            transaction.rollback()

        return Response(data=GroupIncomeSerializer(group_income).data, status=status.HTTP_200_OK)
