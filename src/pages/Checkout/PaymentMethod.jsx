const PaymentMethodSelector = ({
    paymentMethod,
    setPaymentMethod
}) => (
    <div className="mt-8">
        <h2 className="text-xl font-medium text-[#d90429] mb-4">Phương thức thanh toán</h2>
        <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                    className={`border rounded ${paymentMethod === 'cod' ? 'bg-blue-500 text-white' : 'bg-gray-200'} p-4 flex flex-col items-center justify-center cursor-pointer`}
                    onClick={() => setPaymentMethod('cod')}
                >
                    <div className="w-8 h-8 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                        <span className="text-gray-600">👤</span>
                    </div>
                    <span className="text-center text-sm">Thanh toán khi nhận hàng</span>
                </div>
                <div
                    className={`border rounded ${paymentMethod === 'direct' ? 'bg-blue-500 text-white' : 'bg-gray-200'} p-4 flex flex-col items-center justify-center cursor-pointer`}
                    onClick={() => setPaymentMethod('direct')}
                >
                    <div className="w-8 h-8 bg-gray-200 rounded-full mb-2 flex items-center justify-center">
                        <span className="text-gray-600">📱</span>
                    </div>
                    <span className="text-center text-sm">Chuyển khoản trực tiếp</span>
                </div>
            </div>

            <div className="border rounded p-4 mt-6">
                <h3 className="font-medium text-[#d90429] mb-2">
                    {paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản trực tiếp'}
                </h3>
                {paymentMethod === 'cod' ? (
                    <p className="text-gray-700">Quý khách sẽ thanh toán bằng <span className="font-medium">tiền mặt</span> khi đơn vị vận chuyển giao hàng tận nơi.</p>
                ) : (
                    <p className="text-gray-700">Thanh toán bằng cách chuyển khoản trực tiếp.</p>
                )}
            </div>
        </div>
    </div>
);
export default PaymentMethodSelector;