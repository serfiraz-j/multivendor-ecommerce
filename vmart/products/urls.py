from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, ReviewViewSet, WishlistViewSet

router = DefaultRouter()
router.register(r'items', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'reviews', ReviewViewSet)
router.register(r'wishlist', WishlistViewSet, basename='wishlist')

urlpatterns = [
    path('', include(router.urls)),
]