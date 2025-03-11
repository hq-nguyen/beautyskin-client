import { useEffect, useState } from 'react';
import {
  Input, Button, Form, Select, Row, Col, Image, Upload, message, DatePicker, InputNumber, Card, Typography, Space
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ProductModel.css';
import { addProduct } from '../../../apis/product';
import uploadFile from '../../../utils/upload';
import dayjs from 'dayjs';
import { ProductAttributeService } from '../../../apis/productAttribute';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const AddProductPage = () => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [forms, setForms] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinConcerns, setSkinConcerns] = useState([]);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    const cate = await ProductAttributeService.getCategories();
    setCategories(cate);
  };
  const fetchForms = async () => {
    const text = await ProductAttributeService.getTextures();
    setForms(text);
  };
  const fetchSkinTypes = async () => {
    const skinTypes = await ProductAttributeService.getSkinType();
    setSkinTypes(skinTypes);
  };
  const fetchSkinConcerns = async () => {
    const skinConcerns = await ProductAttributeService.getConcern();
    setSkinConcerns(skinConcerns);
  };
  const fetchTags = async () => {
    const tags = await ProductAttributeService.getTags();
    setTags(tags);
  };

  useEffect(() => {
    fetchCategories();
    fetchForms();
    fetchSkinTypes();
    fetchSkinConcerns();
    fetchTags();
  }, []);

  const handleSave = async () => {
    form
      .validateFields().then(async (values) => {
        setLoading(true);

        try {
          // Upload images to Firebase Storage
          const imageUrls = await Promise.all(
            fileList.map(async (file) => {
              const url = await uploadFile(file.originFileObj);
              return url;
            })
          );

          const imageIds = await Promise.all(
            imageUrls.map(async (url) => {
              const res = await ProductAttributeService.uploadImage({ url: url });
              return res.id;
            })
          )

          // Get current date for default values
          const currentDate = new Date().toISOString();

          // Format the data according to the new schema
          const productData = {
            name: values.name,
            description: values.description,
            stock: parseInt(values.stock) || 0,
            createDateTime: currentDate,
            lastUpdateDateTime: currentDate,
            expiredDateTime: values.expiredDateTime ? values.expiredDateTime.toISOString() : null,
            status: "AVAILABLE",
            instruction: values.instruction || "",
            categoryId: values.categoryId || [],
            price: parseFloat(values.price) || 0,
            ingredient: values.ingredient || "",
            skinTypeId: values.skinTypeId || [],
            skinConcernId: values.skinConcernId || [],
            tagId: values.tagId || [],
            routineSteps: values.routineSteps || [],
            formIds: values.formIds ? [values.formIds] : [],
            images: imageIds, 
            promotions: [],
            deleted: false
          };

          await addProduct(productData);

          message.success('Đã thêm thành công sản phẩm!');
          form.resetFields();
          setFileList([]);
          navigate('/admin/list-products');
        } catch (error) {
          message.error(error.message || 'Thêm sản phẩm thất bại.');
        } finally {
          setLoading(false);
        }
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
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

  const handleCancel = () => {
    navigate('/admin/list-products');
  };

  const disabledDate = (current) => {
    return current && current < dayjs().startOf('day');
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ],
  };
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'link', 'image'
  ];

  return (
    <div className="p-4">
      <Title level={2} className="mb-4">Thêm sản phẩm</Title>
      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%' }}
        initialValues={{
          stock: 0,
          price: 0
        }}
      >
        <Row gutter={[24, 24]}>
          {/* Column 1 */}
          <Col xs={24} md={12}>
            <Card title={<Title level={4}>Thông tin cơ bản</Title>} bordered={false}>
              <Form.Item label="Tên sản phẩm" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Mô tả sản phẩm" name="description" rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}>
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  style={{ height: '200px', marginBottom: '60px' }}
                />
              </Form.Item>
              <Row gutter={[24, 0]}>
                <Col xs={24} md={8}>
                  <Form.Item label="Danh mục" name="categoryId" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                    <Select mode='single'>
                      {categories.map((category) => (
                        <Option key={category.id} value={category.id}>{category.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                {/* <Col xs={24} md={12}>
                  <Form.Item label="Loại da" name="skinTypeId">
                    <Select mode="multiple">
                      {skinTypes.map((skinType) => (
                        <Select.Option key={skinType.id} value={skinType.id}>{skinType.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col> */}

                <Col xs={24} md={8}>
                  <Form.Item label="Giá tiền" name="price" rules={[{ required: true, message: 'Vui lòng nhập giá tiền!' }]}>
                    <InputNumber
                      style={{ width: '100%' }}
                      formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Thành phần" name="ingredient">
                <TextArea rows={4} />
              </Form.Item>
            </Card>
          </Col>

          {/* Column 2 */}
          <Col xs={24} md={12}>
            <Card title={<Title level={4}>Chi tiết sản phẩm</Title>} bordered={false}>
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Số lượng sản phẩm" name="stock" rules={[{ required: true, message: 'Vui lòng nhập tồn kho!' }]}>
                    <Input type="number" min={0} />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    name="expiredDateTime"
                    label="Hạn sử dụng"
                    rules={[
                      {
                        validator: (_, value) => {
                          if (value && value < dayjs().startOf('day')) {
                            return Promise.reject('Ngày hết hạn không thể trước ngày hiện tại!');
                          }
                          return Promise.resolve();
                        }
                      }
                    ]}
                  >
                    <DatePicker
                      style={{ width: '100%' }}
                      format="DD/MM/YYYY"
                      disabledDate={disabledDate}
                      placeholder="Chọn hạn sử dụng"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Hướng dẫn sử dụng" name="instruction">
                <ReactQuill
                  theme="snow"
                  modules={modules}
                  formats={formats}
                  style={{ height: '200px', marginBottom: '60px' }}
                />
              </Form.Item>
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item label="Cấu trúc sản phẩm" name="formIds">
                    <Select>
                      {forms.map((form) => (
                        <Select.Option key={form.id} value={form.id}>{form.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Loại da" name="skinTypeId">
                    <Select mode="multiple">
                      {skinTypes.map((skinType) => (
                        <Select.Option key={skinType.id} value={skinType.id}>{skinType.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[24, 0]}>
                <Col xs={24} md={12}>
                  <Form.Item name="skinConcernId" label="Vấn đề da">
                    <Select mode="multiple">
                      {skinConcerns.map((skinConcern) => (
                        <Select.Option key={skinConcern.id} value={skinConcern.id}>{skinConcern.name}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="Tags" name="tagId">
                    <Select mode="multiple">
                      {tags.map((tag) => (
                        <Option key={tag.id} value={tag.id}>{tag.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

            </Card>
          </Col>

          {/* Image Upload (Full Width) */}
          <Col xs={24}>
            <Card title={<Title level={4}>Hình ảnh sản phẩm</Title>} bordered={false}>
              <Form.Item>
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
              </Form.Item>
            </Card>
          </Col>

          {/* Buttons (Full Width) */}
          <Col xs={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" onClick={handleSave} loading={loading}>Lưu</Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default AddProductPage;