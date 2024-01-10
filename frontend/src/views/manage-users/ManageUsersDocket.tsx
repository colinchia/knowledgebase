import React, { useEffect, useState } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { getAllUsers } from "src/utils/AppApiInterfacers";

type UserWithDetails = User & {
    [key: string]: any;
};

function ManageUsersDocket() {
    const { openModal, theme, refreshDocket } = useAppContext();
    const [originalResults, setOriginalResults] = useState<UserWithDetails[]>([]);
    const [results, setResults] = useState<UserWithDetails[]>([]);

    useEffect(() => {
        handleGetAll();
    }, [refreshDocket]);

    const searchResults = (keywords: string, field: string) => {
        if (keywords.trim() === "") {
            setResults(originalResults);
            return;
        }
        
        const searchedKeywords = keywords.toLowerCase().split(" ");
        const searchedField = field.toLowerCase();
        setResults(
            originalResults.filter((result) => {
                const targetString = result[searchedField] ? result[searchedField].toLowerCase() : "";
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
        getAllUsers(
            (data) => {
                process.env.NODE_ENV === "development" && console.log("Success: Fetched all users");
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
                        <AppStyles.ThemedButton theme={theme} className="btn kwb-btn" onClick={() => openModal("ManageUsersModalCreate")}><i className="bi bi-plus-circle kwb-btn-icon"></i>Create User</AppStyles.ThemedButton>
                    </div>
                    <div className="col-6 d-flex justify-content-end">
                        <span className="d-flex align-items-center kwb-docket-itemtally">{results.length} of {originalResults.length} Users</span>
                        <AppStyles.ThemedButtonOutline theme={theme} className="btn kwb-btn kwb-btn-search" onClick={() => openModal("ManageUsersModalSearch", { searchResults, sortResults })}>Search</AppStyles.ThemedButtonOutline>
                    </div>
                </div>
            </div>

            {results.map((result, index) => (
                <AppStyles.ThemedDocketCard theme={theme} key={index} className="container kwb-docket-card">
                    <div className="row pt-2 pb-2">
                        <div className="col-2 d-flex align-items-center justify-content-center">
                            <div className="kwb-img-rounded rounded-circle kwb-docket-img" style={{ backgroundImage: `url(${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/portraits/${result.portrait.split("\\").pop()})` }}></div>
                        </div>
                        <div className="col-2 kwb-docket-colcenter">
                            <p className="kwb-docket-title">{result.email}</p>
                        </div>
                        <div className="col-2 kwb-docket-colcenter">
                            <p className="kwb-docket-text">{result.name}</p>
                        </div>
                        <div className="col-2 kwb-docket-colcenter">
                            <p className="kwb-docket-text">{result.role}</p>
                        </div>
                        <div className="col-2 kwb-docket-colcenter">
                            <p className="kwb-docket-text">{result.department}</p>
                        </div>
                        <div className="col-2 d-flex align-items-center justify-content-end">
                            <AppStyles.ThemedButtonSecondary theme={theme} type="button" className="btn kwb-btn" style={{marginRight: "10px"}} onClick={() => openModal("ManageUsersModalUpdate", result)}><i className="bi bi-pencil-fill"></i></AppStyles.ThemedButtonSecondary>
                            <AppStyles.ThemedButtonSecondary theme={theme} type="button" className="btn kwb-btn" onClick={() => openModal("ManageUsersModalDelete", {setResults, result})}><i className="bi bi-trash3-fill"></i></AppStyles.ThemedButtonSecondary>
                        </div>
                    </div>
                </AppStyles.ThemedDocketCard>
            ))}
        </div>
    );
}

export default ManageUsersDocket;
