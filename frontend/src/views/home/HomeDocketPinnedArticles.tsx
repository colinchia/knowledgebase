import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { stripHtmlTags } from "src/utils/AppFunctions";
import { getAllArticles, getPinnedArticles, pinArticle } from "src/utils/AppApiInterfacers";

function HomeDocketPinnedArticles() {
    const { theme } = useAppContext();
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [pinnedArticles, setPinnedArticles] = useState<Set<number>>(new Set());

    useEffect(() => {
        handleGetAll();
        handleGetPinnedArticles();
    }, []);

    useEffect(() => {
        setFilteredArticles(articles);
    }, [articles]);

    const isPinned = (articleId: number): boolean => {
        return pinnedArticles.has(articleId);
    };

    const handleGetAll = () => {
        getAllArticles(
            (data) => {
                process.env.NODE_ENV === "development" && console.log("Success: Fetched all articles");
                setArticles(data);
            }, 
            (error) => {
                console.error("Error: ", error);
            }
        );
    };
    
    const handleGetPinnedArticles = () => {
        const userIdString = localStorage.getItem("sessionId") || "";

        if (userIdString) {
            const userId = parseInt(userIdString, 10);
            getPinnedArticles(userId, 
                (data: Article[]) => {
                    process.env.NODE_ENV === "development" && console.log("Success: Fetched all pinned articles");
                    setPinnedArticles(new Set(data.map(article => article.id)));
                }, 
                (error) => {
                    console.error("Error: ", error);
                }
            );
        } else {
            console.error("Error: User ID is null");
        }
    };

    const handlePinArticle = (articleId: number) => {
        const userIdString = localStorage.getItem("sessionId") || "";
        const pinState = !isPinned(articleId);

        if (userIdString) {
            const userId = parseInt(userIdString, 10);
            pinArticle(userId, articleId, pinState,
                () => {
                    const newPinnedArticles = new Set(pinnedArticles);
                    pinState ? newPinnedArticles.add(articleId) : newPinnedArticles.delete(articleId);
                    setPinnedArticles(newPinnedArticles);
                },
                (error) => {
                    console.error("Error:", error);
                }
            );
        } else {
            console.error("Error: User ID is null");
        }
    };

    return (
        <div className="container kwb-docket">
            {pinnedArticles.size > 0 && <h2>Pinned</h2>}
            {filteredArticles
                .filter(article => pinnedArticles.has(article.id))
                .map((article, index) => (
                    <AppStyles.ThemedDocketCard theme={theme} key={index} className="container kwb-docket-card">
                        <div className="row">
                            <div className="col-2 d-flex align-items-center justify-content-center">
                                <span onClick={() => handlePinArticle(article.id)}>
                                    {isPinned(article.id) ?
                                        <i className="bi bi-pin-angle-fill kwb-docket-iconpin"></i> :
                                        <i className="bi bi-pin-angle kwb-docket-iconpin"></i>}
                                </span>
                                <div className="kwb-img-rounded rounded-circle kwb-docket-img" style={{backgroundImage: `url(${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/portraits/${article.author.split("\\").pop()})`}}></div>
                            </div>
                            <div className="col-10 kwb-docket-colcenter">
                                <Link to="/article" state={{ articleObject: article }} className="text-decoration-none text-reset">
                                    <p className="kwb-docket-title">{article.title}</p>
                                    <p className="kwb-docket-text">{stripHtmlTags(article.description)}</p>
                                </Link>
                            </div>
                        </div>
                    </AppStyles.ThemedDocketCard>
            ))}
        </div>
    );
}

export default HomeDocketPinnedArticles;
