import { Card, Steps, List, Tag, Alert, Typography, Divider, Space, Spin } from 'antd';
import { SkinOutlined, ExperimentOutlined, BulbOutlined, ShoppingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getRoutineBySkinType } from '../../apis/routine';
import { ProductAttributeService } from '../../apis/productAttribute';
import { useParams } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

const SkinTypeRoutine = ({ skinTypeKey: propSkinTypeKey }) => {
  const params = useParams();
  const skinTypeKey = propSkinTypeKey || params.skinTypeKey || 'normal';
  
  const [skincareRoutine, setSkincareRoutine] = useState([]);
  const [skinTypeInfo, setSkinTypeInfo] = useState(null);
  const [routineInfo, setRoutineInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skinTypes, setSkinTypes] = useState({});

  // mapping key to id
  useEffect(() => {
    const fetchSkinTypes = async () => {
      try {
        setLoading(true);
        const types = await ProductAttributeService.getSkinType();
        
        const typeMap = {};
        types.forEach(type => {
          const key = type.name
            .toLowerCase()
            .replace('da ', '')  
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") 
            .replace(/\s+/g, ''); 
          
          typeMap[key] = type.id;
          
          if (key.includes('thuong') || key.includes('normal')) typeMap['normal'] = type.id;
          if (key.includes('dau') || key.includes('oily')) typeMap['oily'] = type.id;
          if (key.includes('kho') || key.includes('dry')) typeMap['dry'] = type.id;
          if (key.includes('nhay') || key.includes('sensitive')) typeMap['sensitive'] = type.id;
          if (key.includes('hon') || key.includes('combination')) typeMap['combination'] = type.id;
        });
        
        setSkinTypes(typeMap);
      } catch (error) {
        console.error('Error fetching skin types:', error);
        setError('Không thể tải danh sách loại da. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkinTypes();
  }, []);

  useEffect(() => {
    const fetchSkincareRoutine = async () => {
      if (Object.keys(skinTypes).length === 0) {
        return;
      }
      const skinTypeId = skinTypes[skinTypeKey];
      if (!skinTypeId) {
        setError(`Không tìm thấy loại da "${skinTypeKey}". Vui lòng chọn loại da khác.`);
        return;
      }

      try {
        setLoading(true);
        const data = await getRoutineBySkinType(skinTypeId);
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
  }, [skinTypes, skinTypeKey]);

  const skinTypeData = {
    dry: {
      tips: [
        'Uống đủ nước mỗi ngày',
        'Sử dụng máy tạo độ ẩm trong phòng',
        'Tránh tắm nước quá nóng',
        'Tẩy tế bào chết nhẹ nhàng 1 lần/tuần',
        'Sử dụng mặt nạ dưỡng ẩm 1-2 lần/tuần',
        'Bảo vệ da khỏi gió và lạnh',
        'Ăn thực phẩm giàu omega-3 và vitamin E',
      ],
      ingredients: [
        { name: 'Hyaluronic Acid', benefit: 'Cấp ẩm sâu và giữ nước cho da' },
        { name: 'Glycerin', benefit: 'Giữ ẩm và làm mềm da' },
        { name: 'Ceramide', benefit: 'Tăng cường hàng rào bảo vệ da' },
        { name: 'Shea Butter', benefit: 'Dưỡng ẩm và làm dịu da' },
        { name: 'Squalane', benefit: 'Dưỡng ẩm và phục hồi da' },
      ],
      avoidItems: [
        'Sản phẩm chứa cồn hoặc hương liệu mạnh',
        'Rửa mặt quá nhiều lần trong ngày',
        'Tắm nước quá nóng',
        'Bỏ qua bước dưỡng ẩm',
        'Sử dụng sản phẩm tẩy tế bào chết mạnh',
      ],
      color: 'orange',
      alertType: 'success',
      characteristics: [
        'Da thường xuyên cảm thấy căng và khô',
        'Lỗ chân lông nhỏ',
        'Da dễ bị bong tróc và nứt nẻ',
        'Ít dầu và dễ bị kích ứng',
      ],
      maintenance: (
        <>
          <Paragraph>
            Da khô cần được chăm sóc đặc biệt để duy trì độ ẩm và ngăn ngừa tình trạng bong tróc. Hãy chú ý đến việc dưỡng ẩm và bảo vệ da khỏi các yếu tố môi trường.
          </Paragraph>
          <Paragraph>
            <strong>Lưu ý quan trọng:</strong> Trong mùa đông, da khô có thể trở nên nhạy cảm hơn, vì vậy hãy tăng cường dưỡng ẩm và bảo vệ da khỏi gió lạnh.
          </Paragraph>
        </>
      )
    },
    normal: {
      tips: [
        'Duy trì chế độ chăm sóc da đều đặn',
        'Uống đủ nước mỗi ngày',
        'Tẩy tế bào chết 1-2 lần/tuần',
        'Sử dụng mặt nạ dưỡng ẩm 1-2 lần/tuần',
        'Bảo vệ da khỏi ánh nắng mặt trời',
        'Ăn nhiều trái cây và rau xanh',
        'Ngủ đủ giấc mỗi đêm',
      ],
      ingredients: [
        { name: 'Hyaluronic Acid', benefit: 'Dưỡng ẩm sâu và giữ nước cho da' },
        { name: 'Vitamin C', benefit: 'Chống oxy hóa và làm sáng da' },
        { name: 'Vitamin E', benefit: 'Bảo vệ da và dưỡng ẩm' },
        { name: 'Peptide', benefit: 'Hỗ trợ tái tạo da và chống lão hóa' },
        { name: 'Ceramide', benefit: 'Tăng cường hàng rào bảo vệ da' },
      ],
      avoidItems: [
        'Sản phẩm quá mạnh hoặc gây kích ứng',
        'Thay đổi sản phẩm quá thường xuyên',
        'Bỏ qua bước chống nắng',
        'Sử dụng quá nhiều sản phẩm cùng lúc',
        'Chạm tay lên mặt quá nhiều',
      ],
      color: 'blue',
      alertType: 'success',
      characteristics: [
        'Da không quá khô hoặc quá dầu',
        'Lỗ chân lông nhỏ và khó nhìn thấy',
        'Ít gặp vấn đề về mụn',
        'Độ ẩm và dầu cân bằng',
        'Da mềm mại, mịn màng và có độ đàn hồi tốt',
      ],
      maintenance: (
        <>
          <Paragraph>
            Da thường là loại da lý tưởng mà nhiều người mong muốn có được. Tuy nhiên, để duy trì làn da khỏe mạnh, bạn vẫn cần chăm sóc đều đặn và bảo vệ da khỏi các tác động môi trường.
          </Paragraph>
          <Paragraph>
            <strong>Lưu ý quan trọng:</strong> Mặc dù da thường ít gặp vấn đề, nhưng vẫn cần chú ý đến những thay đổi theo mùa. Vào mùa đông, da có thể cần thêm độ ẩm, trong khi mùa hè có thể cần sản phẩm nhẹ hơn và chống nắng tốt hơn.
          </Paragraph>
        </>
      )
    },
    oily: {
      tips: [
        'Rửa mặt 2 lần/ngày, không rửa quá nhiều',
        'Sử dụng sản phẩm không chứa dầu (oil-free)',
        'Tẩy tế bào chết 1-2 lần/tuần',
        'Luôn giữ tay sạch sẽ và tránh chạm vào mặt',
        'Sử dụng giấy thấm dầu thay vì lau bằng khăn',
        'Uống đủ nước và ăn thực phẩm ít dầu mỡ',
        'Giữ sạch gối ngủ và điện thoại',
      ],
      ingredients: [
        { name: 'Niacinamide', benefit: 'Kiểm soát dầu và làm se lỗ chân lông' },
        { name: 'Salicylic Acid', benefit: 'Làm sạch sâu lỗ chân lông' },
        { name: 'Tea Tree Oil', benefit: 'Kháng khuẩn và kiểm soát dầu nhờn' },
        { name: 'Hyaluronic Acid', benefit: 'Cung cấp độ ẩm không gây nhờn' },
        { name: 'Clay', benefit: 'Hút dầu thừa và làm sạch da' },
      ],
      avoidItems: [
        'Sản phẩm chứa nhiều dầu hoặc quá đặc',
        'Rửa mặt quá nhiều lần (hơn 2 lần/ngày)',
        'Bỏ qua bước dưỡng ẩm',
        'Ăn nhiều thực phẩm cay nóng và nhiều dầu mỡ',
        'Sử dụng sản phẩm chứa cồn nồng độ cao',
      ],
      color: 'blue',
      alertType: 'success',
      characteristics: [
        'Da bóng dầu, đặc biệt ở vùng chữ T',
        'Lỗ chân lông to và dễ nhìn thấy',
        'Dễ bị mụn và mụn đầu đen',
        'Trang điểm dễ bị trôi',
        'Da có vẻ dày hơn và ít nếp nhăn hơn',
      ],
      maintenance: (
        <>
          <Paragraph>
            Da dầu cần chế độ chăm sóc đặc biệt để kiểm soát lượng dầu nhờn tiết ra, nhưng vẫn phải đảm bảo cung cấp đủ độ ẩm. Bạn không nên rửa mặt quá nhiều lần vì sẽ khiến da tiết dầu nhiều hơn.
          </Paragraph>
          <Paragraph>
            <strong>Lưu ý quan trọng:</strong> Vào mùa hè, da dầu có thể tiết dầu nhiều hơn, vì vậy nên sử dụng sản phẩm dạng gel hoặc lotion nhẹ thay vì kem đậm đặc.
          </Paragraph>
        </>
      )
    },
    combination: {
      tips: [
        'Sử dụng sản phẩm khác nhau cho các vùng da khác nhau',
        'Tập trung sản phẩm kiểm soát dầu ở vùng chữ T',
        'Dưỡng ẩm nhiều hơn ở vùng má',
        'Tẩy tế bào chết 1-2 lần/tuần',
        'Cân bằng độ pH của da bằng toner không cồn',
        'Bảo vệ da khỏi ánh nắng mặt trời',
        'Sử dụng mặt nạ đất sét cho vùng chữ T và mặt nạ dưỡng ẩm cho vùng má',
      ],
      ingredients: [
        { name: 'Niacinamide', benefit: 'Cân bằng dầu và độ ẩm' },
        { name: 'Hyaluronic Acid', benefit: 'Cung cấp độ ẩm không gây nhờn' },
        { name: 'Vitamin B5', benefit: 'Cân bằng độ ẩm và phục hồi da' },
        { name: 'Zinc', benefit: 'Kiểm soát dầu và làm dịu da' },
        { name: 'AHA/BHA', benefit: 'Tẩy tế bào chết nhẹ nhàng' },
      ],
      avoidItems: [
        'Sản phẩm quá dầu hoặc quá khô',
        'Thành phần gây kích ứng mạnh',
        'Tẩy tế bào chết quá nhiều',
        'Sử dụng cùng một sản phẩm cho toàn bộ khuôn mặt',
        'Bỏ qua bước cân bằng da sau khi rửa mặt',
      ],
      color: 'purple',
      alertType: 'success',
      characteristics: [
        'Vùng chữ T (trán, mũi, cằm) tiết dầu nhiều',
        'Vùng má khô hoặc bình thường',
        'Lỗ chân lông to ở vùng chữ T',
        'Lỗ chân lông nhỏ hơn ở vùng má',
        'Dễ bị mụn ở vùng chữ T',
      ],
      maintenance: (
        <>
          <Paragraph>
            Da hỗn hợp cần phương pháp chăm sóc kết hợp, tập trung kiểm soát dầu ở vùng chữ T và dưỡng ẩm ở vùng má. Lý tưởng nhất là sử dụng các sản phẩm khác nhau cho từng vùng.
          </Paragraph>
          <Paragraph>
            <strong>Lưu ý quan trọng:</strong> Da hỗn hợp có thể thay đổi theo mùa, nên điều chỉnh quy trình chăm sóc da theo điều kiện thời tiết và tình trạng da.
          </Paragraph>
        </>
      )
    },
    sensitive: {
      tips: [
        'Sử dụng sản phẩm ít thành phần và không chứa hương liệu',
        'Thử nghiệm sản phẩm mới trên một vùng da nhỏ',
        'Tránh các thành phần gây kích ứng như cồn, hương liệu, màu nhân tạo',
        'Bảo vệ da khỏi ánh nắng mặt trời',
        'Tránh thay đổi sản phẩm quá thường xuyên',
        'Rửa mặt bằng nước ấm, không quá nóng hoặc quá lạnh',
        'Vỗ nhẹ khăn lên mặt thay vì chà xát',
      ],
      ingredients: [
        { name: 'Aloe Vera', benefit: 'Làm dịu và giảm viêm' },
        { name: 'Chamomile', benefit: 'Làm dịu và giảm kích ứng' },
        { name: 'Centella Asiatica', benefit: 'Phục hồi và bảo vệ da' },
        { name: 'Oatmeal', benefit: 'Làm dịu và chống viêm' },
        { name: 'Ceramide', benefit: 'Tăng cường hàng rào bảo vệ da' },
      ],
      avoidItems: [
        'Cồn và hương liệu nhân tạo',
        'Các sản phẩm có tính acid mạnh',
        'Tẩy tế bào chết quá mạnh',
        'Sản phẩm có nhiều thành phần hoạt tính',
        'Tiếp xúc với nhiệt độ cực đoan',
      ],
      color: 'red',
      alertType: 'success',
      characteristics: [
        'Da dễ bị đỏ và kích ứng',
        'Cảm giác ngứa, rát, bỏng khi sử dụng sản phẩm',
        'Da khô, căng hoặc bong tróc',
        'Nhạy cảm với thay đổi thời tiết',
        'Dễ bị mẩn đỏ khi tiếp xúc với nhiệt',
      ],
      maintenance: (
        <>
          <Paragraph>
            Da nhạy cảm cần được chăm sóc đặc biệt nhẹ nhàng và sử dụng các sản phẩm ít thành phần, không chứa hương liệu. Luôn theo dõi phản ứng của da sau khi sử dụng sản phẩm mới.
          </Paragraph>
          <Paragraph>
            <strong>Lưu ý quan trọng:</strong> Tránh sử dụng quá nhiều sản phẩm cùng lúc và luôn thử nghiệm sản phẩm mới trên một vùng da nhỏ trước khi sử dụng cho toàn bộ mặt.
          </Paragraph>
        </>
      )
    },
  };

  const currentSkinTypeData = skinTypeData[skinTypeKey] || skinTypeData.normal;
  
  const tagColor = currentSkinTypeData.color;
  const alertType = currentSkinTypeData.alertType;
  const skincareTips = currentSkinTypeData.tips;
  const ingredients = currentSkinTypeData.ingredients;
  const thingsToAvoid = currentSkinTypeData.avoidItems;
  const characteristics = currentSkinTypeData.characteristics;
  const maintenanceContent = currentSkinTypeData.maintenance;

  if (loading && Object.keys(skinTypes).length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">
        {routineInfo?.name || `Phương pháp chăm sóc cho ${skinTypeInfo?.type || 'da ' + skinTypeKey}`}
      </Title>

      {/* Overview Section */}
      <Card className="mb-8">
        <Alert
          message={`Đặc điểm ${skinTypeInfo?.type || 'da ' + skinTypeKey}`}
          description={
            <ul className="list-disc pl-5 mt-2">
              {characteristics.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          }
          type={alertType}
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
          <div className="py-8 text-center">
            <Spin tip="Đang tải quy trình chăm sóc da..." />
          </div>
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
                                  <Tag color={tagColor}>{product.name}</Tag>
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
          </>
        ) : (
          <Paragraph>Không có quy trình chăm sóc da nào được tìm thấy.</Paragraph>
        )}
      </Card>

      <Title level={3} className="mb-4">
        <BulbOutlined className="mr-2" />
        Lời khuyên cho {skinTypeInfo?.type || 'da ' + skinTypeKey}
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
                title={<Tag color={tagColor}>{item.name}</Tag>}
                description={item.benefit}
              />
            </List.Item>
          )}
        />
      </Card>

      <Title level={3} className="mb-4">
        Những điều nên tránh
      </Title>
      <Card className="mb-8">
        <List
          dataSource={thingsToAvoid}
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
        {maintenanceContent}
      </Card>
    </div>
  );
};

export default SkinTypeRoutine;

// Export each skin type 
export const Dry = () => <SkinTypeRoutine skinTypeKey="dry" />;
export const Normal = () => <SkinTypeRoutine skinTypeKey="normal" />;
export const Oily = () => <SkinTypeRoutine skinTypeKey="oily" />;
export const Combination = () => <SkinTypeRoutine skinTypeKey="combination" />;
export const Sensitive = () => <SkinTypeRoutine skinTypeKey="sensitive" />;