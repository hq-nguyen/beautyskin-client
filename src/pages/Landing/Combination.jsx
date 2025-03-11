import { useState, useEffect } from 'react';
import { Card, Steps, Collapse, List, Tag, Alert, Typography, Divider } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const Combination = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  // You can fetch recommended products from your API here
  useEffect(() => {
    // Fetch products specifically for combination skin
    // const fetchProducts = async () => {
    //   const products = await fetchProductsBySkinType('combination');
    //   setRecommendedProducts(products);
    // };
    // fetchProducts();
  }, []);

  const skincareMorningSteps = [
    {
      title: 'Sữa rửa mặt',
      description: 'Rửa mặt với sữa rửa mặt nhẹ nhàng, không chứa xà phòng để giữ độ ẩm cho vùng da khô và kiểm soát dầu ở vùng chữ T.',
    },
    {
      title: 'Toner',
      description: 'Sử dụng toner cân bằng độ pH và làm sạch sâu.',
    },
    {
      title: 'Serum',
      description: 'Thoa serum chứa Hyaluronic Acid để cấp ẩm cho vùng da khô và Salicylic Acid để kiểm soát dầu ở vùng chữ T.',
    },
    {
      title: 'Kem dưỡng ẩm',
      description: 'Dùng kem dưỡng ẩm nhẹ nhàng cho toàn bộ khuôn mặt, tập trung vào vùng da khô.',
    },
    {
      title: 'Kem chống nắng',
      description: 'Thoa kem chống nắng không chứa dầu với SPF tối thiểu 30.',
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
      description: 'Sử dụng toner cân bằng độ pH và làm sạch sâu.',
    },
    {
      title: 'Serum',
      description: 'Sử dụng serum chứa Salicylic Acid để kiểm soát dầu và Hyaluronic Acid để cấp ẩm.',
    },
    {
      title: 'Kem dưỡng ẩm',
      description: 'Thoa kem dưỡng ẩm nhẹ nhàng cho toàn bộ khuôn mặt, tập trung vào vùng da khô.',
    },
  ];

  const skincareTips = [
    'Sử dụng sản phẩm phù hợp với từng vùng da',
    'Tránh chạm tay lên mặt để giảm thiểu dầu và bụi bẩn',
    'Tẩy tế bào chết 1-2 lần/tuần để giữ da sạch và thông thoáng',
    'Uống đủ nước để giữ độ ẩm từ bên trong',
    'Tránh sử dụng sản phẩm quá nhiều để không làm tắc nghẽn lỗ chân lông',
    'Ăn thực phẩm giàu vitamin và khoáng chất để hỗ trợ sức khỏe da',
  ];

  const ingredients = [
    {
      name: 'Hyaluronic Acid',
      benefit: 'Cấp ẩm sâu cho vùng da khô',
    },
    {
      name: 'Salicylic Acid',
      benefit: 'Kiểm soát dầu và làm sạch sâu ở vùng chữ T',
    },
    {
      name: 'Glycerin',
      benefit: 'Giữ ẩm và làm mềm da',
    },
    {
      name: 'Niacinamide',
      benefit: 'Cải thiện hàng rào bảo vệ da và giảm thiểu sự xuất hiện của lỗ chân lông',
    },
    {
      name: 'Squalane',
      benefit: 'Dưỡng ẩm và phục hồi da',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">
        Phương pháp chăm sóc cho da hỗn hợp
      </Title>

      {/* Overview Section */}
      <Card className="mb-8">
        <Alert
          message="Đặc điểm của da hỗn hợp"
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
        Lời khuyên cho da hỗn hợp
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

      {/* Maintenance Tips */}
      <Title level={3} className="mb-4">
        Duy trì làn da khỏe mạnh
      </Title>
      <Card className="mb-8">
        <Paragraph>
          Da hỗn hợp cần được chăm sóc cẩn thận để cân bằng độ ẩm và kiểm soát dầu. Hãy chú ý đến việc sử dụng sản phẩm phù hợp với từng vùng da và duy trì thói quen chăm sóc da đều đặn.
        </Paragraph>
        <Paragraph>
          <strong>Lưu ý quan trọng:</strong> Trong mùa hè, da hỗn hợp có thể trở nên bóng dầu hơn, vì vậy hãy tăng cường sử dụng sản phẩm kiểm soát dầu và giữ da sạch sẽ.
        </Paragraph>
      </Card>
    </div>
  );
};

export default Combination;
