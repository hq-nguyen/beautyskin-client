import { useState, useEffect } from 'react';
import { message, Pagination } from 'antd';
import { formatDate, formatCurrency } from '../../utils/format';
import { fetchOrderHistory } from '../../apis/order';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { CheckCircleTwoTone } from '@ant-design/icons';
import { assets } from '../../assets/frontend_assets/assets';
import { Link } from 'react-router-dom';
import { createFeedback } from '../../apis/feedback';
import FeedbackModel from './FeedbackModel';

const OrderHistory = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [order, setOrder] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);

  // Feedback state
  const [popupMode, setPopupMode] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  const statusTabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'wait-payment', label: 'Chờ thanh toán' },
    { key: 'wait-product', label: 'Chờ lấy hàng' },
    { key: 'shipping', label: 'Chờ giao hàng' },
    { key: 'delivered', label: 'Hoàn thành' },
    { key: 'cancelled', label: 'Đã hủy' },
    { key: 'returned', label: 'Trả hàng/Hoàn tiền' },
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchOrderHistory();

      const formattedOrders = response.map(order => ({
        orderId: order.id,
        createdAt: new Date(order.orderDate),
        totalAmount: order.totalPrice,
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
        orderDetails: order.orderDetails.map(detail => ({
          orderDetailId: detail.orderDetailId,
          quantity: detail.quantity,
          price: detail.unitPrice,
          feedback: detail.feedback,
          product: {
            id: detail.product.id,
            name: detail.product.name,
            images: detail.product.images,
            category: detail.product.category ? detail.product.category.name : 'Unknown',
          },
        }))
      }));

      const sortedOrders = formattedOrders.sort((a, b) => b.createdAt - a.createdAt);

      setOrder(sortedOrders);
      setTotal(sortedOrders.length);

      applyFiltersAndPagination(sortedOrders, searchTerm, activeTab, currentPage, pageSize);
    } catch (error) {
      message.error('Error fetching orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayStatus = (status) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý";
      case "IN_PROGRESS":
        return "Đang xử lý";
      case "SHIPPED":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao hàng";
      case "CANCELLED":
        return "Đã hủy";
      case "RETURNED":
        return "Đã trả hàng";
      default:
        return status || "Chờ xử lý";
    }
  };

  const filterOrdersByTab = (orders, tab) => {
    switch (tab) {
      case 'wait-payment':
        return orders.filter(order =>
          (order.paymentStatus === 'PENDING' || order.paymentStatus === null || order.paymentStatus === "CANCELLED") &&
          order.status === 'PENDING'
        );
      case 'wait-product':
        return orders.filter(order => order.status === 'PENDING');
      case 'shipping':
        return orders.filter(order => order.status === 'SHIPPED');
      case 'delivered':
        return orders.filter(order => order.status === 'DELIVERED');
      case 'cancelled':
        return orders.filter(order => order.status === 'CANCELLED');
      case 'returned':
        return orders.filter(order => order.status === 'RETURNED');
      case 'all':
      default:
        return orders;
    }
  };

  const applyFiltersAndPagination = (orders, search, tab, page, size) => {
    let filtered = filterOrdersByTab(orders, tab);

    if (search) {
      filtered = filtered.filter(order =>
        String(order.orderId).toLowerCase().includes(search.toLowerCase()) ||
        order.orderDetails.some(orderDetail =>
          orderDetail.product.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    setTotal(filtered.length);

    const startIndex = (page - 1) * size;
    const paginatedOrders = filtered.slice(startIndex, startIndex + size);

    setDisplayedOrders(paginatedOrders);
  };

  useEffect(() => {
    applyFiltersAndPagination(order, searchTerm, activeTab, currentPage, pageSize);
  }, [searchTerm, activeTab, currentPage, pageSize]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "RETURNED":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
  };

  // Feedback handlers
  const handleOpenPopup = (mode) => {
    setPopupMode(mode);
  };

  const handleClosePopup = () => {
    setPopupMode(null);
  };

  const handleSubmitFeedback = async (data) => {
    if (popupMode == 'feedback') {
      try {
        // Transform the images array to match API expectation
        const formattedImages = data.images.map(url => ({ url }));

        const newData = {
          ...data,
          orderDetailId: selectedOrderDetail.orderDetailId,
          image: formattedImages,  // Use the formatted images array with the key "image"
          images: undefined  // Remove the original images array
        };

        const response = await createFeedback(newData);
        fetchOrders();
      } catch (error) {
        console.error(error);
      }
    } else {
      // Your existing report code
      const newData = { ...data, orderId: selectedOrder.id, image: "" };
      console.log(newData);
    }
    handleClosePopup();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading && displayedOrders.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full mt-6">
      <div className="p-4">
        <div className="flex flex-col justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Lịch sử đặt hàng</h1>
            <p className="text-gray-600 mt-1 text-sm">Tổng đơn hàng: {order.length}</p>
          </div>
          <div className="mt-3 w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập mã đơn hàng hoặc tên sản phẩm..."
                className="pl-10 pr-4 py-2 border text-sm border-gray-300 rounded-lg w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <FaSearch
                className="absolute left-3 top-3 text-gray-400 cursor-pointer"
                onClick={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="mb-4 border-b border-gray-200">
          <div className="flex overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                className={`px-3 py-2 text-sm font-medium mr-2 transition-colors duration-200 ${activeTab === tab.key
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => handleTabChange(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center my-6">
            <FaSpinner className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        )}

        {!loading && displayedOrders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">Không tìm thấy đơn hàng nào.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => (
              <div
                key={order.orderId}
                className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Mã đơn #{order.orderId}</h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.createdAt, "MMM dd, yyyy 'at' hh:mm a")}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0 flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getDisplayStatus(order.status)}
                      </span>
                      <span className="font-semibold text-sm text-gray-900">
                        {formatCurrency(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {order?.orderDetails?.map((orderDetail) => (
                      <div key={orderDetail?.orderDetailId} className="py-3 flex flex-row items-start gap-3">
                        <Link to={`/product/${orderDetail?.product?.id}`}>
                          <img
                            src={orderDetail?.product?.images[0]?.url}
                            alt={orderDetail?.product?.name}
                            className="w-12 h-12 object-cover rounded-lg"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = assets.da_thuong;
                            }}
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${orderDetail?.product?.id}`}>
                            <h4 className="text-sm hover:text-rose-600 font-medium text-gray-900 truncate">{orderDetail?.product?.name}</h4>
                          </Link>
                          <p className="text-xs text-gray-500">{orderDetail?.product?.category}</p>
                          <div className="mt-1 flex items-center justify-between">
                            <p className="text-xs text-gray-600">Số lượng: {orderDetail?.quantity}</p>
                            <p className="font-medium text-xs text-gray-900">{formatCurrency(orderDetail?.price)} x {orderDetail?.quantity}</p>
                          </div>

                          {/* Add feedback button for delivered orders */}
                          {order?.status === "DELIVERED" ? (
                            orderDetail?.feedback === false ? (
                              <div className="mt-2 flex justify-between">
                                <div></div>
                                <button
                                  className="text-xs px-2 py-1 text-white bg-rose-600 hover:bg-rose-700"
                                  onClick={() => {
                                    handleOpenPopup("feedback")
                                    setSelectedOrderDetail(orderDetail)
                                    console.log(orderDetail)
                                  }}
                                >
                                  Đánh giá sản phẩm
                                </button>
                              </div>
                            ) : (
                              <div className="mt-2 flex justify-between">
                                <div></div>
                                <div className="text-sm px-2 py-1 text-green-600">
                                  Đã đánh giá <CheckCircleTwoTone twoToneColor="#52c41a" />
                                </div>
                              </div>
                            )
                          ) : null}
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
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={total}
              onChange={handlePageChange}
              size="small"
              showSizeChanger={false}
              showQuickJumper={false}
              showTotal={(total) => `${total} đơn hàng`}
            />
          </div>
        )}

        {/* Feedback Popup */}
        <FeedbackModel
          visible={popupMode !== null}
          mode={popupMode}
          close={handleClosePopup}
          submit={handleSubmitFeedback}
        />
      </div>
    </div>
  );
};

export default OrderHistory;
