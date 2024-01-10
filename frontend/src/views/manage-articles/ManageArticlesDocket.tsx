import React, { useEffect, useState } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { stripHtmlTags } from "src/utils/AppFunctions";
import { getAllArticles } from "src/utils/AppApiInterfacers";

type ArticleWithDetails = Article & {
    [key: string]: any;
};

function ManageArticlesDocket() {
    const { openModal, theme, refreshDocket } = useAppContext();
    const [originalResults, setOriginalResults] = useState<ArticleWithDetails[]>([]);
    const [results, setResults] = useState<ArticleWithDetails[]>([]);

    useEffect(() => {
        handleGetAll();
    }, [refreshDocket]);

    const searchResults = (keywords: string) => {
        if (keywords.trim() === "") {
            setResults(originalResults);
            return;
        }
        
        const searchedKeywords = keywords.toLowerCase().split(" ");
        setResults(
            originalResults.filter((result) => {
                const targetString = `${result.title.toLowerCase()} ${result.description.toLowerCase()}`;
                return searchedKeywords.every((keyword) => targetString.includes(keyword));
            })
        );
    };

    const sortResults = (sortOrder: string) => {
        let [field, direction] = sortOrder.split("-");
        const isAscending = direction === "asc";
        if (field.toLowerCase() === "datecreated") field = "dateCreated";
    
        setResults(prevResults => {
            const sortedResults = [...originalResults].sort((a, b) => {
                let aValue = a[field];
                let bValue = b[field];
    
                // Sort by strings or dates
                if (typeof aValue === "string" && typeof bValue === "string") {
                    return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                if (field === "dateCreated" || field === "dateUpdated") {
                    aValue = new Date(aValue).getTime();
                    bValue = new Date(bValue).getTime();
                }
                return isAscending ? aValue - bValue : bValue - aValue;
            });
    
            return sortedResults;
        });
    };

    const handleGetAll = () => {
        getAllArticles(
            (data) => {
                process.env.NODE_ENV === "development" && console.log("Success: Fetched all articles");
                setOriginalResults(data);
                setResults(data);
            }, 
            (error) => {
                console.error("Error: ", error);
            }
        );
    };

    return (
        <div className="container kwb-docket">
            <h2></h2>
            <div className="container kwb-docket-controls">
                <div className="row">
                    <div className="col-6 d-flex justify-content-start">
                        <AppStyles.ThemedButton theme={theme} className="btn kwb-btn" onClick={() => openModal("ManageArticlesModalCreate")}><i className="bi bi-plus-circle kwb-btn-icon"></i>Create Article</AppStyles.ThemedButton>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <span className="d-flex align-items-center kwb-docket-itemtally">{results.length} of {originalResults.length} Articles</span>
                        <AppStyles.ThemedButtonOutline theme={theme} className="btn kwb-btn kwb-btn-search" onClick={() => openModal("ManageArticlesModalSearch", { searchResults, sortResults })}>Search</AppStyles.ThemedButtonOutline>
                    </div>
                </div>
            </div>

            {results.map((result, index) => (
                <AppStyles.ThemedDocketCard theme={theme} key={index} className="container kwb-docket-card">
                    <div className="row">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                            <div className="kwb-img-rounded rounded-circle kwb-docket-img" style={{backgroundImage: `url(${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/portraits/${result.author.split("\\").pop()})`}}></div>
                        </div>
                        <div className="col-8 kwb-docket-colcenter">
                            <p className="kwb-docket-title">{result.title}</p>
                            <p className="kwb-docket-text">{stripHtmlTags(result.description)}</p>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-end">
                            <AppStyles.ThemedButtonSecondary theme={theme} type="button" className="btn kwb-btn" style={{marginRight: "10px"}} onClick={() => openModal("ManageArticlesModalUpdate", result)}><i className="bi bi-pencil-fill"></i></AppStyles.ThemedButtonSecondary>
                            <AppStyles.ThemedButtonSecondary theme={theme} type="button" className="btn kwb-btn" onClick={() => openModal("ManageArticlesModalDelete", {setResults, result})}><i className="bi bi-trash3-fill"></i></AppStyles.ThemedButtonSecondary>
                        </div>
                    </div>
                </AppStyles.ThemedDocketCard>
            ))}
        </div>
    );
}

export default ManageArticlesDocket;
