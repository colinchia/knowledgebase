import React, { useRef, useState } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";

type ManageUsersModalSearchProps = {
    searchResults: (searchTerm: string, filterField: string) => void;
    sortResults: (sortOrder: string) => void;
};

function ManageUsersModalSearch({ searchResults, sortResults }: ManageUsersModalSearchProps) {
    const { theme, closeModal } = useAppContext();
    const modalRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const sortRef = useRef<HTMLSelectElement>(null);
    const [selectedField, setSelectedField] = useState<string>("Email");

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            closeModal();
        }
    };

    const handleFieldSelection = (field: string) => {
        setSelectedField(field);
    };

    const handleSearch = () => {
        if (searchRef.current) {
            searchResults(searchRef.current.value, selectedField.toLowerCase());
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
                        <h2 className="modal-title">Search Users</h2>
                        <AppStyles.ThemedCloseButton theme={theme} type="button" className="btn-close" onClick={closeModal}></AppStyles.ThemedCloseButton>
                    </AppStyles.ThemedModalHeader>
                    <AppStyles.ThemedModalBody theme={theme} className="modal-body">
                        <div className="mb-2">
                            <label htmlFor="filterResults" className="form-label">Filter by Keywords:</label>
                            <div className="input-group">
                                <AppStyles.ThemedInput theme={theme} type="text" ref={searchRef} className="form-control" id="searchResults" placeholder="Enter keywords or leave blank to clear search query"></AppStyles.ThemedInput>
                                <button type="button" className="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"><span style={{ marginRight: "10px" }}>{selectedField}</span></button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#" onClick={() => handleFieldSelection("Email")}>Email</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={() => handleFieldSelection("Name")}>Name</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={() => handleFieldSelection("Role")}>Role</a></li>
                                    <li><a className="dropdown-item" href="#" onClick={() => handleFieldSelection("Department")}>Department</a></li>
                                </ul>
                                <button className="btn btn-secondary" type="button" onClick={handleSearch}>Go</button>
                            </div>
                        </div>
                    </AppStyles.ThemedModalBody>
                    <AppStyles.ThemedModalBodyConsecutive theme={theme} className="modal-body">
                        <div className="mb-2">
                            <label htmlFor="sortResults" className="form-label">Sort By:</label>
                            <div className="input-group">
                                <AppStyles.ThemedSelect theme={theme} ref={sortRef} className="form-select" id="sortResults">
                                    <option value="email-asc">Email: A to Z</option>
                                    <option value="email-desc">Email: Z to A</option>
                                    <option value="name-asc">Name: A to Z</option>
                                    <option value="name-desc">Name: Z to A</option>
                                    <option value="role-asc">Role: A to Z</option>
                                    <option value="role-desc">Role: Z to A</option>
                                    <option value="department-asc">Department: A to Z</option>
                                    <option value="department-desc">Department: Z to A</option>
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

export default ManageUsersModalSearch;
