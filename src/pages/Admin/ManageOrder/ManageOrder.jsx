import { useEffect, useState } from 'react';
import { Button, Space, Table, Tag, message, Pagination, Dropdown, Menu, Modal } from 'antd';
import dayjs from 'dayjs';
import { FaEye, FaSearch, FaSpinner } from 'react-icons/fa';
import { fetchOrders, fetchReportByOrder, updateStatusOrder2, updateStatusPayment } from '../../../apis/order';
import {
  EditOutlined,
  DeleteOutlined,
  DownOutlined
} from '@ant-design/icons';

const ManageOrder = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [viewOrderModalVisible, setViewOrderModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusTabs = [
    { key: 'all', label: 'Tất cả' },
    { key: 'pending', label: 'Đơn mới' },
    { key: 'processing', label: 'Xác nhận đơn' },
    { key: 'shipping', label: 'Đang giao hàng' },
    { key: 'delivered', label: 'Đã giao hàng' },
    { key: 'confirmed', label: 'Hoàn thành' },
    { key: 'cancelled', label: 'Đã hủy' },
    { key: 'refund-request', label: 'Yêu cầu hoàn tiền' },
    { key: 'refunded', label: 'Trả hàng/Hoàn tiền' },
  ];
  const statusOptions2 = [
    { key: 'IN_PROGRESS', label: 'Xác nhận đơn' },
    { key: 'SHIPPING', label: 'Đang giao hàng' },
    { key: 'DELIVERED', label: 'Đã giao hàng' },
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

      const sortedOrders = data.sort((a, b) =>
        dayjs(b.orderDate).valueOf() - dayjs(a.orderDate).valueOf()
      );

      setOrders(sortedOrders);
      setTotal(sortedOrders.length);

      applyFiltersAndPagination(sortedOrders, searchTerm, activeTab, currentPage, pageSize);
    } catch (error) {
      message.error('Error fetching orders');
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
        case 'shipping':
          return status === 'SHIPPING';
        case 'delivered':
          return status === 'DELIVERED';
        case 'confirmed':
          return status === 'CONFIRMED';
        case 'cancelled':
          return status === 'CANCELLED';
        case 'refund-request':
          return status === 'REFUND_REQ';
        case 'refunded':
          return status === 'REFUNDED';
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

    let filtered = filterOrdersByTab(orders, tab);
    if (search) {
      filtered = filtered.filter(order => {
        const orderIdMatch = String(order.id).toLowerCase().includes(search.toLowerCase());
        const productNameMatch = order.orderDetails?.some(detail =>
          detail.product?.name?.toLowerCase().includes(search.toLowerCase())
        );
        return orderIdMatch || productNameMatch;
      });
    }
    setTotal(filtered.length);
    const startIndex = (page - 1) * size;
    const paginatedOrders = filtered.slice(startIndex, startIndex + size);
    setDisplayedOrders(paginatedOrders);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
  };

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleDelete = (orderId) => {
    Modal.confirm({
      title: 'Xác nhận xóa đơn hàng',
      content: `Bạn có chắc chắn muốn xóa đơn hàng #${orderId} không?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        console.log('Delete order:', orderId);
        // Implement delete functionality
      }
    });
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setStatusUpdateLoading(true);
      const result = await updateStatusOrder2(orderId, newStatus);

      if (result) {
        if (newStatus === 'SHIPPING') {
          const order = orders.find(order => order.id === orderId);
          if (order && (order.transaction === null || order.paymentStatus === 'PENDING')) {
            await updateStatusPayment(orderId, 'PAID');

            const updatedOrders = orders.map(order => {
              if (order.id === orderId) {
                return {
                  ...order,
                  orderStatus: newStatus,
                  paymentStatus: 'PAID'
                };
              }
              return order;
            });

            setOrders(updatedOrders);
            message.success(`Đơn hàng đã được cập nhật thành ${getOrderStatusLabel(newStatus)} và thanh toán đã được xác nhận`);
          } else {
            const updatedOrders = orders.map(order => {
              if (order.id === orderId) {
                return { ...order, orderStatus: newStatus };
              }
              return order;
            });

            setOrders(updatedOrders);
            message.success(`Trạng thái đơn hàng đã được cập nhật thành ${getOrderStatusLabel(newStatus)}`);
          }
        } else {
          const updatedOrders = orders.map(order => {
            if (order.id === orderId) {
              return { ...order, orderStatus: newStatus };
            }
            return order;
          });

          setOrders(updatedOrders);
          message.success(`Trạng thái đơn hàng đã được cập nhật thành ${getOrderStatusLabel(newStatus)}`);
        }
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      message.error("Cập nhật trạng thái đơn hàng thất bại");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleRefundApproval = async (orderId, approve) => {
    try {
      setStatusUpdateLoading(true);
      const newStatus = approve ? 'REFUNDED' : 'DELIVERED';

      const result = await updateStatusOrder2(orderId, newStatus);

      if (result) {
        const updatedOrders = orders.map(order => {
          if (order.id === orderId) {
            return { ...order, orderStatus: newStatus };
          }
          return order;
        });

        setOrders(updatedOrders);
        message.success(
          approve
            ? 'Yêu cầu hoàn tiền đã được chấp nhận'
            : 'Yêu cầu hoàn tiền đã bị từ chối'
        );
      }
    } catch (error) {
      console.error("Error processing refund request:", error);
      message.error("Xử lý yêu cầu hoàn tiền thất bại");
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // New function to view refund request details
  const viewRefundDetails = async (orderId) => {
    try {
      setStatusUpdateLoading(true);
      const reportData = await fetchReportByOrder(orderId);
      console.log("Report data:", reportData);

      if (reportData) {
        Modal.confirm({
          title: 'Chi tiết yêu cầu hoàn tiền',
          width: 700,
          content: (
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 mb-1">Ngày yêu cầu:</p>
                  <p className="font-medium">{dayjs(reportData.reportDate).format('DD/MM/YYYY HH:mm')}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Số tiền hoàn trả:</p>
                  <p className="font-medium text-red-600">{reportData[0]?.refund?.toLocaleString()} đ</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-1">Lý do:</p>
                <p className="font-medium">{reportData[0].reason || 'Không có thông tin'}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-1">Mô tả chi tiết:</p>
                <p className="font-medium">{reportData[0].description || 'Không có thông tin'}</p>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-1">Thông tin khách hàng:</p>
                <p className="font-medium">{reportData[0].customer?.fullName} ({reportData[0].customer?.mail})</p>
              </div>

              {reportData[0].images && reportData[0].images.length > 0 && (
                <div className="mb-4">
                  <p className="text-gray-600 mb-1">Hình ảnh đính kèm:</p>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {reportData[0].images.map((img, index) => (
                      <img
                        key={index}
                        src={img.url}
                        alt={`Evidence ${index + 1}`}
                        className="w-full h-24 object-cover rounded border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ),
          okText: 'Chấp nhận hoàn tiền',
          footer: (
            <div className="flex justify-end space-x-2">
              <Button onClick={() => Modal.destroyAll()}>
                Đóng
              </Button>
              <Button
                danger
                onClick={() => {
                  Modal.destroyAll();
                  handleRefundApproval(orderId, false);
                }}
              >
                Từ chối yêu cầu
              </Button>
              <Button
                type="primary"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                onClick={() => {
                  Modal.destroyAll();
                  handleRefundApproval(orderId, true);
                }}
              >
                Chấp nhận hoàn tiền
              </Button>
            </div>
          )

        });
      }
    } catch (error) {
      console.error("Error fetching refund request details:", error);
      message.error("Không thể tải thông tin yêu cầu hoàn tiền");
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
      case 'SHIPPING':
        return 'orange';
      case 'DELIVERED':
        return 'green';
      case 'CONFIRMED':
        return 'green';
      case 'CANCELLED':
        return 'red';
      case 'REFUND_REQ':
        return 'volcano';
      case 'REFUNDED':
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
      case 'REFUNDED':
        return 'volcano';
      default:
        return 'default';
    }
  };

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case 'COD': return 'Thanh toán khi nhận hàng';
      case 'VNPAY': return 'Thanh toán trực tuyến';
      default: return method;
    }
  };

  const formatCurrency = (amount) => {
    return `${amount.toLocaleString()} đ`;
  };

  const getOrderStatusLabel = (status) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'Đơn mới';
      case 'IN_PROGRESS': return 'Xác nhận đơn';
      case 'SHIPPING': return 'Đang giao hàng';
      case 'DELIVERED': return 'Đã giao hàng';
      case 'CONFIRMED': return 'Hoàn thành';
      case 'REFUND_REQ': return 'Yêu cầu hoàn tiền';
      case 'CANCELLED': return 'Đã hủy';
      case 'REFUNDED': return 'Trả hàng/Hoàn tiền';
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

  const handleViewOrder = (orderId) => {
      const order = orders.find(order => order.id === orderId);
      if (order) {
        setSelectedOrder(order);
        setViewOrderModalVisible(true);
      } else {
        message.error('Không tìm thấy thông tin đơn hàng');
      }
    };

  // Generate dropdown menu for status update
  const statusMenu = (record) => (
    <Menu
      onClick={({ key }) => handleUpdateStatus(record.id, key)}
      items={statusOptions2.map(option => ({
        key: option.key,
        label: option.label,
        disabled: record.orderStatus === option.key
      }))}
    />
  );

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
      render: (id) => (
        <button onClick={() => handleViewOrder(id)} className="text-blue-600 font-semibold cursor-pointer hover:underline">
          #{id}
        </button>
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
      title: 'Khách hàng',
      dataIndex: 'userResponse',
      key: 'userResponse',
      render: (userResponse) => (
        <div>
          {userResponse ? (
            <div className="text-sm">{userResponse.fullName}</div>
          ) : (
            <div className="text-sm">Không xác đinh</div>
          )}
        </div>
      ),
    },
    {
      title: 'Sản phẩm',
      key: 'products',
      width: 300,
      render: (_, record) => (
        <div>
          {record.orderDetails.map((detail, index) => {
            const truncatedName = detail.orderProductResponse.name.split(" ").slice(0, 8).join(" ");
            return (
              <div key={detail.id} className={index > 0 ? "mt-1" : ""}>
                {truncatedName}...   x  {detail.quantity}
              </div>
            );
          })}
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
      title: 'Phương thức TT',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (paymentMethod) => (
        <div>
          {paymentMethod && paymentMethod === 'VNPAY'? (
            <div className="text-sm">Trực tuyến</div>
          ) : (
            <div className="text-sm">Tiền mặt</div>
          )}
        </div>
      ),
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
      width: 200,
      render: (_, record) => (
        <Space>
          {/* <Dropdown
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
          </Dropdown> */}
          <Button
            type='text'
            size="small"
            icon={<FaEye />}
            onClick={() => handleViewOrder(record.id)}
          >
          </Button>
          {record.orderStatus === 'REFUND_REQ' && (
            <Button
              type="primary"
              size="small"
              onClick={() => viewRefundDetails(record.id)}
              loading={statusUpdateLoading}
            >
              Xem chi tiết
            </Button>
          )}
          {/* <Button
            icon={<DeleteOutlined />}
            type="text"
            danger
            onClick={() => handleDelete(record.id)}
          /> */}
        </Space>
      ),
    },
  ];

  const handleCloseViewOrderModal = () => {
    setViewOrderModalVisible(false);
    setSelectedOrder(null);
  };

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
              placeholder="Nhập mã đơn hàng hoặc tên sản phẩm..."
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


      {/* Order View Modal */}
      <Modal
        open={viewOrderModalVisible}
        onCancel={handleCloseViewOrderModal}
        footer={null}
        width={700}
        bodyStyle={{ padding: '0px' }}
        centered
      >
        {selectedOrder && (
          <div className="bg-white rounded-lg overflow-hidden">
            {/* Header */}
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Chi tiết đơn hàng #{selectedOrder.id}</h2>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Order Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Thông tin đơn hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ngày đặt hàng:</p>
                    <p className="font-medium">{dayjs(selectedOrder.orderDate).format('DD/MM/YYYY HH:mm')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Trạng thái đơn hàng:</p>
                    <Tag color={getStatusColor(selectedOrder.orderStatus)}>
                      {getOrderStatusLabel(selectedOrder.orderStatus)}
                    </Tag>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phương thức thanh toán:</p>
                    <p className="font-medium">
                      {selectedOrder.paymentMethod}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Trạng thái thanh toán:</p>
                    <Tag color={getPaymentStatusColor(selectedOrder.paymentStatus)}>
                      {getPaymentStatusLabel(selectedOrder.paymentStatus)}
                    </Tag>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Thông tin khách hàng</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Tên khách hàng:</p>
                    <p className="font-medium">{selectedOrder.userResponse?.fullName || 'Không xác định'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email:</p>
                    <p className="font-medium">{selectedOrder.userResponse?.mail || 'Không có thông tin'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Số điện thoại:</p>
                    <p className="font-medium">{selectedOrder.userResponse?.phone || 'Không có thông tin'}</p>
                  </div>
                </div>
              </div>

              {/* Product Details */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b pb-2">Chi tiết sản phẩm</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-3 text-left border">Sản phẩm</th>
                      <th className="py-2 px-3 text-center border">Số lượng</th>
                      <th className="py-2 px-3 text-right border">Đơn giá</th>
                      <th className="py-2 px-3 text-right border">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.orderDetails.map((detail, index) => (
                      <tr key={detail.id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-2 px-3 border">
                          <div className="flex items-center">
                            {detail.orderProductResponse.image && (
                              <img
                                src={detail.orderProductResponse.image.url}
                                alt={detail.orderProductResponse.name}
                                className="w-12 h-12 object-cover mr-2 rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{detail.orderProductResponse.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-center border">{detail.quantity}</td>
                        <td className="py-2 px-3 text-right border">{formatCurrency(detail.unitPrice)}</td>
                        <td className="py-2 px-3 text-right border">{formatCurrency(detail.totalPrice)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-100">
                      <td colSpan="3" className="py-2 px-3 text-right border font-semibold">Tổng cộng:</td>
                      <td className="py-2 px-3 text-right border font-bold">{formatCurrency(selectedOrder.totalPrice)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Payment Information */}
              {selectedOrder.orderTransactions && selectedOrder.orderTransactions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 border-b pb-2">Thông tin thanh toán</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* <div>
                      <p className="text-sm text-gray-600 mb-1">Mã giao dịch:</p>
                      <p className="font-medium">#{selectedOrder.orderTransactions[0].id}</p>
                    </div> */}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Số tiền:</p>
                      <p className="font-medium">{formatCurrency(selectedOrder.orderTransactions[0].transactionAmount)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t">
                <Button type="primary" onClick={handleCloseViewOrderModal}>
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageOrder;