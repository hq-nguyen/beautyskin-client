import { X } from "lucide-react";

const PromotionSection = ({
    promotionCode,
    setPromotionCode,
    appliedPromotion,
    applyCoupon,
    removeAppliedPromotion
}) => (
    <div className="mt-8">
        <div className="flex mb-2">
            <input
                type="text"
                placeholder="Nhập mã giảm giá"
                className="flex-1 border border-gray-300 rounded-l p-2"
                value={promotionCode}
                onChange={(e) => setPromotionCode(e.target.value)}
                disabled={appliedPromotion}
            />
            {!appliedPromotion ? (
                <button
                    className="bg-[#EE1F5B] text-white px-4 py-2 rounded-r uppercase text-sm font-medium"
                    onClick={applyCoupon}
                >
                    Áp dụng
                </button>
            ) : (
                <button
                    className="bg-gray-400 text-white px-4 py-2 rounded-r uppercase text-sm font-medium"
                    onClick={removeAppliedPromotion}
                >
                    Hủy
                </button>
            )}
        </div>

        {appliedPromotion && (
            <div className="mt-2 bg-green-100 p-2 rounded flex justify-between items-center">
                <span className="text-green-800">
                    Đã áp dụng: {appliedPromotion.name} - Giảm {appliedPromotion.promoAmount.toLocaleString()} đ
                </span>
                <button
                    onClick={removeAppliedPromotion}
                    className="text-red-600 hover:text-red-800"
                >
                    <X size={20} />
                </button>
            </div>
        )}

        <p className="text-gray-600 text-sm mb-1">- Sau khi áp dụng, Mã giảm giá có thể không dùng được trong vòng 15 phút.</p>
        <p className="text-gray-600 text-sm">- Trong quá trình thanh toán, chúng tôi sẽ tạm khóa mã giảm giá của quý khách để đảm bảo phiên giao dịch được ổn định.</p>
    </div>
);

export default PromotionSection;