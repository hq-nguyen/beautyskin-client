import { useState, useEffect } from 'react';
import { Table, Tag, Space, Modal, Button } from 'antd';
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { fetchCustomer, deleteCustomer } from '../../../apis/customer';
import CustomerModel from './CustomerModel';

const ManageCustomer = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);

    useEffect(() => {
        const getCustomers = async () => {
            try {
                const data = await fetchCustomer();
                console.log(data); // Log the data to see its structure
                // Filter to only include users with the roleEnums "CUSTOMER"
                const customerData = data.filter(user => user.roleEnums === "USER");
                setCustomers(customerData);
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                setLoading(false);
            }
        };
        getCustomers();
    }, []);

    const handleDelete = (customer) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa khách hàng này?',
            content: 'Hành động này không thể hoàn tác!',
            okText: 'Có, xóa',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    await deleteCustomer(customer.id); // Call your API to delete the customer
                    setCustomers(customers.filter(c => c.id !== customer.id));
                    Modal.success({ content: 'Xóa khách hàng thành công!' });
                } catch (error) {
                    Modal.error({ title: 'Xóa khách hàng thất bại!', content: error.message });
                }
            },
        });
    };

    const handleViewDetails = (customer) => {
        setCurrentCustomer(customer);
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
        setCurrentCustomer(null);
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',  
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'mail',
            key: 'mail',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            render: (phone) => phone || 'Chưa cập nhật',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'enabled',
            key: 'enabled',
            render: (active) => (
                <Tag color={active === true ? 'green' : 'red'}>
                    {active ? 'ACTIVE' : 'INACTIVE'}
                </Tag>
            ),
        },
        {
            title: 'Tổng chi tiêu',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => amount ? `${amount.toLocaleString()} đ` : '0 đ',
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

    return (
        <div className="p-4">
            {/* Header */}
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold mb-4 text-black">Danh sách khách hàng</h1>
                {/* Button to Add New Customer */}
            </div>

            {/* Customer Table */}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={customers}
                    rowKey="id"
                    pagination={{ position: ['bottomRight'] }}
                    rowClassName={(_, index) => (index % 2 === 0 ? "bg-gray-100" : "bg-white")}
                    className="w-full border rounded-lg shadow-md"
                />
            )}

            {currentCustomer && (
                <CustomerModel
                    customer={currentCustomer}
                    visible={isModalVisible}
                    onCancel={handleCloseModal}
                />
            )}

        </div>
    );
};

export default ManageCustomer;