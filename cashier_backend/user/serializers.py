from .models import User, CashierGroup
from rest_framework import serializers
from django.contrib.sites.models import Site


class UserSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField(method_name="get_profile_picture")

    def get_profile_picture(self, user):
        if user.profile_picture:
            request = self.context.get("request")
            return request.build_absolute_uri("/static/%s" % user.profile_picture)

    class Meta:
        model = User
        fields = ("uuid", "username", "first_name", "last_name", "email", "profile_picture")


class CreateUserSerializer(serializers.ModelSerializer):
    def create(self, validated_data):
        data = validated_data.copy()
        u = User(**data)
        u.set_password(u.password)
        u.save()

        return u

    class Meta:
        model = User
        fields = (
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "profile_picture",
        )
        extra_kwargs = {
            "password": {"write_only": True},
        }


class RebuildUrlUserSerializer(UserSerializer):
    profile_picture = serializers.SerializerMethodField(method_name="get_profile_picture")

    def get_profile_picture(self, user):
        domain = Site.objects.get_current().domain
        path = user["profile_picture"]
        url = "http://{domain}/static{path}".format(domain=domain, path=path)
        return url


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "password")


class CashierGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashierGroup
        fields = "__all__"
