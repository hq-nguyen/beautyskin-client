import { Card, Steps, List, Tag, Alert, Typography, Divider, Space } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import api from '../../config/axios';

const { Title, Paragraph, Text } = Typography;

const Oily = () => {
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
    'Không chạm tay lên mặt quá nhiều',
    'Thay vỏ gối thường xuyên',
    'Tẩy tế bào chết 1-2 lần/tuần',
    'Sử dụng mặt nạ đất sét 1-2 lần/tuần',
    'Uống đủ nước mỗi ngày',
    'Hạn chế ăn đồ nhiều dầu mỡ',
    'Rửa mặt ngay sau khi tập thể dục',
  ];

  const ingredients = [
    { name: 'Salicylic Acid', benefit: 'Giúp thông thoáng lỗ chân lông và kiểm soát dầu' },
    { name: 'Niacinamide', benefit: 'Cân bằng độ ẩm và kiểm soát dầu' },
    { name: 'Tea Tree Oil', benefit: 'Kháng khuẩn tự nhiên' },
    { name: 'Hyaluronic Acid', benefit: 'Cấp ẩm nhẹ nhàng không gây bóng nhờn' },
    { name: 'Clay (Đất sét)', benefit: 'Hút dầu và làm sạch sâu' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">
        Phương pháp chăm sóc cho da dầu
      </Title>

      {/* Overview Section */}
      <Card className="mb-8">
        <Alert
          message="Đặc điểm của da dầu"
          description={
            <ul className="list-disc pl-5 mt-2">
              <li>Da tiết nhiều dầu, đặc biệt ở vùng chữ T</li>
              <li>Lỗ chân lông to</li>
              <li>Dễ nổi mụn</li>
              <li>Da thường bóng nhờn vào giữa ngày</li>
            </ul>
          }
          type="info"
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
        Lời khuyên cho da dầu
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
                title={<Tag color="blue">{item.name}</Tag>}
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
            'Sản phẩm chứa nhiều dầu',
            'Rửa mặt quá nhiều lần trong ngày',
            'Sử dụng sản phẩm có cồn',
            'Tẩy tế bào chết quá mạnh',
            'Bỏ qua bước dưỡng ẩm',
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
          Da dầu cần được chăm sóc đặc biệt để kiểm soát lượng dầu thừa mà vẫn đảm bảo độ ẩm cần thiết. Việc duy trì quy trình chăm sóc da đều đặn sẽ giúp cải thiện tình trạng da đáng kể.
        </Paragraph>
        <Paragraph>
          <strong>Lưu ý quan trọng:</strong> Da dầu thường thay đổi theo mùa và điều kiện thời tiết. Vào mùa hè, khi thời tiết nóng ẩm, da có thể tiết nhiều dầu hơn, do đó cần điều chỉnh sản phẩm phù hợp. Ngược lại, vào mùa đông, không nên bỏ qua bước dưỡng ẩm dù da có dầu.
        </Paragraph>
      </Card>
    </div>
  );
};

export default Oily;