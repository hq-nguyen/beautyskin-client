import { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Modal, Form, Input, DatePicker, 
  Select, InputNumber, Switch, message, Popconfirm, Row, Col
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
  deletePromotion,
  fetchRanking
} from '../../../apis/promotion';
import { formatCurrency } from '../../../utils/format';

const { Option } = Select;
const { TextArea } = Input;

const DATE_FORMAT = 'YYYY-MM-DD';
const DISPLAY_DATE_FORMAT = 'DD/MM/YYYY';

const ManagePromotion = () => {
  const [promotions, setPromotions] = useState([]);
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState('create'); 
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchPromotions();
    loadRanks();
  }, []);

  const loadRanks = async () => {
    try {
      const ranksData = await fetchRanking();
      setRanks(ranksData);
    } catch (error) {
      message.error('Failed to fetch ranks: ' + error.message);
    }
  };

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
    const startDate = moment(record.startDate);
    const endDate = moment(record.endDate);
    
    const rankId = record.userRank ? record.userRank.id : 1;
    
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      description: record.description,
      startDate: startDate,
      endDate: endDate,
      rank: rankId,
      promoAmount: record.promoAmount,
      orderPrice: record.orderPrice,
      numOfPromo: record.numOfPromo,
      deleted: record.deleted,
      outDate: record.outDate,
      endDateAfterStartDate: record.endDateAfterStartDate
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      const promotionData = modalType === 'create' 
        ? {
            name: values.name,
            description: values.description,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate.toISOString(),
            promoAmount: values.promoAmount,
            numOfPromo: values.numOfPromo || 1073741824, 
            orderPrice: values.orderPrice,
            rank: values.rank || 1, 
          }
        : {
            id: values.id,
            name: values.name,
            description: values.description,
            startDate: values.startDate.toISOString(),
            endDate: values.endDate.toISOString(),
            promoAmount: values.promoAmount,
            orderPrice: values.orderPrice,
            numOfPromo: values.numOfPromo || 1073741824,
            rank: values.rank || 1,
            deleted: values.deleted,
            outDate: values.outDate,
            endDateAfterStartDate: values.endDateAfterStartDate
          };

      if (modalType === 'create') {
        await createPromotion(promotionData);
        message.success('Tạo Khuyến mãi thành công!');
      } else {
        await updatePromotion(promotionData.id, promotionData);
        message.success('Cập nhật Khuyến mãi thành công!');
      }

      setIsModalVisible(false);
      fetchPromotions();
    } catch (error) {
      message.error(`Lỗi khi ${modalType === 'create' ? 'tạo' : 'cập nhật'} khuyến mãi: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePromotion(id);
      message.success('Khuyến mãi đã được xóa!');
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
      title: 'Mã khuyến mãi',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Hạng áp dụng',
      dataIndex: 'userRank',
      key: 'rank',
      render: (userRank) => {
        return userRank ? userRank.rankName : 'Tất cả';
      },
      sorter: (a, b) => {
        const aRank = a.userRank ? a.userRank.id : 0;
        const bRank = b.userRank ? b.userRank.id : 0;
        return aRank - bRank;
      },
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (text) => {
        const date = moment(text);
        return date.isValid() ? date.format(DISPLAY_DATE_FORMAT) : text;
      },
      sorter: (a, b) => moment(a.startDate).unix() - moment(b.startDate).unix(),
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (text) => {
        const date = moment(text);
        return date.isValid() ? date.format(DISPLAY_DATE_FORMAT) : text;
      },
      sorter: (a, b) => moment(a.endDate).unix() - moment(b.endDate).unix(),
    },
    {
      title: 'Giá trị',
      dataIndex: 'promoAmount',
      key: 'promoAmount',
      render: (text) => `${formatCurrency(text)}`,
      sorter: (a, b) => a.promoAmount - b.promoAmount,
    },
    {
      title: 'Giá tiền tối thiểu',
      dataIndex: 'orderPrice',
      key: 'orderPrice',
      render: (text) => `${formatCurrency(text)}`,
      sorter: (a, b) => a.orderPrice - b.orderPrice,
    },
    {
      title: 'Số lượng',
      dataIndex: 'numOfPromo',
      key: 'numOfPromo',
      render: (text) => text === 1073741824 ? 'Không giới hạn' : text,
      sorter: (a, b) => a.numOfPromo - b.numOfPromo,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_, record) => {
        if (record.deleted) {
          return <span style={{ color: 'red' }}>Đã xóa</span>;
        }
        const now = moment();
        const startDate = moment(record.startDate);
        const endDate = moment(record.endDate);
        
        if (now.isBefore(startDate)) {
          return <span style={{ color: 'orange' }}>Chưa bắt đầu</span>;
        } else if (now.isAfter(endDate)) {
          return <span style={{ color: 'gray' }}>Hết hạn</span>;
        } else {
          return <span style={{ color: 'green' }}>Đang áp dụng</span>;
        }
      },
    },
    {
      title: 'Hành động ',
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
        <h1 className='text-2xl font-bold mb-4 text-black'>Quản lý Khuyến mãi</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showCreateModal}
        >
          Thêm Khuyến mãi
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={promotions} 
        rowKey="id" 
        loading={loading}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1400 }}
      />

      <Modal
        title={modalType === 'create' ? 'Tạo Khuyến mãi' : 'Cập nhật Khuyến mãi'}
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
          {modalType === 'update' && (
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
          )}

          <Row gutter={16} align="middle">
            <Col span={16}>
              <Form.Item
                name="name"
                label="Tên Khuyến mãi"
                rules={[{ required: true, message: 'Vui lòng nhập tên Khuyến mãi' }]}
              >
                <Input placeholder="Nhập tên Khuyến mãi" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="rank"
                label="Hạng áp dụng"
                rules={[{ required: true, message: 'Vui lòng chọn hạng' }]}
              >
                <Select 
                  placeholder="Chọn hạng"
                  style={{ width: '100%' }}
                >
                  {ranks.map(rank => (
                    <Option key={rank.id} value={rank.id}>
                      {rank.rankName}
                    </Option>
                  ))}
                  <Option value={1}>Tất cả</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả Khuyến mãi" />
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
                  format={DISPLAY_DATE_FORMAT}
                  showTime
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
                  format={DISPLAY_DATE_FORMAT}
                  showTime
                  placeholder="Chọn ngày kết thúc"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="promoAmount"
                label="Giá trị Khuyến mãi"
                rules={[{ required: true, message: 'Vui lòng nhập giá trị Khuyến mãi' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0}
                  placeholder="Nhập giá trị Khuyến mãi" 
                  formatter={value => `${value}`}
                  parser={value => value.replace('đ', '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="orderPrice"
                label="Giá trị đơn tối thiểu"
                rules={[{ required: true, message: 'Vui lòng nhập giá trị đơn tối thiểu' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={0}
                  placeholder="Nhập giá trị đơn tối thiểu" 
                  formatter={value => `${value}`}
                  parser={value => value.replace('đ', '')}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="numOfPromo"
                label="Số lượng"
                rules={[{ required: true, message: 'Vui lòng nhập số lượng Khuyến mãi' }]}
              >
                <InputNumber 
                  style={{ width: '100%' }} 
                  min={1}
                  placeholder="Nhập số lượng Khuyến mãi" 
                  formatter={value => value === 1073741824 ? 'Không giới hạn' : value}
                  parser={value => value === 'Không giới hạn' ? 1073741824 : value}
                />
              </Form.Item>
            </Col>
          </Row>

          {modalType === 'update' && (
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="deleted"
                  label="Đã xóa"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="endDateAfterStartDate"
                  label="Ngày kết thúc sau ngày bắt đầu"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default ManagePromotion;