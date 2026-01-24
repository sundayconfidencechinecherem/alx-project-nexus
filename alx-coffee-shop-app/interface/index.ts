export interface ButtonProps {
    title: string;
    Btnstyling?: string;
    Txtstyling?: string;
    onPress?: () => void;
}

export interface CoffeeCardProps {
    imageSource?: any;
    name: string;
    Amount: number;
    description: string; 
    id?: string;
    rating?: number;
    
}

export interface Coffee {
    id: string;
    name: string;
    description: string; 
    price: number;
    rating: number;
    size?: string;
    
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface Order {
    id: string;
    items: OrderItem[];
    total: number;
    status: 'received' | 'preparing' | 'ready' | 'delivered' | 'shipped' | 'processing';
    createdAt: Date;
}
