from .models import User, CashierGroup
from rest_framework import serializers


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

    class Meta:
        model = User
        fields = ("username", "password", "first_name", "last_name", "profile_picture")
        extra_kwargs = {
            "password": {"write_only": True},
        }


class UserResponseSerializer(UserSerializer):
    pass


class CashierGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CashierGroup
        fields = "__all__"
