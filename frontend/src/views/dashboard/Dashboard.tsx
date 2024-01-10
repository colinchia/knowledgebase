import React, { useEffect } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { Sidebar, Header, Footer, DashboardGallery } from "src/views";

function Dashboard() {
    const { accountSize, contentMargin, navLinkHidden, sidebarWidth, toggleNav, theme, setInitPage } = useAppContext();

    useEffect(() => {
        setInitPage("/admin/dashboard");
    }, []);

    return (
        <div>
            <Sidebar toggleNav={toggleNav} sidebarWidth={sidebarWidth} accountSize={accountSize} navLinkHidden={navLinkHidden} />
            <AppStyles.ThemedContent theme={theme} className="d-flex flex-column kwb-content" $contentMargin={contentMargin}>
                <div className="flex-grow-1">
                    <Header showBackButton={false} title="Admin Dashboard" />
                    <DashboardGallery />
                </div>
                <Footer />
            </AppStyles.ThemedContent>
        </div>
    );
}

export default Dashboard;
