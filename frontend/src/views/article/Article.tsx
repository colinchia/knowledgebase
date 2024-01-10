import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { Footer, Header, Sidebar, Tooltip } from "src/views";

type ArticleWithDetails = Article & {
    assets?: Asset[];
};

function Article() {
    const { accountSize, contentMargin, navLinkHidden, sidebarWidth, theme, toggleNav } = useAppContext();
    const location = useLocation();
    const article = location.state.articleObject as ArticleWithDetails;
    const navigate = useNavigate();

    const handleAssetClick = (assetItem: Asset) => {
        const assetUrl = `${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/assets/${assetItem.filepath.split("\\").pop()}`;
        
        if (shouldBeOpenedInNewTab(assetItem.filetype)) {
            window.open(assetUrl, "_blank");
        } else {
            // Trigger download for file types that can't be opened in a new tab
            const link = document.createElement("a");
            link.href = assetUrl;
            link.download = assetItem.filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const shouldBeOpenedInNewTab = (filetype: string): boolean => {
        const openInNewTabFileTypes = [
            "image/gif", "image/jpeg", "image/jpg", "image/png", "image/webp",
            "video/avi", "video/mov", "video/mp4", "video/wmv",
            "audio/mp3", "audio/mpeg", "audio/wav"
        ];
        return openInNewTabFileTypes.includes(filetype);
    };

    return (
        <div>
            <Sidebar accountSize={accountSize} navLinkHidden={navLinkHidden} sidebarWidth={sidebarWidth} toggleNav={toggleNav} />
            <AppStyles.ThemedContent className="d-flex flex-column kwb-content" $contentMargin={contentMargin} theme={theme}>
                <div className="flex-grow-1">
                    <Header showBackButton={true} title={article.title} goBack={() => navigate(-1)} />
                    <article className="container kwb-homearticle-description" dangerouslySetInnerHTML={{ __html: article.description }}></article>
                    <div id="article-assets" className="container">
                        <div className="row">
                            {article.assets && article.assets.map((assetItem) => (
                                <div key={assetItem.id} className="col-md-2 mb-4" onClick={() => handleAssetClick(assetItem)}>
                                    <div className="card kwb-asset-tile">
                                        <div className="position-relative">
                                            <div className="card-img-top bg-secondary d-flex justify-content-center align-items-center text-white kwb-docket-card-imagecontainer">
                                                <img src={`${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/thumbnails/${assetItem.thumbnail.split("\\").pop()}`} className="kwb-docket-card-image" />
                                            </div>
                                        </div>
                                        <Tooltip text={assetItem.filename}>
                                            <div className="card-footer text-truncate kwb-docket-cardfooter">{assetItem.filename}</div>
                                        </Tooltip>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <Footer />
            </AppStyles.ThemedContent>
        </div>
    );
}

export default Article;
