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
import requests
from django.contrib.sites.models import Site
from decouple import config
from django.db.models import Q
import json


class UserViewSet(
    viewsets.ViewSet,
    # generics.DestroyAPIView,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.UpdateAPIView,
):
    # def create(self, request, *args, **kwargs):

    #     return super().create(request, *args, **kwargs)

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
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(RebuildUrlUserSerializer(serializer.data).data)

        return Response(data={**serializer.errors}, status=status.HTTP_406_NOT_ACCEPTABLE)

    def logout(self, request):
        pass

    @action(methods=["POST"], detail=False, parser_classes=[parsers.JSONParser])
    def login(self, request):
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
            if res.status_code == 200:
                user = User.objects.get(username=username)
                data = {**(res.json()), "user": RebuildUrlUserSerializer(user.__dict__).data}
                return Response(data=data, status=status.HTTP_200_OK)
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response("errors: username and password are required", status.HTTP_400_BAD_REQUEST)

    @action(methods=["GET"], detail=True)
    def get_groups_by_user(self, request, pk):
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

    def create(self, request):
        supervisor = request.user
        users = request.data["users"]
        group = CashierGroup.objects.create(users=users, supervisor=supervisor, name=request.data["name"])

        return Response(CashierGroupSerializer(group).data, status=status.HTTP_201_CREATED)
