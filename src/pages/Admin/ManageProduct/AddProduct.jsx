import { useState, useEffect } from 'react';
import { Input, Button, Form, Checkbox, Select, Row, Col, Image, Upload, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './ProductModel.css'; // Reuse the same CSS for consistent styling
import { addProduct } from '../../../apis/product';
import uploadFile from '../../../utils/upload';

const { TextArea } = Input;

const AddProductPage = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use useNavigate for navigation
  useEffect(() => {
    // console.log("fileList changed:", fileList);
    // Debugging
  }, [fileList]);

  const handleSave = async () => {

    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);

        try {
          // Upload images to Firebase Storage
          const imageUrls = await Promise.all(
            fileList.map(async (file) => {
              const url = await uploadFile(file.originFileObj); // Assuming uploadFile returns a single URL
              return url;
            })
          );

          // Add the image URLs to the values object
          const productData = { ...values, images: imageUrls };  // Use "images" to match your API

          // Call the addProduct API with the complete product data
          const newProduct = await addProduct(productData);
          
          message.success('Đã thêm thành công sản phẩm!');
          form.resetFields(); // Clear the form after successful add
          setFileList([]); // Clear image list
          navigate('/admin/list-products'); // Redirect to manage product page
        } catch (error) {
          message.error(error.message || 'Thêm sản phẩm thất bại.');
        } finally {
          setLoading(false);
        }
        console.log('Received values:', values);

      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });


  };

  // upload image handler
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // const [fileList, setFileList] = useState([
  //   {
  //     uid: '-1',
  //     name: 'image.png',
  //     status: 'done',
  //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  //   },
  // ]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    console.log("New fileList:", newFileList); // Debugging
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: 'none',
        cursor: 'pointer',
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  // const uploadImage = async (options) => {
  //   const { onSuccess, onError, file } = options;
  //   const formData = new FormData();
  //   formData.append("image", file);

  //   try {
  //     const res = await uploadFile(file);

  //     if (res.data.success) {
  //       form.setFieldsValue({ imageUrl: res.data.imageUrl });
  //       setFileList([{
  //         uid: '-1',
  //         name: file.name,
  //         status: 'done',
  //         url: res.data.imageUrl,
  //       }]);
  //       onSuccess("Ok");
  //     } else {
  //       onError("Upload failed");
  //       message.error("Upload failed: " + res.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     onError("Upload failed");
  //     message.error("Upload failed: " + error.message);
  //   }
  // };

  // const handleImageRemove = () => {
  //   form.setFieldsValue({ imageUrl: null });
  //   setFileList([]);
  // };

  // const customRequest = (options) => {
  //   uploadImage(options);
  // };

  const handleCancel = () => {
    navigate('/admin/list-products'); // Redirect to manage product page
  };

  return (
    <div className="p-4">
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-2xl font-bold mb-4 text-black">Thêm sản phẩm</h1>
      </div>
      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%' }}
      >
        <div className="product-model-content">
          <div className="flex flex-wrap" style={{ width: '100%' }}>
            {/* Basic information */}
            <div style={{ width: '60%', padding: '20px' }}>
              <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>

              <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                <Input />
              </Form.Item>

              <Form.Item label="Mô tả sản phẩm" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}>
                <TextArea rows={4} />
              </Form.Item>

              <Form.Item label="Hướng dẫn sử dụng" name="usageInstruction">
                <TextArea rows={4} />
              </Form.Item>

              {/* Categories */}
              <Form.Item label="Danh mục" name="category">
                <Checkbox.Group>
                  <Row>
                    {['Chăm sóc da', 'Makeup', 'Đặc trị', 'Dưỡng da', 'Thiết bị'].map((cat) => (
                      <Col span={8} key={cat}>
                        <Checkbox value={cat}>{cat}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              {/* Brand */}
              <Form.Item label="Thương hiệu" name="brand">
                <Select>
                  {['Brand A', 'Brand B', 'Brand C', 'Brand D'].map((brand) => (
                    <Select.Option key={brand} value={brand}>
                      {brand}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Price */}
              <Form.Item label="Giá tiền" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}>
                <Input type="number" />
              </Form.Item>

              {/* Status */}
              <Form.Item label="Trạng thái" name="status">
                <Select>
                  <Select.Option value="còn hàng">Còn hàng</Select.Option>
                  <Select.Option value="hết hàng">Hết hàng</Select.Option>
                </Select>
              </Form.Item>

              {/* Tags */}
              <Form.Item label="Tags" name="tag">
                <Checkbox.Group>
                  <Row>
                    {['Sản phẩm mới', 'Bán chạy', 'Hàng giới hạn', 'Phổ biến', 'Mềm', 'Mùi thơm'].map((tag) => (
                      <Col span={8} key={tag}>
                        <Checkbox value={tag}>{tag}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>
            </div>

            {/* Specific details */}
            <div style={{ width: '40%', padding: '20px' }}>
              <h3 className="text-lg font-semibold">Chi tiết cụ thể</h3>

              {/* Volume */}
              <Form.Item label="Dung tích (hoặc khối lượng)" name="capacity">
                <Checkbox.Group>
                  <Row>
                    {['100ml', '80ml', '100g', '80g'].map((tag) => (
                      <Col span={8} key={tag}>
                        <Checkbox value={tag}>{tag}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              {/* Type of skin */}
              <Form.Item label="Loại da" name="skin_type">
                <Checkbox.Group>
                  <Row>
                    {['Da dầu', 'Da khô', 'Da tổng hợp', 'Da thường'].map((type) => (
                      <Col className='mr-4' span={8} key={type}>
                        <Checkbox value={type}>{type}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item name="skinConcern" label="Vấn đề da">
                <Checkbox.Group>
                  <Row>
                    {['Da mụn', 'Da lão hóa', 'Da lỗ chân lông', 'Da có nếp nhăn'].map((type) => (
                      <Col className="mr-4" span={10} key={type}>
                        <Checkbox value={type}>{type}</Checkbox>
                      </Col>
                    ))}
                  </Row>
                </Checkbox.Group>
              </Form.Item>

              <Form.Item
                name="ingredients"
                label="Thành phần"
              >
                <Input />
              </Form.Item>

              <Form.Item name="texture" label="Chất liệu">
                <Select>
                  {['Dạng dung dịch', 'Dạng kem', 'Serum', 'Tạo bọt', 'Kết cấu gel'].map((texture) => (
                    <Select.Option key={texture} value={texture}>
                      {texture}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item name="origin" label="Xuất xứ">
                    <Select>
                        {['Hàn Quốc', 'Trung Quốc', 'Việt Nam', 'Ấn Độ', 'Singapore', 'England', 'US'].map((origin) => (
                            <Select.Option key={origin} value={origin}>
                                {origin}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

              {/* stock */}
              <Form.Item label="Số lượng sản phẩm" name="stock" rules={[{ required: true, message: 'Vui lòng nhập tồn kho!' }]}>
                <Input type="number" />
              </Form.Item>
            </div>

            {/* upload image */}
            <div style={{ width: '100%', padding: '20px' }}>
              <h3 className="text-lg font-semibold">Hình ảnh sản phẩm</h3>

              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                onPreview={handlePreview}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{
                    display: 'none',
                  }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) => !visible && setPreviewImage(''),
                  }}
                  src={previewImage}
                />
              )}

            </div>
            <div style={{ width: '100%', padding: '20px', textAlign: 'right' }}>
              <Button type="primary" onClick={handleSave} loading={loading}>Lưu</Button>
              <Button onClick={handleCancel} style={{ marginLeft: 8 }}>Hủy</Button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AddProductPage;
