import { useState, useEffect } from 'react';
import { message, Pagination } from 'antd';
import { formatDate, formatCurrency } from '../../utils/format';
import { fetchOrderHistory } from '../../apis/order';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { assets } from '../../assets/frontend_assets/assets';
import { Link } from 'react-router-dom';

const OrderHistory = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [allOrders, setAllOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchOrderHistory();

      // Transform the API response to match our component's format
      const formattedOrders = response.map(order => ({
        orderId: order.id,
        createdAt: new Date(order.orderDate),
        totalAmount: order.totalPrice,
        status: mapOrderStatus(order.orderStatus),
        products: order.orderDetails.map(detail => ({
          id: detail.product.id,
          name: detail.product.name,
          image: detail.product.images && detail.product.images.length > 0
            ? detail.product.images[0].url
            : "https://images.unsplash.com/photo-1560393464-5c69a73c5770",
          quantity: detail.quantity,
          price: detail.unitPrice,
          category: detail.product.category ? detail.product.category.name : 'Unknown'
        }))
      }));

      // Sort orders by time (most recent first)
      const sortedOrders = formattedOrders.sort((a, b) => b.createdAt - a.createdAt);

      setAllOrders(sortedOrders);
      setTotal(sortedOrders.length);

      // Apply initial filtering and pagination
      applyFiltersAndPagination(sortedOrders, searchTerm, selectedStatus, currentPage, pageSize);
    } catch (error) {
      message.error('Error fetching orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const mapOrderStatus = (status) => {
    if (status === "IN_PROGRESS" || status === null) {
      return "Đang xử lí";
    } else if (status === "PAID") {
      return "Đã hoàn thành";
    } else if (status === "CANCELLED") {
      return "Đã hủy";
    } else {
      return status;
    }
  };

  const applyFiltersAndPagination = (orders, search, status, page, size) => {
    let filtered = orders;

    // Apply search filter for order ID and product name
    if (search) {
      filtered = filtered.filter(order =>
        String(order.orderId).toLowerCase().includes(search.toLowerCase()) ||
        order.products.some(product =>
          product.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(order => order.status === status);
    }

    // Update total count after filtering
    setTotal(filtered.length);

    // Apply pagination
    const startIndex = (page - 1) * size;
    const paginatedOrders = filtered.slice(startIndex, startIndex + size);

    setDisplayedOrders(paginatedOrders);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFiltersAndPagination(allOrders, searchTerm, selectedStatus, currentPage, pageSize);
  }, [searchTerm, selectedStatus, currentPage, pageSize]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đang xử lí":
        return "bg-blue-100 text-blue-800";
      case "Đã hoàn thành":
        return "bg-green-100 text-green-800";
      case "Đã hủy":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  if (loading && displayedOrders.length === 0) {
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
            <h1 className="text-2xl font-bold text-gray-900">Lịch sử đặt hàng</h1>
            <p className="text-gray-600 mt-1">Tổng đơn hàng: {total}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập mã đơn hàng hoặc tên sản phẩm..."
                className="pl-10 pr-4 py-2 border text-sm border-gray-300 rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <FaSearch
                className="absolute left-3 top-3 text-gray-400 cursor-pointer"
                onClick={handleSearch}
              />
            </div>
            <select
              value={selectedStatus}
              onChange={handleStatusChange}
              className="border text-sm border-gray-300 rounded-lg px-4 py-2"
            >
              <option value="all">Tất cả</option>
              <option value="Đang xử lí">Đang xử lí</option>
              <option value="Đã hoàn thành">Đã hoàn thành</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center my-8">
            <FaSpinner className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        )}

        {!loading && displayedOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-md">Không tìm thấy đơn hàng nào.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {displayedOrders.map((order) => (
              <div
                key={order.orderId}
                className="border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Mã đơn #{order.orderId}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt, "MMM dd, yyyy 'at' hh:mm a")}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status.replace("_", " ")}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {order.products.map((product) => (
                      <div key={product.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <Link to={`/product/${product.id}`}>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = assets.da_thuong;
                            }}
                          />
                        </Link>
                        <div className="flex-1">
                          <Link to={`/product/${product.id}`}>
                            <h4 className="text-sm hover:text-rose-600 font-medium text-gray-900">{product.name}</h4>
                          </Link>
                          <p className="text-xs text-gray-500">{product.category}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-sm text-gray-600">Số lượng: {product.quantity}</p>
                            <p className="font-medium text-sm text-gray-900">{formatCurrency(product.price)}</p>
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

        {total > 0 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total) => `Có ${total} đơn hàng`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;