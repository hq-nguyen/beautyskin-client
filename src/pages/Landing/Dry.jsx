import { Card, Steps, Collapse, List, Tag, Alert, Typography, Divider, Badge, Space } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined, ShoppingOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const Dry = () => {
  const skincareMorningSteps = [
    {
      title: 'Sữa rửa mặt',
      description: 'Rửa mặt với sữa rửa mặt dạng kem để giữ ẩm cho da.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/16"><Tag color="green">Sữa Rửa Mặt Trà Xanh Ngừa Mụn</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Toner',
      description: 'Sử dụng toner dưỡng ẩm để làm dịu và cấp ẩm cho da.',
    },
    {
      title: 'Serum',
      description: 'Thoa serum chứa Hyaluronic Acid để cấp ẩm sâu.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/20"><Tag color="green">Serum Trị Mụn Tea Tree Oil</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Kem dưỡng ẩm',
      description: 'Dùng kem dưỡng ẩm đậm đặc để khóa ẩm.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/15"><Tag color="green">Kem Chống Nắng Kiềm Dầu SPF50</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Kem chống nắng',
      description: 'Thoa kem chống nắng dưỡng ẩm với SPF tối thiểu 30.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/10"><Tag color="green">Kem Chống Nắng Dưỡng Trắng Bảo Vệ Chống Ánh Sáng Xanh Ceuticoz Uvicoz Lotion SPF50+ PA++++</Tag></a>
            </Space>
          </div>
        </>
      )
    },
  ];

  const skincareEveningSteps = [
    {
      title: 'Tẩy trang',
      description: 'Sử dụng dầu tẩy trang để loại bỏ lớp trang điểm và bụi bẩn.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/33"><Tag color="green">Dầu tẩy trang DHC Deep Cleansing Oil</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Sữa rửa mặt',
      description: 'Rửa mặt với sữa rửa mặt dịu nhẹ.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/34"><Tag color="green">Sữa rửa Mặt La Roche-Posay Cho Da Khô Nhạy Cảm 200ml</Tag></a>
            </Space>
          </div>
        </>
      )
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
    {
      title: 'Dầu dưỡng',
      description: 'Sử dụng dầu dưỡng để tăng cường khả năng giữ ẩm cho da.',
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
        <Divider />
        <Alert
          message="Lưu ý"
          description="Các bước được đánh dấu 'Tùy chọn' có thể được thêm vào hoặc bỏ qua tùy thuộc vào tình trạng da hiện tại và nhu cầu của bạn. Nhấp vào sản phẩm để xem chi tiết."
          type="info"
          showIcon
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
        <Divider />
        <Alert
          message="Lưu ý"
          description="Các bước được đánh dấu 'Tùy chọn' có thể được thêm vào hoặc bỏ qua tùy thuộc vào tình trạng da hiện tại và nhu cầu của bạn. Nhấp vào sản phẩm để xem chi tiết."
          type="info"
          showIcon
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