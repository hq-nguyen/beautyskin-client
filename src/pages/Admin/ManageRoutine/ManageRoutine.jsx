import { useState, useEffect } from 'react';
import {
    Layout,
    Typography,
    Button,
    Card,
    Table,
    Space,
    Modal,
    message,
    Tag
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined
} from '@ant-design/icons';
import RoutineForm from './RoutineForm';
import { ProductAttributeService } from '../../../apis/productAttribute';
import {
    createRoutine,
    deleteRoutine,
    fetchRoutines,
    updateRoutine
} from '../../../apis/routine';

const { Title, Text } = Typography;
const { Content } = Layout;

const ManageRoutine = () => {
    const [skinTypes, setSkinTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState(null);
    const [initialValues, setInitialValues] = useState({
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
    });
    const [routines, setRoutines] = useState([]);

    useEffect(() => {
        fetchSkinTypes();
        getAllRoutines();
    }, []);

    const fetchSkinTypes = async () => {
        try {
            setLoading(true);
            const data = await ProductAttributeService.getSkinType();
            setSkinTypes(data);
        } catch (error) {
            message.error('Không thể tải loại da. Vui lòng thử lại sau.');
            console.error('Error fetching skin types:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAllRoutines = async () => {
        try {
            setLoading(true);
            const data = await fetchRoutines();
            const transformedData = data.map((routine) => ({
                id: routine.id,
                name: routine.name,
                description: routine.description,
                skinTypeId: routine.skinTypeResponse.typeId,
                skinTypeName: routine.skinTypeResponse.type,
                routineStepResponse: routine.routineStepResponse ? routine.routineStepResponse.map((step, stepIndex) => ({
                    id: stepIndex + 1,
                    stepName: step.stepName,
                    description: step.description,
                    stepOrder: step.stepOrder,
                    productResponse: step.productResponse || []
                })) : []
            }));
            setRoutines(transformedData);
        } catch (error) {
            message.error('Không thể tải quy trình chăm sóc da. Vui lòng thử lại sau.');
            console.error('Error fetching routines:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRoutine = () => {
        setEditingRoutine(null);
        setInitialValues({
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
        });
        setFormVisible(true);
    };

    const handleEditRoutine = (routine) => {
        setEditingRoutine(routine.id);

        const formattedValues = {
            ...routine,
            skinTypeId: routine.skinTypeId.toString(),
            routineStepResponse: routine.routineStepResponse.map(step => ({
                ...step,
                productResponse: step.productResponse.map(product => product.id.toString())
            }))
        };

        setInitialValues(formattedValues);
        setFormVisible(true);
    };

    const handleFormCancel = () => {
        setFormVisible(false);
        setEditingRoutine(null);
    };

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);

            const formattedValues = {
                ...values,
                skinTypeResponse: {
                    typeId: parseInt(values.skinTypeId),
                    type: skinTypes.find(type => type.id === parseInt(values.skinTypeId))?.name || ''
                },
                routineStepResponse: values.routineStepResponse.map(step => ({
                    stepName: step.stepName,
                    description: step.description,
                    stepOrder: step.stepOrder,
                    productResponse: step.productResponse.map(productId => ({
                        id: parseInt(productId),
                        name: "Product Name" 
                    }))
                }))
            };

            if (editingRoutine) {
                await updateRoutine(editingRoutine, formattedValues);
                message.success('Cập nhật quy trình thành công!');
            } else {
                await createRoutine(formattedValues);
                message.success('Thêm quy trình mới thành công!');
            }

            setFormVisible(false);
            setEditingRoutine(null);
            getAllRoutines();
        } catch (error) {
            message.error('Lưu quy trình thất bại. Vui lòng thử lại.');
            console.error('Error saving routine:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRoutine = (id) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa quy trình này không?',
            content: 'Hành động này không thể hoàn lại.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    setLoading(true);
                    await deleteRoutine(id);
                    setRoutines(routines.filter(routine => routine.id !== id));
                    message.success('Quy trình đã được xóa thành công!');
                } catch (error) {
                    message.error('Xóa quy trình thất bại. Vui lòng thử lại.');
                    console.error('Error deleting routine:', error);
                } finally {         
                    setLoading(false);
                }
            }
        });
    };

    const columns = [
        {
            title: 'Tên quy trình',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Loại da',
            dataIndex: 'skinTypeName',
            key: 'skinTypeName',
            render: (text) => <Tag color="blue">{text}</Tag>,
            filters: skinTypes.map(type => ({ text: type.name, value: type.name })),
            onFilter: (value, record) => record.skinTypeName === value,
        },
        {
            title: 'Số bước',
            key: 'steps',
            render: (_, record) => record.routineStepResponse.length,
            sorter: (a, b) => a.routineStepResponse.length - b.routineStepResponse.length,
        },
        {
            title: 'Hành động',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        type="text"
                        onClick={() => handleEditRoutine(record)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        type="text"
                        danger
                        onClick={() => handleDeleteRoutine(record.id)}
                    />
                </Space>
            ),
        },
    ];

    const expandedRowRender = (record) => (
        <div style={{ padding: '0 16px' }}>
            <Text strong>Các bước chăm sóc da:</Text>
            <div style={{ overflowX: 'auto' }}>
                <Table
                    columns={[
                        {
                            title: 'Bước',
                            dataIndex: 'stepOrder',
                            key: 'stepOrder',
                            width: 80,
                            fixed: 'left',
                        },
                        {
                            title: 'Tên',
                            dataIndex: 'stepName',
                            key: 'stepName',
                            width: 180,
                        },
                        {
                            title: 'Mô tả',
                            dataIndex: 'description',
                            key: 'description',
                            width: 280,
                        },
                        {
                            title: 'Sản phẩm khuyến nghị',
                            key: 'productResponse',
                            render: (_, record) => (
                                <>
                                    {record.productResponse.map((product) => (
                                        <Tag color="green" key={product.id} style={{ marginRight: '8px' }}>
                                            {product.name.length > 40 
                                              ? `${product.name.substring(0, 40)}...` 
                                              : product.name}
                                        </Tag>
                                    ))}
                                </>
                            ),
                            width: 500,
                        },
                    ]}
                    dataSource={record.routineStepResponse.sort((a, b) => a.stepOrder - b.stepOrder)}
                    pagination={false}
                    rowKey={record => record.id || record.stepOrder}
                    scroll={{ x: 1080 }}
                />
            </div>
        </div>
    );

    return (
        <Content style={{ padding: '24px' }}>
            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Title level={4}>Quản lý quy trình chăm sóc da</Title>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAddRoutine}
                    >
                        Thêm quy trình mới
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={routines}
                    rowKey="id"
                    loading={loading}
                    expandable={{
                        expandedRowRender,
                        rowExpandable: record => record.routineStepResponse && record.routineStepResponse.length > 0,
                    }}
                />
            </Card>

            <RoutineForm
                visible={formVisible}
                onCancel={handleFormCancel}
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                isEditing={!!editingRoutine}
            />
        </Content>
    );
};

export default ManageRoutine;