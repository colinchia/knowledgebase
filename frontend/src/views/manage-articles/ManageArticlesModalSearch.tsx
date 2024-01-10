import React, { useRef } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";

type ManageArticlesModalSearchProps = {
    searchResults: (searchTerm: string) => void;
    sortResults: (sortOrder: string) => void;
};

function ManageArticlesModalSearch({ searchResults, sortResults }: ManageArticlesModalSearchProps) {
    const { theme, closeModal } = useAppContext();
    const modalRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const sortRef = useRef<HTMLSelectElement>(null);

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
                        <h2 className="modal-title">Search Articles</h2>
                        <AppStyles.ThemedCloseButton theme={theme} type="button" className="btn-close" onClick={closeModal}></AppStyles.ThemedCloseButton>
                    </AppStyles.ThemedModalHeader>
                    <AppStyles.ThemedModalBody theme={theme} className="modal-body">
                        <div className="mb-2">
                            <label htmlFor="searchResults" className="form-label">Search:</label>
                            <div className="input-group">
                                <AppStyles.ThemedInput theme={theme} type="text" id="searchResults" className="form-control" placeholder="Enter keywords or leave blank to reset" ref={searchRef}></AppStyles.ThemedInput>
                                <button className="btn btn-secondary" type="button" onClick={handleSearch}>Go</button>
                            </div>
                        </div>
                    </AppStyles.ThemedModalBody>
                    <AppStyles.ThemedModalBodyConsecutive theme={theme} className="modal-body">
                        <div className="mb-2">
                            <label htmlFor="sortResults" className="form-label">Sort:</label>
                            <div className="input-group">
                                <AppStyles.ThemedSelect theme={theme} id="sortResults" className="form-select" ref={sortRef}>
                                    <option value="datecreated-asc">Date Created: Oldest to newest</option>
                                    <option value="datecreated-desc">Date Created: Newest to oldest</option>
                                    <option value="title-asc">Article Title: A to Z</option>
                                    <option value="title-desc">Article Title: Z to A</option>
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

export default ManageArticlesModalSearch;
