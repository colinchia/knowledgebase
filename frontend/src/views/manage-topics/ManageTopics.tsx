import React from "react";
import { useNavigate } from "react-router-dom";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { Sidebar, Header, Footer, ManageTopicsModalCreate, ManageTopicsModalUpdate, ManageTopicsModalSearch, ManageTopicsModalDelete, ManageTopicsDocket } from "src/views";

function ModalManager() {
    const { activeModal } = useAppContext();
    switch (activeModal.name) {
        case "ManageTopicsModalCreate": return <ManageTopicsModalCreate { ...activeModal.data } />;
        case "ManageTopicsModalUpdate": return <ManageTopicsModalUpdate { ...activeModal.data } />;
        case "ManageTopicsModalSearch": return <ManageTopicsModalSearch { ...activeModal.data } />;
        case "ManageTopicsModalDelete": return <ManageTopicsModalDelete { ...activeModal.data } />;
        default: return null;
    }
}

function ManageTopics() {
    const { accountSize, contentMargin, navLinkHidden, sidebarWidth, toggleNav, theme } = useAppContext();
    const navigate = useNavigate();

    return (
        <div>
            <Sidebar toggleNav={toggleNav} sidebarWidth={sidebarWidth} accountSize={accountSize} navLinkHidden={navLinkHidden} />
            <ModalManager />
            <AppStyles.ThemedContent theme={theme} className="d-flex flex-column kwb-content" $contentMargin={contentMargin}>
                <div className="flex-grow-1">
                    <Header showBackButton={true} title="Manage Topics" goBack={() => navigate(-1)} />
                    <ManageTopicsDocket />
                </div>
                <Footer />
            </AppStyles.ThemedContent>
        </div>
    );
}

export default ManageTopics;
