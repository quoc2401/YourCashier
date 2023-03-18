from rest_framework import routers
from . import apis
from django.urls import include, path

r = routers.DefaultRouter()
r.register("incomes", apis.IncomeViewSet, basename="income")
r.register("group-incomes", apis.GroupIncomeViewSet, basename="group-income")

urlpatterns = [
    path("", include(r.urls)),
]
