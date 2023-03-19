from rest_framework import viewsets, permissions, generics, parsers, status
from rest_framework.decorators import action, parser_classes as parserClasses
from rest_framework.response import Response
from .models import User, CashierGroup
from .serializers import UserSerializer, UserResponseSerializer, CashierGroupSerializer, LoginSerializer
import requests
from django.contrib.sites.models import Site
from decouple import config
import json


class UserViewSet(
    viewsets.ViewSet,
    generics.CreateAPIView,
    generics.DestroyAPIView,
    generics.ListAPIView,
    generics.RetrieveAPIView,
    generics.UpdateAPIView,
):
    # def create(self, request, *args, **kwargs):

    #     return super().create(request, *args, **kwargs)

    queryset = User.objects.all()
    serializer_class = UserResponseSerializer
    parser_classes = [parsers.MultiPartParser]
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        print("dasdasd1")
        if self.action == "login":
            print("dasdasd1")
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == "login":
            return LoginSerializer
        return UserResponseSerializer

    def initial(self, request, *args, **kwargs):
        if self.action == "login":
            # remove the JSON parser
            self.parser_classes = []

        return super().initial(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            return Response(UserResponseSerializer(serializer.data).data)

        return Response(data={**serializer.errors}, status=status.HTTP_406_NOT_ACCEPTABLE)

    @parserClasses([])
    @action(methods=["POST"], detail=False)
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
            print(res.json())
            if res.status_code == 200:
                user = User.objects.get(username=username)
                data = {**(res.json()), "user": UserResponseSerializer(user).data}
                return Response(data=data, status=status.HTTP_200_OK)
            return Response(status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response("errors: username and password are required", status.HTTP_400_BAD_REQUEST)


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
