import { useState } from "react";

type ModalData = {
    name: string | null;
    data: any;
};

type ModalContext = {
    activeModal: ModalData;
    openModal: (modalName: string, data?: any) => void;
    closeModal: () => void;
    triggerDocketRefresh: () => void;
    refreshDocket: boolean;
};

/**
 * Global Contexts for Modal Handling
 */
export const useModalContext = (): ModalContext=> {
    const [activeModal, setActiveModal] = useState<ModalData>({ name: null, data: null });
    const [refreshDocket, setRefreshDocket] = useState<boolean>(false);

    const openModal = (modalName: string, data: any = null) => {
        if (activeModal.name !== null) {
            process.env.NODE_ENV === "development" && console.warn("Attempting to open a new modal while another is active. Closing the current modal.");
            setActiveModal({ name: null, data: null });
        }
        setActiveModal({ name: modalName, data });
    };

    const closeModal = () => {
        setActiveModal({ name: null, data: null });
    };

    const triggerDocketRefresh = () => {
        setRefreshDocket(prev => !prev);
    };

    return {
        activeModal,
        openModal,
        closeModal,
        triggerDocketRefresh,
        refreshDocket
    };
}
