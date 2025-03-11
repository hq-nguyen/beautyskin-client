import { Card, Steps, List, Tag, Alert, Typography } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Sensitive = () => {
  const skincareMorningSteps = [
    {
      title: 'Sữa rửa mặt dịu nhẹ',
      description: 'Dùng sữa rửa mặt không chứa xà phòng, chất tạo bọt. Massage bằng đầu ngón tay với nước ấm[2][4][7]',
    },
    {
      title: 'Toner không cồn',
      description: 'Sử dụng toner làm dịu chứa thành phần như trà xanh hoặc cúc La Mã[1][3][8]',
    },
    {
      title: 'Serum dưỡng ẩm',
      description: 'Thoa serum chứa Hyaluronic Acid hoặc Ceramide để phục hồi hàng rào bảo vệ da[1][4][6]',
    },
    {
      title: 'Kem dưỡng ẩm',
      description: 'Chọn kem không mùi, kết cấu gel hoặc kem nhẹ có chứa Glycerin[2][5][8]',
    },
    {
      title: 'Kem chống nắng vật lý',
      description: 'Sử dụng SPF 30+ không chứa hóa chất gây kích ứng như Zinc Oxide[1][3][6]',
    },
  ];

  const skincareEveningSteps = [
    {
      title: 'Tẩy trang dạng dầu',
      description: 'Dùng dầu tẩy trang gentle để loại bỏ bụi bẩn mà không gây căng da[3][6]',
    },
    {
      title: 'Sữa rửa mặt',
      description: 'Lặp lại bước làm sạch buổi sáng[2][4]',
    },
    {
      title: 'Mặt nạ giấy dịu da',
      description: 'Đắp 1-2 lần/tuần mặt nạ chứa thành phần như yến mạch hoặc rau má[5][8]',
    },
    {
      title: 'Serum phục hồi',
      description: 'Dùng serum chứa Panthenol hoặc Centella Asiatica[3][4][7]',
    },
    {
      title: 'Kem dưỡng ban đêm',
      description: 'Chọn kem có kết cấu đặc hơn chứa Ceramide và Squalane[4][5][7]',
    },
  ];

  const skincareTips = [
    'Luôn test sản phẩm mới trên vùng da nhỏ trước 24h[2][4]',
    'Tránh sử dụng nhiều sản phẩm cùng lúc[5][7]',
    'Không dùng khăn chà xát mạnh khi lau mặt[1][7]',
    'Hạn chế tẩy tế bào chết vật lý (max 1 lần/tuần)[3][5]',
    'Giữ nhiệt độ phòng mát mẻ tránh bốc hơi nước[2][7]',
    'Ưu tiên sản phẩm có nhãn "Hypoallergenic"[2][4][8]',
  ];

  const ingredients = [
    { name: 'Centella Asiatica', benefit: 'Làm dịu mẩn đỏ và phục hồi tổn thương[3][4]' },
    { name: 'Ceramide', benefit: 'Củng cố hàng rào bảo vệ da[4][5]' },
    { name: 'Panthenol', benefit: 'Giảm ngứa và kích ứng[4][7]' },
    { name: 'Yến mạch', benefit: 'Cấp ẩm và chống viêm[5][8]' },
    { name: 'Zinc Oxide', benefit: 'Bảo vệ da khỏi tia UV an toàn[1][6]' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">
        Phương pháp chăm sóc da nhạy cảm
      </Title>

      <Card className="mb-8">
        <Alert
          message="Đặc điểm da nhạy cảm"
          description={
            <ul className="list-disc pl-5 mt-2">
              <li>Dễ ửng đỏ và nóng rát khi thay đổi môi trường</li>
              <li>Phản ứng với thành phần mỹ phẩm thông thường</li>
              <li>Cảm giác châm chích khi dùng sản phẩm mới</li>
              <li>Xuất hiện mẩn đỏ không rõ nguyên nhân[1][4][5]</li>
            </ul>
          }
          type="warning"
          showIcon
        />
      </Card>

      <Title level={3} className="mb-4">
        <SkinOutlined className="mr-2" />
        Quy trình buổi sáng
      </Title>
      <Card className="mb-8">
        <Steps direction="vertical" current={-1} items={skincareMorningSteps} />
      </Card>

      <Title level={3} className="mb-4">
        <SkinOutlined className="mr-2" />
        Quy trình buổi tối
      </Title>
      <Card className="mb-8">
        <Steps direction="vertical" current={-1} items={skincareEveningSteps} />
      </Card>

      <Title level={3} className="mb-4">
        <BulbOutlined className="mr-2" />
        Nguyên tắc vàng cho da nhạy cảm
      </Title>
      <Card className="mb-8">
        <List
          dataSource={skincareTips}
          renderItem={(item) => <List.Item><Text>{item}</Text></List.Item>}
        />
      </Card>

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

      <Title level={3} className="mb-4">
        Tác nhân cần tránh
      </Title>
      <Card className="mb-8">
        <List
          dataSource={[
            'Sản phẩm chứa cồn denat hoặc hương liệu[1][3][7]',
            'Retinol/Tretinoin nồng độ cao[4][5]',
            'Tẩy da chết hóa học (AHA/BHA) quá 2%[3][5]',
            'Nước hoa và chất tạo màu tổng hợp[2][8]',
            'Thay đổi nhiệt độ đột ngột[2][7]',
          ]}
          renderItem={(item) => <List.Item><Text type="danger">{item}</Text></List.Item>}
        />
      </Card>
    </div>
  );
};

export default Sensitive;
