import { useEffect, useState } from 'react';
import { Button, Space, Table, Tag, message, Pagination, Dropdown, Menu } from 'antd';
import dayjs from 'dayjs';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { EditOutlined, DownOutlined } from '@ant-design/icons';
import { fetchOrders, updateStatusOrder2 } from '../../../apis/order';

const OrderList = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Staff-specific status tabs (limited view)
  const statusTabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Đơn mới' },
    { key: 'processing', label: 'Đang xử lý' },
    { key: 'shipped', label: 'Đang giao hàng' },
  ];

  // Limited status options for staff
  const statusOptions = [
    { key: 'IN_PROGRESS', label: 'Xác nhận đơn' },
    { key: 'SHIPPED', label: 'Giao hàng' },
  ];

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    applyFiltersAndPagination(orders, searchTerm, activeTab, currentPage, pageSize);
  }, [searchTerm, activeTab, currentPage, pageSize, orders]);

  const getOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();

      // Sort orders by date (most recent first)
      const sortedOrders = data.sort((a, b) =>
        dayjs(b.orderDate).valueOf() - dayjs(a.orderDate).valueOf()
      );

      // Filter out completed, cancelled or returned orders - staff only sees active orders
      const filteredOrders = sortedOrders.filter(order => {
        const status = order.orderStatus.toUpperCase();
        return ['PENDING', 'IN_PROGRESS', 'SHIPPED', 'DELIVERED'].includes(status);
      });

      setOrders(filteredOrders);
      setTotal(filteredOrders.length);
      console.log("order:", filteredOrders);

      // Apply initial filtering and pagination
      applyFiltersAndPagination(filteredOrders, searchTerm, activeTab, currentPage, pageSize);
    } catch (error) {
      message.error('Không thể tải danh sách đơn hàng');
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByTab = (orders, tab) => {
    if (tab === 'all') return orders;

    return orders.filter(order => {
      const status = order.orderStatus.toUpperCase();
      switch (tab) {
        case 'pending':
          return status === 'PENDING';
        case 'processing':
          return status === 'IN_PROGRESS';
        case 'shipped':
          return status === 'SHIPPED';
        default:
          return true;
      }
    });
  };

  const applyFiltersAndPagination = (orders, search, tab, page, size) => {
    if (!orders || orders.length === 0) {
      setDisplayedOrders([]);
      setTotal(0);
      return;
    }

    // First apply tab filter
    let filtered = filterOrdersByTab(orders, tab);

    // Then apply search filter for order ID, product name, or customer name
    if (search) {
      filtered = filtered.filter(order => {
        // Convert order ID to string and check if it includes search term
        const orderIdMatch = String(order.id).toLowerCase().includes(search.toLowerCase());

        // Check if any product name in order details includes search term
        const productNameMatch = order.orderDetails?.some(detail =>
          detail.product?.name?.toLowerCase().includes(search.toLowerCase())
        );
        
        // Check if customer name includes search term
        const customerNameMatch = order.customerName?.toLowerCase().includes(search.toLowerCase());

        return orderIdMatch || productNameMatch || customerNameMatch;
      });
    }

    // Update total count after filtering
    setTotal(filtered.length);

    // Apply pagination
    const startIndex = (page - 1) * size;
    const paginatedOrders = filtered.slice(startIndex, startIndex + size);

    setDisplayedOrders(paginatedOrders);
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setStatusUpdateLoading(true);

      // Call API to update order status
      const result = await updateStatusOrder2(orderId, newStatus);

      // If successful, update local state
      if (result) {
        const updatedOrders = orders.map(order => {
          if (order.id === orderId) {
            return { ...order, orderStatus: newStatus };
          }
          return order;
        });

        setOrders(updatedOrders);
        message.success(`Trạng thái đơn hàng đã được cập nhật thành ${getOrderStatusLabel(newStatus)}`);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Cập nhật trạng thái đơn hàng thất bại");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'gold';
      case 'IN_PROGRESS':
        return 'blue';
      case 'SHIPPED':
        return 'orange';
      case 'DELIVERED':
        return 'green';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'green';
      case 'CANCELLED':
        return 'red';
      case 'PENDING':
        return 'orange';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} đ`;
  };

  const getOrderStatusLabel = (status) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'Đơn mới';
      case 'IN_PROGRESS': return 'Đang xử lý';
      case 'SHIPPED': return 'Đang giao hàng';
      case 'DELIVERED': return 'Đã giao hàng';
      default: return status;
    }
  };

  const getPaymentStatusLabel = (status) => {
    switch (status.toUpperCase()) {
      case 'PAID': return 'Đã thanh toán';
      case 'PENDING': return 'Chưa thanh toán';
      case 'CANCELLED': return 'Thanh toán thất bại';
      default: return status;
    }
  };

  // Generate dropdown menu for status update
  const statusMenu = (record) => {
    // Determine available next statuses based on current status
    let availableOptions = [];
    
    switch(record.orderStatus.toUpperCase()) {
      case 'PENDING':
        availableOptions = [{ key: 'IN_PROGRESS', label: 'Xác nhận đơn' }];
        break;
      case 'IN_PROGRESS':
        availableOptions = [{ key: 'SHIPPED', label: 'Giao hàng' }];
        break;
      default:
        availableOptions = [];
    }
    
    return (
      <Menu
        onClick={({ key }) => handleUpdateStatus(record.id, key)}
        items={availableOptions.map(option => ({
          key: option.key,
          label: option.label
        }))}
      />
    );
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
      width: 70,
    },
    {
      title: 'Mã đơn',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (name, record) => (
        <div>
          <div className="text-sm">{record?.userAddress?.user?.fullName}</div>
        </div>
      ),
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'orderDate',
      key: 'orderDate',
      sorter: (a, b) => dayjs(a.orderDate).valueOf() - dayjs(b.orderDate).valueOf(),
      sortDirections: ['descend', 'ascend'],
      render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Sản phẩm',
      key: 'products',
      render: (_, record) => (
        <div>
          {record.orderDetails.map((detail, index) => (
            <div key={detail.id} className={index > 0 ? "mt-1" : ""}>
              {detail.product.name} x{detail.quantity}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      sortDirections: ['descend', 'ascend'],
      render: (total) => formatCurrency(total),
    },
    {
      title: 'Thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus) => (
        <Tag color={getPaymentStatusColor(paymentStatus)}>
          {getPaymentStatusLabel(paymentStatus)}
        </Tag>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (orderStatus) => (
        <Tag color={getStatusColor(orderStatus)}>
          {getOrderStatusLabel(orderStatus)}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        // Only show actions dropdown if there are available status updates
        record.orderStatus !== 'SHIPPED' && (
          <Dropdown
            overlay={statusMenu(record)}
            trigger={['click']}
            disabled={statusUpdateLoading}
          >
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              loading={statusUpdateLoading}
            >
              Cập nhật <DownOutlined />
            </Button>
          </Dropdown>
        )
      ),
    },
  ];

  return (
    <div className="w-full mt-6 p-4">
      <div className="flex flex-col justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Đơn hàng</h1>
          <p className="text-gray-600 mt-1">Tổng đơn hàng: {orders.length}</p>
        </div>
        <div className="mt-3 w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn hàng, tên sản phẩm hoặc khách hàng..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
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

      {/* Status Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <div className="flex overflow-x-auto whitespace-nowrap pb-2 scrollbar-hide">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              className={`px-4 py-2 text-sm font-medium mr-2 transition-colors duration-200 ${activeTab === tab.key
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                }`}
              onClick={() => handleTabChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center my-8">
          <FaSpinner className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : displayedOrders.length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-gray-500">Không tìm thấy đơn hàng nào.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <Table
            columns={columns}
            dataSource={displayedOrders}
            rowKey="id"
            pagination={false}
            rowClassName={(record, index) => (index % 2 === 0 ? "bg-gray-50" : "bg-white")}
            className="w-full"
          />

          {total > 0 && (
            <div className="py-4 px-6 flex justify-end border-t border-gray-200">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={total}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={['10', '20', '50']}
                showTotal={(total) => `Tổng ${total} đơn hàng`}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderList;