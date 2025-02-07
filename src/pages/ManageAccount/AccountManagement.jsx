import AccountContent from "../../components/AccountContent/AccountContent";
import AccountSidebar from "../../components/AccountSidebar/AccountSidebar";

function AccountManagement() {
    return (
        <>
            <div className="flex gap-5 max-w-[1200px] mx-auto p-5">
                <AccountSidebar />
                <AccountContent />
            </div>
        </>
    );
}

export default AccountManagement;