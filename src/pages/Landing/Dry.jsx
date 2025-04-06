import { Card, Steps, List, Tag, Alert, Typography, Divider, Space } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import api from '../../config/axios'; 

const { Title, Paragraph, Text } = Typography;

const Dry = () => {
  const [skincareRoutine, setSkincareRoutine] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSkincareRoutine = async () => {
      try {
        setLoading(true);
        const skinTypeId = localStorage.getItem('skinTypeId');
        const token = localStorage.getItem('token');

        if (!skinTypeId) {
          throw new Error('Skin type ID not found in localStorage.');
        }
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        const response = await api.get(`/routine/getRoutineBySkinType/${skinTypeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            skinTypeId: skinTypeId,
          },
        });

        console.log('API Response:', response.data);
        const data = response.data;
        setSkincareRoutine(data.routineSteps || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching skincare routine:', error);
        setError(error.response?.data?.error || 'Không thể tải quy trình chăm sóc da. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    getSkincareRoutine();
  }, []);

  const skincareTips = [
    'Uống đủ nước mỗi ngày',
    'Sử dụng máy tạo độ ẩm trong phòng',
    'Tránh tắm nước quá nóng',
    'Tẩy tế bào chết nhẹ nhàng 1 lần/tuần',
    'Sử dụng mặt nạ dưỡng ẩm 1-2 lần/tuần',
    'Bảo vệ da khỏi gió và lạnh',
    'Ăn thực phẩm giàu omega-3 và vitamin E',
  ];

  const ingredients = [
    { name: 'Hyaluronic Acid', benefit: 'Cấp ẩm sâu và giữ nước cho da' },
    { name: 'Glycerin', benefit: 'Giữ ẩm và làm mềm da' },
    { name: 'Ceramide', benefit: 'Tăng cường hàng rào bảo vệ da' },
    { name: 'Shea Butter', benefit: 'Dưỡng ẩm và làm dịu da' },
    { name: 'Squalane', benefit: 'Dưỡng ẩm và phục hồi da' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">
        Phương pháp chăm sóc cho da khô
      </Title>

      {/* Overview Section */}
      <Card className="mb-8">
        <Alert
          message="Đặc điểm của da khô"
          description={
            <ul className="list-disc pl-5 mt-2">
              <li>Da thường xuyên cảm thấy căng và khô</li>
              <li>Lỗ chân lông nhỏ</li>
              <li>Da dễ bị bong tróc và nứt nẻ</li>
              <li>Ít dầu và dễ bị kích ứng</li>
            </ul>
          }
          type="warning"
          showIcon
        />
      </Card>

      {/* Skincare Routine */}
      <Title level={3} className="mb-4">
        <SkinOutlined className="mr-2" />
        Quy trình chăm sóc da
      </Title>
      <Card className="mb-8">
        {error ? (
          <Alert message="Lỗi" description={error} type="error" showIcon />
        ) : loading ? (
          <Paragraph>Đang tải quy trình chăm sóc da...</Paragraph>
        ) : skincareRoutine.length > 0 ? (
          <>
            <Steps
              direction="vertical"
              current={-1}
              items={skincareRoutine.map((step) => ({
                title: step.stepName || step.name,
                description: (
                  <div>
                    <Text>{step.description}</Text>
                    {step.lastUpdated && (
                      <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                        Cập nhật lần cuối: {new Date(step.lastUpdated).toLocaleString()}
                      </Text>
                    )}
                    {step.products?.length > 0 && (
                      <div className="mt-4">
                        <ShoppingOutlined style={{ marginRight: 8 }} />
                        <Text strong>Sản phẩm gợi ý:</Text>
                        <div className="ml-4 mt-2">
                          <Space direction="vertical">
                            {step.products.map((product) => (
                              <div key={product.id}>
                                <a href={`/product/${product.id}`}>
                                  <Tag color="green">{product.name}</Tag>
                                </a>
                              </div>
                            ))}
                          </Space>
                        </div>
                      </div>
                    )}
                  </div>
                ),
              }))}
            />
            <Divider />
            <Alert
              message="Lưu ý"
              description="Các bước được đánh dấu 'Tùy chọn' có thể được thêm vào hoặc bỏ qua tùy thuộc vào tình trạng da hiện tại và nhu cầu của bạn. Nhấp vào sản phẩm để xem chi tiết."
              type="info"
              showIcon
            />
          </>
        ) : (
          <Paragraph>Không có quy trình chăm sóc da nào được tìm thấy.</Paragraph>
        )}
      </Card>

      {/* Tips Section */}
      <Title level={3} className="mb-4">
        <BulbOutlined className="mr-2" />
        Lời khuyên cho da khô
      </Title>
      <Card className="mb-8">
        <List
          dataSource={skincareTips}
          renderItem={(item) => (
            <List.Item>
              <Text>{item}</Text>
            </List.Item>
          )}
        />
      </Card>

      {/* Ingredients Section */}
      <Title level={3} className="mb-4">
        <ExperimentOutlined className="mr-2" />
        Thành phần nên có trong sản phẩm
      </Title>
      <Card className="mb-8">
        <List
          dataSource={ingredients}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Tag color="orange">{item.name}</Tag>}
                description={item.benefit}
              />
            </List.Item>
          )}
        />
      </Card>

      {/* What to Avoid */}
      <Title level={3} className="mb-4">
        Những điều nên tránh
      </Title>
      <Card className="mb-8">
        <List
          dataSource={[
            'Sản phẩm chứa cồn hoặc hương liệu mạnh',
            'Rửa mặt quá nhiều lần trong ngày',
            'Tắm nước quá nóng',
            'Bỏ qua bước dưỡng ẩm',
            'Sử dụng sản phẩm tẩy tế bào chết mạnh',
          ]}
          renderItem={(item) => (
            <List.Item>
              <Text type="danger">{item}</Text>
            </List.Item>
          )}
        />
      </Card>

      {/* Maintenance Tips */}
      <Title level={3} className="mb-4">
        Duy trì làn da khỏe mạnh
      </Title>
      <Card className="mb-8">
        <Paragraph>
          Da khô cần được chăm sóc đặc biệt để duy trì độ ẩm và ngăn ngừa tình trạng bong tróc. Hãy chú ý đến việc dưỡng ẩm và bảo vệ da khỏi các yếu tố môi trường.
        </Paragraph>
        <Paragraph>
          <strong>Lưu ý quan trọng:</strong> Trong mùa đông, da khô có thể trở nên nhạy cảm hơn, vì vậy hãy tăng cường dưỡng ẩm và bảo vệ da khỏi gió lạnh.
        </Paragraph>
      </Card>
    </div>
  );
};

export default Dry;