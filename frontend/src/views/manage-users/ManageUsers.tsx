import React from "react";
import { useNavigate } from "react-router-dom";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { Sidebar, Header, Footer, ManageUsersModalCreate, ManageUsersModalUpdate, ManageUsersModalSearch, ManageUsersModalDelete, ManageUsersDocket } from "src/views";

function ModalManager() {
    const { activeModal } = useAppContext();
    switch (activeModal.name) {
        case "ManageUsersModalCreate": return <ManageUsersModalCreate { ...activeModal.data } />;
        case "ManageUsersModalUpdate": return <ManageUsersModalUpdate { ...activeModal.data } />;
        case "ManageUsersModalSearch": return <ManageUsersModalSearch { ...activeModal.data } />;
        case "ManageUsersModalDelete": return <ManageUsersModalDelete { ...activeModal.data } />;
        default: return null;
    }
}

function ManageUsers() {
    const { accountSize, contentMargin, navLinkHidden, sidebarWidth, toggleNav, theme } = useAppContext();
    const navigate = useNavigate();

    return (
        <div>
            <Sidebar toggleNav={toggleNav} sidebarWidth={sidebarWidth} accountSize={accountSize} navLinkHidden={navLinkHidden} />
            <ModalManager />
            <AppStyles.ThemedContent theme={theme} className="d-flex flex-column kwb-content" $contentMargin={contentMargin}>
                <div className="flex-grow-1">
                    <Header showBackButton={true} title="Manage Users" goBack={() => navigate(-1)} />
                    <ManageUsersDocket />
                </div>
                <Footer />
            </AppStyles.ThemedContent>
        </div>
    );
}

export default ManageUsers;
