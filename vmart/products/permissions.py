from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Sadece mağaza sahibi ürünü düzenleyebilir."""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.store.user == request.user