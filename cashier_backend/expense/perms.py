from rest_framework.permissions import IsAuthenticated


class IsOwner(IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        perms = request.user and request.user == obj.user
        return perms
