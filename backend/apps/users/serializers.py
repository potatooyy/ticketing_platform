# apps/users/serializers.py
# TODO: 補密碼強度驗證
from rest_framework import serializers
from .models import User
class UserRegistrationSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = (
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            'gender', 
            'password'
        )
        

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            gender=validated_data['gender'],
            role='member',
        )
        user.set_password(validated_data['password'])
        user.save()
        return user