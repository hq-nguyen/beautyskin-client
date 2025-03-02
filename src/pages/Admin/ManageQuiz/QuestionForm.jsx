import React from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    Divider,
    Modal
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const QuestionForm = ({
    visible,
    onCancel,
    onSubmit,
    initialValues,
    isEditing
}) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (visible) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [visible, form, initialValues]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const formattedValues = {
                ...values,
                answer: values.answers.map(ans => ({
                    ...ans,
                    point: parseInt(ans.points, 10)
                }))
            };
            onSubmit(formattedValues);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <Modal
            title={isEditing ? 'Cập nhật câu hỏi' : 'Thêm mới câu hỏi'}
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
                    name="question"
                    label="Câu hỏi"
                    rules={[{ required: true, message: 'Nhập câu hỏi' }]}
                >
                    <Input placeholder="Nhập câu hỏi tại đây" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả câu hỏi"
                    rules={[{ required: true, message: 'Nhập mô tả cho câu hỏi' }]}
                >
                    <TextArea placeholder="Nhập mô tả cho câu hỏi" rows={2} />
                </Form.Item>

                <Divider>Câu trả lời với số điểm tương ứng (1-4)</Divider>

                <Form.List name="answers">
                    {(fields) => (
                        <>
                            {fields.map((field, index) => (
                                <div key={field.key} style={{ display: 'flex', marginBottom: '8px' }}>
                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'answer']}
                                        fieldKey={[field.fieldKey, 'answer']}
                                        rules={[{ required: true, message: 'Vui lòng nhập câu trả lời' }]}
                                        style={{ flex: 1, marginRight: '12px', marginBottom: '8px' }}
                                    >
                                        <Input placeholder={`Câu trả lời ${index + 1}`} />
                                    </Form.Item>

                                    <Form.Item
                                        {...field}
                                        name={[field.name, 'points']}
                                        fieldKey={[field.fieldKey, 'point']}
                                        style={{ width: '150px', marginBottom: '8px' }}
                                    >
                                        <Select placeholder="Points">
                                            <Option value="1">1 điểm</Option>
                                            <Option value="2">2 điểm</Option>
                                            <Option value="3">3 điểm</Option>
                                            <Option value="4">4 điểm</Option>
                                        </Select>
                                    </Form.Item>
                                </div>
                            ))}
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
};

export default QuestionForm;
