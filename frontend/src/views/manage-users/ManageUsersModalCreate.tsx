import React, { useRef, useState } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { isValidEmail, isValidPassword } from "src/utils/AppValidators";
import { createUser } from "src/utils/AppApiInterfacers";
import usePortraitInput from "src/hooks/usePortraitInput";

type Errors = {
    userEmail?: string;
    userPassword?: string;
    userName?: string;
    userDepartment?: string;
    userRole?: string;
};

function ManageUsersModalCreate() {
    const { closeModal, triggerDocketRefresh, theme } = useAppContext();
    const { portraitSrc, portraitFile, handlePortraitChange } = usePortraitInput();
    const defaultPortraitSrc = `${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/portraits/portrait-default.jpg`;
    const displayPortrait = portraitSrc || defaultPortraitSrc;
    const modalRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userEmail, setUserEmail] = useState<string>("");
    const [userPassword, setUserPassword] = useState<string>("");
    const [userRole, setUserRole] = useState<string>("READER");
    const [userName, setUserName] = useState<string>("");
    const [userDepartment, setUserDepartment] = useState<string>("");
    const [errors, setErrors] = useState<Errors>({});
    
    const validateFields = () => {
        const errors: Errors = {};
        if (!userEmail || !isValidEmail(userEmail)) {
            errors.userEmail = "Invalid user email. Ensure it is not empty and adheres to a valid email format.";
        }
        if (!userPassword || !isValidPassword(userPassword)) {
            errors.userPassword = "Invalid password. Ensure it is at least 8 characters long and contains at least one number, one uppercase letter, and one lowercase letter.";
        }
        if (!userRole) {
            errors.userRole = "User role cannot be empty.";
        }
        return errors;
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === modalRef.current) {
            closeModal();
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserPassword(e.target.value);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    };

    const handleDepartmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserDepartment(e.target.value);
    };

    const handlePortraitClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleCreate = () => {
        const fieldErrors = validateFields();
        if (Object.keys(fieldErrors).length === 0) {
            const formData = new FormData();
            formData.append("email", userEmail);
            formData.append("password", userPassword);
            formData.append("role", userRole);
            formData.append("name", userName);
            formData.append("department", userDepartment);
            if (portraitFile) { formData.append("portrait", portraitFile); }

            createUser(formData, 
                (data) => {
                    process.env.NODE_ENV === "development" && console.log("Success: User created: ", data);
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
                        <h2 className="modal-title">Create User</h2>
                        <AppStyles.ThemedCloseButton theme={theme} type="button" className="btn-close" onClick={closeModal} aria-label="Close"></AppStyles.ThemedCloseButton>
                    </AppStyles.ThemedModalHeader>
                    <AppStyles.ThemedModalBody theme={theme} className="modal-body">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-3">
                                    <div id="user-portrait" className="kwb-img-rounded rounded-circle kwb-portrait" style={{backgroundImage: `url(${displayPortrait})`}} onClick={handlePortraitClick}></div>
                                    <input type="file" accept="image/*" style={{display: "none"}} ref={fileInputRef} onChange={handlePortraitChange} />
                                </div>
                                <div className="col-9">
                                    <div id="user-email" className={`mb-4 ${errors.userEmail ? "has-error" : ""}`}>
                                        <label className="form-label">User Email <span className="text-danger">*</span></label>
                                        <AppStyles.ThemedInput theme={theme} type="email" className="form-control" value={userEmail} onChange={handleEmailChange}></AppStyles.ThemedInput>
                                        {errors.userEmail && <p className="text-danger">{errors.userEmail}</p>}
                                    </div>
                                    <div id="user-password" className={`mb-4 ${errors.userPassword ? "has-error" : ""}`}>
                                        <label className="form-label">User Password <span className="text-danger">*</span></label>
                                        <AppStyles.ThemedInput theme={theme} type="password" className="form-control" value={userPassword} onChange={handlePasswordChange}></AppStyles.ThemedInput>
                                        {errors.userPassword && <p className="text-danger">{errors.userPassword}</p>}
                                    </div>
                                    <div id="user-name" className={`mb-4 ${errors.userName ? "has-error" : ""}`}>
                                        <label className="form-label">User Name</label>
                                        <AppStyles.ThemedInput theme={theme} type="text" className="form-control" value={userName} onChange={handleNameChange}></AppStyles.ThemedInput>
                                        {errors.userName && <p className="text-danger">{errors.userName}</p>}
                                    </div>
                                    <div id="user-department" className={`mb-4 ${errors.userDepartment ? "has-error" : ""}`}>
                                        <label className="form-label">User Department</label>
                                        <AppStyles.ThemedInput theme={theme} type="text" className="form-control" value={userDepartment} onChange={handleDepartmentChange}></AppStyles.ThemedInput>
                                        {errors.userDepartment && <p className="text-danger">{errors.userDepartment}</p>}
                                    </div>
                                    <div id="user-role" className={`mb-4 ${errors.userRole ? "has-error" : ""}`}>
                                        <label className="form-label">User Role <span className="text-danger">*</span></label>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="userrole" value="READER" checked={userRole === "READER"} onChange={(e) => setUserRole(e.target.value)} />
                                            <label className="form-check-label" htmlFor="userrole-reader"> Reader</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="userrole" value="EDITOR" checked={userRole === "EDITOR"} onChange={(e) => setUserRole(e.target.value)} />
                                            <label className="form-check-label" htmlFor="userrole-editor"> Editor</label>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="userrole" value="ADMIN" checked={userRole === "ADMIN"} onChange={(e) => setUserRole(e.target.value)} />
                                            <label className="form-check-label" htmlFor="userrole-admin"> Admin</label>
                                        </div>
                                        {errors.userRole && <p className="text-danger">{errors.userRole}</p>}
                                    </div>
                                </div>
                            </div>
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

export default ManageUsersModalCreate;
