from rest_framework import viewsets, permissions, generics, parsers, status
from rest_framework.decorators import action, parser_classes as method_parsers
from rest_framework.response import Response
from .models import User, CashierGroup
from .serializers import (
    CreateUserSerializer,
    UserSerializer,
    CashierGroupSerializer,
    LoginSerializer,
    RebuildUrlUserSerializer,
)
from decouple import config
import json
from .services import UserServices


class UserViewSet(
    viewsets.ViewSet,
    # generics.DestroyAPIView,
    # generics.ListAPIView,
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
