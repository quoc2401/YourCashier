from rest_framework import viewsets, permissions, generics, parsers, status
from rest_framework.decorators import action, parser_classes as method_parsers
from rest_framework.response import Response
from .perms import IsOwner, IsAdmin
from .models import User, CashierGroup
from expense.models import GroupExpense
from income.models import GroupIncome
from .serializers import (
    CreateUserSerializer,
    UserSerializer,
    CashierGroupSerializer,
    LoginSerializer,
    RebuildUrlUserSerializer,
)
from expense.serializers import GroupExpenseSerializer
from income.serializers import GroupIncomeSerializer
from decouple import config
from django.db.models import Q
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
    pagination_class = Paginator
    parser_classes = [parsers.MultiPartParser]
    permission_classes = [IsOwner()]
    pagination_class = Paginator

    def get_permissions(self):
        if self.action in ["login", "signup", "list"]:
            return [permissions.AllowAny()]
        # if self.action in ["list"]:
        #     return [IsAdmin()]
        return self.permission_classes

    def get_serializer_class(self):
        if self.action == "login":
            return LoginSerializer
        return self.serializer_class

    def get_queryset(self):
        q = self.queryset
        kw = self.request.query_params.get("kw")
        new_page_size = self.request.query_params.get("page_size")

        if kw:
            if self.action not in ["expenses", "incomes"]:
                q = q.filter(Q(first_name__icontains=kw) | Q(last_name__icontains=kw))
        if new_page_size:
            self.pagination_class.page_size = new_page_size

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
        kw = self.request.query_params.get("kw")

        if kw:
            groups = groups.filter(name__icontains=kw)
        paginated_incomes = self.paginate_queryset(groups)

        return self.get_paginated_response(CashierGroupSerializer(paginated_incomes, many=True).data)

    @action(methods=["GET"], detail=True)
    def expenses(self, request, pk):
        return UserServices.get_expenses(self)

    @action(methods=["GET"], detail=True)
    def incomes(self, request, pk):
        return UserServices.get_incomes(self)

    @action(
        methods=["GET"],
        detail=False,
    )
    def total_stats(self, request):
        return UserServices.get_totals(self, request)


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

        group.users.add(supervisor)
        group.users.add(*users)

        return Response(CashierGroupSerializer(group).data, status=status.HTTP_200_OK)

    @action(methods=["GET"], detail=True)
    def users(self, request, pk):
        group = self.get_object()

        data = [RebuildUrlUserSerializer(u.__dict__).data for u in group.users.filter(is_active=True)]

        return Response(data=data, status=status.HTTP_200_OK)

    @action(methods=["GET"], detail=True)
    def expenses_not_approved(self, request, pk):
        group_expenses = GroupExpense.objects.filter(cashier_group_id=pk, is_approved=False, expense__is_active=True)
        kw = self.request.query_params.get("kw")

        if kw:
            group_expenses = group_expenses.filter(name__icontains=kw)
        paginated_expenses = self.paginate_queryset(group_expenses)

        return self.get_paginated_response(GroupExpenseSerializer(paginated_expenses, many=True).data)

    @action(methods=["GET"], detail=True)
    def expenses_approved(self, request, pk):
        group_expenses = GroupExpense.objects.filter(cashier_group_id=pk, is_approved=True, expense__is_active=True)
        kw = self.request.query_params.get("kw")

        if kw:
            group_expenses = group_expenses.filter(name__icontains=kw)
        paginated_expenses = self.paginate_queryset(group_expenses)

        return self.get_paginated_response(GroupExpenseSerializer(paginated_expenses, many=True).data)

    @action(methods=["GET"], detail=True)
    def income(self, request, pk):
        group_income = GroupIncome.objects.filter(cashier_group_id=pk, income__is_active=True)
        kw = self.request.query_params.get("kw")

        if kw:
            group_income = group_income.filter(name__icontains=kw)
        paginated_incomes = self.paginate_queryset(group_income)

        return self.get_paginated_response(GroupIncomeSerializer(paginated_incomes, many=True).data)
