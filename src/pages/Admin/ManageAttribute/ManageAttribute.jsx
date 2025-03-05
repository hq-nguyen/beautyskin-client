import { useState, useEffect } from 'react';
import {
    Layout,
    Menu,
    Select,
    Table,
    Button,
    Modal,
    Form,
    Input,
    Upload,
    message
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import { ProductAttributeService } from '../../../apis/productAttributes';

const { Sider, Content } = Layout;
const { Option } = Select;

const ProductAttributeManagement = () => {
    const [attributeType, setAttributeType] = useState('category');
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [form] = Form.useForm();

    const fetchData = async () => {
        try {
            let response;
            switch (attributeType) {
                case 'category':
                    response = await ProductAttributeService.getCategories();
                    break;
                case 'brand':
                    response = await ProductAttributeService.getBrands();
                    break;
                case 'concern':
                    response = await ProductAttributeService.getConcerns();
                    break;
                case 'texture':
                    response = await ProductAttributeService.getTextures();
                    break;
            }
            setData(response.data);
        } catch (error) {
            message.error('Failed to fetch data');
        }
    };

    useEffect(() => {
        fetchData();
    }, [attributeType]);

    const handleDelete = async (id) => {
        try {
            switch (attributeType) {
                case 'category':
                    await ProductAttributeService.deleteCategory(id);
                    break;
                case 'brand':
                    await ProductAttributeService.deleteBrand(id);
                    break;
                case 'concern':
                    await ProductAttributeService.deleteConcern(id);
                    break;
                case 'texture':
                    await ProductAttributeService.deleteTexture(id);
                    break;
            }
            message.success('Deleted successfully');
            fetchData();
        } catch (error) {
            message.error('Failed to delete');
        }
    };

    const handleSubmit = async (values) => {
        try {
            if (editingRecord) {
                // Update logic
                switch (attributeType) {
                    case 'category':
                        await ProductAttributeService.updateCategory(editingRecord.id, values);
                        break;
                    case 'brand': {
                        const formData = {
                            name: values.name,
                            description: values.description,
                            image: values.image ? URL.createObjectURL(values.image.file) : editingRecord.image
                        };
                        await ProductAttributeService.updateBrand(editingRecord.id, formData);
                        break;
                    }
                    case 'concern':
                        await ProductAttributeService.updateConcern(editingRecord.id, values);
                        break;
                    case 'texture':
                        await ProductAttributeService.updateTexture(editingRecord.id, values);
                        break;
                }
            } else {
                // Create logic
                switch (attributeType) {
                    case 'category':
                        await ProductAttributeService.createCategory(values);
                        break;
                    case 'brand': {
                        const formData = {
                            name: values.name,
                            description: values.description,
                            image: URL.createObjectURL(values.image.file)
                        };
                        await ProductAttributeService.createBrand(formData);
                        break;
                    }
                    case 'concern':
                        await ProductAttributeService.createConcern(values);
                        break;
                    case 'texture':
                        await ProductAttributeService.createTexture(values);
                        break;
                }
            }
            message.success(`${editingRecord ? 'Updated' : 'Created'} successfully`);
            setModalVisible(false);
            fetchData();
            form.resetFields();
        } catch (error) {
            message.error('Operation failed');
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
                        title: 'Category Name',
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
            case 'brand':
                return [
                    ...baseColumns,
                    {
                        title: 'Brand Name',
                        dataIndex: 'name',
                        key: 'name'
                    },
                    {
                        title: 'Description',
                        dataIndex: 'description',
                        key: 'description'
                    },
                    {
                        title: 'Image',
                        dataIndex: 'image',
                        key: 'image',
                        render: (image) => <img src={image} style={{ maxWidth: 50 }} alt="Brand" />
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
            case 'concern':
                return [
                    ...baseColumns,
                    {
                        title: 'Concern Name',
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
                            rules={[
                                { required: !editingRecord, message: 'Image is required' }
                            ]}
                        >
                            <Upload
                                name="image"
                                listType="picture-card"
                                className="image-uploader"
                                showUploadList={true}
                                beforeUpload={() => false}
                            >
                                <PlusOutlined />
                            </Upload>
                        </Form.Item>
                    </>
                );
            case 'concern':
                return (
                    <Form.Item
                        name="name"
                        label="Concern Name"
                        rules={[
                            { required: true, message: 'Concern name is required' },
                            { max: 100, message: 'Maximum 100 characters allowed' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
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
                    <Option value="concern">Concern</Option>
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
                    Add New
                </Button>

                <Table
                    columns={getColumns()}
                    dataSource={data}
                    rowKey="id"
                />

                <Modal
                    title={`${editingRecord ? 'Edit' : 'Add'} ${attributeType}`}
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
