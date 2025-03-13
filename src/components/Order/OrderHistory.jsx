import { useState, useEffect } from 'react';
import { message } from 'antd';
import { formatDate } from '../../utils/format';
import { fetchOrderHistory } from '../../apis/order';
import { FaSearch, FaSpinner } from 'react-icons/fa';

const OrderHistory = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [orders, setOrders] = useState([]);

  // Dummy orders for demonstration
  const dummyOrders = [
    {
      orderId: "ORD-2024-001",
      createdAt: new Date(),
      totalAmount: 299.99,
      status: "IN_PROCESS",
      products: [
        {
          id: 1,
          name: "Wireless Headphones",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
          quantity: 2,
          price: 149.99,
          category: "Electronics"
        },
        {
          id: 2,
          name: "Smart Watch",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
          quantity: 1,
          price: 199.99,
          category: "Accessories"
        }
      ]
    },
    {
      orderId: "ORD-2024-002",
      createdAt: new Date(Date.now() - 86400000),
      totalAmount: 159.98,
      status: "COMPLETED",
      products: [
        {
          id: 3,
          name: "Running Shoes",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
          quantity: 1,
          price: 159.98,
          category: "Footwear"
        }
      ]
    },
    {
      orderId: "ORD-2024-003",
      createdAt: new Date(Date.now() - 2 * 86400000),
      totalAmount: 89.95,
      status: "CANCELLED",
      products: [
        {
          id: 4,
          name: "Bluetooth Speaker",
          image: "https://images.unsplash.com/photo-1558537348-c0f8e733989d",
          quantity: 1,
          price: 89.95,
          category: "Electronics"
        }
      ]
    }
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Comment this out for demo and use dummy data instead
      // const data = await fetchOrderHistory();
      // setOrders(data);
      
      // Use dummy data for demo
      setTimeout(() => {
        setOrders(dummyOrders);
        setLoading(false);
      }, 1000); // Simulate API delay
    } catch (error) {
      message.error(error?.response?.data || 'Error fetching orders');
    } finally {
      // setLoading(false); // This is handled in the setTimeout for the demo
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "IN_PROCESS":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.products.some(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
            <p className="text-gray-600 mt-1">John Doe | Total Orders: {orders.length}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="IN_PROCESS">In Process</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.orderId}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt, "MMM dd, yyyy 'at' hh:mm a")}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace("_", " ")}
                      </span>
                      <span className="font-semibold text-gray-900">
                        ${order.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {order.products.map((product) => (
                      <div key={product.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover rounded-lg"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-500">{product.category}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                            <p className="font-medium text-gray-900">${product.price.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;