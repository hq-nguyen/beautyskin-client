import { useState, useEffect } from 'react';
import { Table, Tag, Space, Modal, Button, Select } from 'antd';
import {
    EditOutlined,
} from '@ant-design/icons';
import { MdBlock } from "react-icons/md";
import { CiUnlock } from "react-icons/ci";
import { fetchCustomer, lockCustomer, unLockCustomer } from '../../../apis/customer';
import CustomerModel from './CustomerModel';

const { Option } = Select;

const ManageCustomer = () => {
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const getCustomers = async () => {
            try {
                const data = await fetchCustomer();
                console.log(data); // Log the data to see its structure
                // Filter to only include users with the roleEnums "CUSTOMER"
                const customerData = data.filter(user => user.roleEnums === "USER");
                setCustomers(customerData);
                setFilteredCustomers(customerData);
            } catch (error) {
                console.error("Error fetching customers:", error);
            } finally {
                setLoading(false);
            }
        };
        getCustomers();
    }, []);

    useEffect(() => {
        // Apply filters when statusFilter changes
        if (statusFilter === 'all') {
            setFilteredCustomers(customers);
        } else if (statusFilter === 'active') {
            setFilteredCustomers(customers.filter(customer => customer.active === true));
        } else if (statusFilter === 'locked') {
            setFilteredCustomers(customers.filter(customer => customer.active === false));
        }
    }, [statusFilter, customers]);

    const handleLockAccount = (customer) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn khóa tài khoản khách hàng này?',
            content: 'Hành động này có thể hoàn tác sau!',
            okText: 'Có, khóa',
            okType: 'danger',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    await lockCustomer(customer.id); // Call your API to lock the customer
                    // Update the local state after successful API call
                    const updatedCustomers = customers.map(c => {
                        if (c.id === customer.id) {
                            return { ...c, active: false };
                        }
                        return c;
                    });
                    setCustomers(updatedCustomers);
                    Modal.success({ content: 'Khóa tài khoản khách hàng thành công!' });
                } catch (error) {
                    Modal.error({ title: 'Khóa tài khoản khách hàng thất bại!', content: error.message });
                }
            },
        });
    };

    const handleUnLockAccount = (customer) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn mở khóa tài khoản khách hàng này?',
            content: 'Tài khoản sẽ có thể hoạt động bình thường sau khi mở khóa',
            okText: 'Có, mở khóa',
            okType: 'primary',
            cancelText: 'Không',
            onOk: async () => {
                try {
                    await unLockCustomer(customer.id); // Assume you have this API function
                    // Update the local state after successful API call
                    const updatedCustomers = customers.map(c => {
                        if (c.id === customer.id) {
                            return { ...c, active: true };
                        }
                        return c;
                    });
                    setCustomers(updatedCustomers);
                    Modal.success({ content: 'Mở khóa tài khoản khách hàng thành công!' });
                } catch (error) {
                    Modal.error({ title: 'Mở khóa tài khoản khách hàng thất bại!', content: error.message });
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
            title: 'Trạng thái khóa',
            dataIndex: 'active',
            key: 'active',
            render: (locked) => (
                <Tag color={locked === true ? 'blue' : 'volcano'}>
                    {locked ? 'Đang hoạt động' : 'Đã khóa'}
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
                <Space>
                    <Button
                        icon={<EditOutlined className="text-blue-500 w-5 h-5" />}
                        type="text"
                        onClick={() => handleViewDetails(record)}
                    />
                    {record.active === true ? (
                        <Button
                            icon={<MdBlock />}
                            type="text"
                            danger
                            onClick={() => handleLockAccount(record)}
                        />
                    ) : (
                        <Button
                            icon={<CiUnlock />}
                            type="text"
                            onClick={() => handleUnLockAccount(record)}
                        />
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-4">
            {/* Header */}
            <div className='flex justify-between items-center mb-4'>
                <h1 className="text-2xl font-bold mb-4 text-black">Danh sách khách hàng</h1>
                
                {/* Filter dropdown */}
                <div className="mb-4">
                    <Select 
                        value={statusFilter} 
                        onChange={setStatusFilter} 
                        style={{ width: 200 }}
                        placeholder="Lọc theo trạng thái"
                    >
                        <Option value="all">Tất cả</Option>
                        <Option value="active">Đang hoạt động</Option>
                        <Option value="locked">Đã khóa</Option>
                    </Select>
                </div>
            </div>

            {/* Customer Table */}
            {loading ? (
                <div>Loading...</div>
            ) : (
                <Table
                    columns={columns}
                    dataSource={filteredCustomers}
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