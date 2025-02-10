import AccountSidebar from "../../components/AccountSidebar/AccountSidebar";
import AddressForm from "../../components/AddAddress/AddAdress";


function AddAddress() {
    return (
        <div className="flex gap-5 max-w-[1200px] mx-auto p-5">
            <AccountSidebar />
            <AddressForm />
        </div>
    );
}

export default AddAddress;
