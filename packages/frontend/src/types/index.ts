export type Offer = {
  id: string;
  name: string;
  description: string;
  price: string;
  type: 'SOLO' | 'DUO' | 'FAMILY';
  seats: number;
  isActive: boolean;
  eventId?: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  sport: string;
  location: string;
  date: string;
  image?: string | null;
  offers?: Offer[] | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type User = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type Order = {
  id: string;
  userId: string;
  offerId: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  transactionType?: string | null;
  transactionId?: string | null;
  totalAmount: string;
  key2?: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type Ticket = {
  id: string;
  userId: string;
  offerId: string;
  finalKey: string;
  status: 'ACTIVE' | 'USED' | 'CANCELLED';
  orderItemId: string;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};

export type PassType = 'Solo' | 'Duo' | 'Familial';

export type OrderItem = {
  id: string;
  offerId: string;
  orderId: string;
  quantity: number;
  unitPrice: string;
  tickets: Ticket[];
};

export type OrderWithItems = {
  id: string;
  userId: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  transactionType?: string | null;
  transactionId?: string | null;
  totalAmount: string;
  key2?: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  orderItems: OrderItem[];
};
