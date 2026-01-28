from rest_framework import serializers
from .models import User, Profile, Store

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ['phone', 'address_line', 'city', 'country', 'zip_code']

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'name', 'slug', 'description', 'logo', 'banner', 'verified', 
                  'policy_welcome', 'policy_shipping', 'policy_refund']
        read_only_fields = ['slug', 'verified']

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    store = StoreSerializer(read_only=True)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'is_seller', 'profile', 'store']

    def create(self, validated_data):
        """Yeni kullanıcı kaydı için."""
        profile_data = validated_data.pop('profile')
        password = validated_data.pop('password')
        
        # Kullanıcıyı oluştur
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        
        # Profilini oluştur
        Profile.objects.create(user=user, **profile_data)
        store_name = self.initial_data.get('store') 
    
        if user.is_seller and store_name:
            from products.models import Store
            Store.objects.create(
                user=user, 
                name=store_name
            )
        return user

    def update(self, instance, validated_data):
        """Profil bilgilerini güncellemek için."""
        profile_data = validated_data.pop('profile', None)
        
        for attr, value in validated_data.items():
            if attr == 'password':
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()

        if profile_data:
            profile = instance.profile
            for attr, value in profile_data.items():
                setattr(profile, attr, value)
            profile.save()
            
        return instance