from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer, CheckoutSerializer

class OrderViewSet(viewsets.ModelViewSet):
    """ALICI İÇİN: Kendi siparişlerini listeler ve yeni sipariş oluşturur."""
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'create':
            return CheckoutSerializer
        return OrderSerializer

class VendorOrderViewSet(viewsets.ModelViewSet):
    """SATICI İÇİN: Sadece kendi mağazasına gelen ürünleri görür ve kargolar."""
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = OrderItemSerializer

    def get_queryset(self):
        # Satıcı sadece kendi mağazasının kalemlerini görür
        return OrderItem.objects.filter(store__user=self.request.user).order_by('-id')

    @action(detail=True, methods=['post'])
    def ship_item(self, request, pk=None):
        order_item = self.get_object()
        order_item.shipping_status = 'shipped'
        order_item.tracking_number = request.data.get('tracking_number', 'TRK123456789')
        order_item.carrier_company = request.data.get('carrier', 'Aras Kargo')
        order_item.save()
        main_order = order_item.order
        main_order.status = 'completed'
        main_order.save()
        return Response({"detail": "Ürün kargoya verildi. Alıcı artık takip edebilir."})