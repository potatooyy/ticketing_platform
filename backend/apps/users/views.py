# apps/users/views.py
# TODO: JWT
from rest_framework import viewsets, status
from .models import User
from .serializers import UserRegistrationSerializers
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response


# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch', 'delete']
    queryset =User.objects.all().order_by('-date_joined')
    serializer_class = UserRegistrationSerializers

    # def get_permissions(self):
    #     if self.action == 'create':
    #         permission_classes = [AllowAny]  # 允許未登入註冊
    #     else:
    #         permission_classes = [IsAuthenticated]  # 其他動作需登入
    #     return [permission() for permission in permission_classes]
    
    def get_permissions(self):
        if self.action in ['create']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]


    def create(self, request, *args, **kwargs):

        print(request.data)
        # request_data = request.data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()