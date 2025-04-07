import { useState, useEffect } from 'react';
import { Table, Tag, Space, Modal, Button, Select } from 'antd';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { MdBlock } from "react-icons/md";
import { CiUnlock } from "react-icons/ci";
import StaffModel from './StaffModel';
import AddStaff from './AddStaff';
import { createStaff,  fetchStaff, lockAccount, unLockAccount, } from '../../../apis/customer';

const { Option } = Select;

const ManageStaff = () => {
  const [staffs, setStaffs] = useState([]);
  const [filteredStaffs, setFilteredStaffs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentStaff, setCurrentStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const getStaffs = async () => {
      try {
        const data = await fetchStaff();
        const staffData = data.filter(user => user.role === "STAFF");
        setStaffs(staffData);
        setFilteredStaffs(staffData);
      } catch (error) {
        console.error("Error fetching staffs:", error);
      } finally {
        setLoading(false);
      }
    };
    getStaffs();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredStaffs(staffs);
    } else if (statusFilter === 'active') {
      setFilteredStaffs(staffs.filter(staff => staff.active === true));
    } else if (statusFilter === 'locked') {
      setFilteredStaffs(staffs.filter(staff => staff.active === false));
    }
  }, [statusFilter, staffs]);

  const handleLockAccount = (staff) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn khóa tài khoản nhân viên này?',
      content: 'Hành động này có thể hoàn tác sau!',
      okText: 'Có, khóa',
      okType: 'danger',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await lockAccount(staff.id);
          const updatedStaffs = staffs.map(s => 
            s.id === staff.id ? { ...s, active: false } : s
          );
          setStaffs(updatedStaffs);
          Modal.success({ content: 'Khóa tài khoản nhân viên thành công!' });
        } catch (error) {
          Modal.error({ 
            title: 'Khóa tài khoản nhân viên thất bại!', 
            content: error.message 
          });
        }
      },
    });
  };

  const handleUnLockAccount = (staff) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn mở khóa tài khoản nhân viên này?',
      content: 'Tài khoản sẽ có thể hoạt động bình thường sau khi mở khóa',
      okText: 'Có, mở khóa',
      okType: 'primary',
      cancelText: 'Không',
      onOk: async () => {
        try {
          await unLockAccount(staff.id);
          const updatedStaffs = staffs.map(s => 
            s.id === staff.id ? { ...s, active: true } : s
          );
          setStaffs(updatedStaffs);
          Modal.success({ content: 'Mở khóa tài khoản nhân viên thành công!' });
        } catch (error) {
          Modal.error({ 
            title: 'Mở khóa tài khoản nhân viên thất bại!', 
            content: error.message 
          });
        }
      },
    });
  };

  const handleViewDetails = (staff) => {
    setCurrentStaff(staff);
    setIsModalVisible(true);
  };

  const handleAddNewStaff = async (newStaff) => {
    try {
      const response = await createStaff(newStaff);
      const newStaffWithId = { 
        ...newStaff, 
        id: response.id, 
        active: true 
      };
      const updatedStaffs = [...staffs, newStaffWithId];
      setStaffs(updatedStaffs);
      setFilteredStaffs(updatedStaffs);
      setIsAddModalVisible(false);
    } catch (error) {
      console.error("Error adding staff:", error);
      Modal.error({ 
        title: 'Thêm nhân viên thất bại!', 
        content: error.message 
      });
    }
    getStaffs(); 
  };

  const columns = [
    {
      title: 'STT',
      key: 'index',
      render: (_, __, index) =>  index + 1,
      width: 70,
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
      title: 'Số đơn đã xử lý',
      dataIndex: 'completedOrders',
      key: 'completedOrders',
      render: (numberOfAssigned) => (
        <Tag color="blue"> {numberOfAssigned} đơn hàng</Tag>
      )
    },
    {
      title: 'Trạng thái khóa',
      dataIndex: 'active',
      key: 'active',
      render: (active) => (
        <Tag color={active ? 'blue' : 'volcano'}>
          {active ? 'Đang hoạt động' : 'Đã khóa'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            icon={<MdOutlineRemoveRedEye className="text-blue-500 w-5 h-5" />} 
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
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4 text-black">Danh sách nhân viên</h1>
        
        <div className="flex items-center space-x-4">
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
          
          <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
            Thêm nhân viên
          </Button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Table
          columns={columns}
          dataSource={filteredStaffs}
          rowKey="id"
          pagination={{ position: ['bottomRight'] }}
          rowClassName={(_, index) => (index % 2 === 0 ? "bg-gray-100" : "bg-white")}
          className="w-full border rounded-lg shadow-md"
          scroll={{ x: 1200 }}
        />
      )}

      {currentStaff && (
        <StaffModel
          staff={currentStaff}
          visible={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setCurrentStaff(null);
          }}
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