from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from cashier_backend.abstract_models import BaseModel


# Create your models here.
class User(AbstractUser):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False)
    profile_picture = models.ImageField(upload_to="users/%y/%m", null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)


class CashierGroup(BaseModel):
    name = models.CharField(max_length=255)
    supervisor_id = models.ForeignKey(
        User,
        related_name="supervised_cashier_groups",
        related_query_name="supervised_cashier_groups",
        on_delete=models.PROTECT,
    )
    users = models.ManyToManyField(User, related_name="cashier_groups")
