import { useState, useEffect } from 'react';
import { Row, Col, Card, message } from 'antd';
import { Pie } from '@ant-design/plots';
import StatisticCard from './StatisticCard';
import { getOrdersFromStaff } from '../../apis/staff';

const DashboardSummary = () => {
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    pending: 0,
    cancelled: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Use the real API call
      const orders = await getOrdersFromStaff();
      
      // Calculate statistics from orders
      const statusCounts = {
        completed: 0,
        inProgress: 0,
        pending: 0,
        cancelled: 0
      };
      
      orders.forEach(orderAssignment => {
        const status = orderAssignment.order.orderStatus;
        if (status === 'SHIPPED' || status === 'DELIVERED') {
          statusCounts.completed++;
        } else if (status === 'IN_PROGRESS') {
          statusCounts.inProgress++;
        } else if (status === 'CANCELLED') {
          statusCounts.cancelled++;
        }
      });
      
      const totalOrders = orders.length;
      
      setStats({
        completed: statusCounts.completed,
        inProgress: statusCounts.inProgress,
        cancelled: statusCounts.cancelled,
        total: totalOrders
      });
    } catch (error) {
      message.error('Failed to fetch dashboard statistics');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    {
      type: 'Hoàn thành',
      value: stats.completed,
    },
    {
      type: 'Đang xử lí',
      value: stats.inProgress,
    },
    {
      type: 'Đã hủy',
      value: stats.cancelled,
    },  
    
  ];

  const config = {
    appendPadding: 10,
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}: {value}',
    },
    color: ['#5dd821', '#faad14', '#ff4d4f'],
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard
            title="Số đơn hoàn thành"
            value={stats.completed}
            loading={loading}
            icon="completed"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard
            title="Số đơn đang xử lí"
            value={stats.inProgress}
            loading={loading}
            icon="inProgress"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatisticCard
            title="Số đơn đã hủy"
            value={stats.cancelled}
            loading={loading}
            icon="cancelled"
          />
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Phân phối trạng thái đơn hàng" bordered={false}>
            <div style={{ height: 300 }}>
              {stats.total > 0 ? (
                <Pie {...config} />
              ) : (
                <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {loading ? 'Đang tải dữ liệu...' : 'Không có dữ liệu đơn hàng'}
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardSummary;