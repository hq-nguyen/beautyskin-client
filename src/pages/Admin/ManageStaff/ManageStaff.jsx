import { useState, useEffect } from 'react';
import { Table, Tag, Space, Modal, Button, Avatar } from 'antd';
import { MdOutlineDeleteOutline, MdOutlineRemoveRedEye } from "react-icons/md";
import { fetchStaff, deleteStaff, addStaff } from '../../../apis/staff';
import StaffModel from './StaffModel';
import AddStaff from './AddStaff'; // Import the AddStaff component

const ManageStaff = () => {
  const [staffs, setStaffs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStaffs = async () => {
      try {
        const data = await fetchStaff();
        setStaffs(data);
      } catch (error) {
        console.error("Error fetching staffs:", error);
      } finally {
        setLoading(false);
      }
    };
    getStaffs();
  }, []);

  const handleViewDetails = (staff) => {
    console.log("Viewing details for:", staff); // Add this line
    setCurrentStaff(staff);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCurrentStaff(null);
  };

  const handleDelete = (staff) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa nhân viên này?',
      content: 'Hành động này không thể hoàn tác!',
      okText: 'Có, xóa',
      okType: 'danger',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await deleteStaff(staff.id);
          setStaffs(staffs.filter(s => s.id !== staff.id));
          Modal.success({ content: 'Xóa nhân viên thành công!' });
        } catch (error) {
          Modal.error({ title: 'Xóa nhân viên thất bại!', content: error.message });
        }
      },
    });
  };

  const handleAddNewStaff = async (newStaff) => {
    try {
      await addStaff(newStaff); // Call your API to add the new staff
      setStaffs([...staffs, newStaff]); // Optimistically update the UI
      setIsAddModalVisible(false); // Close the modal
    } catch (error) {
      console.error("Error adding staff:", error);
    }
  };

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar) => (<Avatar src={avatar} alt="Avatar" />),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Số đơn đã giao',
      dataIndex: 'numberOfAssigned',
      key: 'numberOfAssigned',
    },
    {
      title: 'Số đơn đã xử lý',
      dataIndex: 'numberOfOrderProcessed',
      key: 'numberOfOrderProcessed',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status.toUpperCase() === 'ACTIVE' ? 'green' : 'red'}>
          {status ? status.toUpperCase() : 'INACTIVE'}
        </Tag>
      ),
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
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4 text-black">Danh sách nhân viên</h1>
        <Button type="primary" onClick={() => setIsAddModalVisible(true)}>Thêm nhân viên</Button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          columns={columns}
          dataSource={staffs}
          rowKey="id"
          pagination={{ position: ['bottomRight'] }}
          rowClassName={(_, index) => (index % 2 === 0 ? "bg-gray-100" : "bg-white")}
          className="w-full border rounded-lg shadow-md"
        />
      )}

      {currentStaff && (
        <StaffModel
          staff={currentStaff}
          visible={isModalVisible}
          onCancel={handleCloseModal}
        />
      )}

      <AddStaff
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onSave={handleAddNewStaff}
      />
    </div>
  );
};

export default ManageStaff;
