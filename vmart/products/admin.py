from django.contrib import admin
from .models import Category, Product, ProductImage, ProductAttribute, ProductVariant, Review, Wishlist

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

class ProductAttributeInline(admin.TabularInline):
    model = ProductAttribute
    extra = 1

class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['title', 'store', 'category', 'base_price', 'is_active']
    list_filter = ['category', 'store', 'is_active']
    search_fields = ['title', 'description']
    inlines = [ProductImageInline, ProductAttributeInline, ProductVariantInline]

admin.site.register(Category)
admin.site.register(Review)
admin.site.register(Wishlist)