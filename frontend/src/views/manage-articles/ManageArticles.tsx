import React from "react";
import { useNavigate } from "react-router-dom";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { Sidebar, Header, Footer, ManageArticlesModalCreate, ManageArticlesModalUpdate, ManageArticlesModalSearch, ManageArticlesModalDelete, ManageArticlesDocket } from "src/views";

function ModalManager() {
    const { activeModal } = useAppContext();
    switch (activeModal.name) {
        case "ManageArticlesModalCreate": return <ManageArticlesModalCreate { ...activeModal.data } />;
        case "ManageArticlesModalUpdate": return <ManageArticlesModalUpdate { ...activeModal.data } />;
        case "ManageArticlesModalSearch": return <ManageArticlesModalSearch { ...activeModal.data } />;
        case "ManageArticlesModalDelete": return <ManageArticlesModalDelete { ...activeModal.data } />;
        default: return null;
    }
}

function ManageArticles() {
    const { accountSize, contentMargin, navLinkHidden, sidebarWidth, toggleNav, theme } = useAppContext();
    const navigate = useNavigate();

    return (
        <div>
            <Sidebar toggleNav={toggleNav} sidebarWidth={sidebarWidth} accountSize={accountSize} navLinkHidden={navLinkHidden} />
            <ModalManager />
            <AppStyles.ThemedContent theme={theme} className="d-flex flex-column kwb-content" $contentMargin={contentMargin}>
                <div className="flex-grow-1">
                    <Header showBackButton={true} title="Manage Articles" goBack={() => navigate(-1)} />
                    <ManageArticlesDocket />
                </div>
                <Footer />
            </AppStyles.ThemedContent>
        </div>
    );
}

export default ManageArticles;
