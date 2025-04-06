import { Card, Steps, List, Tag, Alert, Typography, Divider, Space } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import api from '../../config/axios';

const { Title, Paragraph, Text } = Typography;

const Normal = () => {
  const [skincareRoutine, setSkincareRoutine] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getSkincareRoutine = async () => {
      try {
        setLoading(true);
        const skinTypeId = localStorage.getItem('skinTypeId');
        const token = localStorage.getItem('token')

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
    'Duy trì chế độ chăm sóc da đều đặn',
    'Uống đủ nước mỗi ngày',
    'Tẩy tế bào chết 1-2 lần/tuần',
    'Sử dụng mặt nạ dưỡng ẩm 1-2 lần/tuần',
    'Bảo vệ da khỏi ánh nắng mặt trời',
    'Ăn nhiều trái cây và rau xanh',
    'Ngủ đủ giấc mỗi đêm',
  ];

  const ingredients = [
    { name: 'Hyaluronic Acid', benefit: 'Dưỡng ẩm sâu và giữ nước cho da' },
    { name: 'Vitamin C', benefit: 'Chống oxy hóa và làm sáng da' },
    { name: 'Vitamin E', benefit: 'Bảo vệ da và dưỡng ẩm' },
    { name: 'Peptide', benefit: 'Hỗ trợ tái tạo da và chống lão hóa' },
    { name: 'Ceramide', benefit: 'Tăng cường hàng rào bảo vệ da' },
  ];

  const renderHTML = (htmlString) => {
    return <div dangerouslySetInnerHTML={{ __html: htmlString }} />;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">
        Phương pháp chăm sóc cho da thường
      </Title>

      {/* Overview Section */}
      <Card className="mb-8">
        <Alert
          message="Đặc điểm của da thường"
          description={
            <ul className="list-disc pl-5 mt-2">
              <li>Da không quá khô hoặc quá dầu</li>
              <li>Lỗ chân lông nhỏ và khó nhìn thấy</li>
              <li>Ít gặp vấn đề về mụn</li>
              <li>Độ ẩm và dầu cân bằng</li>
              <li>Da mềm mại, mịn màng và có độ đàn hồi tốt</li>
            </ul>
          }
          type="success"
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
        Lời khuyên cho da thường
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
            'Sản phẩm quá mạnh hoặc gây kích ứng',
            'Thay đổi sản phẩm quá thường xuyên',
            'Bỏ qua bước chống nắng',
            'Sử dụng quá nhiều sản phẩm cùng lúc',
            'Chạm tay lên mặt quá nhiều',
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
          Da thường là loại da lý tưởng mà nhiều người mong muốn có được. Tuy nhiên, để duy trì làn da khỏe mạnh, bạn vẫn cần chăm sóc đều đặn và bảo vệ da khỏi các tác động môi trường.
        </Paragraph>
        <Paragraph>
          <strong>Lưu ý quan trọng:</strong> Mặc dù da thường ít gặp vấn đề, nhưng vẫn cần chú ý đến những thay đổi theo mùa. Vào mùa đông, da có thể cần thêm độ ẩm, trong khi mùa hè có thể cần sản phẩm nhẹ hơn và chống nắng tốt hơn.
        </Paragraph>
      </Card>
    </div>
  );
};

export default Normal;