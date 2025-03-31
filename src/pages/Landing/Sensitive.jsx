import { Card, Steps, List, Tag, Alert, Typography, Divider, Space } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined, ShoppingOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Sensitive = () => {
  const skincareMorningSteps = [
    {
      title: 'Sữa rửa mặt dịu nhẹ',
      description: 'Dùng sữa rửa mặt không chứa xà phòng, chất tạo bọt. Massage bằng đầu ngón tay với nước ấm.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/12"><Tag color="green">Sữa rửa mặt Reihaku Hatomugi Facial Foam</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Toner không cồn',
      description: 'Sử dụng toner làm dịu chứa thành phần như trà xanh hoặc cúc La Mã.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/36"><Tag color="green">Nước hoa hồng không mùi Klairs Supple Preparation Unscented Toner</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Serum dưỡng ẩm',
      description: 'Thoa serum chứa Hyaluronic Acid hoặc Ceramide để phục hồi hàng rào bảo vệ da.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/14"><Tag color="green">Serum Dưỡng Ẩm Hyaluronic Acid</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Kem dưỡng ẩm',
      description: 'Chọn kem không mùi, kết cấu gel hoặc kem nhẹ có chứa Glycerin.',
    },
    {
      title: 'Kem chống nắng vật lý',
      description: 'Sử dụng SPF 30+ không chứa hóa chất gây kích ứng như Zinc Oxide.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/27"><Tag color="green">Kem Chống Nắng Dưỡng Ẩm SPF50+ PA+++</Tag></a>
            </Space>
          </div>
        </>
      )
    },
  ];

  const skincareEveningSteps = [
    {
      title: 'Tẩy trang dạng dầu',
      description: 'Dùng dầu tẩy trang gentle để loại bỏ bụi bẩn mà không gây căng da.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/11"><Tag color="green">Dầu tẩy trang DHC Deep Cleansing Oil làm sạch, dưỡng da mềm mịn</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Sữa rửa mặt',
      description: 'Lặp lại bước làm sạch buổi sáng.',
    },
    {
      title: 'Mặt nạ giấy dịu da',
      description: 'Đắp 1-2 lần/tuần mặt nạ chứa thành phần như yến mạch hoặc rau má.',
      // subTitle: (
      //   <>
      //     <ShoppingOutlined style={{ marginRight: 8 }} />
      //     <Text strong>Sản phẩm gợi ý:</Text>
      //     <div className="ml-4 mt-2">
      //       <Space>
      //         <a href="/product/31"><Tag color="green">Mặt Nạ Dr.Jart+ Cicapair Calming Mask</Tag></a>
      //       </Space>
      //     </div>
      //   </>
      // )
    },
    {
      title: 'Serum phục hồi',
      description: 'Dùng serum chứa Panthenol hoặc Centella Asiatica.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/18"><Tag color="green">Tinh Chất Dưỡng Da Vitamin C</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Kem dưỡng ban đêm',
      description: 'Chọn kem có kết cấu đặc hơn chứa Ceramide và Squalane.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/21"><Tag color="green">Kem Dưỡng Ẩm Ban Đêm Collagen</Tag></a>
            </Space>
          </div>
        </>
      )
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