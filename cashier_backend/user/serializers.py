from .models import User, CashierGroup
from rest_framework import serializers
from django.contrib.sites.models import Site


class UserSerializer(serializers.ModelSerializer):
    # image = serializers.SerializerMethodField(source="profile_picture", method_name="get_image")
    # avatar = serializers.SerializerMethodField('avatar')

    # def get_image(self, user):
    #     if user.avatar:
    #         request = self.context.get("request")
    #         return request.build_absolute_uri("/static/%s" % user.avatar.name) if request else ""

    def create(self, validated_data):
        data = validated_data.copy()
        u = User(**data)
        u.set_password(u.password)
        u.save()

        return u

    # def get_absolute_url():
    #     return "/users/"

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


class UserResponseSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField(method_name="get_profile_picture")

    def get_profile_picture(self, user):
        user = User(**user)
        if user.profile_picture:
            domain = Site.objects.get_current().domain
            path = user.profile_picture
            url = "http://{domain}/static/{path}".format(domain=domain, path=path)
            return url

    class Meta:
        model = User
        fields = ("uuid", "username", "first_name", "last_name", "email", "profile_picture")


class CashierGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashierGroup
        fields = "__all__"
