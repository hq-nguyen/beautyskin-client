import { Modal, Form, Input, Button, Row, Col } from 'antd';

const AddStaff = ({ visible, onCancel, onSave }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newStaff = {
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
        email: values.mail,
        fullName: values.fullName
      };

      onSave(newStaff);
      form.resetFields();
    }).catch((errorInfo) => {
      console.log('Validation Failed:', errorInfo);
    });
  };

  return (
    <Modal
      title="Thêm nhân viên mới"
      open={visible}
      onCancel={onCancel}
      width={500} // Reduced width
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Thêm nhân viên
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="fullName" 
              label="Họ và tên" 
              rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="username" 
              label="Tên đăng nhập" 
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                { min: 4, message: 'Tên đăng nhập phải có ít nhất 4 ký tự' }
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item 
          name="mail" 
          label="Email" 
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]}
        >
          <Input />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              name="password" 
              label="Mật khẩu" 
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' }
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              name="confirmPassword" 
              label="Xác nhận mật khẩu" 
              dependencies={['password']}
              rules={[
                { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddStaff;