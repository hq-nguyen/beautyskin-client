import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, Form, Input, DatePicker, 
  Select, InputNumber, Switch, message, Popconfirm, Typography, Row, Col, Upload
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons';
import moment from 'moment';
import { 
  getAllPromotions, 
  createPromotion, 
  updatePromotion, 
  deletePromotion 
} from '../../../apis/promotion';
import uploadFile from '../../../utils/upload';
import { ProductAttributeService } from '../../../apis/productAttribute';

const { Option } = Select;
const { TextArea } = Input;

// Define a consistent date format to use throughout the application
const DATE_FORMAT = 'YYYY-MM-DD';
const DISPLAY_DATE_FORMAT = 'DD/MM/YYYY';

const ManagePromotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); 
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const data = await getAllPromotions();
      setPromotions(data);
    } catch (error) {
      message.error('Failed to fetch promotions');
    } finally {
      setLoading(false);
    }
  };

  const showCreateModal = () => {
    setModalType('create');
    setCurrentPromotion(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showUpdateModal = (record) => {
    setModalType('update');
    setCurrentPromotion(record);
    
    // Parse dates correctly and set form values
    const startDate = moment(record.startDate, DISPLAY_DATE_FORMAT);
    const endDate = moment(record.endDate, DISPLAY_DATE_FORMAT);
    
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      startDate: startDate,
      endDate: endDate,
      type: record.type,
      promoAmount: record.promoAmount,
      deleted: record.deleted,
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
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
    setPreviewVisible(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      let imageUrl = null;
      let imageId = null;
      
      if (fileList.length > 0 && fileList[0].originFileObj) {
        try {
          imageUrl = await uploadFile(fileList[0].originFileObj);
          
          const imageResponse = await ProductAttributeService.uploadImage({ url: imageUrl });
          imageId = imageResponse.id;
        } catch (error) {
          console.error('Error uploading image:', error);
          message.error('Lỗi khi tải ảnh lên: ' + (error.message || 'Lỗi không xác định'));
        }
      }
      
      const promotionData = {
        name: values.name,
        description: values.description,
        startDate: values.startDate.format(DISPLAY_DATE_FORMAT),
        endDate: values.endDate.format(DISPLAY_DATE_FORMAT),
        type: values.type,
        promoAmount: Math.min(Math.max(values.promoAmount, 0), 100),
        deleted: values.deleted || false,
        imageId: imageId,
      };

      if (modalType === 'create') {
        await createPromotion(promotionData);
        message.success('Tạo voucher thành công!');
      } else {
        await updatePromotion(currentPromotion.id, promotionData);
        message.success('Cập nhật voucher thành công!');
      }

      setIsModalVisible(false);
      fetchPromotions();
    } catch (error) {
      message.error(`Failed to ${modalType} promotion: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePromotion(id);
      message.success('Voucher đã được xóa!');
      fetchPromotions();
    } catch (error) {
      message.error(`Failed to delete promotion: ${error.message}`);
    }
  };

  const columns = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (text, record, index) => index + 1,
      align: 'center',
      fixed: 'left'
    },
    {
      title: 'Tên voucher',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => {
        // Safely parse and format the date
        const date = moment(text, DISPLAY_DATE_FORMAT);
        return date.isValid() ? date.format(DISPLAY_DATE_FORMAT) : text;
      },
      sorter: (a, b) => {
        const dateA = moment(a.startDate, DISPLAY_DATE_FORMAT);
        const dateB = moment(b.startDate, DISPLAY_DATE_FORMAT);
        return dateA.unix() - dateB.unix();
      },
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => {
        // Safely parse and format the date
        const date = moment(text, DISPLAY_DATE_FORMAT);
        return date.isValid() ? date.format(DISPLAY_DATE_FORMAT) : text;
      },
      sorter: (a, b) => {
        const dateA = moment(a.endDate, DISPLAY_DATE_FORMAT);
        const dateB = moment(b.endDate, DISPLAY_DATE_FORMAT);
        return dateA.unix() - dateB.unix();
      },
    },
    {
      title: 'Loại voucher',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Giảm theo phần trăm', value: 'DISCOUNT_BY_PERCENT' },
        { text: 'Giảm theo số tiền', value: 'DISCOUNT_BY_AMOUNT' },
        { text: 'Áp dụng cho đơn hàng', value: 'APPLY_FOR_ORDER' },
        { text: 'Áp dụng cho sản phẩm', value: 'APPLY_FOR_PRODUCT' },
      ],
      onFilter: (value, record) => record.type === value,
      render: (type) => {
        const typeMap = {
          DISCOUNT_BY_PERCENT: 'Giảm theo phần trăm',
          DISCOUNT_BY_AMOUNT: 'Giảm theo số tiền',
          APPLY_FOR_ORDER: 'Áp dụng cho đơn hàng',
          APPLY_FOR_PRODUCT: 'Áp dụng cho sản phẩm',
        };
        return typeMap[type] || type;
      },
    },
    {
      title: 'Số tiền(hoặc %) giảm',
      dataIndex: 'promoAmount',
      key: 'promoAmount',
      render: (text, record) => {
        if (record.type === 'DISCOUNT_BY_PERCENT') {
          return `${text}%`;
        }
        return `${text}đ`;
      },
      sorter: (a, b) => a.promoAmount - b.promoAmount,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        const now = moment();
        const startDate = moment(record.startDate, DISPLAY_DATE_FORMAT);
        const endDate = moment(record.endDate, DISPLAY_DATE_FORMAT);
        const currentTime = now.format('HH:mm:ss');
        const startTime = moment(record.startTime, 'HH:mm:ss').format('HH:mm:ss');
        const endTime = moment(record.endTime, 'HH:mm:ss').format('HH:mm:ss');
        
        if (record.deleted) {
          return <span style={{ color: 'red' }}>Đã xóa</span>;
        } else if (now.isBefore(startDate) || (now.isSame(startDate, 'day') && currentTime < startTime)) {
          return <span style={{ color: 'orange' }}>Chưa bắt đầu</span>;
        } else if (now.isAfter(endDate) || (now.isSame(endDate, 'day') && currentTime > endTime)) {
          return <span style={{ color: 'gray' }}>Hết hạn</span>;
        } else {
          return <span style={{ color: 'green' }}>Đang áp dụng</span>;
        }
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            icon={<EditOutlined className="text-blue-500 w-5 h-5" />} 
            type="text"
            onClick={() => showUpdateModal(record)}
          >
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa chương trình khuyến mãi này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Đồng ý"
            cancelText="Không"
            icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
          >
            <Button icon={<DeleteOutlined />} type="text" danger>
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h1 className='text-2xl font-bold mb-4 text-black'>Quản lý Voucher</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showCreateModal}
        >
          Thêm Voucher
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={promotions} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200 }}
      />

      <Modal
        title={modalType === 'create' ? 'Tạo Voucher' : 'Cập nhật Voucher'}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          name="promotionForm"
        >
          <Form.Item
            name="name"
            label="Tên Voucher"
            rules={[{ required: true, message: 'Vui lòng nhập tên voucher' }]}
          >
            <Input placeholder="Nhập tên voucher" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả voucher" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Ngày bắt đầu"
                rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu' }]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  disabledDate={(current) => current && current < moment().startOf('day')}
                  format={DISPLAY_DATE_FORMAT}
                  showTime={{ format: 'HH:mm' }}
                  placeholder="Chọn ngày bắt đầu"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="Ngày kết thúc"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày kết thúc' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || !getFieldValue('startDate') || value.isAfter(getFieldValue('startDate'))) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Ngày kết thúc phải sau ngày bắt đầu'));
                    },
                  }),
                ]}
              >
                <DatePicker 
                  style={{ width: '100%' }} 
                  disabledDate={(current) => {
                    const startDate = form.getFieldValue('startDate');
                    return (current && current < moment().startOf('day')) || 
                           (startDate && current && current.isBefore(startDate, 'day'));
                  }}
                  format={DISPLAY_DATE_FORMAT}
                  showTime={{ format: 'HH:mm' }}
                  placeholder="Chọn ngày kết thúc"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="type"
            label="Loại Voucher"
            rules={[{ required: true, message: 'Vui lòng chọn loại voucher' }]}
          >
            <Select placeholder="Chọn loại voucher">
              <Option value="DISCOUNT_BY_PERCENT">Giảm theo phần trăm</Option>
              <Option value="DISCOUNT_BY_AMOUNT">Giảm theo số tiền</Option>
              <Option value="APPLY_FOR_ORDER">Áp dụng cho đơn hàng</Option>
              <Option value="APPLY_FOR_PRODUCT">Áp dụng cho sản phẩm</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="promoAmount"
            label="Giá trị voucher"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị voucher' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              min={0}
              max={100}
              placeholder="Nhập giá trị voucher" 
            />
          </Form.Item>

          {modalType === 'update' && (
            <Form.Item
              name="deleted"
              label="Đã xóa"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        visible={previewVisible}
        title="Xem trước hình ảnh"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default ManagePromotion;