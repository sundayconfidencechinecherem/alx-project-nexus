// contexts/OrdersContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type OrderStatus = 'received' | 'preparing' | 'ready' | 'delivered' | 'shipped' | 'processing';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  customerName: string;
  address: string;
  phone: string;
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | null>(null);

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD123456",
      items: [
        { id: "1", name: "Cappuccino", price: 4.2, quantity: 2 },
        { id: "2", name: "Latte", price: 4.0, quantity: 1 },
      ],
      total: 12.4,
      status: 'delivered',
      createdAt: new Date(Date.now() - 86400000 * 2),
      customerName: "John Doe",
      address: "123 Main St",
      phone: "+1234567890",
    },
    
  ]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`,
      status: 'received',
      createdAt: new Date(),
    };

    setOrders([newOrder, ...orders]);
    
    // Simulate order progress
    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'processing');
    }, 60000);

    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'preparing');
    }, 180000);

    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'ready');
    }, 300000);

    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'shipped');
    }, 420000);

    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'delivered');
    }, 600000);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
  };

  const getOrderById = (orderId: string) => {
    return orders.find(order => order.id === orderId);
  };

  return (
    <OrdersContext.Provider value={{ 
      orders, 
      addOrder, 
      updateOrderStatus,
      deleteOrder,
      getOrderById
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error('useOrders must be used within OrdersProvider');
  return context;
};