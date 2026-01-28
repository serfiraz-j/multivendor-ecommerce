from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductAttribute, ProductVariant, Review, Wishlist

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'parent', 'image']

class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'color', 'additional_price', 'stock', 'sku']

class AttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = ['id', 'name', 'value']

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_feature']

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Review
        fields = ['id', 'username', 'rating', 'comment', 'created_at', 'product']

import json
import uuid
from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductAttribute, ProductVariant, Review, Wishlist

class ProductSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    variants = VariantSerializer(many=True, required=False)
    attributes = AttributeSerializer(many=True, required=False)
    images = ImageSerializer(many=True, read_only=True)
    
    store_name = serializers.ReadOnlyField(source='store.name')
    
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(), 
        write_only=True, 
        required=False
    )
    
    def get_average_rating(self, obj):
        import django.db.models as models
        if hasattr(obj, 'avg_rating') and obj.avg_rating is not None:
            return obj.avg_rating
        
        avg = obj.reviews.aggregate(models.Avg('rating'))['rating__avg']
        return avg if avg is not None else 0 

    class Meta:
        model = Product
        fields = ['id', 'store', 'category', 'title', 'slug', 'description', 
                  'base_price', 'variants', 'attributes', 'images', 
                  'uploaded_images', 'store_name', 'reviews', 'average_rating']
        read_only_fields = ['store', 'slug', 'store_name']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request.user, 'store'):
            validated_data['store'] = request.user.store
        else:
            raise serializers.ValidationError({"store": "You must have a store to create a product."})
        # validated_data içindeki boş hallerini temizle (hata almamak için)
        validated_data.pop('variants', None)
        validated_data.pop('attributes', None)
        uploaded_images = validated_data.pop('uploaded_images', [])

        # Request'ten string halini çek ve listeye çevir
        raw_variants = request.data.get('variants', '[]')
        raw_attributes = request.data.get('attributes', '[]')

        try:
            variants_list = json.loads(raw_variants) if isinstance(raw_variants, str) else raw_variants
            attributes_list = json.loads(raw_attributes) if isinstance(raw_attributes, str) else raw_attributes
        except (json.JSONDecodeError, TypeError):
            variants_list = []
            attributes_list = []

        if request and hasattr(request.user, 'store'):
            validated_data['store'] = request.user.store

        product = Product.objects.create(**validated_data)
        
        for var in variants_list:
            ProductVariant.objects.create(
                product=product,
                size=var.get('size', ''),
                color=var.get('color', ''),
                additional_price=var.get('additional_price', 0),
                stock=var.get('stock', 0),
                sku=var.get('sku', f"SKU-{uuid.uuid4().hex[:8].upper()}")
            )
            
        for attr in attributes_list:
            ProductAttribute.objects.create(
                product=product,
                name=attr.get('name'),
                value=attr.get('value')
            )
            
        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)
            
        return product
    def update(self, instance, validated_data):
        request = self.context.get('request')
        
        raw_variants = request.data.get('variants')
        raw_attributes = request.data.get('attributes')
        uploaded_images = request.FILES.getlist('uploaded_images')

        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.base_price = validated_data.get('base_price', instance.base_price)
        instance.category = validated_data.get('category', instance.category)
        instance.save()

        if raw_variants is not None:
            instance.variants.all().delete()
            variants_list = json.loads(raw_variants) if isinstance(raw_variants, str) else raw_variants
            for var in variants_list:
                ProductVariant.objects.create(
                    product=instance,
                    size=var.get('size', ''),
                    color=var.get('color', ''),
                    additional_price=var.get('additional_price', 0),
                    stock=var.get('stock', 0),
                    sku=var.get('sku', f"SKU-{uuid.uuid4().hex[:8].upper()}")
                )

        for image in uploaded_images:
            ProductImage.objects.create(product=instance, image=image)

        return instance
    
class WishlistSerializer(serializers.ModelSerializer):
    product_details = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_details', 'created_at']