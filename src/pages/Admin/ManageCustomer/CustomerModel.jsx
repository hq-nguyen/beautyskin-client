import PropTypes from 'prop-types';
import { Modal, Descriptions, Tag } from 'antd';

const CustomerModel = ({ customer, visible, onCancel }) => {
  return (
    <Modal
      title={`Thông tin nhân viên: ${customer?.name}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Descriptions bordered column={2} >
        <Descriptions.Item label="Họ và tên">{customer?.name}</Descriptions.Item>
        <Descriptions.Item label="Email">{customer?.email}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{customer?.phoneNumber}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{customer?.dateOfBirth}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{customer?.gender}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={customer?.status === 'Active' ? 'green' : 'red'}>
            {customer?.status?.toUpperCase()}
          </Tag>
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};
CustomerModel.propTypes = {
  customer: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phoneNumber: PropTypes.string,
    dateOfBirth: PropTypes.string,
    gender: PropTypes.string,
    status: PropTypes.string,
  }),
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CustomerModel;
