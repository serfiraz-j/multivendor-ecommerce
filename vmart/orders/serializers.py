from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product, ProductVariant

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.title')
    product_id = serializers.ReadOnlyField(source='product.id')
    store_name = serializers.ReadOnlyField(source='store.name')
    product_image = serializers.SerializerMethodField()
    product_slug = serializers.ReadOnlyField(source='product.slug')

    class Meta:
        model = OrderItem
        fields = [
            'id', 'product_name', 'product_image', 'product_slug', 
            'store_name', 'quantity', 'price_at_purchase', 
            'shipping_status', 'tracking_number', 'carrier_company','product_id'
        ]

    def get_product_image(self, obj):
        if obj.product.images.exists():
            image_obj = obj.product.images.first()
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(image_obj.image.url)
            return image_obj.image.url
        return None
    
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'total_price', 'status', 'shipping_address', 'items', 'created_at']

class CheckoutSerializer(serializers.Serializer):
    address = serializers.CharField(write_only=True)
    cart_items = serializers.JSONField(write_only=True)

    def create(self, validated_data):
        user = self.context['request'].user
        items_data = validated_data.pop('cart_items')
        address_text = validated_data.pop('address')
    
        # 1. Stok Kontrolü
        for item in items_data:
            product = Product.objects.get(id=item['product_id'])
            variant = ProductVariant.objects.get(id=item['variant_id']) if item.get('variant_id') else None
            stock_to_check = variant.stock if variant else product.stock
            if stock_to_check < item['quantity']:
                raise serializers.ValidationError(f"Stok yetersiz: {product.title}")

        order = Order.objects.create(
            user=user,
            total_price=0,
            shipping_address=address_text, 
            status='paid',
            transaction_id="SIMULATED_TRANS_12345"
        )

        total_order_price = 0
        for item in items_data:
            product = Product.objects.get(id=item['product_id'])
            variant = ProductVariant.objects.get(id=item['variant_id']) if item.get('variant_id') else None
            
            price = (product.base_price + (variant.additional_price if variant else 0))
            total_order_price += (price * item['quantity'])

            OrderItem.objects.create(
                order=order,
                product=product,
                variant=variant,
                store=product.store,
                quantity=item['quantity'],
                price_at_purchase=price
            )
            
            # Stok Güncelleme
            if variant:
                variant.stock -= item['quantity']
                variant.save()
            else:
                product.stock -= item['quantity']
                product.save()

        order.total_price = total_order_price
        order.save()
        return order