import { useEffect, useState } from 'react';
import { Button, Space, Table, Tag, message, Pagination, Input } from 'antd';
// import { fetchOrder } from '../../../apis/orderMock';
import dayjs from 'dayjs';
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from 'react-icons/md';
import { FaSearch, FaSpinner } from 'react-icons/fa';
import { fetchOrders } from '../../../apis/order';

const ManageOrder = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const statusTabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'new', label: 'Đơn mới' },
    { key: 'processing', label: 'Đang xử lý' },
    { key: 'shipped', label: 'Đang giao hàng' },
    { key: 'completed', label: 'Hoàn thành' },
    { key: 'cancelled', label: 'Đã hủy' },
    { key: 'returned', label: 'Trả hàng/Hoàn tiền' },
  ];

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    applyFiltersAndPagination(orders, searchTerm, activeTab, currentPage, pageSize);
  }, [searchTerm, activeTab, currentPage, pageSize]);

  const getOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      
      // Sort orders by date (most recent first)
      const sortedOrders = data.sort((a, b) => 
        dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
      );
      
      setOrders(sortedOrders);
      setTotal(sortedOrders.length);
      
      // Apply initial filtering and pagination
      applyFiltersAndPagination(sortedOrders, searchTerm, activeTab, currentPage, pageSize);
    } catch (error) {
      message.error('Error fetching orders');
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrdersByTab = (orders, tab) => {
    switch (tab) {
      case 'new':
        return orders.filter(order => order.orderStatus === 'Pending');
      case 'processing':
        return orders.filter(order => order.orderStatus === 'Processing');
      case 'shipped':
        return orders.filter(order => order.orderStatus === 'Shipped');
      case 'completed':
        return orders.filter(order => order.orderStatus === 'Delivered');
      case 'cancelled':
        return orders.filter(order => order.orderStatus === 'Cancelled');
      case 'returned':
        return orders.filter(order => order.orderStatus === 'Returned');
      case 'all':
      default:
        return orders;
    }
  };

  const applyFiltersAndPagination = (orders, search, tab, page, size) => {
    // First apply tab filter
    let filtered = filterOrdersByTab(orders, tab);

    // Then apply search filter for order ID, customer name, or brand
    if (search) {
      filtered = filtered.filter(order =>
        String(order.id).toLowerCase().includes(search.toLowerCase()) ||
        String(order.brand).toLowerCase().includes(search.toLowerCase())
      );
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

  const handleViewDetails = (record) => {
    console.log('View details for order:', record);
    // Implement view details functionality
  };

  const handleDelete = (record) => {
    console.log('Delete order:', record);
    // Implement delete functionality
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'gold';
      case 'Processing':
        return 'blue';
      case 'Shipped':
        return 'orange';
      case 'Delivered':
        return 'green';
      case 'Cancelled':
        return 'red';
      case 'Returned':
        return 'volcano';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
      sortDirections: ['descend', 'ascend'],
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thương hiệu',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
      sortDirections: ['descend', 'ascend'],
      render: (total) => `${total.toLocaleString()} đ`,
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus) => (
        <Tag color={paymentStatus === 'Paid' ? 'green' : 'red'}>
          {paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
        </Tag>
      )
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (orderStatus) => (
        <Tag color={getStatusColor(orderStatus)}>
          {(() => {
            switch(orderStatus) {
              case 'Pending': return 'Đơn mới';
              case 'Processing': return 'Đang xử lý';
              case 'Shipped': return 'Đang giao hàng';
              case 'Delivered': return 'Hoàn thành';
              case 'Cancelled': return 'Đã hủy';
              case 'Returned': return 'Trả hàng/Hoàn tiền';
              default: return orderStatus;
            }
          })()}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            onClick={() => handleViewDetails(record)} 
            icon={<MdOutlineRemoveRedEye className="text-blue-500 w-5 h-5" />} 
            title="Xem chi tiết"
          />
          <Button 
            onClick={() => handleDelete(record)} 
            icon={<MdOutlineDeleteOutline className="text-red-500 w-5 h-5" />} 
            title="Xóa đơn hàng"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full mt-6 p-4">
      <div className="flex flex-col justify-between items-start mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-600 mt-1">Tổng đơn hàng: {orders.length}</p>
        </div>
        <div className="mt-3 w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Nhập mã đơn hàng hoặc thương hiệu..."
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
              className={`px-4 py-2 text-sm font-medium mr-2 transition-colors duration-200 ${
                activeTab === tab.key
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

export default ManageOrder;