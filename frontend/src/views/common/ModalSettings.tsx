import React, { useEffect, useRef, useState } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { isValidEmail } from "src/utils/AppValidators";
import { updateSettings } from "src/utils/AppApiInterfacers";
import usePortraitInput from "src/hooks/usePortraitInput";

type Errors = {
    settingsEmail?: string;
    settingsName?: string;
};

function ModalSettings() {
    const { theme, updateTheme, profilePortrait, setProfilePortrait, profileName, setProfileName, closeModal } = useAppContext();
    const { portraitSrc, portraitFile, handlePortraitChange } = usePortraitInput();
    const modalRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [existingPortraitSrc, setExistingPortraitSrc] = useState<string>("");
    const [settingsEmail, setSettingsEmail] = useState<string>("");
    const [settingsName, setSettingsName] = useState<string>("");
    const [settingsTheme, setSettingsTheme] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        if (profilePortrait) { setExistingPortraitSrc(`${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/portraits/${profilePortrait.split("\\").pop()}`); }
        setSettingsEmail(localStorage.getItem("sessionEmail") || "");
        setSettingsName(profileName);
        setSettingsTheme(localStorage.getItem("sessionTheme") || "");
    }, []);
    
    const validateFields = () => {
        const errors: Errors = {};
        if (!settingsEmail || !isValidEmail(settingsEmail)) {
            errors.settingsEmail = "Invalid user email. Ensure it is not empty and adheres to a valid email format.";
        }
        return errors;
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            closeModal();
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSettingsName(e.target.value);
    };
    
    const handlePortraitClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleUpdate = () => {
        const fieldErrors = validateFields();
        if (Object.keys(fieldErrors).length === 0) {
            const userIdString = localStorage.getItem("sessionId") || "";
            
            if (userIdString) {
                const userId = parseInt(userIdString, 10);
                const formData = new FormData();
                formData.append("email", settingsEmail);
                formData.append("name", settingsName);
                formData.append("theme", settingsTheme);
                if (portraitFile) { formData.append("portrait", portraitFile); }

                updateSettings(userId, formData, 
                    (data) => {
                        process.env.NODE_ENV === "development" && console.log("Success: Settings updated for user ID: ", data.id);
                        updateTheme(settingsTheme);
                        setProfilePortrait(data.portrait);
                        setProfileName(data.name);
                        closeModal();
                    }, 
                    (error) => {
                        console.error("Error: ", error);
                    }
                );
            } else {
                console.error("Error: User ID is null");
            }
        } else {
            setErrors(fieldErrors);
        }
    };

    return (
        <div ref={modalRef} className="modal show kwb-modal" onClick={handleOutsideClick} tabIndex={-1}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content kwb-formgroup">
                    <AppStyles.ThemedModalHeader theme={theme} className="modal-header">
                        <h2 className="modal-title">My Settings</h2>
                        <AppStyles.ThemedCloseButton theme={theme} type="button" className="btn-close" onClick={closeModal} aria-label="Close"></AppStyles.ThemedCloseButton>
                    </AppStyles.ThemedModalHeader>
                    <AppStyles.ThemedModalBody theme={theme} className="modal-body">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-3">
                                    <div id="settings-portrait" className="rounded-circle kwb-img-rounded kwb-portrait" style={{ backgroundImage: `url(${portraitSrc || existingPortraitSrc})` }} onClick={handlePortraitClick}></div>
                                    <input type="file" accept="image/*" style={{ display: "none" }} ref={fileInputRef} onChange={handlePortraitChange} />
                                </div>
                                <div className="col-9">
                                    <div id="settings-email" className="mb-4">
                                        <label className="form-label">My Email</label>
                                        <AppStyles.ThemedInput theme={theme} type="email" className="form-control" value={settingsEmail} disabled></AppStyles.ThemedInput>
                                        {errors.settingsEmail && <p className="text-danger">{errors.settingsEmail}</p>}
                                    </div>
                                    <div id="settings-name" className={`mb-4 ${errors.settingsName ? "has-error" : ""}`}>
                                        <label className="form-label">My Name</label>
                                        <AppStyles.ThemedInput theme={theme} type="text" className="form-control" value={settingsName} onChange={handleNameChange}></AppStyles.ThemedInput>
                                        {errors.settingsName && <p className="text-danger">{errors.settingsName}</p>}
                                    </div>
                                    <div id="settings-theme" className="mb-4">
                                        <label className="form-label">Theme</label>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" value="THEMEDEFAULT" checked={settingsTheme === "THEMEDEFAULT"} onChange={(e) => setSettingsTheme(e.target.value)} />
                                            <label className="form-check-label"> Default Theme</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" value="THEMELIGHT" checked={settingsTheme === "THEMELIGHT"} onChange={(e) => setSettingsTheme(e.target.value)} />
                                            <label className="form-check-label"> Light Theme</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" value="THEMEDARK" checked={settingsTheme === "THEMEDARK"} onChange={(e) => setSettingsTheme(e.target.value)} />
                                            <label className="form-check-label"> Dark Theme</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AppStyles.ThemedModalBody>
                    <AppStyles.ThemedModalFooter theme={theme} className="modal-footer">
                        <AppStyles.ThemedButton theme={theme} type="submit" className="btn kwb-btn" onClick={handleUpdate}>Save</AppStyles.ThemedButton>
                    </AppStyles.ThemedModalFooter>
                </div>
            </div>
        </div>
    );
}

export default ModalSettings;
