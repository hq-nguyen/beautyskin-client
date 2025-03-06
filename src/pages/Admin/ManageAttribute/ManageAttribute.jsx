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

const { Sider, Content } = Layout;
const { Option } = Select;

const ProductAttributeManagement = () => {
    const [attributeType, setAttributeType] = useState('category');
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();
    const [isSubmitted, setIsSubmitted] = useState(false);

    const fetchData = async () => {
        try {
            let response;
            switch (attributeType) {
                case 'category':
                    response = await ProductAttributeService.getCategories();
                    // console.log('Categories Response:', response);
                    setData(response);
                    break;
                case 'brand':
                    response = await ProductAttributeService.getBrands();
                    setData(Array.isArray(response) ? response : [response]);
                    break;
                case 'skinType':
                    response = await ProductAttributeService.getSkinType();
                    setData(Array.isArray(response) ? response : [response]);
                    break;
                case 'texture':
                    response = await ProductAttributeService.getTextures();
                    setData(response.data);
                    break;
            }
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
                    switch (attributeType) {
                        case 'category':
                            await ProductAttributeService.deleteCategory(id);
                            break;
                        case 'brand':
                            await ProductAttributeService.deleteBrand(id);
                            break;
                        case 'skinType':
                            await ProductAttributeService.deleteSkinType(id);
                            break;
                        case 'texture':
                            await ProductAttributeService.deleteTexture(id);
                            break;
                    }
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

            // Create appropriate data object based on attribute type
            let submitData;

            switch (attributeType) {
                case 'category':
                case 'texture':
                    submitData = values;
                    break;
                case 'brand':
                    submitData = {
                        name: values.name,
                        description: values.description || '',
                        imageUrl: imageUrl || ''
                    };
                    break;
                case 'skinType':
                    submitData = {
                        name: values.name,
                        description: values.description || '',
                    };
                    break;
            }

            if (editingRecord) {
                // Update logic
                switch (attributeType) {
                    case 'category':
                        await ProductAttributeService.updateCategory(editingRecord.id, submitData);
                        break;
                    case 'brand':
                        await ProductAttributeService.updateBrand(editingRecord.id, submitData);
                        break;
                    case 'skinType':
                        await ProductAttributeService.updateSkinType(editingRecord.id, submitData);
                        break;
                    case 'texture':
                        await ProductAttributeService.updateTexture(editingRecord.id, submitData);
                        break;
                }
            } else {
                // Create logic
                switch (attributeType) {
                    case 'category':
                        await ProductAttributeService.createCategory(submitData);
                        break;
                    case 'brand':
                        await ProductAttributeService.createBrand(submitData);
                        break;
                    case 'skinType':
                        await ProductAttributeService.createSkinType(submitData);
                        break;
                    case 'texture':
                        await ProductAttributeService.createTexture(submitData);
                        break;
                }
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

        switch (attributeType) {
            case 'category':
                return [
                    ...baseColumns,
                    {
                        title: 'Tên danh mục',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
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
                    },
                ];
            case 'brand':
                return [
                    ...baseColumns,
                    {
                        title: 'Tên thương hiệu',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
                        title: 'Thông tin mô tả',
                        dataIndex: 'description',
                        key: 'description'
                    },
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
                    },
                    {
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
                    },
                ];
            case 'skinType':
                return [
                    ...baseColumns,
                    {
                        title: 'Loại da',
                        dataIndex: 'typeName',
                        key: 'typeName'
                    },
                    {
                        title: 'Mô tả',
                        dataIndex: 'description',
                        key: 'description',
                    },
                    {
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
                                        form.setFieldsValue({
                                            typeName: record.name,
                                            description: record.description
                                        });
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
                    },
                ];
            case 'texture':
                return [
                    ...baseColumns,
                    {
                        title: 'Texture Name',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
                        title: 'Action',
                        key: 'action',
                        render: (text, record) => (
                            <div>
                                <Button
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        setEditingRecord(record);
                                        form.setFieldsValue(record);
                                        setModalVisible(true);
                                    }}
                                />
                                <Button
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDelete(record.id)}
                                />
                            </div>
                        )
                    }
                ];
        }
    };

    const renderModalContent = () => {
        switch (attributeType) {
            case 'category':
                return (
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[
                            { required: true, message: 'Category name is required' },
                            { max: 100, message: 'Maximum 100 characters allowed' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                );
            case 'brand':
                return (
                    <>
                        <Form.Item
                            name="name"
                            label="Brand Name"
                            rules={[
                                { required: true, message: 'Brand name is required' },
                                { max: 100, message: 'Maximum 100 characters allowed' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[
                                { max: 500, message: 'Maximum 500 characters allowed' }
                            ]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                        <Form.Item
                            name="image"
                            label="Upload Image"

                        >
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
                        </Form.Item>
                    </>
                );
            case 'skinType':
                return (
                    <>
                        <Form.Item
                            name="name"
                            label="Tên loại da"
                            rules={[
                                { required: true, message: 'Vui lòng nhập tên loại da' },
                                { max: 100, message: 'Tối đa 100 kí tự' }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                { max: 500, message: 'Tối đa 500 kí tự' }
                            ]}
                        >
                            <Input.TextArea />
                        </Form.Item>
                    </>
                );
            case 'texture':
                return (
                    <Form.Item
                        name="name"
                        label="Texture Name"
                        rules={[
                            { required: true, message: 'Texture name is required' },
                            { max: 100, message: 'Maximum 100 characters allowed' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                );
        }
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
                    <Option value="category">Category</Option>
                    <Option value="brand">Brand</Option>
                    <Option value="skinType">Loại da</Option>
                    <Option value="texture">Texture</Option>
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
                    title={`${editingRecord ? 'Chỉnh sửa' : 'Thêm mới'} ${attributeType}`}
                    visible={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    onOk={() => form.submit()}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        {renderModalContent()}
                    </Form>
                </Modal>
            </Content>
        </Layout>
    );
};

export default ProductAttributeManagement;
