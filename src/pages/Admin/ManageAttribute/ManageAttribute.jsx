import { useState, useEffect } from 'react';
import {
    Layout,
    Select,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Upload,
    message,
    Space,
    Image
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { ProductAttributeService } from '../../../apis/productAttribute';
import uploadFile from '../../../utils/upload';

const { Content } = Layout;
const { Option } = Select;

const ProductAttributeManagement = () => {
    const [attributeType, setAttributeType] = useState('category');
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Configuration object mapping attribute types to their properties and methods
    const attributeConfig = {
        category: {
            title: 'Danh mục',
            fetchMethod: ProductAttributeService.getCategories,
            createMethod: ProductAttributeService.createCategory,
            updateMethod: ProductAttributeService.updateCategory,
            deleteMethod: ProductAttributeService.deleteCategory,
            columns: [
                { title: 'Tên danh mục', dataIndex: 'name', key: 'name' }
            ],
            formItems: [
                {
                    name: "name",
                    label: "Category Name",
                    rules: [
                        { required: true, message: 'Category name is required' },
                        { max: 100, message: 'Maximum 100 characters allowed' }
                    ],
                    component: <Input />
                }
            ],
            createData: (values, imageUrl) => ({
                name: values.name,
                description: values.description || '',
            })
        },
        brand: {
            title: 'Thương hiệu',
            fetchMethod: ProductAttributeService.getBrands,
            createMethod: ProductAttributeService.createBrand,
            updateMethod: ProductAttributeService.updateBrand,
            deleteMethod: ProductAttributeService.deleteBrand,
            columns: [
                { title: 'Tên thương hiệu', dataIndex: 'name', key: 'name' },
                { title: 'Thông tin mô tả', dataIndex: 'description', key: 'description' },
                {
                    title: 'Logo',
                    dataIndex: 'imageUrl',
                    key: 'imageUrl',
                    render: (imageUrl) => (
                        <Image
                            src={imageUrl}
                            alt="Brand"
                            style={{
                                maxWidth: 50,
                                maxHeight: 50,
                                objectFit: 'contain'
                            }}
                        />
                    )
                }
            ],
            formItems: [
                {
                    name: "name",
                    label: "Brand Name",
                    rules: [
                        { required: true, message: 'Brand name is required' },
                        { max: 100, message: 'Maximum 100 characters allowed' }
                    ],
                    component: <Input />
                },
                {
                    name: "description",
                    label: "Description",
                    rules: [
                        { max: 500, message: 'Maximum 500 characters allowed' }
                    ],
                    component: <Input.TextArea />
                },
                {
                    name: "image",
                    label: "Upload Image",
                    component: (form) => (
                        <Upload
                            listType="picture-card"
                            fileList={form.getFieldValue('image')?.fileList}
                            beforeUpload={() => false}
                            onChange={({ fileList }) => {
                                form.setFieldsValue({
                                    image: {
                                        fileList: fileList,
                                        file: fileList.length > 0 ? fileList[0].originFileObj : null,
                                    },
                                });
                            }}
                        >
                            {form.getFieldValue('image')?.fileList?.length >= 1 ? null : <PlusOutlined />}
                        </Upload>
                    )
                }
            ],
            createData: (values, imageUrl) => ({
                name: values.name,
                description: values.description || '',
                imageUrl: imageUrl || ''
            })
        },
        skinType: {
            title: 'Loại da',
            fetchMethod: ProductAttributeService.getSkinType,
            createMethod: ProductAttributeService.createSkinType,
            updateMethod: ProductAttributeService.updateSkinType,
            deleteMethod: ProductAttributeService.deleteSkinType,
            columns: [
                { title: 'Loại da', dataIndex: 'name', key: 'name' },
                { title: 'Mô tả', dataIndex: 'description', key: 'description' }
            ],
            formItems: [
                {
                    name: "name",
                    label: "Tên loại da",
                    rules: [
                        { required: true, message: 'Vui lòng nhập tên loại da' },
                        { max: 100, message: 'Tối đa 100 kí tự' }
                    ],
                    component: <Input />
                },
                {
                    name: "description",
                    label: "Mô tả",
                    rules: [
                        { max: 500, message: 'Tối đa 500 kí tự' }
                    ],
                    component: <Input.TextArea />
                }
            ],
            createData: (values) => ({
                name: values.name,
                description: values.description || '',
            })
        },
        concern: {
            title: 'Vấn đề da',
            fetchMethod: ProductAttributeService.getConcern,
            createMethod: ProductAttributeService.createConcern,
            updateMethod: ProductAttributeService.updateConcern,
            deleteMethod: ProductAttributeService.deleteConcern,
            columns: [
                { title: 'Vấn đề về da', dataIndex: 'name', key: 'name' },
                { title: 'Mô tả', dataIndex: 'description', key: 'description' }
            ],
            formItems: [
                {
                    name: "name",
                    label: "Tên vấn đề về da",
                    rules: [
                        { required: true, message: 'concern name is required' },
                        { max: 100, message: 'Maximum 100 characters allowed' }
                    ],
                    component: <Input />
                },
                {
                    name: "description",
                    label: "Mô tả",
                    rules: [
                        { max: 500, message: 'Tối đa 500 kí tự' }
                    ],
                    component: <Input.TextArea />
                }
            ],
            createData: (values) => ({
                name: values.name,
                description: values.description || '',
            })
        },
        texture: {
            title: 'Kết cấu sản phẩm',
            fetchMethod: ProductAttributeService.getTextures,
            createMethod: ProductAttributeService.createTexture,
            updateMethod: ProductAttributeService.updateTexture,
            deleteMethod: ProductAttributeService.deleteTexture,
            columns: [
                { title: 'Kết cấu sản phẩm', dataIndex: 'name', key: 'name' },
                { title: 'Mô tả', dataIndex: 'description', key: 'description' }
            ],
            formItems: [
                {
                    name: "name",
                    label: "Loại kết cấu",
                    rules: [
                        { required: true, message: 'concern name is required' },
                        { max: 100, message: 'Maximum 100 characters allowed' }
                    ],
                    component: <Input />
                },
                {
                    name: "description",
                    label: "Mô tả",
                    rules: [
                        { max: 500, message: 'Tối đa 500 kí tự' }
                    ],
                    component: <Input.TextArea />
                }
            ],
            createData: (values) => ({
                name: values.name,
                description: values.description || '',
            })
        }
    };

    const fetchData = async () => {
        try {
            const config = attributeConfig[attributeType];
            const response = await config.fetchMethod();
            setData(Array.isArray(response) ? response : [response]);
        } catch (error) {
            console.error('API Call Error:', error);
            message.error(`Failed to fetch ${attributeType} data: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchData();
    }, [attributeType]);

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa thuộc tính này không?',
            content: 'Hành động này không thể hoàn lại.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const config = attributeConfig[attributeType];
                    await config.deleteMethod(id);
                    message.success('Đã xóa thành công');
                    fetchData();
                } catch (error) {
                    message.error('Có lỗi khi xóa', error.message);
                }
            }
        });
    };

    const handleSubmit = async (values) => {
        setIsSubmitted(true);
        try {
            let imageUrl = editingRecord?.imageUrl;

            // Handle file upload only if a new file is selected
            if (values.image && values.image.file) {
                try {
                    imageUrl = await uploadFile(values.image.file);
                    console.log('Uploaded Image URL:', imageUrl);
                } catch (uploadError) {
                    console.error('Image Upload Error:', uploadError);
                    message.error('Failed to upload image');
                    return;
                }
            }

            const config = attributeConfig[attributeType];
            const submitData = config.createData(values, imageUrl);

            if (editingRecord) {
                await config.updateMethod(editingRecord.id, submitData);
            } else {
                await config.createMethod(submitData);
            }

            message.success(`${editingRecord ? 'Cập nhật' : 'Tạo mới'} thành công`);
            setModalVisible(false);
            fetchData();
            form.resetFields();
        } catch (error) {
            message.error('Operation failed', error.message);
        } finally {
            setIsSubmitted(false);
        }
    };

    const getColumns = () => {
        const baseColumns = [
            {
                title: 'STT',
                dataIndex: 'id',
                key: 'id',
                render: (text, record, index) => index + 1
            }
        ];

        const actionColumn = {
            title: 'Hành động',
            key: 'actions',
            width: 150,
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined className="text-blue-500 w-5 h-5" />}
                        type="text"
                        onClick={() => {
                            setEditingRecord(record);
                            form.setFieldsValue(record);
                            setModalVisible(true);
                        }}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        type="text"
                        danger
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        };

        return [
            ...baseColumns,
            ...attributeConfig[attributeType].columns,
            actionColumn
        ];
    };

    const renderFormItems = () => {
        return attributeConfig[attributeType].formItems.map((item, index) => (
            <Form.Item
                key={index}
                name={item.name}
                label={item.label}
                rules={item.rules}
            >
                {typeof item.component === 'function' ? item.component(form) : item.component}
            </Form.Item>
        ));
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold p-4">Các thuộc tính sản phẩm</h1>
            <Content style={{ margin: '12px 16px', padding: 24, background: '#fff' }}>
                <Select
                    style={{ width: 200, marginBottom: 16 }}
                    value={attributeType}
                    onChange={(value) => setAttributeType(value)}
                >
                    {Object.entries(attributeConfig).map(([key, config]) => (
                        <Option key={key} value={key}>{config.title}</Option>
                    ))}
                </Select>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingRecord(null);
                        form.resetFields();
                        setModalVisible(true);
                    }}
                    style={{ marginBottom: 16, marginLeft: 16 }}
                >
                    Thêm mới
                </Button>

                <Table
                    columns={getColumns()}
                    dataSource={data}
                    rowKey="id"
                />

                <Modal
                    title={`${editingRecord ? 'Chỉnh sửa' : 'Thêm mới'} ${attributeConfig[attributeType].title}`}
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    onOk={() => form.submit()}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        {renderFormItems()}
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};

export default ProductAttributeManagement;