import { useEffect, useState } from 'react';
import {
  Input, Button, Form, Select, Row, Col, Image, Upload, message, DatePicker, InputNumber, Modal, Space
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { updateProduct } from '../../../apis/product';
import uploadFile from '../../../utils/upload';
import dayjs from 'dayjs';
import { ProductAttributeService } from '../../../apis/productAttribute';

const { TextArea } = Input;
const { Option } = Select;

const ProductModel = ({ product, onSave, onCancel, visible }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [forms, setForms] = useState([]);
  const [skinTypes, setSkinTypes] = useState([]);
  const [skinConcerns, setSkinConcerns] = useState([]);
  const [tags, setTags] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [promotionType, setPromotionType] = useState('input');

  const fetchCategories = async () => {
    const cate = await ProductAttributeService.getCategories();
    setCategories(cate);
  };

  const fetchForms = async () => {
    const form = await ProductAttributeService.getTextures();
    setForms(form);
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

  // Initialize form values when product changes
  useEffect(() => {
    if (product && visible) {
      form.setFieldsValue({
        name: product.name,
        description: product.description,
        stock: product.stock,
        price: product.price,
        promotion: product.promotion || 0,
        ingredient: product.ingredient,
        instruction: product.instruction,
        categoryId: product.categoryId || (product.category ? product.category.id : null),
        expiredDateTime: product.expiredDateTime ? dayjs(product.expiredDateTime) : null,
        status: product.status || "AVAILABLE",
        skinTypeId: product.skinTypes?.map(type => type.id) || [],
        skinConcernId: product.skinConcerns?.map(concern => concern.id) || [],
        tagId: product.tags?.map(tag => tag.id) || [],
        formIds: product.forms?.map(f => f.id) || [],
        stepId: product.stepId?.map(step => step.id) || [],
      });
      setPromotionType(product.promotion !== undefined ? 'input' : 'select');

      // Initialize file list with existing images
      if (product.images && product.images.length > 0) {
        const initialFileList = product.images.map((image, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url: image.url
        }));
        setFileList(initialFileList);
      } else {
        setFileList([]);
      }
    }
  }, [product, visible, form]);

  const handleSave = async () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);

        try {
          // Handle existing and new images
          let imageIds = [];
          // Keep existing images that weren't removed
          if (product.images) {
            const existingImageUrls = fileList
              .filter(file => file.url)
              .map(file => file.url);

            const keptImages = product.images
              .filter(image => {
                return existingImageUrls.some(url =>
                  url.includes(image.id) || url === image.url
                );
              })
              .map(image => image.id);

            imageIds = [...keptImages];
          }

          // Upload new images
          const newFiles = fileList.filter(file => file.originFileObj);

          if (newFiles.length > 0) {
            // Upload new files to Firebase
            const newImageUrls = await Promise.all(
              newFiles.map(async (file) => {
                const url = await uploadFile(file.originFileObj);
                return url;
              })
            );

            // Register images with the API
            const newImageIds = await Promise.all(
              newImageUrls.map(async (url) => {
                const res = await ProductAttributeService.uploadImage({ url: url });
                return res.id;
              })
            );

            imageIds = [...imageIds, ...newImageIds];
          }

          // Create updated product data
          const updatedProductData = {
            id: product.id,
            name: values.name,
            description: values.description,
            stock: parseInt(values.stock) || 0,
            createDateTime: product.createDateTime || new Date().toISOString(),
            lastUpdateDateTime: new Date().toISOString(),
            expiredDateTime: values.expiredDateTime ? values.expiredDateTime.toISOString() : null,
            status: values.status || product.status || "AVAILABLE",
            instruction: values.instruction || "",
            categoryId: values.categoryId || 0,
            price: parseFloat(values.price) || 0,
            promotion: parseFloat(values.promotion) || 0,
            ingredient: values.ingredient || "",
            skinTypeId: values.skinTypeId || [],
            skinConcernId: values.skinConcernId || [],
            tagId: values.tagId || [],
            formIds: values.formIds ? [values.formIds].flat() : [],
            routineSteps: values.routineSteps || [],
            images: imageIds,
            deleted: false
          };

          // Call the updateProduct API
          await updateProduct(product.id, updatedProductData);
          message.success('Đã cập nhật thành công sản phẩm!');

          // Notify parent component
          if (onSave) {
            onSave(updatedProductData);
          }
        } catch (error) {
          message.error(error.message || 'Cập nhật sản phẩm thất bại.');
          console.error('Update error:', error);
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
      <div style={{ marginTop: 8 }}>
        Upload
      </div>
    </button>
  );

  return (
    <Modal
      title="Chỉnh sửa sản phẩm"
      open={visible}
      onCancel={onCancel}
      width={1000}
      footer={null}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        style={{ width: '100%' }}
        preserve={false}
      >
        <Row gutter={[16, 16]}>
          {/* Basic Info */}
          <Col xs={24} md={12}>
            <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Mô tả sản phẩm"
              name="description"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm!' }]}
            >
              <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                style={{ height: '150px', marginBottom: '40px' }}
              />
            </Form.Item>
          </Col>

          {/* Product Details */}
          <Col xs={24} md={12}>
            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Danh mục"
                  name="categoryId"
                  rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                >
                  <Select>
                    {categories.map((category) => (
                      <Option key={category.id} value={category.id}>{category.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Giá tiền"
                  name="price"
                  rules={[
                    { required: true, message: 'Vui lòng nhập giá tiền!' },
                    { 
                      validator: (_, value) => {
                        if (value >= 1000) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Giá phải từ 1.000 VNĐ trở lên!'));
                      }
                    }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                    min={1000}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Số lượng sản phẩm"
                  name="stock"
                  rules={[{ required: true, message: 'Vui lòng nhập tồn kho!' }]}
                >
                  <InputNumber style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={[16, 0]}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="expiredDateTime"
                  label="Hạn sử dụng"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    format="DD/MM/YYYY"
                    disabledDate={disabledDate}
                    placeholder="Chọn hạn sử dụng"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="status"
                  label="Trạng thái"
                  rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                >
                  <Select>
                    <Option value="AVAILABLE">Có sẵn</Option>
                    <Option value="OUT_OF_STOCK">Hết hàng</Option>
                    <Option value="INSUFFICIENT_STOCK">Ngừng kinh doanh</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Col>

          {/* Product Attributes */}
          <Col xs={24} md={12}>
            <Form.Item label="Cấu trúc sản phẩm" name="formIds">
              <Select>
                {forms.map((form) => (
                  <Select.Option key={form.id} value={form.id}>{form.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Loại da" name="skinTypeId">
              <Select mode="multiple">
                {skinTypes.map((skinType) => (
                  <Option key={skinType.id} value={skinType.id}>{skinType.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="skinConcernId" label="Vấn đề da">
              <Select mode="multiple">
                {skinConcerns.map((skinConcern) => (
                  <Option key={skinConcern.id} value={skinConcern.id}>{skinConcern.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Tags" name="tagId">
              <Select mode="multiple">
                {tags.map((tag) => (
                  <Option key={tag.id} value={tag.id}>{tag.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {/* Additional Info */}
          <Col xs={24} md={12}>
            <Form.Item label="Thành phần" name="ingredient">
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item label="Hướng dẫn sử dụng" name="instruction">
              <ReactQuill
                theme="snow"
                modules={modules}
                formats={formats}
                style={{ height: '150px', marginBottom: '40px' }}
              />
            </Form.Item>
          </Col>

          {/* Images */}
          <Col xs={24}>
            <Form.Item label="Hình ảnh sản phẩm">
              <Upload
                listType="picture-card"
                fileList={fileList}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                onPreview={handlePreview}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>

              <Image
                style={{ display: 'none' }}
                preview={{
                  visible: previewOpen,
                  onVisibleChange: (visible) => setPreviewOpen(visible),
                  afterVisibleChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            </Form.Item>
          </Col>

          {/* Buttons */}
          <Col xs={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={onCancel}>Hủy</Button>
              <Button type="primary" onClick={handleSave} loading={loading}>
                Lưu thay đổi
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProductModel;