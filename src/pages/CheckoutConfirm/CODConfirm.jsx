import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { toast } from "react-toastify";
import api from '../../config/axios';

const CODPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [orderData, setOrderData] = useState(null);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const defaultAddress = JSON.parse(localStorage.getItem('defaultAddress')) || 
                                    (location.state?.orderData?.shippingAddress);

                let shippingAddr = defaultAddress;

                if (!defaultAddress) {
                    const userId = localStorage.getItem('id');
                    const response = await api.get(`address/getByUser/${userId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    const defaultAddr = response.data.find(addr => addr.isDefault);
                    localStorage.setItem('defaultAddress', JSON.stringify(defaultAddr));
                    shippingAddr = defaultAddr;
                }

                const orderResponse = await api.get('order/getLastedOrder', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const order = orderResponse.data;

                setOrderData({
                    orderId: order.id.toString(),
                    total: order.totalPrice,
                    shippingFee: 0,
                    items: order.orderDetails.map(detail => ({
                        name: detail.product?.name || 'Unknown Product',
                        price: detail.unitPrice,
                        quantity: detail.quantity,
                    })),
                    shippingAddress: shippingAddr,
                    estimatedDelivery: '15-03-2025'
                });
            } catch (error) {
                console.error("Error fetching order data:", error);
                toast.error('Không thể tải thông tin đơn hàng gần nhất!');
            }
        };

        fetchOrderData();
    }, [location.state]);

    const handleContinueShopping = () => {
        navigate('/shop');
    };

    if (!orderData) {
        return <div className="text-center p-4">Đang tải...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-4 font-sans mt-8">
            {/* Success Header */}
            <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                    <CheckCircle2 className="w-16 h-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-medium text-[#d90429] mb-2">
                    Đặt hàng thành công!
                </h1>
                <p className="text-gray-600">
                    Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn sẽ được giao trong thời gian sớm nhất.
                </p>
                <p className="text-gray-600 mt-1">
                    Mã đơn hàng: <span className="font-bold">{orderData.orderId}</span>
                </p>
            </div>

            {/* Order Summary */}
            <div className="bg-white border border-gray-200 rounded p-6 mb-6">
                <h2 className="text-xl font-medium text-[#d90429] mb-4">
                    Thông tin đơn hàng
                </h2>
                <div className="border-b border-gray-200 pb-4 mb-4">
                    {orderData.items.map((item, index) => (
                        <div key={index} className="flex justify-between py-2">
                            <div>
                                <p className="text-gray-800">{item.name}</p>
                                <p className="text-gray-600 text-sm">Số lượng: {item.quantity}</p>
                            </div>
                            <span className="text-gray-800 font-medium">
                                {(item.price * item.quantity).toLocaleString()} đ
                            </span>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-gray-700">Tạm tính:</span>
                        <span className="text-gray-800">
                            {orderData.total.toLocaleString()} đ
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-700">Phí vận chuyển:</span>
                        <span className="text-gray-800">
                            {orderData.shippingFee.toLocaleString()} đ
                        </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-lg font-medium">Tổng cộng:</span>
                        <span className="text-lg font-bold text-[#d90429]">
                            {orderData.total.toLocaleString()} đ
                        </span>
                    </div>
                </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white border border-gray-200 rounded p-6 mb-6">
                <h2 className="text-xl font-medium text-[#d90429] mb-4">
                    Thông tin giao hàng
                </h2>
                <div className="space-y-2">
                    <p className="text-gray-800">
                        <span className="font-medium">Người nhận:</span> {orderData.shippingAddress?.name || 'Chưa có thông tin'}
                    </p>
                    <p className="text-gray-800">
                        <span className="font-medium">Số điện thoại:</span> {orderData.shippingAddress?.phone || 'Chưa có thông tin'}
                    </p>
                    <p className="text-gray-800">
                        <span className="font-medium">Địa chỉ:</span> {orderData.shippingAddress?.address || 'Chưa có thông tin'}
                    </p>
                    <p className="text-gray-800">
                        <span className="font-medium">Phương thức thanh toán:</span> Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="text-gray-800">
                        <span className="font-medium">Dự kiến giao hàng:</span> {orderData.estimatedDelivery}
                    </p>
                </div>
            </div>

            {/* Instructions */}
            <div className="bg-red-50 border border-red-200 rounded p-6 mb-6">
                <h3 className="text-lg font-medium text-[#d90429] mb-2">
                    Hướng dẫn thanh toán COD
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    <li>Vui lòng chuẩn bị số tiền chính xác: {orderData.total.toLocaleString()} đ</li>
                    <li>Kiểm tra kỹ sản phẩm khi nhận hàng</li>
                    <li>Liên hệ ngay nếu có vấn đề với đơn hàng</li>
                    <li>Thời gian giao hàng có thể thay đổi tùy theo khu vực</li>
                </ul>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4">
                <button
                    onClick={handleContinueShopping}
                    className="bg-[#EE1F5B] text-white py-3 px-6 rounded text-sm font-medium hover:bg-[#d90429]"
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        </div>
    );
};

export default CODPage;