from rest_framework import permissions


class GroupOwner(permissions.IsAuthenticated):
    def has_object_permission(self, request, view, obj):
        return request.user and request.user == obj.cashier_group.supervisor
