import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { getAllTopics } from "src/utils/AppApiInterfacers";

type TopicWithDetails = Topic & {
    [key: string]: any;
};

function ManageTopicsDocket() {
    const { openModal, theme, refreshDocket } = useAppContext();
    const [originalResults, setOriginalResults] = useState<TopicWithDetails[]>([]);
    const [results, setResults] = useState<TopicWithDetails[]>([]);

    useEffect(() => {
        handleGetAll();
    }, [refreshDocket]);

    const searchResults = (keywords: string) => {
        if (keywords.trim() === "") {
            setResults(originalResults);
            return;
        }
        
        const searchedKeywords = keywords.toLowerCase();
        setResults(
            originalResults.filter((result) => {
                const targetString = result.title.toLowerCase();
                return targetString.includes(searchedKeywords);
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
        getAllTopics(
            (data) => {
                process.env.NODE_ENV === "development" && console.log("Success: Fetched all topics");
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
                        <AppStyles.ThemedButton theme={theme} className="btn kwb-btn" onClick={() => openModal("ManageTopicsModalCreate")}><i className="bi bi-plus-circle kwb-btn-icon"></i>Create Topic</AppStyles.ThemedButton>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <span className="d-flex align-items-center kwb-docket-itemtally">{results.length} of {originalResults.length} Topics</span>
                        <AppStyles.ThemedButtonOutline theme={theme} className="btn kwb-btn kwb-btn-search" onClick={() => openModal("ManageTopicsModalSearch", { searchResults, sortResults })}>Search</AppStyles.ThemedButtonOutline>
                    </div>
                </div>
            </div>

            {results.map((result, index) => (
                <AppStyles.ThemedDocketCard theme={theme} key={index} className="container kwb-docket-card">
                    <div className="row pt-2 pb-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                            <FontAwesomeIcon icon={result.icon.split(" ") as [any, any]} />
                        </div>
                        <div className="col-8 kwb-docket-colcenter">
                            <p className="kwb-docket-title">{result.title}</p>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-end">
                            <AppStyles.ThemedButtonSecondary theme={theme} type="button" className="btn kwb-btn" style={{marginRight: "10px"}} onClick={() => openModal("ManageTopicsModalUpdate", result)}><i className="bi bi-pencil-fill"></i></AppStyles.ThemedButtonSecondary>
                            <AppStyles.ThemedButtonSecondary theme={theme} type="button" className="btn kwb-btn" onClick={() => openModal("ManageTopicsModalDelete", {setResults, result})}><i className="bi bi-trash3-fill"></i></AppStyles.ThemedButtonSecondary>
                        </div>
                    </div>
                </AppStyles.ThemedDocketCard>
            ))}
        </div>
    );
}

export default ManageTopicsDocket;
