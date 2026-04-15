import React from 'react';
import type { Order } from '../../types';

interface OrdersPageProps {
    orders: Order[];
}

const OrdersPage: React.FC<OrdersPageProps> = ({ orders }) => {
    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</div>
                                    <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{order.name}</div>
                                    <div className="text-sm text-gray-500">{order.phone}</div>
                                    <div className="text-sm text-gray-500 truncate max-w-xs">{order.address}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <ul className="text-sm text-gray-700 list-disc list-inside">
                                        {order.items.map(item => (
                                            <li key={item.id}>{item.name} (x{item.quantity})</li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 font-semibold">৳{order.subtotal.toFixed(2)}</div>
                                </td>
                                 <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {orders.length === 0 && (
                    <div className="text-center py-10 text-gray-500">
                        No orders have been placed yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
