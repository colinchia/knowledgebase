import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { stripHtmlTags } from "src/utils/AppFunctions";
import { getArticlesByTopicId, getPinnedArticles, pinArticle } from "src/utils/AppApiInterfacers";

type ArticleWithDetails = Article & {
    topics: Topic[];
    assets: Asset[];
    [key: string]: any;
};

type TopicDocketRelatedArticlesProps = {
    topicId: number;
};

function TopicDocketRelatedArticles({ topicId }: TopicDocketRelatedArticlesProps) {
    const { openModal, theme } = useAppContext();
    const [articles, setArticles] = useState<ArticleWithDetails[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<ArticleWithDetails[]>([]);
    const [sortOrder, setSortOrder] = useState<string>("Newest to oldest");
    const [pinnedArticles, setPinnedArticles] = useState<Set<number>>(new Set());

    useEffect(() => {
        handleGetAll();
        handleGetPinnedArticles();
    }, []);

    useEffect(() => {
        const sortedArticles = sortArticles([...articles]);
        setFilteredArticles(sortedArticles);
    }, [articles, sortOrder]);

    const isPinned = (articleId: number) => {
        return pinnedArticles.has(articleId);
    };

    const filterArticles = (keywords: string) => {
        const keywordArray = keywords.toLowerCase().split(" ");
        setFilteredArticles(
            articles.filter((article) => {
                const targetString = `${article.title.toLowerCase()} ${article.description.toLowerCase()}`;
                return keywordArray.every((keyword) => targetString.includes(keyword));
            })
        );
    };

    const sortArticles = (articlesToSort: ArticleWithDetails[]): ArticleWithDetails[] => {
        if (sortOrder === "Date: Newest to oldest") {
            return articlesToSort.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
        }
        if (sortOrder === "Date: Oldest to newest") {
            return articlesToSort.sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());
        }
        if (sortOrder === "Title: A to Z") {
            return articlesToSort.sort((a, b) => a.title.localeCompare(b.title));
        }
        if (sortOrder === "Title: Z to A") {
            return articlesToSort.sort((a, b) => b.title.localeCompare(a.title));
        }
        return articlesToSort;
    };

    const handleGetAll = () => {
        getArticlesByTopicId(topicId, 
            (data) => {
                process.env.NODE_ENV === "development" && console.log("Success: Fetched all related articles");
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
            <h2></h2>
            <div className="container kwb-docket-controls">
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <span className="d-flex align-items-center kwb-docket-itemtally">{filteredArticles.length} of {articles.length} Articles</span>
                        <AppStyles.ThemedButtonOutline theme={theme} className="btn kwb-btn kwb-btn-search" onClick={() => openModal("TopicModalSearchRelatedArticles", { filterArticles, setSortOrder })}>Search</AppStyles.ThemedButtonOutline>
                    </div>
                </div>
            </div>

            {filteredArticles.map((article, index) => (
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

export default TopicDocketRelatedArticles;
