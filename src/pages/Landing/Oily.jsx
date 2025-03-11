import { useState, useEffect } from 'react';
import { Card, Steps, Collapse, List, Tag, Alert, Typography, Divider } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const Oily = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // You can fetch recommended products from your API here
  useEffect(() => {
    // Fetch products specifically for oily skin
    // const fetchProducts = async () => {
    //   const products = await fetchProductsBySkinType('oily');
    //   setRecommendedProducts(products);
    // };
    // fetchProducts();
  }, []);

  const skincareMorningSteps = [
    {
      title: 'Sữa rửa mặt',
      description: 'Rửa mặt với sữa rửa mặt dịu nhẹ, không chứa dầu để loại bỏ bã nhờn tích tụ qua đêm.',
    },
    {
      title: 'Toner',
      description: 'Sử dụng toner không cồn để cân bằng độ pH và kiểm soát dầu.',
    },
    {
      title: 'Serum',
      description: 'Thoa serum chứa Niacinamide hoặc Salicylic Acid để kiểm soát dầu và se khít lỗ chân lông.',
    },
    {
      title: 'Kem dưỡng ẩm',
      description: 'Dùng kem dưỡng ẩm dạng gel hoặc lotion không dầu.',
    },
    {
      title: 'Kem chống nắng',
      description: 'Thoa kem chống nắng dạng gel hoặc lotion với SPF tối thiểu 30.',
    },
  ];

  const skincareEveningSteps = [
    {
      title: 'Tẩy trang',
      description: 'Sử dụng dầu tẩy trang hoặc nước tẩy trang không dầu.',
    },
    {
      title: 'Sữa rửa mặt',
      description: 'Rửa mặt kỹ để loại bỏ hoàn toàn dầu và bụi bẩn.',
    },
    {
      title: 'Toner',
      description: 'Sử dụng toner để cân bằng da.',
    },
    {
      title: 'Điều trị',
      description: 'Sử dụng các sản phẩm đặc trị (nếu cần) như benzoyl peroxide hoặc retinol.',
    },
    {
      title: 'Kem dưỡng ẩm',
      description: 'Thoa kem dưỡng ẩm dạng nhẹ.',
    },
  ];

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
    {
      name: 'Salicylic Acid',
      benefit: 'Giúp thông thoáng lỗ chân lông và kiểm soát dầu',
    },
    {
      name: 'Niacinamide',
      benefit: 'Cân bằng độ ẩm và kiểm soát dầu',
    },
    {
      name: 'Tea Tree Oil',
      benefit: 'Kháng khuẩn tự nhiên',
    },
    {
      name: 'Hyaluronic Acid',
      benefit: 'Cấp ẩm nhẹ nhàng không gây bóng nhờn',
    },
    {
      name: 'Clay (Đất sét)',
      benefit: 'Hút dầu và làm sạch sâu',
    },
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

      {/* Morning Routine */}
      <Title level={3} className="mb-4">
        <SkinOutlined className="mr-2" />
        Quy trình buổi sáng
      </Title>
      <Card className="mb-8">
        <Steps
          direction="vertical"
          current={-1}
          items={skincareMorningSteps}
        />
      </Card>

      {/* Evening Routine */}
      <Title level={3} className="mb-4">
        <SkinOutlined className="mr-2" />
        Quy trình buổi tối
      </Title>
      <Card className="mb-8">
        <Steps
          direction="vertical"
          current={-1}
          items={skincareEveningSteps}
        />
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
    </div>
  );
};

export default Oily;
