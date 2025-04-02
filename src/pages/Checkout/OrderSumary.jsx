const OrderSummary = ({
    totalPrice,
    originalTotalPrice,
    totalQuantity,
    totalDiscount
}) => (
    <div className="mt-8">
        <div className="flex justify-between py-2">
            <span className="text-gray-700">Tạm tính:</span>
            <span className="font-bold">{originalTotalPrice.toLocaleString()} đ</span>
        </div>
        <div className="flex justify-between py-2">
            <span className="text-gray-700">Giảm giá:</span>
            <span className="text-[#d90429] font-bold">-{totalDiscount.toLocaleString()} đ</span>
        </div>
        <div className="flex justify-between py-2">
            <span className="text-gray-700">Phí vận chuyển:</span>
            <span className="font-bold">0 đ</span>
        </div>
        <div className="flex justify-between py-4 border-t border-gray-200 mt-2">
            <span className="text-lg font-medium">Tổng giá trị đơn hàng:</span>
            <span className="text-xl font-bold text-[#d90429]">{totalPrice.toLocaleString()} đ</span>
        </div>
    </div>
);

export default OrderSummary;