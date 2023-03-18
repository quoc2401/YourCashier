from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from .models import Income, GroupIncome
from .serializers import IncomeSerializer, GroupIncomeSerializer


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


class GroupIncomeViewSet(
    viewsets.ViewSet,
    generics.CreateAPIView,
    generics.DestroyAPIView,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.UpdateAPIView,
):
    queryset = GroupIncome.objects.all()
    serializer_class = GroupIncomeSerializer
