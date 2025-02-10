import AccountSidebar from "../../components/AccountSidebar/AccountSidebar";
import AddressManagement from "../../components/AddressManagement";


function AddressDefault() {
    return (
        <div className="flex gap-5 max-w-[1200px] mx-auto p-5">
            <AccountSidebar />
            <AddressManagement />
        </div>
    );
}

export default AddressDefault;
