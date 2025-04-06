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
        routineStepRequests: [
            {
                stepName: '',
                description: '',
                stepOrder: 1,
                products: []
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
            const transformedData = data.map(routine => ({
                id: routine.id,
                name: routine.name,
                description: routine.description,
                skinTypeId: routine.skinType.id,
                skinTypeName: routine.skinType.name,
                routineStepRequests: routine.routineSteps ? routine.routineSteps.map(step => ({
                    id: step.id,
                    stepName: step.stepName,
                    description: step.description,
                    stepOrder: step.stepOrder,
                    products: step.products || []
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
            routineStepRequests: [
                {
                    stepName: '',
                    description: '',
                    stepOrder: 1,
                    products: []
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
            routineStepRequests: routine.routineStepRequests.map(step => ({
                ...step,
                // Ensure products is an array of IDs as strings
                products: step.products.map(product => product.id.toString())
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

            if (editingRoutine) {
                // Update existing routine
                await updateRoutine(editingRoutine, values);
                message.success('Cập nhật quy trình thành công!');
            } else {
                // Add new routine
                await createRoutine(values);
                message.success('Thêm quy trình mới thành công!');
            }

            setFormVisible(false);
            setEditingRoutine(null);
            // Refresh data after update
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
            render: (_, record) => record.routineStepRequests.length,
            sorter: (a, b) => a.routineStepRequests.length - b.routineStepRequests.length,
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
                            // ellipsis: true,
                            width: 280,
                        },
                        {
                            title: 'Sản phẩm khuyến nghị',
                            key: 'products',
                            render: (_, record) => (
                                <>
                                    {record.products.map((product) => (
                                        <Tag color="green" key={product.id} style={{ marginRight: '8px' }}>
                                            {product.name.split(" ").slice(0, 6).join(" ")} ... - {product.category.name}
                                        </Tag>
                                    ))}
                                </>
                            ),
                            width: 500,
                        },
                    ]}
                    dataSource={record.routineStepRequests}
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
                        rowExpandable: record => record.routineStepRequests && record.routineStepRequests.length > 0,
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