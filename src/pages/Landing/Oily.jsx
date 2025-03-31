import { Card, Steps, Collapse, List, Tag, Alert, Typography, Divider, Badge, Space } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined, ShoppingOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const Oily = () => {
  const skincareMorningSteps = [
    {
      title: 'Sữa rửa mặt',
      description: 'Rửa mặt với sữa rửa mặt dịu nhẹ, không chứa dầu để loại bỏ bã nhờn tích tụ qua đêm.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/16"><Tag color="blue">Sữa Rửa Mặt Trà Xanh Ngừa Mụn</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Toner',
      description: 'Sử dụng toner không cồn để cân bằng độ pH và kiểm soát dầu.',
    },
    {
      title: 'Serum',
      description: 'Thoa serum chứa Niacinamide hoặc Salicylic Acid để kiểm soát dầu và se khít lỗ chân lông.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/20"><Tag color="blue">Serum Trị Mụn Tea Tree Oil</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Kem dưỡng ẩm',
      description: 'Dùng kem dưỡng ẩm dạng gel hoặc lotion không dầu.',
    },
    {
      title: 'Kem chống nắng',
      description: 'Thoa kem chống nắng dạng gel hoặc lotion với SPF tối thiểu 30.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/15"><Tag color="blue">Kem Chống Nắng Kiềm Dầu</Tag></a>
            </Space>
          </div>
        </>
      )
    },
  ];

  const skincareEveningSteps = [
    {
      title: 'Tẩy trang',
      description: 'Sử dụng dầu tẩy trang hoặc nước tẩy trang không dầu.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/19"><Tag color="blue">Nước Tẩy Trang Micellar</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Sữa rửa mặt',
      description: 'Rửa mặt kỹ để loại bỏ hoàn toàn dầu và bụi bẩn.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/29"><Tag color="blue">Sữa Rửa Mặt CeraVe Sạch Sâu Cho Da Thường Đến Da Dầu 473ml</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Toner',
      description: 'Sử dụng toner để cân bằng da.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/30"><Tag color="blue">Dung dịch loại bỏ tế bào chết Skin Perfecting 2% BHA Liquid Exfoliant 118ml</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Điều trị',
      description: 'Sử dụng các sản phẩm đặc trị (nếu cần) như benzoyl peroxide hoặc retinol.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/25"><Tag color="blue">Tẩy Tế Bào Chết Hóa Học AHA/BHA</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Dưỡng ẩm',
      description: 'Thoa kem dưỡng ẩm dạng nhẹ.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/26"><Tag color="blue">Kem Dưỡng La Roche-Posay Effaclar Mat</Tag></a>
            </Space>
          </div>
        </>
      )
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