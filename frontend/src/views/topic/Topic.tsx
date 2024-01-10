import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { Sidebar, Header, Footer, TopicModalSearchRelatedArticles, TopicDocketRelatedArticles } from "src/views";

function ModalManager() {
    const { activeModal } = useAppContext();
    switch (activeModal.name) {
        case "TopicModalSearchRelatedArticles": return <TopicModalSearchRelatedArticles { ...activeModal.data } />;
        default: return null;
    }
}

function Topic() {
    const { accountSize, contentMargin, navLinkHidden, sidebarWidth, toggleNav, theme } = useAppContext();
    const location = useLocation();
    const topic = location.state.topicObject;
    const navigate = useNavigate();

    return (
        <div>
            <Sidebar toggleNav={toggleNav} sidebarWidth={sidebarWidth} accountSize={accountSize} navLinkHidden={navLinkHidden} />
            <ModalManager />
            <AppStyles.ThemedContent theme={theme} className="d-flex flex-column kwb-content" $contentMargin={contentMargin}>
                <div className="flex-grow-1">
                    <Header showBackButton={true} title={topic.title} goBack={() => navigate(-1)} />
                    <TopicDocketRelatedArticles topicId={topic.id} />
                </div>
                <Footer />
            </AppStyles.ThemedContent>
        </div>
    );
}

export default Topic;
