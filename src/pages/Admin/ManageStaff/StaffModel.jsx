import PropTypes from 'prop-types';
import { Modal, Avatar, Descriptions, Tag } from 'antd';

const StaffModel = ({ staff, visible, onCancel }) => {
    return (
        <Modal
            title={`Thông tin nhân viên: ${staff?.name}`}
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Avatar src={staff?.avatar} size={100} />
            </div>
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Họ và tên">{staff?.name}</Descriptions.Item>
                <Descriptions.Item label="Email">{staff?.email}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{staff?.phoneNumber}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{staff?.dob}</Descriptions.Item>
                <Descriptions.Item label="Giới tính">{staff?.gender}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={staff?.status.toLowerCase() === 'active' ? 'green' : 'red'}>
                        {staff?.status?.toUpperCase()}
                    </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Số lượng đơn hàng đã xử lý">{staff?.numberOfOrderProcessed}</Descriptions.Item>
                <Descriptions.Item label="Ngày tham gia">{staff?.dateOfJoining}</Descriptions.Item>
                <Descriptions.Item label="Đơn hàng đã giao">
                    {staff?.assignedOrder && staff.assignedOrder.length > 0 ? (
                        staff.assignedOrder.map((order, index) => (
                            <Tag color="blue" key={index}>{order}</Tag>
                        ))
                    ) : (
                        "Chưa có đơn hàng"
                    )}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};
StaffModel.propTypes = {
    staff: PropTypes.shape({
        name: PropTypes.string,
        avatar: PropTypes.string,
        email: PropTypes.string,
        phoneNumber: PropTypes.string,
        dob: PropTypes.string,
        gender: PropTypes.string,
        status: PropTypes.string,
        numberOfOrderProcessed: PropTypes.number,
        dateOfJoining: PropTypes.string,
        assignedOrder: PropTypes.arrayOf(PropTypes.string),
    }),
    visible: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default StaffModel;
