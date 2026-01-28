from django.db import models
from accounts.models import User, Store
from products.models import Product, ProductVariant

class Order(models.Model):
    """Alıcının gördüğü ana sipariş ve ödeme özeti."""
    STATUS_CHOICES = (
        ('pending', 'Ödeme Bekliyor'),
        ('paid', 'Ödendi / Hazırlanıyor'),
        ('failed', 'Ödeme Başarısız'),
        ('completed', 'Tamamlandı'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    shipping_address = models.TextField()
    # Ödeme Simülasyonu için:
    transaction_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sipariş #{self.id} - {self.user.username}"

class OrderItem(models.Model):
    """Satıcının gördüğü kalemler ve kargo takibi."""
    SHIPPING_STATUS = (
        ('processing', 'Hazırlanıyor'),
        ('shipped', 'Kargoya Verildi'),
        ('delivered', 'Teslim Edildi'),
        ('cancelled', 'İptal Edildi'),
    )
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='vendor_orders')
    
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=12, decimal_places=2) # Fiyat değişirse sipariş bozulmamalı
    
    # KARGO TAKİBİ (Hem satıcı günceller, hem alıcı izler)
    shipping_status = models.CharField(max_length=20, choices=SHIPPING_STATUS, default='processing')
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    carrier_company = models.CharField(max_length=50, blank=True, null=True) # Örn: Aras, UPS

    def __str__(self):
        return f"{self.product.title} ({self.quantity} adet)"