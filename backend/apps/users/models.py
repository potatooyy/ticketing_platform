# /apps/users/models.py
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.db import models
from django.contrib.auth.validators import UnicodeUsernameValidator

username_validator = UnicodeUsernameValidator()


# Create your models here.
class Gender(models.TextChoices):
    MALE = 'male', '男'
    FEMALE = 'female', '女'
    UNDISCLOSED  = 'undisclosed', '不願透漏'
class UserRole(models.TextChoices):
    MEMBER = 'member', '一般會員'   
    STAFF = 'staff', '一般管理者'
    ADMIN = 'admin', '系統管理者'

class User(AbstractUser):
    username = models.CharField(
        _("使用者名稱"),
        max_length=150,
        unique=True,
        help_text=_(
            "必填，150 字元以內，可包含英文字母、數字及 @/./+/-/_ 等符號。"
        ),
        validators=[username_validator],
        error_messages={
            "unique": _("此使用者名稱已被使用。"),
        },
    )
    first_name = models.CharField(_('first name'), max_length=150, blank=False)
    last_name = models.CharField(_('last name'), max_length=150, blank=False)
    email = models.EmailField(_("email address"), blank=False, unique=True)
    gender = models.CharField(max_length=32, choices=Gender.choices, default=Gender.UNDISCLOSED, blank=False)
    role = models.CharField(max_length=32, choices=UserRole.choices, default=UserRole.MEMBER, blank=False)
    def __str__(self):
        return self.username

    def is_staff_user(self):
        return self.role == UserRole.STAFF

    def is_admin_user(self):
        return self.role == UserRole.ADMIN or self.is_superuser