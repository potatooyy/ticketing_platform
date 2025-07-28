# /apps/users/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User

# Register your models here.
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    # list 頁面欄位顯示
    list_display = ('username', 'email', 'role', 'is_staff', 'is_superuser')
    # 詳細頁面欄位分組與顯示
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('email', 'first_name', 'last_name', 'gender', 'role')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    # 新增使用者表單欄位配置
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'first_name', 'last_name', 'gender', 'role'),
        }),
    )
    search_fields = ('username', 'email')
    ordering = ('username',)