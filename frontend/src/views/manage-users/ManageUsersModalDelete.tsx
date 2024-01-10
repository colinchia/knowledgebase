import React, { useRef } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { deleteUser } from "src/utils/AppApiInterfacers";

type UserWithDetails = {
    result: User;
};

type ManageUsersModalDeleteProps = {
    setResults: React.Dispatch<React.SetStateAction<UserWithDetails[]>>;
};

function ManageUsersModalDelete({ setResults }: ManageUsersModalDeleteProps) {
    const { theme, activeModal, closeModal, triggerDocketRefresh } = useAppContext();
    const modalRef = useRef<HTMLDivElement>(null);
    const user = activeModal.data as UserWithDetails;

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            closeModal();
        }
    };

    const handleDelete = () => {
        deleteUser(user.result.id, 
            (data) => {
                process.env.NODE_ENV === "development" && console.log("Success: ", data);
                setResults(prevResults => prevResults.filter(result => user.result.id !== user.result.id));
                closeModal();
                triggerDocketRefresh();
            },
            (error) => {
                console.error("Error: ", error);
            }
        );
    };

    return (
        <div ref={modalRef} className="modal show kwb-modal" onClick={handleOutsideClick} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content kwb-formgroup">
                    <AppStyles.ThemedModalHeader theme={theme} className="modal-header">
                        <h2 className="modal-title">Delete User</h2>
                        <AppStyles.ThemedCloseButton theme={theme} type="button" className="btn-close" onClick={closeModal} aria-label="Close"></AppStyles.ThemedCloseButton>
                    </AppStyles.ThemedModalHeader>
                    <AppStyles.ThemedModalBody theme={theme} className="modal-body">
                        <div className="mb-1">
                            <p>Are you sure you want to delete the user account "{user.result.email}"?</p>
                        </div>
                    </AppStyles.ThemedModalBody>
                    <AppStyles.ThemedModalFooter theme={theme} className="modal-footer">
                        <AppStyles.ThemedButtonSecondary theme={theme} type="button" className="btn kwb-btn" onClick={closeModal}>Cancel</AppStyles.ThemedButtonSecondary>
                        <AppStyles.ThemedButton theme={theme} type="submit" className="btn kwb-btn" onClick={handleDelete}>Delete</AppStyles.ThemedButton>
                    </AppStyles.ThemedModalFooter>
                </div>
            </div>
        </div>
    );
}

export default ManageUsersModalDelete;
