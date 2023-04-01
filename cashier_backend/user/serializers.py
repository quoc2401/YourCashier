from .models import User, CashierGroup
from rest_framework import serializers
from django.contrib.sites.models import Site
from django.utils.text import camel_case_to_spaces, get_valid_filename


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

    def to_internal_value(self, data):
        """
        Override to_internal_value to convert camel case property names to snake case
        """
        snake_case_data = {}
        for key, value in data.items():
            # Convert camel case property names to snake case
            snake_case_key = get_valid_filename(camel_case_to_spaces(key)).replace(" ", "_")
            snake_case_data[snake_case_key] = value
        return super().to_internal_value(snake_case_data)

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
        path = "/static/" + user["profile_picture"]
        print(path)
        path = path.replace("//", "/")
        print(path)
        url = "http://{domain}{path}".format(domain=domain, path=path)
        return url


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "password")


class CashierGroupSerializer(serializers.ModelSerializer):
    supervisor = serializers.SerializerMethodField(method_name="get_supervisor")
    users = serializers.SerializerMethodField(method_name="get_users")

    def get_supervisor(self, group):
        u = RebuildUrlUserSerializer(group.supervisor.__dict__).data
        return u

    def get_users(self, group):
        print(group.users.all())
        # u = RebuildUrlUserSerializer(group.users.all(), many=True).data

        data = [RebuildUrlUserSerializer(u.__dict__).data for u in group.users.all()]
        return data

    class Meta:
        model = CashierGroup
        fields = "__all__"
