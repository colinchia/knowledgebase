import React, { useRef, useState } from "react";
import DOMPurify from "dompurify";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { generateSlug, getFileIcon } from "src/utils/AppFunctions";
import { createArticle } from "src/utils/AppApiInterfacers";
import { BrowserAssets, BrowserTopics, EditorTiny } from "src/views";

type Errors = {
    articleTitle?: string;
    articleDescription?: string;
};

function ManageArticlesModalCreate() {
    const { theme, closeModal, triggerDocketRefresh, profilePortrait } = useAppContext();
    const modalRef = useRef<HTMLDivElement>(null);
    const [articleTitle, setArticleTitle] = useState<string>("");
    const [articleDescription, setArticleDescription] = useState<string>("");
    const [articleAssets, setArticleAssets] = useState<Asset[]>([]);
    const [articleTopics, setArticleTopics] = useState<Topic[]>([]);
    const [errors, setErrors] = useState<Errors>({});

    const validateFields = (): Errors => {
        const errors: Errors = {};
        if (!articleTitle) {
            errors.articleTitle = "Article title cannot be empty.";
        }
        if (!articleDescription) {
            errors.articleDescription = "Article description cannot be empty.";
        }
        return errors;
    };

    const removeArticleAsset = (index: number) => {
        const newAssets = [...articleAssets];
        newAssets.splice(index, 1);
        setArticleAssets(newAssets);
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            closeModal();
        }
    };

    const handleAssetSelected = (asset: Asset) => {
        setArticleAssets([...articleAssets, asset]);
    };

    const handleTopicSelected = (topic: Topic) => {
        setArticleTopics([...articleTopics, topic]);
    };

    const handleTopicRemove = (topicToRemove: Topic) => {
        setArticleTopics(articleTopics.filter(topic => topic.id !== topicToRemove.id));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setArticleTitle(e.target.value);
    };

    const handleDescriptionChange = (newDescription: string) => {
        setArticleDescription(newDescription);
    };

    const handleCreate = () => {
        const fieldErrors = validateFields();
        if (Object.keys(fieldErrors).length === 0) {
            const sanitizedArticleTitle = DOMPurify.sanitize(articleTitle);
            const sanitizedArticleDescription = DOMPurify.sanitize(articleDescription);

            const formData = new FormData();
            formData.append("title", sanitizedArticleTitle);
            formData.append("slug", generateSlug(sanitizedArticleTitle));
            formData.append("description", sanitizedArticleDescription);
            formData.append("author", profilePortrait);
            const assetIds = JSON.stringify(articleAssets.map(asset => asset.id));
            formData.append("assetIds", assetIds);
            const topicIds = JSON.stringify(articleTopics.map(topic => topic.id));
            formData.append("topicIds", topicIds);

            createArticle(formData, 
                (data) => {
                    process.env.NODE_ENV === "development" && console.log("Success: Article created: ", data);
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
                        <h2 className="modal-title">Create Article</h2>
                        <AppStyles.ThemedCloseButton theme={theme} type="button" className="btn-close" onClick={closeModal} aria-label="Close"></AppStyles.ThemedCloseButton>
                    </AppStyles.ThemedModalHeader>
                    <AppStyles.ThemedModalBody theme={theme} className="modal-body">
                        <div id="article-title" className={`mb-4 ${errors.articleTitle ? "has-error" : ""}`}>
                            <label className="form-label">Article Title <span className="text-danger">*</span></label>
                            <AppStyles.ThemedInput theme={theme} type="text" className="form-control" value={articleTitle} onChange={handleTitleChange}></AppStyles.ThemedInput>
                            {errors.articleTitle && <p className="text-danger">{errors.articleTitle}</p>}
                        </div>
                        <div id="article-description" className={`mb-4 ${errors.articleDescription ? "has-error" : ""}`}>
                            <label className="form-label">Article Description <span className="text-danger">*</span></label>
                            <EditorTiny value={articleDescription} onChange={handleDescriptionChange} />
                            {errors.articleDescription && <p className="text-danger">{errors.articleDescription}</p>}
                        </div>
                        <div id="article-attachments" className="mb-4">
                            <label className="form-label">Attachments</label>
                            <BrowserAssets onAssetSelected={handleAssetSelected} selectedAssets={articleAssets} />
                            <ul className="list-group list-group-flush kwb-formgroup-filelist">
                                {articleAssets.map(asset => (
                                    <li className="list-group-item" key={asset.id}>
                                        <div className="row">
                                            <div className="col-2 text-center kwb-formgroup-filelisticon"><i className={getFileIcon(asset.filetype)}></i></div>
                                            <div className="col-8"><span>{asset.filename} <span className="kwb-formgroup-filelistdesc">({Math.round(asset.filesize / 1024)} kb)</span></span></div>
                                            <div className="col-2 text-end"><button type="button" className="kwb-btn-borderless" onClick={() => removeArticleAsset(asset.id)}><i className="bi bi-x-circle text-danger"></i></button></div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div id="article-topics">
                            <div className="mb-2">
                                <label className="form-label">Add to Topics</label>
                                <BrowserTopics onTopicSelected={handleTopicSelected} selectedTopics={articleTopics} />
                            </div>
                            {articleTopics.map(topic => (
                                <button key={topic.id} type="button" className="btn btn-outline-secondary kwb-btn kwb-modal-pills">
                                    <span style={{ marginRight: "10px" }}>{topic.title}</span>
                                    <i className="bi bi-x-circle" onClick={() => handleTopicRemove(topic)}></i>
                                </button>
                            ))}
                        </div>
                    </AppStyles.ThemedModalBody>
                    <AppStyles.ThemedModalFooter theme={theme} className="modal-footer">
                        <AppStyles.ThemedButton theme={theme} type="submit" className="btn kwb-btn" onClick={handleCreate}>Create</AppStyles.ThemedButton>
                    </AppStyles.ThemedModalFooter>
                </div>
            </div>
        </div>
    );
}

export default ManageArticlesModalCreate;
