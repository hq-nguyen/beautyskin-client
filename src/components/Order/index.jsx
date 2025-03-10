import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import api from '../../config/axios';

const OrderManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      width: '15%',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      width: '25%',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      width: '20%',
      render: (total) => `${parseInt(total).toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '20%',
      render: (status) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            status === 'Hoàn thành'
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {status}
        </span> 
      ),
    },
  ];

  const fetchOrders = async (params = pagination) => {
    try {
      setLoading(true);
      const response = await api.get(`getByUser`);
      
      if (!response.ok) {
        throw new Error('Lỗi khi tải dữ liệu');
      }

      const result = await response.json();
      
      const startIndex = (params.current - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedData = result.slice(startIndex, endIndex);
      
      setData(paginatedData);
      setPagination({
        ...params,
        total: result.length,
      });
    } catch (error) {
      message.error('Có lỗi xảy ra khi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleTableChange = (newPagination) => {
    setPagination(newPagination);
    fetchOrders(newPagination);
  };

  return (
    <div className="flex-1 bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] mt-[35px]">
      <div className="bg-white rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Quản lý đơn hàng</h1>
          <div className="text-gray-600">
            Tổng đơn hàng: {pagination.total}
          </div>
        </div>

        <style>
          {`
            .ant-table-thead .ant-table-cell {
              background-color: #E9D6D6 !important;
            }
            .ant-table-thead th.ant-table-cell::before {
              display: none !important;
            }
          `}
        </style>

        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total) => `Tổng ${total} đơn hàng`,
          }}
          onChange={handleTableChange}
          loading={loading}
          className="bg-white rounded-lg"
          rowKey="id"
        />
      </div>
    </div>
  );
};

export default OrderManagement;
