import { Menu } from 'antd';
import { 
  DashboardOutlined, 
  ShoppingCartOutlined, 
  UserOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/features/useSlice';

const StaffSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const menuItems = [
    {
      key: '/staff',
      icon: <DashboardOutlined />,
      label: 'Thống kê công việc',
    },
    {
      key: '/staff/orders',
      icon: <ShoppingCartOutlined />,
      label: 'Xử lí đơn hàng',
    },
    // {
    //   key: '/customers',
    //   icon: <UserOutlined />,
    //   label: 'Customer Support',
    // },
  ];
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login'); // Redirect to login page after logout
  };
  
  return (
    <div className="relative h-screen w-64 bg-white shadow-lg flex flex-col">
      <Link to={'/'} className="p-4 flex items-center justify-center mb-5">
        <h2 className="m-0 text-gray-800 text-xl font-semibold tracking-wider">BeautySkin</h2>
      </Link>
      
      <div className="flex-grow overflow-y-auto">
        <Menu
          style={{
            borderRight: 'none',
            backgroundColor: '#fff'
          }}
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems.map(item => ({
            ...item,
            label: <span className="text-base">{item.label}</span>
          }))}
          onClick={({ key }) => navigate(key)}
        />
      </div>
      
      <div className="mt-auto p-4 border-t border-gray-100">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-lg text-gray-800 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 shadow-sm hover:shadow"
        >
          <LogoutOutlined className="mr-2 text-lg" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default StaffSidebar;
