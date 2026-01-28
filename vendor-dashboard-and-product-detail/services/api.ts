import {
  mockUsers,
  mockCategories,
  mockProducts,
  mockOrders,
  mockAddresses,
  mockWishlist,
  mockVendorStats,
} from "@/data/mock-data"
import type { User, Category, Product, Order, Address, WishlistItem, VendorStats, CartItem } from "@/types"

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Auth API
export const authApi = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    await delay(500)
    const user = mockUsers.find((u) => u.email === email)
    if (!user) {
      throw new Error("Invalid credentials")
    }
    // In real app, validate password and return JWT
    return { user, token: "mock-jwt-token-" + user.id }
  },

  async register(data: {
    email: string
    password: string
    first_name: string
    last_name: string
    role: "customer" | "vendor"
  }): Promise<{ user: User; token: string }> {
    await delay(500)
    const newUser: User = {
      id: "user-" + Date.now(),
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      role: data.role,
      created_at: new Date().toISOString(),
    }
    return { user: newUser, token: "mock-jwt-token-" + newUser.id }
  },

  async getCurrentUser(token: string): Promise<User | null> {
    await delay(300)
    const userId = token.replace("mock-jwt-token-", "")
    return mockUsers.find((u) => u.id === userId) || null
  },
}

// Products API
export const productsApi = {
  async getAll(params?: { category?: string; search?: string }): Promise<Product[]> {
    await delay(300)
    let products = [...mockProducts]
    if (params?.category) {
      products = products.filter((p) => p.category_id === params.category)
    }
    if (params?.search) {
      const search = params.search.toLowerCase()
      products = products.filter(
        (p) => p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search),
      )
    }
    return products.filter((p) => p.is_active)
  },

  async getById(id: string): Promise<Product | null> {
    await delay(300)
    return mockProducts.find((p) => p.id === id) || null
  },

  async getBySlug(slug: string): Promise<Product | null> {
    await delay(300)
    return mockProducts.find((p) => p.slug === slug) || null
  },

  async getByVendor(vendorId: string): Promise<Product[]> {
    await delay(300)
    return mockProducts.filter((p) => p.vendor_id === vendorId)
  },

  async create(data: Partial<Product>): Promise<Product> {
    await delay(500)
    const newProduct: Product = {
      id: "prod-" + Date.now(),
      vendor_id: data.vendor_id || "",
      vendor_name: data.vendor_name || "",
      name: data.name || "",
      slug: data.name?.toLowerCase().replace(/\s+/g, "-") || "",
      description: data.description || "",
      base_price: data.base_price || 0,
      category_id: data.category_id || "",
      category_name: data.category_name || "",
      images: data.images || [],
      variants: data.variants || [],
      attributes: data.attributes || [],
      reviews: [],
      average_rating: 0,
      review_count: 0,
      stock: data.stock || 0,
      is_active: true,
      created_at: new Date().toISOString(),
    }
    return newProduct
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    await delay(500)
    const product = mockProducts.find((p) => p.id === id)
    if (!product) throw new Error("Product not found")
    return { ...product, ...data }
  },

  async delete(id: string): Promise<void> {
    await delay(300)
  },
}

// Categories API
export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    await delay(200)
    return mockCategories
  },

  async getById(id: string): Promise<Category | null> {
    await delay(200)
    return mockCategories.find((c) => c.id === id) || null
  },
}

// Orders API
export const ordersApi = {
  async getByUser(userId: string): Promise<Order[]> {
    await delay(300)
    return mockOrders.filter((o) => o.user_id === userId)
  },

  async getByVendor(vendorId: string): Promise<Order[]> {
    await delay(300)
    return mockOrders.filter((o) => o.items.some((item) => item.vendor_id === vendorId))
  },

  async create(data: { items: CartItem[]; shipping_address: Address; user_id: string }): Promise<Order> {
    await delay(500)
    const order: Order = {
      id: "order-" + Date.now(),
      user_id: data.user_id,
      items: data.items.map((item) => ({
        id: "item-" + Date.now() + Math.random(),
        product_id: item.product.id,
        product_name: item.product.name,
        product_image: item.product.images[0]?.url || "",
        variant_name: item.variant?.value,
        quantity: item.quantity,
        unit_price: item.product.base_price + (item.variant?.additional_price || 0),
        total_price: (item.product.base_price + (item.variant?.additional_price || 0)) * item.quantity,
        status: "pending",
        vendor_id: item.product.vendor_id,
        vendor_name: item.product.vendor_name,
      })),
      shipping_address: data.shipping_address,
      subtotal: data.items.reduce(
        (sum, item) => sum + (item.product.base_price + (item.variant?.additional_price || 0)) * item.quantity,
        0,
      ),
      shipping_cost: 9.99,
      total: 0,
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    order.total = order.subtotal + order.shipping_cost
    return order
  },

  async shipItem(
    orderId: string,
    itemId: string,
    data: { tracking_number: string; carrier_company: string },
  ): Promise<void> {
    await delay(500)
    // In real app, this would update the database
  },
}

// Addresses API
export const addressesApi = {
  async getByUser(userId: string): Promise<Address[]> {
    await delay(200)
    return mockAddresses.filter((a) => a.user_id === userId)
  },

  async create(data: Omit<Address, "id">): Promise<Address> {
    await delay(300)
    return { id: "addr-" + Date.now(), ...data }
  },

  async update(id: string, data: Partial<Address>): Promise<Address> {
    await delay(300)
    const address = mockAddresses.find((a) => a.id === id)
    if (!address) throw new Error("Address not found")
    return { ...address, ...data }
  },

  async delete(id: string): Promise<void> {
    await delay(200)
  },
}

// Wishlist API
export const wishlistApi = {
  async getByUser(userId: string): Promise<WishlistItem[]> {
    await delay(200)
    return mockWishlist
  },

  async add(userId: string, productId: string): Promise<WishlistItem> {
    await delay(300)
    const product = mockProducts.find((p) => p.id === productId)
    if (!product) throw new Error("Product not found")
    return {
      id: "wish-" + Date.now(),
      product,
      added_at: new Date().toISOString(),
    }
  },

  async remove(userId: string, wishlistItemId: string): Promise<void> {
    await delay(200)
  },
}

// Vendor Stats API
export const vendorApi = {
  async getStats(vendorId: string): Promise<VendorStats> {
    await delay(300)
    return mockVendorStats
  },
}
