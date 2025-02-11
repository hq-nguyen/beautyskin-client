import AccountSidebar from "../../components/AccountSidebar/AccountSidebar";
import OrderManagement from "../../components/Order";


function Order() {
    return (
        <div className="flex gap-5 max-w-[1200px] mx-auto p-5">
            <AccountSidebar />
            <OrderManagement />
        </div>
    );
}

export default Order;
