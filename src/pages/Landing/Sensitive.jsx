import { Card, Steps, List, Tag, Alert, Typography, Divider, Space } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined, ShoppingOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Sensitive = () => {
  // Dữ liệu tĩnh thay vì fetch từ API
  const skincareSteps = [
    {
      steporder: 1,
      stepname: 'Tẩy trang cho da nhạy cảm',
      description:
        'Cũng giống như các loại da khác, da nhạy cảm cũng cần được “thở”, được làm sạch và thông thoáng lỗ chân lông. Vệ sinh da cẩn thận là tiền đề quyết định hiệu quả của các dưỡng chất được hấp thụ vào da ở các bước chăm sóc sau đó. Bạn nên chọn sản phẩm tẩy trang dịu nhẹ, không chứa hương liệu, các chất tẩy rửa mạnh và cồn xấu gây mất cân bằng da.',
      products: [
        { id: 11, name: 'Dầu tẩy trang DHC Deep Cleansing Oil làm sạch, dưỡng da mềm mịn' },
      ],
    },
    {
      steporder: 2,
      stepname: 'Sữa rửa mặt cho da nhạy cảm',
      description:
        'Dùng sữa rửa mặt không chứa xà phòng, chất tạo bọt. Massage nhẹ nhàng bằng đầu ngón tay với nước ấm để làm sạch da mà không gây kích ứng.',
      products: [
        { id: 12, name: 'Sữa rửa mặt Reihaku Hatomugi Facial Foam' },
      ],
    },
    {
      steporder: 3,
      stepname: 'Nước cân bằng cho da nhạy cảm (Toner)',
      description:
        'Sử dụng toner làm dịu chứa thành phần như trà xanh hoặc cúc La Mã để cân bằng độ pH và làm dịu da sau bước làm sạch.',
      products: [
        { id: 36, name: 'Nước hoa hồng không mùi Klairs Supple Preparation Unscented Toner' },
      ],
    },
    {
      steporder: 4,
      stepname: 'Tinh chất dưỡng cho da nhạy cảm (Serum)',
      description:
        'Thoa serum chứa Hyaluronic Acid hoặc Ceramide để phục hồi hàng rào bảo vệ da và cung cấp độ ẩm cần thiết.',
      products: [
        { id: 14, name: 'Serum Dưỡng Ẩm Hyaluronic Acid' },
      ],
    },
    {
      steporder: 5,
      stepname: 'Kem dưỡng cho da nhạy cảm',
      description:
        'Chọn kem không mùi, kết cấu gel hoặc kem nhẹ có chứa Glycerin để khóa ẩm và bảo vệ da suốt cả ngày.',
      products: [
        { id: 21, name: 'Kem Dưỡng Ẩm Ban Đêm Collagen' },
      ],
    },
    {
      steporder: 6,
      stepname: 'Kem chống nắng cho da nhạy cảm',
      description:
        'Sử dụng kem chống nắng vật lý SPF 30+ không chứa hóa chất gây kích ứng như Zinc Oxide để bảo vệ da khỏi tia UV.',
      products: [
        { id: 27, name: 'Kem Chống Nắng Dưỡng Ẩm SPF50+ PA+++' },
      ],
    },
  ];

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

  // Render product suggestions
  const renderProductSuggestion = (products) => {
    if (!products || products.length === 0) return null;
    return (
      <div className="mt-2">
        <Space align="start">
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <div>
            <Text strong>Sản phẩm gợi ý:</Text>
            <div className="mt-1">
              <Space>
                {products.map((product) => (
                  <a key={product.id} href={`/product/${product.id}`}>
                    <Tag color="green">{product.name}</Tag>
                  </a>
                ))}
              </Space>
            </div>
          </div>
        </Space>
      </div>
    );
  };

  // Format steps for Ant Design Steps component
  const formattedSteps = skincareSteps.map((step) => ({
    title: `Bước ${step.steporder}: ${step.stepname}`,
    description: (
      <>
        <Paragraph>{step.description}</Paragraph>
        {renderProductSuggestion(step.products)}
      </>
    ),
  }));

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

      {/* Skincare Steps */}
      <Title level={3} className="mb-4">
        <SkinOutlined className="mr-2" />
        Các bước chăm sóc da nhạy cảm
      </Title>
      <Card className="mb-8">
        {skincareSteps.length > 0 ? (
          <>
            <Steps direction="vertical" current={-1} items={formattedSteps} />
            <Divider />
            <Alert
              message="Lưu ý"
              description="Nhấp vào sản phẩm để xem chi tiết. Hãy điều chỉnh thứ tự hoặc bỏ qua các bước tùy theo nhu cầu và tình trạng da của bạn."
              type="info"
              showIcon
            />
          </>
        ) : (
          <Alert message="No steps available" type="info" showIcon />
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