import { Modal, Avatar, Descriptions, Tag } from 'antd';

const StaffModel = ({ staff, visible, onCancel }) => {
    return (
        <Modal
            title={`Thông tin nhân viên: ${staff?.fullName}`}
            open={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Họ và tên">{staff?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Email">{staff?.mail}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">
                    {staff?.phone? (
                            <Tag color="blue" >{staff?.completedOrders}</Tag>
                    ) : (
                        "Chưa cập nhật"
                    )}</Descriptions.Item>
                {/* <Descriptions.Item label="Số lượng đơn hàng đã xử lý">{staff?.numberOfOrderProcessed}</Descriptions.Item> */}
                <Descriptions.Item label="Đơn hàng đã giao">
                    {staff?.completedOrders? (
                            <Tag color="blue" >Đã hoàn thành {staff?.completedOrders} đơn hàng</Tag>
                    ) : (
                        "Chưa có đơn hàng"
                    )}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default StaffModel;
