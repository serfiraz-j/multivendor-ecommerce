from rest_framework import viewsets, permissions, filters
from rest_framework.exceptions import ValidationError
from orders.models import Order, OrderItem
from django_filters.rest_framework import DjangoFilterBackend
from .models import Product, Category, Review, Wishlist
from .serializers import ProductSerializer, CategorySerializer, ReviewSerializer, WishlistSerializer
from django.db.models import Avg

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    filterset_fields = ['category', 'store', 'category__slug'] 
    search_fields = ['title', 'description', 'category__name']
    ordering_fields = ['base_price', 'created_at', 'avg_rating']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        is_vendor_view = self.request.query_params.get('vendor') == 'true'
        
        if is_vendor_view and self.request.user.is_authenticated:
            if hasattr(self.request.user, 'store'):
                return Product.objects.filter(store=self.request.user.store).annotate(
                    avg_rating=Avg('reviews__rating')
                ).order_by('-created_at')
        
        return Product.objects.filter(is_active=True).annotate(
            avg_rating=Avg('reviews__rating')
        ).order_by('-created_at')

    def perform_create(self, serializer):
        if hasattr(self.request.user, 'store'):
            serializer.save(store=self.request.user.store)
        else:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"store": "Mağaza profili bulunamadı. Lütfen önce mağaza oluşturun."})
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Ana sayfadaki kategori menüsü için."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]



class ReviewViewSet(viewsets.ModelViewSet):
    """Kullanıcıların yorum yapmasını ve puan vermesini sağlar."""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        user = self.request.user
        product = serializer.validated_data['product']
        
        serializer.save(user=self.request.user)

class WishlistViewSet(viewsets.ModelViewSet):
    """Kullanıcının favori ürünlerini yönetir."""
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Sadece giriş yapan kullanıcının kendi favorilerini getir
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)