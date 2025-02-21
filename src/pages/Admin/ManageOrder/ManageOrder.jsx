import { useEffect, useState } from 'react';
import { Button, Space, Table, Tag } from 'antd';
import { fetchOrder } from '../../../apis/order';
import dayjs from 'dayjs';
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from 'react-icons/md';

const ManageOrder = () => {

  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getOrder = async () => {
      try {
        const data = await fetchOrder();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    getOrder();
  }, []);

    const handleViewDetails = (record) => {
    console.log(record);
    }

    const handleDelete = (record) => {
    console.log(record);
    }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
      sortDirections: ['ascend', 'descend'],
      render: (date) => dayjs(date).format('DD-MM-YYYY'),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => a.total - b.total,
      sortDirections: ['ascend', 'descend'],
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (paymentStatus) => (
        <Tag color={paymentStatus === 'Paid' ? 'green' : 'red'}>
          {paymentStatus}
        </Tag>
      )
    },
    {
      title: 'Order Status',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (orderStatus) => (
        <Tag color={orderStatus === 'Shipped' ? 'orange' : orderStatus === 'Delivered' ? 'green' : 'red'}>
          {orderStatus}
        </Tag>
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button onClick={() => handleViewDetails(record)} icon={<MdOutlineRemoveRedEye className="text-blue-500 w-5 h-5" />} />
          <Button onClick={() => handleDelete(record)} icon={<MdOutlineDeleteOutline className="text-red-500 w-5 h-5" />} />
        </Space>
      ),
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <div className='p-4'>
      {/* Header */}
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4 text-black">Danh sách đơn hàng</h1>
        {/* Button to Add New Customer */}
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          columns={columns}
          dataSource={order}
          onChange={onChange}
          rowKey="id"
          pagination={{ position: ['bottomRight'] }}
          rowClassName={(_, index) => (index % 2 === 0 ? "bg-gray-100" : "bg-white")}
          className="w-full border rounded-lg shadow-md"
        />
      )}
    </div>

  );
};

export default ManageOrder;
