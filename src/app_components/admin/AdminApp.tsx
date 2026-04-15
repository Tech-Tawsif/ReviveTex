import React, { useState, useEffect } from 'react';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';
import type { Product, Order } from '../../types';
import * as SupabaseService from '../../supabaseService';

interface AdminAppProps {
    products: Product[];
    onAddProduct: (newProductData: Omit<Product, 'id'>, images: File[]) => void;
    onUpdateProduct: (updatedProduct: Product, newImages: File[]) => void;
    onDeleteProduct: (productId: string | number) => void;
    onExitAdmin: () => void;
    isLoading: boolean;
}

const AdminApp: React.FC<AdminAppProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct, onExitAdmin, isLoading }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isOrdersLoading, setIsOrdersLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setIsOrdersLoading(true);
            const fetchedOrders = await SupabaseService.getOrders();
            setOrders(fetchedOrders);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            alert(`Could not fetch orders. Please check the console for details.`);
        } finally {
            setIsOrdersLoading(false);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchOrders();
        }
    }, [isLoggedIn]);

    const handleLogin = (user: string, pass: string) => {
        if (user === 'admin' && pass === 'password') {
            setIsLoggedIn(true);
        } else {
            alert('Invalid credentials');
        }
    };
    
    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
      <div className="bg-gray-100 min-h-screen">
        <DashboardPage 
            products={products}
            orders={orders}
            onAddProduct={onAddProduct}
            onUpdateProduct={onUpdateProduct}
            onDeleteProduct={onDeleteProduct}
            onLogout={handleLogout}
            onExitAdmin={onExitAdmin}
            isLoading={isLoading || isOrdersLoading}
        />
      </div>
    );
};

export default AdminApp;