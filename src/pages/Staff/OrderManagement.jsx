import { Typography } from 'antd';
import OrderList from '../../components/Order/Staff/OrderList';

const { Title } = Typography;

const OrderManagement = () => {
  return (
    <div>
      <Title level={2}>Xử lí đơn hàng</Title>
      <OrderList />
    </div>
  );
};

export default OrderManagement;