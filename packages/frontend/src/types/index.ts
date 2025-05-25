export type Offer = {
  id: string;
  title: string;
  type: string;
  price: string;
  status: string;
  description: string;
  image: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  lieu: string;
  price: string;
  status: string;
  description: string;
  image: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  key1: string;
};

export type Order = {
  id: string;
  user: string;
  date: string;
  total: string;
  status: string;
};
