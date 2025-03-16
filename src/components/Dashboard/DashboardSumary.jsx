import React, { useState, useEffect } from 'react';
import { Row, Col, Card, message } from 'antd';
import { Pie } from '@ant-design/plots';
import StatisticCard from './StatisticCard';

// Mock statistics data
const mockStats = {
  completed: 42,
  inProgress: 28,
  pending: 15,
  total: 85
};

// Mock function to get dashboard stats - simulates API call
const getMockDashboardStats = () => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve(mockStats);
    }, 800);
  });
};

const DashboardSummary = () => {
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    pending: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Use mock function instead of API call
      const data = await getMockDashboardStats();
      setStats(data);
    } catch (error) {
      message.error('Failed to fetch dashboard statistics');
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
      type: 'Chờ xử lí',
      value: stats.pending,
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
    color: ['#52c41a', '#1890ff', '#faad14'],
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <StatisticCard
            title="Số đơn hoàn thành"
            value={stats.completed}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatisticCard
            title="Số đơn đang xử lí"
            value={stats.inProgress}
            loading={loading}
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatisticCard
            title="Số đơn chờ xử lí"
            value={stats.pending}
            loading={loading}
          />
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="Phân phối trạng thái đơn hàng" bordered={false}>
            <div style={{ height: 300 }}>
              <Pie {...config} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardSummary;