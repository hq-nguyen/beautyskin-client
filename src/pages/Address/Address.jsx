import AccountSidebar from "../../components/AccountSidebar/AccountSidebar";
import ShippingAddress from "../../components/ShippingAddress/ShippingAddress";

function Address() {
    return (
        <div className="flex gap-5 max-w-[1200px] mx-auto p-5">
            <AccountSidebar />
            <ShippingAddress />
        </div>
    );
}

export default Address;
