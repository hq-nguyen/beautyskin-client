import AccountSidebar from "../../components/AccountSidebar/AccountSidebar";
import ChangePasswordForm from "../../components/Password";


function ChangePassword() {
    return (
        <div className="flex gap-5 max-w-[1200px] mx-auto p-5">
            <AccountSidebar />
            <ChangePasswordForm />
        </div>
    );
}

export default ChangePassword;
