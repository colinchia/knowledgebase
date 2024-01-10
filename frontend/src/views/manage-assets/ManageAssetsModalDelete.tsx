import React, { useRef, useState } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { deleteAsset } from "src/utils/AppApiInterfacers";

type AssetWithDetails = {
    result: Asset;
};

type ManageAssetsModalDeleteProps = {
    setResults: React.Dispatch<React.SetStateAction<AssetWithDetails[]>>;
};

function ManageAssetsModalDelete({ setResults }: ManageAssetsModalDeleteProps) {
    const { theme, activeModal, closeModal, triggerDocketRefresh } = useAppContext();
    const modalRef = useRef<HTMLDivElement>(null);
    const asset = activeModal.data as AssetWithDetails;
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            closeModal();
        }
    };

    const handleDelete = () => {
        deleteAsset(asset.result.id, 
            (data) => {
                process.env.NODE_ENV === "development" && console.log("Success: ", data.message);
                setResults(prevResults => prevResults.filter(result => asset.result.id !== asset.result.id));
                closeModal();
                triggerDocketRefresh();
            },
            (error) => {
                console.error("Error: ", error.error);
                setErrorMessage(error.error);
            }
        );
    };

    return (
        <div ref={modalRef} className="modal show kwb-modal" onClick={handleOutsideClick} tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content kwb-formgroup">
                    <AppStyles.ThemedModalHeader theme={theme} className="modal-header">
                        <h2 className="modal-title">Delete Asset</h2>
                        <AppStyles.ThemedCloseButton theme={theme} type="button" className="btn-close" onClick={closeModal} aria-label="Close"></AppStyles.ThemedCloseButton>
                    </AppStyles.ThemedModalHeader>
                    <AppStyles.ThemedModalBody theme={theme} className="modal-body">
                        <div className="mb-1">
                            <p>Are you sure you want to delete the asset "{asset.result.filename}"?</p>
                            {errorMessage && <p className="text-danger">{errorMessage}</p>}
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

export default ManageAssetsModalDelete;
