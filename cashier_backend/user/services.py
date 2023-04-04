from .serializers import (
    CreateUserSerializer,
    RebuildUrlUserSerializer,
)
from decouple import config
import requests
from django.contrib.sites.models import Site
from rest_framework.response import Response
from rest_framework import status
from .models import User, CashierGroup
from oauth2_provider.models import AccessToken
from expense.serializers import ExpenseSerializer
from income.serializers import IncomeSerializer
from datetime import datetime, date, timedelta
from income.models import Income
from expense.models import Expense
from django.db.models import Sum
import urllib.parse

# from dateutil import parser


class UserServices:
    def login(request):
        username = request.data["username"]
        password = request.data["password"]
        if username and password:
            domain = Site.objects.get_current().domain

            url = "{protocol}{domain}/{path}".format(protocol=config("PROTOCOL"), domain=domain, path="o/token/")
            data = {
                "username": username,
                "password": password,
                "grant_type": config("OAUTH_GRANT_TYPE"),
                "client_id": config("OAUTH_CLIENT_ID"),
                "client_secret": config("OAUTH_CLIENT_SECRET"),
            }
            res = requests.post(url=url, data=data)
            if res.status_code == 400:
                return Response(data={"error": "Username or password invalid"}, status=res.status_code)
            if res.status_code == 200:
                user = User.objects.get(username=username)
                data = {**(res.json()), "user": RebuildUrlUserSerializer(user.__dict__).data}
                return Response(data=data, status=status.HTTP_200_OK)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response("errors: username and password are required", status.HTTP_400_BAD_REQUEST)

    def signup(request):
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            username = request.data["username"]
            password = request.data["password"]

            domain = Site.objects.get_current().domain

            url = "{protocol}{domain}/{path}".format(protocol=config("PROTOCOL"), domain=domain, path="o/token/")
            data = {
                "username": username,
                "password": password,
                "grant_type": config("OAUTH_GRANT_TYPE"),
                "client_id": config("OAUTH_CLIENT_ID"),
                "client_secret": config("OAUTH_CLIENT_SECRET"),
            }
            res = requests.post(url=url, data=data)
            if res.status_code == 200:
                data = {**(res.json()), "user": RebuildUrlUserSerializer(serializer.data).data}
                return Response(data=data, status=status.HTTP_200_OK)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(data={**serializer.errors}, status=status.HTTP_406_NOT_ACCEPTABLE)

    def refresh(request):
        refresh_token = request.data.get("refresh_token")
        if refresh_token:
            domain = Site.objects.get_current().domain
            url = "{protocol}{domain}/{path}".format(protocol=config("PROTOCOL"), domain=domain, path="o/token/")
            data = {
                "refresh_token": refresh_token,
                "grant_type": "refresh_token",
                "client_id": config("OAUTH_CLIENT_ID"),
                "client_secret": config("OAUTH_CLIENT_SECRET"),
            }
            res = requests.post(url=url, data=data)
            if res.status_code == 200:
                print(res.json())
                access_token = res.json()["access_token"]
                user = AccessToken.objects.get(token=access_token).user
                data = {**(res.json()), "user": RebuildUrlUserSerializer(user.__dict__).data}
                return Response(data=data, status=status.HTTP_200_OK)
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response("errors: refresh_token is required", status.HTTP_400_BAD_REQUEST)

    def logout(request):
        token = request.auth
        print(token)
        if token:
            domain = Site.objects.get_current().domain
            url = "{protocol}{domain}/{path}".format(protocol=config("PROTOCOL"), domain=domain, path="o/revoke-token/")
            data = {
                "token": token,
                "client_id": config("OAUTH_CLIENT_ID"),
                "client_secret": config("OAUTH_CLIENT_SECRET"),
            }
            res = requests.post(url=url, data=data)
            if res.status_code == 200:
                return Response(status=status.HTTP_200_OK)
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response("errors: refresh_token is required", status.HTTP_400_BAD_REQUEST)

    def get_expenses(self):
        u = self.get_object()
        kw = self.request.query_params.get("kw")
        from_date = self.request.query_params.get("fromDate")
        to_date = self.request.query_params.get("toDate")

        expenses = u.expenses.filter(is_active=True, group_expense=None)
        if kw:
            expenses = expenses.filter(description__icontains=kw)

        if not from_date or from_date in ("undefined", "null"):
            from_date = datetime.now().replace(day=1, hour=0)
        else:
            from_date = urllib.parse.unquote(from_date)
            from_date = datetime.strptime(from_date[: from_date.index(" (")], "%a %b %d %Y %H:%M:%S %Z%z").strftime(
                "%Y-%m-%d %H:%M:%S"
            )

        if not to_date or to_date in ("undefined", "null"):
            to_date = None
        if to_date:
            to_date = urllib.parse.unquote(to_date)
            to_date = datetime.strptime(to_date[: to_date.index(" (")], "%a %b %d %Y %H:%M:%S %Z%z").strftime(
                "%Y-%m-%d %H:%M:%S"
            )
            expenses = expenses.filter(created_date__lte=to_date)

        expenses = expenses.filter(created_date__gte=from_date)
        paginated_expenses = self.paginate_queryset(expenses)

        return self.get_paginated_response(ExpenseSerializer(paginated_expenses, many=True).data)
        # return Response(data=)

    def get_incomes(self):
        u = self.get_object()
        kw = self.request.query_params.get("kw")
        from_date = self.request.query_params.get("fromDate")
        to_date = self.request.query_params.get("toDate")

        incomes = u.incomes.filter(is_active=True, group_income=None)
        if kw:
            incomes = incomes.filter(description__icontains=kw)

        if not from_date or from_date in ("undefined", "null"):
            from_date = datetime.now().replace(day=1, hour=0)
        else:
            from_date = urllib.parse.unquote(from_date)
            from_date = datetime.strptime(from_date[: from_date.index(" (")], "%a %b %d %Y %H:%M:%S %Z%z")

        if not to_date or to_date in ("undefined", "null"):
            to_date = None
        if to_date:
            to_date = urllib.parse.unquote(to_date)
            to_date = datetime.strptime(to_date[: to_date.index(" (")], "%a %b %d %Y %H:%M:%S %Z%z")
            incomes = incomes.filter(created_date__lte=to_date)

        incomes = incomes.filter(created_date__gte=from_date)
        paginated_incomes = self.paginate_queryset(incomes)

        return self.get_paginated_response(IncomeSerializer(paginated_incomes, many=True).data)

    def get_totals(self, request):
        user_id = request.user.id
        from_date = self.request.query_params.get("fromDate")
        to_date = self.request.query_params.get("toDate")

        if not from_date or from_date in ("undefined", "null"):
            from_date = datetime.now().replace(day=1, hour=0)
        else:
            from_date = urllib.parse.unquote(from_date)
            from_date = datetime.strptime(from_date[: from_date.index(" (")], "%a %b %d %Y %H:%M:%S %Z%z")

        if not to_date or to_date in ("undefined", "null"):
            to_date = datetime.now()
        else:
            to_date = urllib.parse.unquote(to_date)
            to_date = datetime.strptime(to_date[: to_date.index(" (")], "%a %b %d %Y %H:%M:%S %Z%z")

        try:
            total_income = Income.objects.filter(
                created_date__range=[from_date, to_date], user_id=user_id, is_active=True, group_income=None
            ).aggregate(total=Sum("amount"))["total"]

            total_expense = Expense.objects.filter(
                created_date__range=[from_date, to_date], user_id=user_id, is_active=True, group_expense=None
            ).aggregate(total=Sum("amount"))["total"]

            if not total_income:
                total_income = 0
            if not total_expense:
                total_expense = 0

            total_difference = total_income - total_expense

            return Response(
                data={"totalIncome": total_income, "totalExpense": total_expense, "totalDifference": total_difference}
            )
        except TypeError:
            return Response(data={"error": "an error occurred"}, status=status.HTTP_404_NOT_FOUND)
