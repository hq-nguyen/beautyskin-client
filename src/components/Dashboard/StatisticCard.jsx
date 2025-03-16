import { Card, Statistic } from 'antd';
import { 
  CheckCircleOutlined, 
  SyncOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';

const StatisticCard = ({ title, value, prefix, loading }) => {
  const getIcon = () => {
    switch (title) {
      case 'Completed Orders':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'In Progress Orders':
        return <SyncOutlined style={{ color: '#1890ff' }} />;
      case 'Pending Orders':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
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
        prefix={prefix || getIcon()}
      />
    </Card>
  );
};

export default StatisticCard;