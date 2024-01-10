import React from "react";
import { useNavigate } from "react-router-dom";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { Sidebar, Header, Footer, ManageAssetsModalAdd, ManageAssetsModalDelete, ManageAssetsModalSearch, ManageAssetsDocket } from "src/views";

function ModalManager() {
    const { activeModal } = useAppContext();
    switch (activeModal.name) {
        case "ManageAssetsModalAdd": return <ManageAssetsModalAdd { ...activeModal.data } />;
        case "ManageAssetsModalSearch": return <ManageAssetsModalSearch { ...activeModal.data } />;
        case "ManageAssetsModalDelete": return <ManageAssetsModalDelete { ...activeModal.data } />;
        default: return null;
    }
}

function ManageAssets() {
    const { accountSize, contentMargin, navLinkHidden, sidebarWidth, toggleNav, theme } = useAppContext();
    const navigate = useNavigate();

    return (
        <div>
            <Sidebar toggleNav={toggleNav} sidebarWidth={sidebarWidth} accountSize={accountSize} navLinkHidden={navLinkHidden} />
            <ModalManager />
            <AppStyles.ThemedContent theme={theme} className="d-flex flex-column kwb-content" $contentMargin={contentMargin}>
                <div className="flex-grow-1">
                    <Header showBackButton={true} title="Manage Assets" goBack={() => navigate(-1)} />
                    <ManageAssetsDocket />
                </div>
                <Footer />
            </AppStyles.ThemedContent>
        </div>
    );
}

export default ManageAssets;
