import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';

const { Option } = Select;

const AddStaff = ({ visible, onCancel, onSave }) => {
    const [form] = Form.useForm();

    const handleOk = () => {
        form.validateFields().then((values) => {
            // Convert date to string format
            const newStaff = {
                ...values,
                dob: values.dob.format('YYYY-MM-DD'),
                dateOfJoining: values.dateOfJoining.format('YYYY-MM-DD'),
            };
            onSave(newStaff);
            form.resetFields(); // Reset form fields after saving
        });
    };

    return (
        <Modal
            title="Thêm nhân viên mới"
            open={visible}
            onCancel={onCancel}
            footer={null} // Remove default OK/Cancel buttons
        >
            <Form form={form} layout="vertical">
                <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="phoneNumber" label="Số điện thoại" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true }]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
                    <Select placeholder="Chọn giới tính">
                        <Option value="Male">Nam</Option>
                        <Option value="Female">Nữ</Option>
                        <Option value="Other">Khác</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                    <Select placeholder="Chọn trạng thái">
                        <Option value="active">Hoạt động</Option>
                        <Option value="inactive">Ngừng hoạt động</Option>
                    </Select>
                </Form.Item>
                <Form.Item name="numberOfOrderProcessed" label="Số lượng đơn hàng đã xử lý" rules={[{ required: true }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item name="dateOfJoining" label="Ngày tham gia" rules={[{ required: true }]}>
                    <DatePicker />
                </Form.Item>

                <Button type="primary" onClick={handleOk}>
                    Thêm nhân viên
                </Button>
            </Form>
        </Modal>
    );
};

export default AddStaff;
