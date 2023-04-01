from rest_framework import viewsets, permissions, generics, parsers, status
from rest_framework.decorators import action, parser_classes as method_parsers
from rest_framework.response import Response
from .models import User, CashierGroup
from expense.models import Expense, GroupExpense
from income.models import Income, GroupIncome
from .serializers import (
    CreateUserSerializer,
    UserSerializer,
    CashierGroupSerializer,
    LoginSerializer,
    RebuildUrlUserSerializer,
)
from expense.serializers import ExpenseSerializer, GroupExpenseSerializer
from income.serializers import IncomeSerializer, GroupIncomeSerializer
from decouple import config
from django.db.models import Q
import json
from .services import UserServices
from cashier_backend.paginators import Paginator


class UserViewSet(
    viewsets.ViewSet,
    # generics.DestroyAPIView,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.UpdateAPIView,
):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    parser_classes = [parsers.MultiPartParser]
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ["login", "signup"]:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "login":
            return LoginSerializer
        return self.serializer_class

    def get_queryset(self):
        q = self.queryset
        kw = self.request.query_params.get("kw")

        if kw:
            q = q.filter(Q(first_name__icontains=kw) | Q(last_name__icontains=kw))

        return q

    @action(methods=["POST"], detail=False, serializer_class=CreateUserSerializer)
    def signup(self, request):
        return UserServices.signup(request=request)

    @action(methods=["POST"], detail=False, parser_classes=[parsers.JSONParser])
    def logout(self, request):
        return UserServices.logout(request=request)

    @action(methods=["POST"], detail=False, parser_classes=[parsers.JSONParser])
    def login(self, request):
        return UserServices.login(request=request)

    @action(methods=["POST"], detail=False, parser_classes=[parsers.JSONParser])
    def refresh(self, request):
        return UserServices.refresh(request=request)

    @action(methods=["GET"], detail=True)
    def groups(self, request, pk):
        user = User.objects.get(pk=pk)
        groups = user.cashier_groups.filter(is_active=True)

        return Response(data=CashierGroupSerializer(groups, many=True).data, status=status.HTTP_200_OK)


class CashierGroupViewSet(
    viewsets.ViewSet,
    generics.CreateAPIView,
    generics.DestroyAPIView,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.UpdateAPIView,
):
    queryset = CashierGroup.objects.all()
    serializer_class = CashierGroupSerializer
    pagination_class = Paginator

    def get_queryset(self):
        q = self.queryset
        kw = self.request.query_params.get("kw")
        new_page_size = self.request.query_params.get("page_size")

        if kw:
            q = q.filter(Q(name__icontains=kw))

        if new_page_size:
            self.pagination_class.page_size = new_page_size

        return q

    def create(self, request):
        supervisor = request.user
        users_ids = request.data["users"]
        group = CashierGroup.objects.create(supervisor=supervisor, name=request.data["name"])

        users = User.objects.filter(id__in=users_ids)

        group.users.add(*users)

        return Response(CashierGroupSerializer(group).data, status=status.HTTP_201_CREATED)

    @action(methods=["GET"], detail=True)
    def users(self, request, pk):
        group = self.get_object()

        data = [RebuildUrlUserSerializer(u.__dict__).data for u in group.users.filter(is_active=True)]

        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=["GET"], detail=True)
    def expenses_not_approved(self, request, pk):
        group_expenses = GroupExpense.objects.filter(cashier_group_id=pk, is_approved=False, expense__is_active=True)

        return Response(
            data=GroupExpenseSerializer(group_expenses, many=True).data,
            status=status.HTTP_200_OK,
        )

    @action(methods=["GET"], detail=True)
    def expenses_approved(self, request, pk):
        group_expenses = GroupExpense.objects.filter(cashier_group_id=pk, is_approved=True, expense__is_active=True)

        return Response(
            data=GroupExpenseSerializer(group_expenses, many=True).data,
            status=status.HTTP_200_OK,
        )

    @action(methods=["GET"], detail=True)
    def income(self, request, pk):
        group_expenses = GroupIncome.objects.filter(cashier_group_id=pk, income__is_active=True)

        return Response(
            data=GroupIncomeSerializer(group_expenses, many=True).data,
            status=status.HTTP_200_OK,
        )
