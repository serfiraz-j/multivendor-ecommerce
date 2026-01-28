from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import User, Store, Profile
from .serializers import UserSerializer, StoreSerializer, ProfileSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class ProfileUpdateView(generics.RetrieveUpdateAPIView):
    """Kullanıcının kendi profilini görmesi ve düzenlemesi."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class StoreManageView(generics.RetrieveUpdateAPIView):
    """Satıcının mağaza bilgilerini yönetmesi."""
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Mağaza yoksa otomatik oluştur (Etsy'de mağaza açma süreci gibi)
        store, created = Store.objects.get_or_create(
            user=self.request.user, 
            defaults={'name': f"{self.request.user.username}'s Shop"}
        )
        if not self.request.user.is_seller:
            self.request.user.is_seller = True
            self.request.user.save()
        return store