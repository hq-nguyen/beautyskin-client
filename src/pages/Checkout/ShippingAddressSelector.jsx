import { Link } from "react-router-dom";

const ShippingAddressSelector = ({
    addresses,
    selectedAddressId,
    handleAddressSelect
}) => (
    <div className="bg-white rounded border border-gray-200 p-4">
        <h2 className="text-xl font-medium text-red-800 mb-4">Thông tin nhận hàng</h2>
        <div className="mb-4">
            {addresses.length > 0 ? (
                addresses.map((address) => (
                    <div className="flex items-center mb-4" key={address.id}>
                        <input
                            type="radio"
                            id={`address-${address.id}`}
                            name="address"
                            className="mr-2 h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                            checked={selectedAddressId === address.id}
                            onChange={() => handleAddressSelect(address.id)}
                        />
                        <div>
                            <p className="font-medium">{address.name}</p>
                            <p className="text-gray-600">{address.address}</p>
                            <p className="text-gray-600">{address.ward}, {address.district}, {address.province}</p>
                            <p className="text-gray-600">{address.phone}</p>
                            {address.isDefault && <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded mt-1 inline-block">Mặc định</span>}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-600 mb-4">Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ mới.</p>
            )}
            <button className='bg-[#EE1F5B] text-white px-4 py-2 rounded uppercase text-sm font-medium'>
                <Link to={'/user/manage-address'}>Thêm địa chỉ mới</Link>
            </button>
        </div>
    </div>
);

export default ShippingAddressSelector;