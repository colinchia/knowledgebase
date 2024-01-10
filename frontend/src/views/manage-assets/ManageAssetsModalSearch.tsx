import React, { useRef, useState } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";

type ManageAssetsModalSearchProps = {
    searchResults: (keywords: string) => void;
    filterResults: (filters: string[]) => void;
    sortResults: (sortOrder: string) => void;
};

function ManageAssetsModalSearch({ searchResults, filterResults, sortResults }: ManageAssetsModalSearchProps) {
    const { theme, closeModal } = useAppContext();
    const modalRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const filterRef = useRef<HTMLInputElement>(null);
    const sortRef = useRef<HTMLSelectElement>(null);
    const [openSections, setOpenSections] = useState<OpenSections>({ search: false, filter: false, sort: false });

    const toggleGuidelines = (section: keyof OpenSections) => {
        setOpenSections(prevState => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };    

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            closeModal();
        }
    };

    const handleSearch = () => {
        if (searchRef.current) {
            searchResults(searchRef.current.value);
            closeModal();
        }
    };

    const handleFilter = () => {
        const filters: string[] = [];
        const checkboxes = document.querySelectorAll<HTMLInputElement>(".form-check-input");
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                filters.push(checkbox.value);
            }
        });
        filterResults(filters);
        closeModal();
    };

    const handleSort = () => {
        if (sortRef.current) {
            sortResults(sortRef.current.value);
            closeModal();
        }
    };

    return (
        <div ref={modalRef} className="modal show kwb-modal" onClick={handleOutsideClick} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <AppStyles.ThemedModalHeader theme={theme} className="modal-header">
                        <h2 className="modal-title">Search Assets</h2>
                        <AppStyles.ThemedCloseButton theme={theme} type="button" className="btn-close" onClick={closeModal}></AppStyles.ThemedCloseButton>
                    </AppStyles.ThemedModalHeader>
                    <AppStyles.ThemedModalBody theme={theme} className="modal-body">
                        <div className="mb-2">
                            <div className="kwb-label-collapse">
                                <AppStyles.ThemedLink theme={theme} data-bs-toggle="collapse" href="#collapseSearch" onClick={() => toggleGuidelines("search")}>
                                    Search: 
                                    <i className={`kwb-styled-chevron bi ${openSections.search ? "bi-chevron-down rotate" : "bi-chevron-right"}`}></i>
                                </AppStyles.ThemedLink>
                                <div className="collapse" id="collapseSearch">
                                    <p>Enter keywords to search for specific asset files by filename.</p>
                                </div>
                            </div>
                            <div className="input-group">
                                <AppStyles.ThemedInput theme={theme} type="text" ref={searchRef} className="form-control" id="searchResults" placeholder="Enter keywords or leave blank to reset"></AppStyles.ThemedInput>
                                <span className="input-group-text">Filename</span>
                                <button className="btn btn-secondary" type="button" onClick={handleSearch}>Go</button>
                            </div>
                        </div>
                    </AppStyles.ThemedModalBody>
                    <AppStyles.ThemedModalBodyConsecutive theme={theme} className="modal-body">
                        <div className="mb-2">
                            <div className="kwb-label-collapse">
                                <AppStyles.ThemedLink theme={theme} data-bs-toggle="collapse" href="#collapseFilter" onClick={() => toggleGuidelines("filter")}>
                                    Filter: 
                                    <i className={`kwb-styled-chevron bi ${openSections.filter ? "bi-chevron-down rotate" : "bi-chevron-right"}`}></i>
                                </AppStyles.ThemedLink>
                                <div className="collapse" id="collapseFilter">
                                    <p>Select one or more file types to narrow down the displayed asset files.</p>
                                </div>
                            </div>
                            <div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="filter-image" value="filter-image" />
                                    <label className="form-check-label" htmlFor="filter-image"> Image Files</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="filter-video" value="filter-video" />
                                    <label className="form-check-label" htmlFor="filter-video"> Video Files</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="filter-audio" value="filter-audio" />
                                    <label className="form-check-label" htmlFor="filter-audio"> Audio Files</label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" name="filter-document" value="filter-document" />
                                    <label className="form-check-label" htmlFor="filter-document"> Document Files</label>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-secondary" type="button" onClick={handleFilter}>Go</button>
                            </div>
                        </div>
                    </AppStyles.ThemedModalBodyConsecutive>
                    <AppStyles.ThemedModalBodyConsecutive theme={theme} className="modal-body">
                        <div className="mb-2">
                            <div className="kwb-label-collapse">
                                <AppStyles.ThemedLink theme={theme} data-bs-toggle="collapse" href="#collapseSort" onClick={() => toggleGuidelines("sort")}>
                                    Sort: 
                                    <i className={`kwb-styled-chevron bi ${openSections.sort ? "bi-chevron-down rotate" : "bi-chevron-right"}`}></i>
                                </AppStyles.ThemedLink>
                                <div className="collapse" id="collapseSort">
                                    <p>Choose an option to sort the display order of the asset files.</p>
                                </div>
                            </div>
                            <div className="input-group">
                                <AppStyles.ThemedSelect theme={theme} ref={sortRef} className="form-select" id="sortResults">
                                    <option value="datecreated-asc">Date Created: Oldest to Newest</option>
                                    <option value="datecreated-desc">Date Created: Newest to Oldest</option>
                                    <option value="filename-asc">File Name: A to Z</option>
                                    <option value="filename-desc">File Name: Z to A</option>
                                </AppStyles.ThemedSelect>
                                <button className="btn btn-secondary" type="button" onClick={handleSort}>Go</button>
                            </div>
                        </div>
                    </AppStyles.ThemedModalBodyConsecutive>
                    <AppStyles.ThemedModalFooter theme={theme} className="modal-footer">
                        <AppStyles.ThemedButton theme={theme} type="button" className="btn kwb-btn" onClick={closeModal}>Close</AppStyles.ThemedButton>
                    </AppStyles.ThemedModalFooter>
                </div>
            </div>
        </div>
    );
}

export default ManageAssetsModalSearch;
