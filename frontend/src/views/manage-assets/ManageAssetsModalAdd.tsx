import React, { useRef, useState } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { getFileIcon } from "src/utils/AppFunctions";
import { createAsset } from "src/utils/AppApiInterfacers";

type UploadedFile = File;

type Errors = {
    noFilesSelected?: string;
    unacceptedFileType?: string;
    totalSizeExceeded?: string;
};

function ManageAssetsModalAdd() {
    const { theme, closeModal, triggerDocketRefresh } = useAppContext();
    const modalRef = useRef<HTMLDivElement>(null);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
    const [rejectedFiles, setRejectedFiles] = useState<UploadedFile[]>([]);
    const [openSections, setOpenSections] = useState<OpenSections>({ guidelines: false });
    const [errors, setErrors] = useState<Errors>({});

    const MAX_TOTAL_SIZE_MB = 10;

    const ALLOWED_FILE_TYPES = {
        image: ["image/gif", "image/jpeg", "image/jpg", "image/png", "image/webp"],
        video: ["video/avi", "video/mov", "video/mp4", "video/wmv"],
        audio: ["audio/mp3", "audio/mpeg", "audio/wav"],
        document: [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "text/plain"
        ]
    };

    const removeUploadedFile = (index: number) => {
        const newFiles = [...uploadedFiles];
        newFiles.splice(index, 1);
        setUploadedFiles(newFiles);
    };

    const toggleGuidelines = (section: keyof OpenSections) => {
        setOpenSections(prevState => ({
            ...prevState,
            [section]: !prevState[section],
        }));
    };  

    const validateFields = (): Errors => {
        const errors: Errors = {};

        if (uploadedFiles.length === 0 && rejectedFiles.length === 0) {
            errors.noFilesSelected = "No files were selected!";
        }

        if (rejectedFiles.length > 0) {
            errors.unacceptedFileType = "Some files cannot be uploaded because they are not of an accepted file type. Please see the 'File Upload Guidelines' for a list of allowed file types";
        }

        const totalSizeMb = uploadedFiles.reduce((total, file) => total + file.size, 0) / (1024 * 1024);
        if (totalSizeMb > MAX_TOTAL_SIZE_MB) {
            errors.totalSizeExceeded = "The total combined size of the files to be uploaded exceeds 10MB";
        }

        return errors;
    };
    
    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            closeModal();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const fileList = Array.from(e.target.files);

            // Separate valid and invalid files
            const validFiles: UploadedFile[] = [];
            const invalidFiles: UploadedFile[] = [];
            fileList.forEach(file => {
                process.env.NODE_ENV === "development" && console.log(`File: ${file.name}, MIME Type: ${file.type}`);
                if (Object.values(ALLOWED_FILE_TYPES).some(types => types.includes(file.type))) {
                    validFiles.push(file);
                } else {
                    invalidFiles.push(file);
                }
            });

            // Add valid files to uploadedFiles
            const filesToAdd: UploadedFile[] = [];
            for (const file of validFiles) {
                const isDuplicate = uploadedFiles.some(
                    uploadedFile => uploadedFile.name === file.name && uploadedFile.type == file.type
                );
                if (!isDuplicate) {
                    filesToAdd.push(file);
                }
            }
            setUploadedFiles([...uploadedFiles, ...filesToAdd]);

            // Update list of invalid files
            setRejectedFiles(invalidFiles);
        }
    };    

    const handleAdd = async () => {
        const fieldErrors = validateFields();
        if (Object.keys(fieldErrors).length === 0) {
            const formData = new FormData();
            uploadedFiles.forEach((file) => {
                formData.append("files", file);
            });

            createAsset(formData, 
                (data) => {
                    if (data && Array.isArray(data) && data.length > 0) {
                        data.forEach(asset => {
                            process.env.NODE_ENV === "development" && console.log("Asset added successfully with ID: ", asset.id);
                        });
                        closeModal();
                        triggerDocketRefresh();
                    }
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
                        <h2 className="modal-title">Add Asset</h2>
                        <AppStyles.ThemedCloseButton theme={theme} type="button" className="btn-close" onClick={closeModal}></AppStyles.ThemedCloseButton>
                    </AppStyles.ThemedModalHeader>
                    <AppStyles.ThemedModalBody theme={theme} className="modal-body">
                        <div className="kwb-label-collapse">
                            <AppStyles.ThemedLink theme={theme} data-bs-toggle="collapse" href="#collapseGuidelines" onClick={() => toggleGuidelines("guidelines")}>
                                File Upload Guidelines: 
                                <i className={`kwb-styled-chevron bi ${openSections.guidelines ? "bi-chevron-down rotate" : "bi-chevron-right"}`}></i>
                            </AppStyles.ThemedLink>
                            <div className="collapse" id="collapseGuidelines">
                                <ul>
                                    <li>Files with duplicate names will be timestamped to avoid overwriting existing files</li>
                                    <li>Ensure the total file size does not exceed 10MB</li>
                                    <li>Allowed file types are:
                                        <ul>
                                            <li>Images: JPEG, JPG, PNG, WEBP</li>
                                            <li>Video: AVI, MOV, MP4, WMV</li>
                                            <li>Audio: MP3, MPEG, WAV</li>
                                            <li>Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT</li>
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <AppStyles.ThemedInput theme={theme} type="file" className="form-control kwb-formgroup-fileupload" onChange={handleFileChange} multiple></AppStyles.ThemedInput>
                        <ul className="list-group list-group-flush kwb-formgroup-filelist">
                            {uploadedFiles.map((file, index) => (
                                <AppStyles.ThemedFileUploadList theme={theme} className="list-group-item" key={index}>
                                    <div className="row">
                                        <div className="col-2 text-center kwb-formgroup-filelisticon"><i className={getFileIcon(file.type)}></i></div>
                                        <div className="col-8"><span>{file.name} <span className="kwb-formgroup-filelistdesc">({Math.round(file.size / 1024)} kb)</span></span></div>
                                        <div className="col-2 text-end"><button type="button" className="kwb-btn-borderless" onClick={() => removeUploadedFile(index)}><i className="bi bi-trash3-fill text-danger"></i></button></div>
                                    </div>
                                </AppStyles.ThemedFileUploadList>
                            ))}
                        </ul>
                        {errors.noFilesSelected && <p className="text-danger">{errors.noFilesSelected}</p>}
                        {errors.unacceptedFileType && <p className="text-danger">{errors.unacceptedFileType}</p>}
                        {errors.totalSizeExceeded && <p className="text-danger">{errors.totalSizeExceeded}</p>}
                    </AppStyles.ThemedModalBody>
                    <AppStyles.ThemedModalFooter theme={theme} className="modal-footer">
                        <AppStyles.ThemedButton theme={theme} type="submit" className="btn kwb-btn" onClick={handleAdd}>Add</AppStyles.ThemedButton>
                    </AppStyles.ThemedModalFooter>
                </div>
            </div>
        </div>
    );
}

export default ManageAssetsModalAdd;
