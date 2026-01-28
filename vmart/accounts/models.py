from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify

class User(AbstractUser):
    is_seller = models.BooleanField(default=False, help_text="Kullanıcı satıcı moduna geçti mi?")
    email = models.EmailField(unique=True)

    REQUIRED_FIELDS = ['email'] # Email zorunlu

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone = models.CharField(max_length=20, blank=True)
    address_line = models.TextField(blank=True, help_text="Açık adres")
    city = models.CharField(max_length=50, blank=True)
    country = models.CharField(max_length=50, blank=True)
    zip_code = models.CharField(max_length=10, blank=True)

    def __str__(self):
        return f"{self.user.username} Profili"

class Store(models.Model):
    """Satıcının dükkan kimliği."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='store')
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)
    logo = models.ImageField(upload_to='stores/logos/', null=True, blank=True)
    banner = models.ImageField(upload_to='stores/banners/', null=True, blank=True)
    policy_welcome = models.TextField(blank=True, help_text="Mağaza karşılama mesajı")
    policy_shipping = models.TextField(blank=True, help_text="Kargo politikası")
    policy_refund = models.TextField(blank=True, help_text="İade politikası")
    verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name