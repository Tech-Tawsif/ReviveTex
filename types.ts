export interface Product {
  id: string | number;
  name: string;
  price: number;
  imageUrls: string[];
  description: string;
  moq: number; // Minimum Order Quantity
  stockType: 'bulk' | 'semi-bulk';
  createdAt?: string;
}

export interface BusinessProfile {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  location: string;
  businessType: string;
  isVerified: boolean;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: number;
  createdAt: string;
  businessId: string;
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface NewOrderResponse {
    id: number;
    subtotal: number;
}
