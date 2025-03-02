import { useState, useEffect } from 'react';
import {
    Layout,
    Typography,
    Button,
    Table,
    Card,
    Space,
    Tag,
    Modal,
    message,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import QuestionForm from './QuestionForm';
import { createQuiz, deleteQuiz, fetchQuizzes, updateQuiz } from '../../../apis/quiz';

const { Text, Paragraph } = Typography;
const { Content } = Layout;

const ManageQuiz = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedQuestion, setExpandedQuestion] = useState(null);
    const [formVisible, setFormVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [formInitialValues, setFormInitialValues] = useState({
        question: '',
        description: '',
        answers: [
            { answer: '', points: '1' },
            { answer: '', points: '2' },
            { answer: '', points: '3' },
            { answer: '', points: '4' }
        ]
    });

    useEffect(() => {
        const getQuizzes = async () => {
            try {
                setLoading(true);
                const quiz = await fetchQuizzes();
                setQuizzes(quiz);
                setError(null);
            }
            catch (error) {
                setError('Failed to load quizzes. Please try again later.');
                console.error('Error fetching quizzes:', error);
            } finally {
                setLoading(false);
            }
        };
        getQuizzes();
    }, [])


    const handleToggleExpand = (key) => {
        setExpandedQuestion(expandedQuestion === key ? null : key);
    };

    const handleEditQuestion = (quiz) => {
        setEditingQuestion(quiz.id);
        setFormInitialValues({
            question: quiz.question,
            description: quiz.description,
            answers: quiz.answers.map(a => ({
                answer: a.answer,
                points: a.points.toString()
            }))
        });
        setFormVisible(true);
    };

    const handleAddQuestion = () => {
        setEditingQuestion(null);
        setFormInitialValues({
            question: '',
            description: '',
            answers: [
                { answer: '', points: '1' },
                { answer: '', points: '2' },
                { answer: '', points: '3' },
                { answer: '', points: '4' }
            ]
        });
        setFormVisible(true);
    };

    const handleFormCancel = () => {
        setFormVisible(false);
        setEditingQuestion(null);
    };

    const handleFormSubmit = async (values) => {
        try {
            const formattedData = {
                ...values,
                answers: values.answers.map(ans => ({
                    ...ans,
                    point: parseInt(ans.point, 10) 
                }))
            };

            if (editingQuestion) {
                // Update existing question
                await updateQuiz(editingQuestion, formattedData);

                setQuizzes(prev =>
                    prev.map(quiz =>
                        quiz.id === editingQuestion ?
                            {
                                ...quiz,
                                ...formattedData,
                                answers: formattedData.answers.map((ans, idx) => ({
                                    ...ans,
                                    id: quiz.answers[idx]?.id || Date.now() + idx
                                }))
                            } :
                            quiz
                    )
                );
                message.success('Cập nhật câu hỏi thành công');
            } else {
                // Add new question
                const newQuiz = await createQuiz(formattedData);

                setQuizzes(prev => [...prev, newQuiz]);
                message.success('Thêm câu hỏi mới thành công');
            }

            setFormVisible(false);
            setEditingQuestion(null);
        } catch (err) {
            message.error('Failed to save question. Please try again.');
            console.error('Error saving question:', err);
        }
    };

    const handleDeleteQuestion = async (id) => {
        Modal.confirm({
            title: 'Bạn có chắc chắn muốn xóa câu hỏi này không?',
            content: 'Hành động này không thể hoàn lại.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteQuiz(id);
                    setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
                    message.success('Question deleted successfully');
                } catch (err) {
                    message.error('Failed to delete question. Please try again.');
                    console.error('Error deleting question:', err);
                }
            }
        });
    };

    // Show information about skin type scoring
    const showSkinTypeInfo = () => {
        Modal.info({
            title: 'Hướng dẫn đánh giá loại da',
            content: (
                <div>
                    <Paragraph>
                        Bài kiểm tra này giúp xác định loại da dựa trên tổng số điểm đạt được:
                    </Paragraph>
                    <ul>
                        <li><Text strong>Từ 0-10:</Text> Da khô</li>
                        <li><Text strong>Từ 11-20:</Text> Da thường</li>
                        <li><Text strong>Từ 21-30:</Text> Da tổng hợp</li>
                        <li><Text strong>Từ 31-40:</Text> Da dầu</li>
                    </ul>
                    <Paragraph>
                        Mỗi phương án trả lời sẽ được chấm điểm từ 1-4, số càng cao thường biểu thị xu hướng da dầu.
                    </Paragraph>
                </div>
            ),
            width: 600,
        });
    };

    // Columns for the answers table in the expanded view
    const answerColumns = [
        {
            title: 'Câu trả lời',
            dataIndex: 'answer',
            key: 'answer',
            width: '70%',
        },
        {
            title: 'Điểm số',
            dataIndex: 'points',
            key: 'points',
            width: '30%',
            render: (points) => (
                <Tag color={
                    points === 1 ? 'cyan' :
                        points === 2 ? 'blue' :
                            points === 3 ? 'purple' :
                                'magenta'
                }>
                    {points} điểm 
                </Tag>
            )
        }
    ];

    // Columns for main questions table
    const columns = [
        {
            title: 'Câu hỏi',
            dataIndex: 'question',
            key: 'question',
            render: (text, record) => (
                <div>
                    <div>{text}</div>
                    {record.description && (
                        <Text type="secondary" style={{ fontSize: '12px' }}>{record.description}</Text>
                    )}
                </div>
            ),
        },
        {
            title: 'Khoảng điểm số',
            key: 'pointsRange',
            width: 150,
            render: (_, record) => {
                const min = Math.min(...record.answers.map(a => a.points));
                const max = Math.max(...record.answers.map(a => a.points));
                return <Text>{min} - {max} điểm</Text>;
            },
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
                        onClick={() => handleEditQuestion(record)}
                    />
                    <Button
                        icon={<DeleteOutlined />}
                        type="text"
                        danger
                        onClick={() => handleDeleteQuestion(record.id)}
                    />
                </Space>
            ),
        },
    ];

    if (error) return <div style={{ padding: '20px', color: 'red' }}>{error}</div>;

    return (
        <Layout>
            <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h1 className='text-2xl font-bold mb-4 text-black'>Quản lí trắc nghiệm loại da</h1>
                    <Space>
                        <Button
                            icon={<InfoCircleOutlined />}
                            onClick={showSkinTypeInfo}
                        >
                            Hướng dẫn tính điểm
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={handleAddQuestion}
                        >
                            Thêm câu hỏi?
                        </Button>
                    </Space>
                </div>

                {/* Questions List */}
                <Card>
                    <Paragraph>
                        Bài kiểm tra này giúp người dùng xác định loại da của họ dựa trên phản hồi của họ.
                        Mỗi câu trả lời được chấm từ 1-4 điểm, với tổng điểm cho biết loại da của người dùng.
                    </Paragraph>
                    <Table
                        columns={columns}
                        dataSource={quizzes}
                        rowKey="id"
                        pagination={false}
                        loading={loading}
                        expandable={{
                            expandedRowRender: record => (
                                <div style={{ padding: '0 16px' }}>
                                    <Text strong>Các câu trả lời và điểm đánh giá</Text>
                                    <Table
                                        columns={answerColumns}
                                        dataSource={record.answers}
                                        rowKey="id"
                                        pagination={false}
                                        size="small"
                                        style={{ marginTop: '8px' }}
                                    />
                                </div>
                            ),
                            expandedRowKeys: expandedQuestion ? [expandedQuestion] : [],
                            onExpand: (expanded, record) => handleToggleExpand(expanded ? record.id : null)
                        }}
                        locale={{
                            emptyText: 'Không có câu hỏi nào. Bắt đầu bằng cách thêm câu hỏi mới.'
                        }}
                    />
                </Card>

                {/* Question Form Modal */}
                <QuestionForm
                    visible={formVisible}
                    onCancel={handleFormCancel}
                    onSubmit={handleFormSubmit}
                    initialValues={formInitialValues}
                    isEditing={Boolean(editingQuestion)}
                />
            </Content>
        </Layout>
    );
};

export default ManageQuiz;