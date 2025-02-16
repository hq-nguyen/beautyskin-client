import { Link } from "react-router-dom";


const ShippingAddress = () => {
    return (
        <div className="flex-1 bg-white p-6 rounded-lg mt-[35px] shadow-[0px_0px_10px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Số địa chỉ nhận hàng</h2>
                <button className="bg-gray-800 text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-gray-700 transition-colors">
                    <Link to={'/user/add-address'}>Thêm địa chỉ mới →</Link> 
                </button>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-lg mb-2">Địa chỉ của tôi</h3>
                <div className="flex items-center gap-2">
                    <p className="text-gray-600">Hiện tại bạn chưa có địa chỉ nào!</p>
                    <Link to={'/user/add-address'} className="text-[#d90429] hover:underline">Thêm mới tại đây!</Link>
                </div>
            </div>
        </div>
    );
};

export default ShippingAddress;