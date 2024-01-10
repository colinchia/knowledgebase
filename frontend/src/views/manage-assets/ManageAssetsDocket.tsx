import React, { useEffect, useState } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { getAllAssets } from "src/utils/AppApiInterfacers";
import { Tooltip } from "src/views";

type AssetWithDetails = Asset & {
    [key: string]: any;
};

function ManageAssetsDocket() {
    const { openModal, theme, refreshDocket } = useAppContext();
    const [originalResults, setOriginalResults] = useState<AssetWithDetails[]>([]);
    const [results, setResults] = useState<AssetWithDetails[]>([]);

    useEffect(() => {
        handleGetAll();
    }, [refreshDocket]);

    const filterMapping: FilterMapping = {
        "filter-image": ["image/gif", "image/jpeg", "image/jpg", "image/png", "image/webp"],
        "filter-video": ["video/avi", "video/mov", "video/mp4", "video/wmv"],
        "filter-audio": ["audio/mp3", "audio/mpeg", "audio/wav"],
        "filter-document": [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain",
        ],
    };

    const searchResults = (keywords: string) => {
        if (keywords.trim() === "") {
            setResults(originalResults);
            return;
        }
        
        const searchedKeywords = keywords.toLowerCase();
        setResults(
            originalResults.filter((result) => {
                const targetString = result.filename.toLowerCase();
                return targetString.includes(searchedKeywords);
            })
        );
    };

    const filterResults = (filters: string[]) => {
        setResults(
            originalResults.filter((result) => {
                return filters.some((filter: string) => {
                    return (filterMapping as any)[filter].includes(result.filetype.toLowerCase());
                });
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
        getAllAssets(
            (data) => {
                process.env.NODE_ENV === "development" && console.log("Success: Fetched all assets");
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
                        <AppStyles.ThemedButton theme={theme} className="btn kwb-btn" onClick={() => openModal("ManageAssetsModalAdd")}><i className="bi bi-plus-circle kwb-btn-icon"></i>Add Asset</AppStyles.ThemedButton>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <span className="d-flex align-items-center kwb-docket-itemtally">{results.length} of {originalResults.length} Assets</span>
                        <AppStyles.ThemedButtonOutline theme={theme} className="btn kwb-btn kwb-btn-search" onClick={() => openModal("ManageAssetsModalSearch", { searchResults, filterResults, sortResults })}>Search</AppStyles.ThemedButtonOutline>
                    </div>
                </div>
            </div>
            <div className="row">
                {results.map((result, index) => {
                    return (
                        <div key={index} className="col-md-2 mb-4">
                            <div className="card">
                                <div className="position-relative">
                                    <div className="card-img-top bg-secondary d-flex justify-content-center align-items-center text-white kwb-docket-card-imagecontainer">
                                        <img src={`${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/thumbnails/${result.thumbnail.split("\\").pop()}`} className="kwb-docket-card-image" />
                                    </div>
                                    <button type="button" className="kwb-btn-borderless position-absolute kwb-docket-carddeletebtn" onClick={() => openModal("ManageAssetsModalDelete", {setResults, result})}>
                                        <i className="bi bi-trash3-fill"></i>
                                    </button>
                                </div>
                                <Tooltip text={result.filename}>
                                    <div className="card-footer text-truncate kwb-docket-cardfooter">{result.filename}</div>
                                </Tooltip>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ManageAssetsDocket;
