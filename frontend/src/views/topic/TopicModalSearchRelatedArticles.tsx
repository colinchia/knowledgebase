import React, { useRef } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";

type TopicModalSearchRelatedArticlesProps = {
    filterArticles: (keywords: string) => void;
    setSortOrder: (order: string) => void;
};

function TopicModalSearchRelatedArticles({ filterArticles, setSortOrder }: TopicModalSearchRelatedArticlesProps) {
    const { theme, closeModal } = useAppContext();
    const modalRef = useRef<HTMLDivElement>(null);
    const keywordRef = useRef<HTMLInputElement>(null);
    const sortRef = useRef<HTMLSelectElement>(null);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            closeModal();
        }
    };

    const handleFilter = () => {
        if (keywordRef.current) {
            filterArticles(keywordRef.current.value);
            closeModal();
        }
    };

    const handleSort = () => {
        if (sortRef.current) {
            const selectedOrder = sortRef.current.value;
            setSortOrder(selectedOrder);
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
                            <label htmlFor="filterResults" className="form-label">Filter by Keywords:</label>
                            <div className="input-group">
                                <AppStyles.ThemedInput theme={theme} type="text" ref={keywordRef} className="form-control" id="filterResults" placeholder="Enter keywords or leave blank to clear filters"></AppStyles.ThemedInput>
                                <button className="btn btn-secondary" type="button" onClick={handleFilter}>Go</button>
                            </div>
                        </div>
                    </AppStyles.ThemedModalBody>
                    <AppStyles.ThemedModalBodyConsecutive theme={theme} className="modal-body">
                        <div className="mb-2">
                            <label htmlFor="sortResults" className="form-label">Sort By:</label>
                            <div className="input-group">
                                <AppStyles.ThemedSelect theme={theme} ref={sortRef} className="form-select" id="sortResults">
                                    <option>Date: Newest to oldest</option>
                                    <option>Date: Oldest to newest</option>
                                    <option>Title: A to Z</option>
                                    <option>Title: Z to A</option>
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

export default TopicModalSearchRelatedArticles;
