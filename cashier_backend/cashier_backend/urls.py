"""cashier_backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from django.conf import settings
import oauth2_provider.views as oauth2_views


schema_view = get_schema_view(
    openapi.Info(
        title="YourCashier API",
        default_version="v1",
        description="APIs for YourCashier",
        contact=openapi.Contact(email="quoc2401@gmail.com"),
        license=openapi.License(name="QuocDuong@2023"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

oauth2_endpoint_views = [
    path("authorize/", oauth2_views.AuthorizationView.as_view(), name="authorize"),
    path("token/", oauth2_views.TokenView.as_view(), name="token"),
    path("revoke-token/", oauth2_views.RevokeTokenView.as_view(), name="revoke-token"),
]
# oauth additional urls
if settings.DEBUG:
    # OAuth2 Application Management endpoints
    oauth2_endpoint_views += [
        path("applications/", oauth2_views.ApplicationList.as_view(), name="list"),
        path("applications/register/", oauth2_views.ApplicationRegistration.as_view(), name="register"),
        path("applications/<pk>/", oauth2_views.ApplicationDetail.as_view(), name="detail"),
        path("applications/<pk>/delete/", oauth2_views.ApplicationDelete.as_view(), name="delete"),
        path("applications/<pk>/update/", oauth2_views.ApplicationUpdate.as_view(), name="update"),
    ]

    # OAuth2 Token Management endpoints
    oauth2_endpoint_views += [
        path("authorized-tokens/", oauth2_views.AuthorizedTokensListView.as_view(), name="authorized-token-list"),
        path(
            "authorized-tokens/<pk>/delete/",
            oauth2_views.AuthorizedTokenDeleteView.as_view(),
            name="authorized-token-delete",
        ),
    ]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("user.urls")),
    path("", include("income.urls")),
    path("", include("expense.urls")),
    # swagger urls
    re_path(r"^swagger(?P<format>\.json|\.yaml)$", schema_view.without_ui(cache_timeout=0), name="schema-json"),
    re_path(r"^swagger/$", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    re_path(r"^redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    # oauth urls
    path("o/", include((oauth2_endpoint_views, "oauth2_provider"), namespace="oauth2_provider")),
]
