from rest_framework import viewsets, permissions, generics, parsers, status
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
    # def create(self, request, *args, **kwargs):

    #     return super().create(request, *args, **kwargs)

    queryset = User.objects.all()
    serializer_class = UserResponseSerializer
    parser_classes = [parsers.MultiPartParser]

    def create(self, request, *args, **kwargs):
        # user = User.objects.create(request.data)
        print("here")
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            return Response(UserResponseSerializer(serializer.data).data)

        return Response(data={serializer.errors}, status=status.HTTP_406_NOT_ACCEPTABLE)


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
