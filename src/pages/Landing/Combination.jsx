import { Card, Steps, List, Tag, Alert, Typography, Divider, Space } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getRoutineBySkinType } from '../../apis/routine';

const { Title, Paragraph, Text } = Typography;

const Combination = () => {
  const [skincareRoutine, setSkincareRoutine] = useState([]);
  const [skinTypeInfo, setSkinTypeInfo] = useState(null);
  const [routineInfo, setRoutineInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSkincareRoutine = async () => {
      try {
        setLoading(true);
        const data = await getRoutineBySkinType(6); 
        setRoutineInfo({
          id: data.id,
          name: data.name,
          description: data.description
        });

        setSkinTypeInfo(data.skinTypeResponse);
        setSkincareRoutine(data.routineStepResponse || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching skincare routine:', error);
        setError(error?.response?.data?.error || 'Không thể tải quy trình chăm sóc da. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkincareRoutine();
  }, []);

  const skincareTips = [
    'Sử dụng sản phẩm phù hợp với từng vùng da',
    'Tránh chạm tay lên mặt để giảm thiểu dầu và bụi bẩn',
    'Tẩy tế bào chết 1-2 lần/tuần để giữ da sạch và thông thoáng',
    'Uống đủ nước để giữ độ ẩm từ bên trong',
    'Tránh sử dụng sản phẩm quá nhiều để không làm tắc nghẽn lỗ chân lông',
    'Ăn thực phẩm giàu vitamin và khoáng chất để hỗ trợ sức khỏe da',
  ];

  const ingredients = [
    { name: 'Hyaluronic Acid', benefit: 'Cấp ẩm sâu cho vùng da khô' },
    { name: 'Salicylic Acid', benefit: 'Kiểm soát dầu và làm sạch sâu ở vùng chữ T' },
    { name: 'Glycerin', benefit: 'Giữ ẩm và làm mềm da' },
    { name: 'Niacinamide', benefit: 'Cải thiện hàng rào bảo vệ da và giảm thiểu sự xuất hiện của lỗ chân lông' },
    { name: 'Squalane', benefit: 'Dưỡng ẩm và phục hồi da' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">
        {routineInfo?.name || "Phương pháp chăm sóc cho da hỗn hợp"}
      </Title>

      <Card className="mb-8">
        <Alert
          message={`Đặc điểm ${skinTypeInfo?.type || "da hỗn hợp"}`}
          description={
            <ul className="list-disc pl-5 mt-2">
              <li>Da dầu ở vùng chữ T (trán, mũi, cằm)</li>
              <li>Da khô hoặc thường ở vùng chữ U (hai gò má)</li>
              <li>Lỗ chân lông lớn ở vùng chữ T</li>
              <li>Dễ bị mụn và bóng dầu</li>
            </ul>
          }
          type="warning"
          showIcon
        />
      </Card>

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
                title: step.stepName,
                description: (
                  <div>
                    <Text>{step.description}</Text>
                    {step.productResponse?.length > 0 && (
                      <div className="mt-4">
                        <ShoppingOutlined style={{ marginRight: 8 }} />
                        <Text strong>Sản phẩm gợi ý:</Text>
                        <div className="ml-4 mt-2">
                          <Space direction="vertical">
                            {step.productResponse.map((product) => (
                              <div key={product.id}>
                                <a href={`/product/${product.id}`}>
                                  <Tag color="orange">{product.name}</Tag>
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

      <Title level={3} className="mb-4">
        <BulbOutlined className="mr-2" />
        Nguyên tắc vàng cho da hỗn hợp
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

      <Title level={3} className="mb-4">
        Tác nhân cần tránh
      </Title>
      <Card className="mb-8">
        <List
          dataSource={[
            'Sử dụng sản phẩm quá nhiều hoặc quá ít',
            'Rửa mặt quá nhiều lần trong ngày',
            'Tắm nước quá nóng',
            'Bỏ qua bước dưỡng ẩm cho vùng da khô',
            'Sử dụng sản phẩm không phù hợp với từng vùng da',
          ]}
          renderItem={(item) => (
            <List.Item>
              <Text type="danger">{item}</Text>
            </List.Item>
          )}
        />
      </Card>

      <Title level={3} className="mb-4">
        Duy trì làn da khỏe mạnh
      </Title>
      <Card className="mb-8">
        <Paragraph>
          Da hỗn hợp cần được chăm sóc cẩn thận để cân bằng độ ẩm và kiểm soát dầu. Hãy chú ý đến việc sử dụng sản phẩm phù hợp với từng vùng da và duy trì thói quen chăm sóc da đều đặn.
        </Paragraph>
        <Paragraph>
          <strong>Lưu ý quan trọng:</strong> Trong mùa hè, da hỗn hợp có thể trở nên bóng dầu hơn, vì vậy hãy tăng cường sử dụng sản phẩm kiểm soát dầu và giữ da sạch sẽ. Ngược lại, vào mùa đông, cần chú ý cấp ẩm cho vùng da khô nhiều hơn.
        </Paragraph>
      </Card>
    </div>
  );
};

export default Combination;