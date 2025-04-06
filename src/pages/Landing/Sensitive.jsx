import { Card, Steps, List, Tag, Alert, Typography, Divider, Space } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import api from '../../config/axios'; 

const { Title, Paragraph, Text } = Typography;

const Sensitive = () => {
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
    'Luôn test sản phẩm mới trên vùng da nhỏ trước 24h',
    'Tránh sử dụng nhiều sản phẩm cùng lúc',
    'Không dùng khăn chà xát mạnh khi lau mặt',
    'Hạn chế tẩy tế bào chết vật lý (max 1 lần/tuần)',
    'Giữ nhiệt độ phòng mát mẻ tránh bốc hơi nước',
    'Ưu tiên sản phẩm có nhãn "Hypoallergenic"',
  ];

  const ingredients = [
    { name: 'Centella Asiatica', benefit: 'Làm dịu mẩn đỏ và phục hồi tổn thương' },
    { name: 'Ceramide', benefit: 'Củng cố hàng rào bảo vệ da' },
    { name: 'Panthenol', benefit: 'Giảm ngứa và kích ứng' },
    { name: 'Yến mạch', benefit: 'Cấp ẩm và chống viêm' },
    { name: 'Zinc Oxide', benefit: 'Bảo vệ da khỏi tia UV an toàn' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">
        Phương pháp chăm sóc da nhạy cảm
      </Title>

      {/* Overview Section */}
      <Card className="mb-8">
        <Alert
          message="Đặc điểm da nhạy cảm"
          description={
            <ul className="list-disc pl-5 mt-2">
              <li>Dễ ửng đỏ và nóng rát khi thay đổi môi trường</li>
              <li>Phản ứng với thành phần mỹ phẩm thông thường</li>
              <li>Cảm giác châm chích khi dùng sản phẩm mới</li>
              <li>Xuất hiện mẩn đỏ không rõ nguyên nhân</li>
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
        Nguyên tắc vàng cho da nhạy cảm
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
        Thành phần an toàn
      </Title>
      <Card className="mb-8">
        <List
          dataSource={ingredients}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={<Tag color="green">{item.name}</Tag>}
                description={item.benefit}
              />
            </List.Item>
          )}
        />
      </Card>

      {/* What to Avoid */}
      <Title level={3} className="mb-4">
        Tác nhân cần tránh
      </Title>
      <Card className="mb-8">
        <List
          dataSource={[
            'Sản phẩm chứa cồn denat hoặc hương liệu',
            'Retinol/Tretinoin nồng độ cao',
            'Tẩy da chết hóa học (AHA/BHA) quá 2%',
            'Nước hoa và chất tạo màu tổng hợp',
            'Thay đổi nhiệt độ đột ngột',
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
          Da nhạy cảm đòi hỏi sự kiên nhẫn và chăm sóc đặc biệt. Việc thiết lập một quy trình đơn giản, nhất quán với các sản phẩm dịu nhẹ sẽ giúp cải thiện hàng rào bảo vệ da và giảm thiểu phản ứng.
        </Paragraph>
        <Paragraph>
          <strong>Lưu ý quan trọng:</strong> Da nhạy cảm rất dễ bị tác động bởi các yếu tố môi trường như thời tiết, ô nhiễm, và thậm chí là stress. Hãy điều chỉnh quy trình chăm sóc da theo mùa và lắng nghe phản ứng của làn da để có phương pháp phù hợp nhất.
        </Paragraph>
      </Card>
    </div>
  );
};

export default Sensitive;