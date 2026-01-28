from django.urls import path
from .views import RegisterView, ProfileUpdateView, StoreManageView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Profile & Store
    path('me/', ProfileUpdateView.as_view(), name='user_profile'),
    path('my-store/', StoreManageView.as_view(), name='manage_store'),
]