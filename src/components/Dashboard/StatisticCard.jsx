import { Card, Statistic } from 'antd';
import { 
  CheckCircleOutlined, 
  SyncOutlined, 
  ClockCircleOutlined,
  StopOutlined
} from '@ant-design/icons';

const StatisticCard = ({ title, value, loading, icon }) => {
  const getIcon = () => {
    if (icon) {
      switch (icon) {
        case 'completed':
          return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
        case 'inProgress':
          return <SyncOutlined style={{ color: '#1890ff' }} />;
        case 'pending':
          return <ClockCircleOutlined style={{ color: '#faad14' }} />;
        case 'cancelled':
          return <StopOutlined style={{ color: '#ff4d4f' }} />;
        default:
          return null;
      }
    }
    
    // Fallback to title-based icon selection for backward compatibility
    switch (title) {
      case 'Số đơn hoàn thành':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'Số đơn đang xử lí':
        return <SyncOutlined style={{ color: '#1890ff' }} />;
      case 'Số đơn chờ xử lí':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'Số đơn đã hủy':
        return <StopOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  return (
    <Card bordered={false}>
      <Statistic
        title={title}
        value={value}
        precision={0}
        loading={loading}
        prefix={getIcon()}
      />
    </Card>
  );
};

export default StatisticCard;