import { useState, useEffect } from 'react';
import { Card, Steps, Collapse, List, Tag, Alert, Typography, Divider } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const Dry = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // You can fetch recommended products from your API here
  useEffect(() => {
    // Fetch products specifically for dry skin
    // const fetchProducts = async () => {
    //   const products = await fetchProductsBySkinType('dry');
    //   setRecommendedProducts(products);
    // };
    // fetchProducts();
  }, []);

  const skincareMorningSteps = [
    {
      title: 'Sữa rửa mặt',
      description: 'Rửa mặt với sữa rửa mặt dạng kem để giữ ẩm cho da.',
    },
    {
      title: 'Toner',
      description: 'Sử dụng toner dưỡng ẩm để làm dịu và cấp ẩm cho da.',
    },
    {
      title: 'Serum',
      description: 'Thoa serum chứa Hyaluronic Acid để cấp ẩm sâu.',
    },
    {
      title: 'Kem dưỡng ẩm',
      description: 'Dùng kem dưỡng ẩm đậm đặc để khóa ẩm.',
    },
    {
      title: 'Kem chống nắng',
      description: 'Thoa kem chống nắng dưỡng ẩm với SPF tối thiểu 30.',
    },
  ];

  const skincareEveningSteps = [
    {
      title: 'Tẩy trang',
      description: 'Sử dụng dầu tẩy trang để loại bỏ lớp trang điểm và bụi bẩn.',
    },
    {
      title: 'Sữa rửa mặt',
      description: 'Rửa mặt với sữa rửa mặt dịu nhẹ.',
    },
    {
      title: 'Toner',
      description: 'Sử dụng toner dưỡng ẩm để cân bằng da.',
    },
    {
      title: 'Serum',
      description: 'Sử dụng serum chứa dầu dưỡng hoặc peptide để phục hồi da.',
    },
    {
      title: 'Kem dưỡng ẩm',
      description: 'Thoa kem dưỡng ẩm đậm đặc để phục hồi độ ẩm qua đêm.',
    },
  ];

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
    {
      name: 'Hyaluronic Acid',
      benefit: 'Cấp ẩm sâu và giữ nước cho da',
    },
    {
      name: 'Glycerin',
      benefit: 'Giữ ẩm và làm mềm da',
    },
    {
      name: 'Ceramide',
      benefit: 'Tăng cường hàng rào bảo vệ da',
    },
    {
      name: 'Shea Butter',
      benefit: 'Dưỡng ẩm và làm dịu da',
    },
    {
      name: 'Squalane',
      benefit: 'Dưỡng ẩm và phục hồi da',
    },
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