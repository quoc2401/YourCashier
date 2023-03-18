from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response
from .models import User, CashierGroup
from .serializers import UserSerializer, UserResponseSerializer, CashierGroupSerializer


class UserViewSet(
    viewsets.ViewSet,
    generics.CreateAPIView,
    generics.DestroyAPIView,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.UpdateAPIView,
):
    queryset = User.objects.all()
    serializer_class = UserSerializer


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
