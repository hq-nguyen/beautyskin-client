import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    Divider,
    Card,
    Modal,
} from 'antd';
import { SaveOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ProductAttributeService } from '../../../apis/productAttribute';
import { getProductBySkinType } from '../../../apis/product';
import { deleteRoutineStep } from '../../../apis/routine';

const { TextArea } = Input;
const { Option } = Select;

const RoutineForm = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    isEditing
}) => {
    const [form] = Form.useForm();
    const [skinTypes, setSkinTypes] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedSkinType, setSelectedSkinType] = useState(null);
    const [deletedStepIds, setDeletedStepIds] = useState([]);

    // Fetch skin types on component mount
    useEffect(() => {
        if (visible) {
            fetchSkinTypes();
            setDeletedStepIds([]);
            if (initialValues?.skinTypeId) {
                setSelectedSkinType(initialValues.skinTypeId);
                fetchProducts(initialValues.skinTypeId);
            }
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [visible, form, initialValues]);

    const fetchSkinTypes = async () => {
        try {
            setLoading(true);
            const data = await ProductAttributeService.getSkinType();
            setSkinTypes(data);
        } catch (error) {
            Modal.error({
                title: 'Lỗi',
                content: 'Không thể tải loại da. Vui lòng thử lại sau.'
            });
            console.error('Error fetching skin types:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (skinTypeId) => {
        try {
            setLoading(true);
            const productsData = await getProductBySkinType(skinTypeId);
            setProducts(productsData);
        } catch (error) {
            Modal.error({
                title: 'Lỗi',
                content: 'Không thể tải sản phẩm. Vui lòng thử lại sau.'
            });
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSkinTypeChange = async (skinTypeId) => {
        setSelectedSkinType(skinTypeId);
        await fetchProducts(skinTypeId);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Format the data according to API requirements
            const formattedData = {
                ...values,
                skinTypeId: parseInt(values.skinTypeId, 10),
                routineStepRequests: values.routineStepRequests.map((step, index) => ({
                    ...(step.id ? { id: step.id } : {}), // Include ID if it exists (for editing)
                    stepName: step.stepName,
                    description: step.description,
                    stepOrder: index + 1,
                    products: step.products.map(productId => ({ id: parseInt(productId, 10) }))
                })),
                deletedStepIds: deletedStepIds
            };

            onSubmit(formattedData);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title={isEditing ? 'Cập nhật quy trình chăm sóc da' : 'Thêm quy trình chăm sóc da mới'}
            open={visible}
            onCancel={onCancel}
            width={800}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSubmit}
                    loading={loading}
                >
                    Lưu
                </Button>
            ]}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
            >
                <Form.Item
                    name="name"
                    label="Tên quy trình"
                    rules={[{ required: true, message: 'Vui lòng nhập tên quy trình' }]}
                >
                    <Input placeholder="Nhập tên quy trình" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả quy trình"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả quy trình' }]}
                >
                    <TextArea placeholder="Nhập mô tả quy trình" rows={2} />
                </Form.Item>

                <Form.Item
                    name="skinTypeId"
                    label="Loại da"
                    rules={[{ required: true, message: 'Vui lòng chọn loại da' }]}
                >
                    <Select
                        placeholder="Chọn loại da"
                        onChange={handleSkinTypeChange}
                        loading={loading}
                    >
                        {skinTypes.map(type => (
                            <Option key={type.id} value={type.id.toString()}>
                                {type.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Divider>Các bước chăm sóc da</Divider>

                <Form.List
                    name="routineStepRequests"
                    rules={[
                        {
                            validator: async (_, steps) => {
                                if (!steps || steps.length < 1) {
                                    return Promise.reject(new Error('Cần có ít nhất 1 bước chăm sóc da'));
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    {(fields, { add, remove }, { errors }) => (
                        <>
                            {fields.map((field, index) => (
                                <Card
                                    key={field.key}
                                    style={{ marginBottom: 16 }}
                                    size="small"
                                    title={`Bước ${index + 1}`}
                                    extra={
                                        fields.length > 1 && (
                                            <Button
                                                type="text"
                                                danger
                                                icon={<MinusCircleOutlined />}
                                                onClick={() => {
                                                    const stepId = form.getFieldValue(['routineStepRequests', field.name, 'id']);
                                                    if (stepId) {
                                                        Modal.confirm({
                                                            title: 'Xác nhận xóa',
                                                            content: 'Bạn có chắc chắn muốn xóa bước này không?',
                                                            okText: 'Xóa',
                                                            okType: 'danger',
                                                            cancelText: 'Hủy',
                                                            onOk: async () => {
                                                                try {
                                                                    // Add the step ID to deletedStepIds array
                                                                    setDeletedStepIds(prev => [...prev, stepId]);

                                                                    // Call API to delete step
                                                                    await deleteRoutineStep(stepId);

                                                                    // Remove from form
                                                                    remove(field.name);
                                                                } catch (error) {
                                                                    Modal.error({
                                                                        title: 'Lỗi',
                                                                        content: 'Không thể xóa bước. Vui lòng thử lại sau.'
                                                                    });
                                                                }
                                                            }
                                                        });
                                                    } else {
                                                        // For new steps (not saved yet), just remove without confirmation
                                                        remove(field.name);
                                                    }
                                                }}
                                            />
                                        )
                                    }
                                >
                                    {/* Hidden field for step ID */}
                                    <Form.Item
                                        noStyle
                                        name={[field.name, 'id']}
                                    >
                                        <Input type="hidden" />
                                    </Form.Item>

                                    <Form.Item
                                        name={[field.name, 'stepName']}
                                        label="Tên bước"
                                        rules={[{ required: true, message: 'Vui lòng nhập tên bước' }]}
                                    >
                                        <Input placeholder={`Tên bước ${index + 1}`} />
                                    </Form.Item>

                                    <Form.Item
                                        name={[field.name, 'description']}
                                        label="Mô tả"
                                        rules={[{ required: true, message: 'Vui lòng nhập mô tả bước' }]}
                                    >
                                        <TextArea placeholder="Nhập mô tả chi tiết cho bước này" rows={2} />
                                    </Form.Item>

                                    <Form.Item
                                        name={[field.name, 'products']}
                                        label="Sản phẩm khuyến nghị"
                                        rules={[{ required: true, message: 'Vui lòng chọn ít nhất một sản phẩm' }]}
                                    >
                                        <Select
                                            mode="multiple"
                                            placeholder="Chọn sản phẩm"
                                            disabled={!selectedSkinType}
                                            loading={loading}
                                        >
                                            {products.map(product => (
                                                <Option key={product.id} value={product.id.toString()}>
                                                    <div className='flex align-items-center'>
                                                        {product.images && (
                                                            <img

                                                                src={product.images[0].url}
                                                                alt={product.name}
                                                                style={{ width: 32, height: 32, marginRight: 8 }}
                                                            />
                                                        )}
                                                        {product.name}
                                                    </div>
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Card>
                            ))}

                            <Form.Item>
                                <Button
                                    type="dashed"
                                    onClick={() => add({
                                        stepName: '',
                                        description: '',
                                        products: []
                                    })}
                                    icon={<PlusOutlined />}
                                    style={{ width: '100%' }}
                                >
                                    Thêm bước
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default RoutineForm;