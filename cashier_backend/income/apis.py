from rest_framework import viewsets, status, generics, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Income, GroupIncome
from user.models import User
from .serializers import IncomeSerializer, GroupIncomeSerializer, CreateGroupIncomeSerializer
from django.db import transaction


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
    parser_classes = [parsers.JSONParser]


class GroupIncomeViewSet(
    viewsets.ViewSet,
    generics.DestroyAPIView,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.UpdateAPIView,
):
    queryset = GroupIncome.objects.all()
    serializer_class = GroupIncomeSerializer
    parser_classes = [parsers.JSONParser]

    @action(methods=["POST"], detail=False, serializer_class=CreateGroupIncomeSerializer)
    def create_new(self, request):
        try:
            with transaction.atomic():
                u = User.objects.get(username=request.user.username)
                income = Income.objects.create(
                    amount=request.data["income"]["amount"], description=request.data["income"]["description"], user=u
                )
                group_income = GroupIncome.objects.create(income=income, cashier_group_id=request.data["cashier_group"])

            transaction.commit()

        except Exception as e:
            transaction.rollback()

        return Response(data=GroupIncomeSerializer(group_income).data, status=status.HTTP_200_OK)
