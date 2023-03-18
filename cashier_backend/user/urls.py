from rest_framework import routers
from . import apis
from django.urls import include, path

r = routers.DefaultRouter()
r.register("users", apis.UserViewSet, basename="user")
r.register("cashier-groups", apis.CashierGroupViewSet, basename="cashier-group")

urlpatterns = [
    path("", include(r.urls)),
]
