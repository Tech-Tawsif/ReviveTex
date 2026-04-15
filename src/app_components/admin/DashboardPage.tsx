import React, { useState } from 'react';
import type { Product, Order } from '../../types';
import ProductModal from './ProductModal';
import OrdersPage from './OrdersPage';
import { EditIcon } from './ui-icons/EditIcon';
import { DeleteIcon } from './ui-icons/DeleteIcon';

interface DashboardPageProps {
    products: Product[];
    orders: Order[];
    onAddProduct: (newProductData: Omit<Product, 'id'>, images: File[]) => void;
    onUpdateProduct: (updatedProduct: Product, newImages: File[]) => void;
    onDeleteProduct: (productId: string | number) => void;
    onLogout: () => void;
    onExitAdmin: () => void;
    isLoading: boolean;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ products, orders, onAddProduct, onUpdateProduct, onDeleteProduct, onLogout, onExitAdmin, isLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [activeView, setActiveView] = useState<'products' | 'orders'>('products');

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };
    
    const handleDeleteClick = (product: Product) => {
        if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
            onDeleteProduct(product.id);
        }
    };

    const handleSaveProduct = (productData: Omit<Product, 'id'> | Product, images: File[]) => {
        if ('id' in productData) {
            onUpdateProduct(productData as Product, images);
        } else {
            onAddProduct(productData, images);
        }
        setIsModalOpen(false);
    };

    const TabButton: React.FC<{ view: 'products' | 'orders'; label: string; count: number }> = ({ view, label, count }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeView === view
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
        >
            {label} <span className="ml-1 bg-gray-300 text-gray-700 text-xs font-semibold px-2 py-0.5 rounded-full">{count}</span>
        </button>
    );

    return (
        <div className="relative min-h-screen">
            {isLoading && (
                <div className="absolute inset-0 bg-gray-500/30 z-50 flex items-center justify-center" aria-label="Loading...">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                </div>
            )}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2 font-display">Revive<span className="text-emerald-600">Tex</span> Factory Admin</h1>
                        <div className="flex space-x-2">
                            <TabButton view="products" label="Inventory" count={products.length} />
                            <TabButton view="orders" label="Bulk Orders" count={orders.length} />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                         <button
                            onClick={onLogout}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Logout
                        </button>
                        <button
                            onClick={onExitAdmin}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Exit to Shop
                        </button>
                    </div>
                </header>
                
                {activeView === 'products' && (
                    <>
                        <div className="w-full text-right mb-6">
                             <button
                                onClick={handleOpenAddModal}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                + Add New Product
                            </button>
                        </div>

                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Type</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MOQ</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Unit</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map(product => (
                                            <tr key={product.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {product.imageUrls && product.imageUrls.length > 0 ? (
                                                            <img src={product.imageUrls[0]} alt={product.name} className="w-10 h-10 object-cover rounded-lg mr-3" />
                                                        ) : (
                                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 mr-3">No Image</div>
                                                        )}
                                                        <div className="text-sm font-bold text-slate-900">{product.name}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                                                        product.stockType === 'bulk' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {product.stockType}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                    {product.moq} units
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-slate-900">৳{product.price}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end space-x-4">
                                                        <button onClick={() => handleOpenEditModal(product)} className="text-blue-600 hover:text-blue-900 flex items-center space-x-1">
                                                            <EditIcon />
                                                            <span>Edit</span>
                                                        </button>
                                                         <button onClick={() => handleDeleteClick(product)} className="text-red-600 hover:text-red-900 flex items-center space-x-1">
                                                            <DeleteIcon />
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activeView === 'orders' && (
                    <OrdersPage orders={orders} />
                )}

                {isModalOpen && (
                    <ProductModal
                        product={editingProduct}
                        onClose={() => setIsModalOpen(false)}
                        onSave={handleSaveProduct}
                    />
                )}
            </div>
        </div>
    );
};

export default DashboardPage;