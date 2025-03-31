import { Card, Steps, List, Tag, Alert, Typography, Divider, Space } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined, ShoppingOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Normal = () => {
  const skincareMorningSteps = [
    {
      title: 'Sữa rửa mặt',
      description: 'Rửa mặt với sữa rửa mặt dịu nhẹ để làm sạch da.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/12"><Tag color="blue">Sữa rửa mặt Reihaku Hatomugi Facial Foam</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Toner',
      description: 'Sử dụng toner cân bằng độ pH và làm dịu da.',
    },
    {
      title: 'Serum',
      description: 'Thoa serum chứa vitamin C để bảo vệ da khỏi tác động môi trường và chống oxy hóa.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/14"><Tag color="blue">Serum Dưỡng Ẩm Hyaluronic Acid</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Kem dưỡng ẩm',
      description: 'Dùng kem dưỡng ẩm phù hợp với da thường để duy trì độ ẩm cân bằng.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/27"><Tag color="blue">Kem Chống Nắng Dưỡng Ẩm SPF50+ PA+++</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Kem chống nắng',
      description: 'Thoa kem chống nắng với SPF tối thiểu 30 để bảo vệ da khỏi tia UV.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/27"><Tag color="blue">Kem Chống Nắng Dưỡng Trắng Bảo Vệ Chống Ánh Sáng Xanh Ceuticoz Uvicoz Lotion SPF50+ PA++++ </Tag></a>
            </Space>
          </div>
        </>
      )
    },
  ];

  const skincareEveningSteps = [
    {
      title: 'Tẩy trang',
      description: 'Sử dụng dầu tẩy trang hoặc nước tẩy trang nhẹ nhàng.',
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
      description: 'Rửa mặt để loại bỏ bụi bẩn và dầu thừa tích tụ trong ngày.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/6"><Tag color="blue">Tẩy Trang 2 Lớp Emmié by HappySkin 3 In 1 Bi-Phase Micellar Water</Tag></a>
            </Space>
          </div>
        </>
      )
    },
    {
      title: 'Toner',
      description: 'Sử dụng toner để cân bằng da và chuẩn bị cho các bước tiếp theo.',
    },
    {
      title: 'Serum',
      description: 'Sử dụng serum chứa các thành phần dưỡng ẩm như Hyaluronic Acid hoặc Peptide.',
    },
    {
      title: 'Kem dưỡng ẩm',
      description: 'Thoa kem dưỡng ẩm để khóa ẩm qua đêm.',
      subTitle: (
        <>
          <ShoppingOutlined style={{ marginRight: 8 }} />
          <Text strong>Sản phẩm gợi ý:</Text>
          <div className="ml-4 mt-2">
            <Space>
              <a href="/product/23"><Tag color="blue">Kem Dưỡng Mắt Chống Nhăn Peptide</Tag></a>
            </Space>
          </div>
        </>
      )
    },
  ];

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
    {
      name: 'Hyaluronic Acid',
      benefit: 'Dưỡng ẩm sâu và giữ nước cho da',
    },
    {
      name: 'Vitamin C',
      benefit: 'Chống oxy hóa và làm sáng da',
    },
    {
      name: 'Vitamin E',
      benefit: 'Bảo vệ da và dưỡng ẩm',
    },
    {
      name: 'Peptide',
      benefit: 'Hỗ trợ tái tạo da và chống lão hóa',
    },
    {
      name: 'Ceramide',
      benefit: 'Tăng cường hàng rào bảo vệ da',
    },
  ];

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