import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useGetParams from "../../hooks/useGetParams";
import { updateStatusPayment } from "../../apis/order";
import { clearCart } from "../../redux/features/cartSlice";
import { FaCheckCircle, FaHistory, FaHome, FaTimesCircle } from "react-icons/fa";
import { formatCurrency } from "../../utils/format";

const PaymentResult = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [paymentStatus, setPaymentStatus] = useState(true);
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState({
        orderNumber: "ORD123456789",
        amount: 1299.99,
        paymentMethod: "VNPAY",
        transactionDate: new Date(),
    });
    const [order, setOrder] = useState({});
    const getParams = useGetParams();
    const orderId = getParams("orderId");
    const status = getParams("vnp_TransactionStatus");

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const changeStatus = async () => {
        try {
            let statusEnum;
            if (status === "00") {
                setPaymentStatus(true);
                statusEnum = "PAID";
                
                // Only update payment status when payment is successful
                const response = await updateStatusPayment(orderId, statusEnum);
                
                if (response?.paymentStatus === "PAID") {
                    dispatch(clearCart());
                    setOrder(response);
                }
                console.log("Payment successful:", response);
            } else {
                setPaymentStatus(false);
                statusEnum = "CANCELLED";
                
                // For failed payments, we still need to fetch order details to display
                // but we won't update its status to maintain data integrity
                console.log("Payment failed with status:", status);
                
                // Instead of updating the order, we might want to cancel it or mark it as failed
                // This depends on your business logic
                const response = await updateStatusPayment(orderId, statusEnum);
                setOrder(response);
            }
            
            // Clear the pending order ID from localStorage
            localStorage.removeItem('pendingOrderId');
        } catch (error) {
            console.error("Error processing payment result:", error);
            setPaymentStatus(false);
        }
    }

    useEffect(() => {
        if (orderId) {
            changeStatus();
        }
    }, [orderId]);

    const failedMessage = [
        "Không đủ tiền trong tài khoản",
        "Thẻ hết hạn",
        "Thẻ bị khóa",
        "Kết nối mạng không ổn định",
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
                <div
                    className={`p-8 ${paymentStatus ? "bg-green-50" : "bg-red-50"}`}
                >
                    {paymentStatus ? (
                        <div className="text-center">
                            <FaCheckCircle className="mx-auto h-16 w-16 text-green-500 animate-bounce" />
                            <h2 className="mt-4 text-3xl font-bold text-green-800">
                                Thanh toán thành công!
                            </h2>
                            <div className="mt-6 space-y-4 text-left">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Mã đơn hàng:</span>
                                    <span className="font-semibold">{order?.id}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Tổng tiền:</span>
                                    <span className="font-semibold">
                                        {order?.totalPrice ? formatCurrency(order.totalPrice.toFixed(2)) : "N/A"}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Phương thức thanh toán:</span>
                                    <span className="font-semibold">
                                        {orderDetails.paymentMethod}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Thời gian thanh toán:</span>
                                    <span className="font-semibold">{order?.orderDate}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <FaTimesCircle className="mx-auto h-16 w-16 text-red-500 animate-bounce" />
                            <h2 className="mt-4 text-3xl font-bold text-red-800">
                                Thanh toán thất bại!
                            </h2>
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-red-700 mb-4">
                                    Nguyên nhân có thể:
                                </h3>
                                <ul className="text-left space-y-2">
                                    {failedMessage.map((reason, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="mr-2">•</span>
                                            <span className="text-gray-700">{reason}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-6 text-gray-600">
                                    Vui lòng thử lại hoặc liên hệ với bộ phận hỗ trợ nếu sự cố vẫn tiếp diễn.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-gray-50 space-y-4">
                    <button
                        className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        onClick={() => (navigate("/"))}
                    >
                        <FaHome className="mr-2" /> Trở về trang chủ
                    </button>
                    <button
                        className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        onClick={() => (navigate("/user/manage-order"))}
                    >
                        <FaHistory className="mr-2" /> Xem lịch sử đơn hàng
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PaymentResult;