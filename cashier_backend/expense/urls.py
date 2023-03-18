from rest_framework import routers
from . import apis
from django.urls import include, path

r = routers.DefaultRouter()
r.register("expenses", apis.ExpenseViewSet, basename="expense")
r.register("group-expenses", apis.GroupExpenseViewSet, basename="group-expense")

urlpatterns = [
    path("", include(r.urls)),
]
