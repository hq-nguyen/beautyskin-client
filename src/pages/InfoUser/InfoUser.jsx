    import UpdateInfoUser from "../../components/AccountInfo/UpdateInfoUser";
    import AccountSidebar from "../../components/AccountSidebar/AccountSidebar";

    function InfoUser() {
        return (
            <div className="flex gap-5 max-w-[1200px] mx-auto p-5">
                <AccountSidebar />
                <UpdateInfoUser />
            </div>
        );
    }

    export default InfoUser;