import { Typography } from 'antd';
import DashboardSummary from '../../components/Dashboard/DashboardSumary';

const { Title } = Typography;

const Dashboard = () => {
  return (
    <div>
      <Title level={2}>Thống kê hiệu suất</Title>
      <DashboardSummary />
    </div>
  );
};

export default Dashboard;