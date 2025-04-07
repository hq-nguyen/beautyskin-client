import React, { useState, useEffect } from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    Divider,
    Card,
    Modal,
    message,
} from 'antd';
import { SaveOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ProductAttributeService } from '../../../apis/productAttribute';
import { getProductBySkinType } from '../../../apis/product';
import { fetchRoutines } from '../../../apis/routine'; 

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
    const [allRoutines, setAllRoutines] = useState([]);

    useEffect(() => {
        if (visible) {
            fetchSkinTypes();
            fetchAllRoutines(); 
            setDeletedStepIds([]);
            form.resetFields();

            if (initialValues) {
                if (initialValues.skinTypeId) {
                    setSelectedSkinType(initialValues.skinTypeId);
                    fetchProducts(initialValues.skinTypeId);
                }
                setTimeout(() => {
                    form.setFieldsValue(initialValues);
                }, 100);
            }
        }
    }, [visible, form, initialValues]);

    const fetchAllRoutines = async () => {
        try {
            setLoading(true);
            const routinesData = await fetchRoutines();
            console.log('routinesData', routinesData);
            
            setAllRoutines(routinesData || []);

        } catch (error) {
            console.error('Error fetching all routines:', error);
        } finally {
            setLoading(false);
        }
    };

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
        if (!skinTypeId) return;

        try {
            setLoading(true);
            const productsData = await getProductBySkinType(skinTypeId);
            setProducts(productsData || []);
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

    const checkRoutineExistsForSkinType = (skinTypeId) => {
        if (!skinTypeId || !allRoutines.length) return null;
        const skinTypeIdStr = skinTypeId.toString();
        const existingRoutine = allRoutines.find(routine => 
            routine.skinTypeResponse.typeId.toString() === skinTypeIdStr && 
            (!isEditing || (isEditing && initialValues && routine.id !== initialValues.id))
        );
        
        return existingRoutine;
    };

    const handleSkinTypeChange = async (skinTypeId) => {
        if (!skinTypeId) return;
        
        setSelectedSkinType(skinTypeId);
        await fetchProducts(skinTypeId);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const existingRoutine = checkRoutineExistsForSkinType(values.skinTypeId);
            
            if (existingRoutine) {
                message.error(`Không thể tạo quy trình mới. Đã tồn tại quy trình "${existingRoutine.name}" cho loại da này. Mỗi loại da chỉ có thể có một quy trình.`);
                return; 
            }
            
            if (values.routineStepResponse && values.routineStepResponse.length > 0) {
                values.routineStepResponse = values.routineStepResponse.map((step, index) => ({
                    ...step,
                    stepOrder: index + 1
                }));
            }
            const formattedData = {
                ...values,
                deletedStepIds: deletedStepIds
            };

            onSubmit(formattedData);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handleRemoveStep = (field, remove) => {
        const stepId = form.getFieldValue(['routineStepResponse', field.name, 'id']);

        if (stepId) {
            Modal.confirm({
                title: 'Xác nhận xóa',
                content: 'Bạn có chắc chắn muốn xóa bước này không?',
                okText: 'Xóa',
                okType: 'danger',
                cancelText: 'Hủy',
                onOk: () => {
                    setDeletedStepIds(prev => [...prev, stepId]);
                    remove(field.name);
                    message.success('Bước đã được xóa thành công!');
                    const currentValues = form.getFieldValue('routineStepResponse');
                    if (currentValues && currentValues.length > 0) {
                        const updatedValues = currentValues.map((step, index) => ({
                            ...step,
                            stepOrder: index + 1
                        }));
                        form.setFieldsValue({ routineStepResponse: updatedValues });
                    }
                }
            });
        } else {
            remove(field.name);
            const currentValues = form.getFieldValue('routineStepResponse');
            if (currentValues && currentValues.length > 0) {
                const updatedValues = currentValues.map((step, index) => ({
                    ...step,
                    stepOrder: index + 1
                }));
                form.setFieldsValue({ routineStepResponse: updatedValues });
            }
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
                initialValues={{
                    name: '',
                    description: '',
                    skinTypeId: undefined,
                    routineStepResponse: [
                        {
                            stepName: '',
                            description: '',
                            stepOrder: 1,
                            productResponse: []
                        }
                    ]
                }}
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
                    rules={[
                        { required: true, message: 'Vui lòng chọn loại da' },
                        {
                            validator: (_, value) => {
                                if (!value) return Promise.resolve();
                                
                                const existingRoutine = checkRoutineExistsForSkinType(value);
                                if (existingRoutine) {
                                    return Promise.reject(new Error(`Đã tồn tại quy trình cho loại da này (${existingRoutine.name})`));
                                }
                                return Promise.resolve();
                            }
                        }
                    ]}
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
                    name="routineStepResponse"
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
                                                onClick={() => handleRemoveStep(field, remove)}
                                            />
                                        )
                                    }
                                >
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
                                        noStyle
                                        name={[field.name, 'stepOrder']}
                                        initialValue={index + 1}
                                    >
                                        <Input type="hidden" />
                                    </Form.Item>

                                    <Form.Item
                                        name={[field.name, 'productResponse']}
                                        label="Sản phẩm khuyến nghị"
                                        rules={[{ required: true, message: 'Vui lòng chọn ít nhất một sản phẩm' }]}
                                    >
                                        <Select
                                            mode="multiple"
                                            placeholder="Chọn sản phẩm"
                                            disabled={!selectedSkinType}
                                            loading={loading}
                                            optionFilterProp="children"
                                        >
                                            {products.map(product => (
                                                <Option key={product.id} value={product.id.toString()}>
                                                    <div className="flex align-items-center">
                                                        {product.images && product.images.length > 0 && (
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
                                        stepOrder: fields.length + 1,
                                        productResponse: []
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