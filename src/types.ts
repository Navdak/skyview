export type UserRole = 'admin' | 'customer';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: UserRole;
  createdAt?: any;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable?: boolean;
  isPopular?: boolean;
  createdAt?: any;
}

export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Reservation {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  date: string;
  time: string;
  guests: number;
  status: ReservationStatus;
  notes?: string;
  createdAt?: any;
}

export interface Review {
  id: string;
  userId?: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: any;
}

export type OrderStatus = 'pending' | 'preparing' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress?: string;
  createdAt?: any;
}
