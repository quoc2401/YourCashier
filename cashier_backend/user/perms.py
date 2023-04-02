from rest_framework.permissions import IsAuthenticated


class IsOwner(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        perms = request.user and request.user == obj
        return perms


class IsAdmin(IsAuthenticated):
    def has_permission(self, request, view):
        return request.user and request.user.is_superuser == True
