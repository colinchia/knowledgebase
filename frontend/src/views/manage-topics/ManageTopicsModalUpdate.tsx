import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DOMPurify from "dompurify";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { generateSlug } from "src/utils/AppFunctions";
import { updateTopic } from "src/utils/AppApiInterfacers";
import { BrowserIcons, EditorTiny } from "src/views";

type TopicWithDetails = Topic & {
    description: string;
};

type Errors = {
    topicTitle?: string;
    topicDescription?: string;
};

function ManageTopicsModalUpdate() {
    const { theme, closeModal, triggerDocketRefresh, activeModal } = useAppContext();
    const modalRef = useRef<HTMLDivElement>(null);
    const topic = activeModal.data as TopicWithDetails;
    const initialIconParts = topic.icon.split(" ");
    const initialIcon: Icon = {
        iconPrefix: initialIconParts[0] as IconPrefix,
        iconName: initialIconParts[1] as IconName
    };
    const [showBrowserIcons, setShowBrowserIcons] = useState<boolean>(false);
    const [topicIcon, setTopicIcon] = useState<Icon>(initialIcon);
    const [topicTitle, setTopicTitle] = useState<string>(topic.title);
    const [topicDescription, setTopicDescription] = useState<string>(topic.description);
    const [errors, setErrors] = useState<Errors>({});

    const validateFields = (): Errors => {
        const errors: Errors = {};
        if (!topicTitle) {
            errors.topicTitle = "Topic title cannot be empty.";
        }
        return errors;
    };

    const toggleBrowserIcons = () => {
        setShowBrowserIcons(!showBrowserIcons);
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            closeModal();
        }
    };

    const handleCloseBrowserIcons = () => {
        setShowBrowserIcons(false);
    };

    const handleIconSelect = (icon: Icon) => {
        setTopicIcon(icon);
        setShowBrowserIcons(false);
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTopicTitle(e.target.value);
    };

    const handleDescriptionChange = (newDescription: string) => {
        setTopicDescription(newDescription);
    };

    const handleUpdate = () => {
        const fieldErrors = validateFields();
        if (Object.keys(fieldErrors).length === 0) {
            const sanitizedTopicTitle = DOMPurify.sanitize(topicTitle);
            const sanitizedTopicDescription = DOMPurify.sanitize(topicDescription);

            const formData = new FormData();
            formData.append("slug", generateSlug(sanitizedTopicTitle));
            formData.append("title", sanitizedTopicTitle);
            formData.append("description", sanitizedTopicDescription);
            formData.append("icon", `${topicIcon.iconPrefix} ${topicIcon.iconName}`);
            
            updateTopic(topic.id, formData, 
                (data) => {
                    process.env.NODE_ENV === "development" && console.log("Success: Topic updated: ", data);
                    closeModal();
                    triggerDocketRefresh();
                }, 
                (error) => {
                    console.error("Error: ", error);
                }
            );
        } else {
            setErrors(fieldErrors);
        }
    };

    return (
        <div ref={modalRef} className="modal show kwb-modal" onClick={handleOutsideClick} tabIndex={-1}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content kwb-formgroup">
                    <AppStyles.ThemedModalHeader theme={theme} className="modal-header">
                        <h2 className="modal-title">Update Topic</h2>
                        <AppStyles.ThemedCloseButton theme={theme} type="button" className="btn-close" onClick={closeModal} aria-label="Close"></AppStyles.ThemedCloseButton>
                    </AppStyles.ThemedModalHeader>
                    <AppStyles.ThemedModalBody theme={theme} className="modal-body">
                        <div id="topic-title" className={`mb-4 ${errors.topicTitle ? "has-error" : ""}`}>
                            <label className="form-label">Topic Title <span className="text-danger">*</span></label>
                            <div className="input-group">
                                <button type="button" className="btn btn-secondary" style={{ width: "50px"}} onClick={toggleBrowserIcons}><FontAwesomeIcon icon={[topicIcon.iconPrefix, topicIcon.iconName]} /></button>
                                {showBrowserIcons && <BrowserIcons onIconSelect={handleIconSelect} onClose={handleCloseBrowserIcons} />}
                                <AppStyles.ThemedInput theme={theme} type="text" className="form-control" placeholder="Enter a topic title" value={topicTitle} onChange={handleTitleChange}></AppStyles.ThemedInput>
                            </div>
                            {errors.topicTitle && <p className="text-danger">{errors.topicTitle}</p>}
                        </div>
                        <div id="topic-description" className={`mb-1 ${errors.topicDescription ? "has-error" : ""}`}>
                            <label className="form-label">Topic Description</label>
                            <EditorTiny value={topicDescription} onChange={handleDescriptionChange} />
                            {errors.topicDescription && <p className="text-danger">{errors.topicDescription}</p>}
                        </div>
                    </AppStyles.ThemedModalBody>
                    <AppStyles.ThemedModalFooter theme={theme} className="modal-footer">
                        <AppStyles.ThemedButton theme={theme} type="submit" className="btn kwb-btn" onClick={handleUpdate}>Update</AppStyles.ThemedButton>
                    </AppStyles.ThemedModalFooter>
                </div>
            </div>
        </div>
    );
}

export default ManageTopicsModalUpdate;
