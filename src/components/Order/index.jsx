/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Table } from 'antd';

const OrderManagement = () => {
  const [data, setData] = useState([
    {
      key: '1',
      orderCode: 'DH001',
      product: 'Sản phẩm A',
      total: 1500000,
      status: 'Đang xử lý',
    },
    {
      key: '2',
      orderCode: 'DH002',
      product: 'Sản phẩm B',
      total: 2000000,
      status: 'Hoàn thành',
    },
    {
      key: '3',
      orderCode: 'DH002',
      product: 'Sản phẩm C',
      total: 4000000,
      status: 'Hoàn thành',
    },
    {
      key: '4',
      orderCode: 'DH002',
      product: 'Sản phẩm D',
      total: 5000000,
      status: 'Hoàn thành',
    },  
    {
      key: '5',
      orderCode: 'DH002',
      product: 'Sản phẩm E',
      total: 9000000,
      status: 'Hoàn thành',
    },
    {
      key: '6',
      orderCode: 'DH002',
      product: 'Sản phẩm F',
      total: 7000000,
      status: 'Hoàn thành',
    },
  ]);

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'orderCode',
      key: 'orderCode',
      width: '25%',
    },
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      key: 'product',
      width: '30%',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      width: '20%',
      render: (total) => `${total.toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: '25%',
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

  return (
    <div className="flex-1 bg-white p-5 rounded-[10px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)] mt-[35px]">
      <div className="bg-white rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Quản lý đơn hàng</h1>
          <div className="text-gray-600">
            Tổng đơn hàng: {data.length}
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
            total: data.length,
            pageSize: 5,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} đơn hàng`,
          }}
          className="bg-white rounded-lg"
        />
      </div>
    </div>
  );
};

export default OrderManagement;