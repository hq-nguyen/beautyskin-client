import { Menu } from 'antd';
import { 
  DashboardOutlined, 
  ShoppingCartOutlined, 
  UserOutlined 
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const StaffSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
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
  
  return (
    <div className="sidebar">
      <div className="logo-container" style={{ 
        padding: '16px', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <h2 style={{ 
          margin: 0, 
          color: '#333',
          fontSize: '20px',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>BeautySkin</h2>
      </div>
      <Menu
        style={{
          borderRight: 'none',
          backgroundColor: '#fff'
        }}
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems.map(item => ({
          ...item,
          label: <span style={{ fontSize: '15px' }}>{item.label}</span>
        }))}
        onClick={({ key }) => navigate(key)}
      />
      <div className="sidebar-footer" style={{ 
        padding: '16px', 
        position: 'absolute', 
        bottom: 0, 
        width: '100%',
        borderTop: '1px solid #f0f0f0',
        textAlign: 'center',
        color: '#999',
        fontSize: '12px'
      }}>
      </div>
    </div>
  );
};

export default StaffSidebar;