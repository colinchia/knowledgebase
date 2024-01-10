import React, { useRef, useState } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { isValidEmail, isValidPassword } from "src/utils/AppValidators";
import { updateUser } from "src/utils/AppApiInterfacers";
import usePortraitInput from "src/hooks/usePortraitInput";

type Errors = {
    userEmail?: string;
    userPassword?: string;
    userRole?: string;
    userName?: string;
    userDepartment?: string;
};

function ManageUsersModalUpdate() {
    const { activeModal, closeModal, triggerDocketRefresh, theme } = useAppContext();
    const { portraitSrc, portraitFile, handlePortraitChange } = usePortraitInput();
    const modalRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const user = activeModal.data as User;
    const [userEmail, setUserEmail] = useState<string>(user.email);
    const [userPassword, setUserPassword] = useState<string>("•••••");
    const [userRole, setUserRole] = useState<string>(user.role);
    const [userName, setUserName] = useState<string>(user.name);
    const [userDepartment, setUserDepartment] = useState<string>(user.department);
    const existingPortraitSrc = `${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/portraits/${user.portrait.split("\\").pop()}`;
    const displayPortrait = portraitSrc || existingPortraitSrc;
    const [passwordModified, setPasswordModified] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({});

    const validateFields = () => {
        const errors: Errors = {};
        if (!userEmail || !isValidEmail(userEmail)) {
            errors.userEmail = "Invalid user email. Ensure it is not empty and adheres to a valid email format.";
        }
        if (passwordModified && !isValidPassword(userPassword)) {
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

    const handlePasswordFocus = () => {
        if (!passwordModified) {
            setUserPassword("");
            setPasswordModified(true);
        }
    };

    const handlePasswordBlur = () => {
        if (passwordModified && userPassword === "") {
            setUserPassword("•••••");
            setPasswordModified(false);
        }
    };

    const handleUpdate = async () => {
        const fieldErrors = validateFields();
        if (Object.keys(fieldErrors).length === 0) {
            const formData = new FormData();
            formData.append("email", userEmail);
            if (passwordModified) { formData.append("password", userPassword); }
            formData.append("role", userRole);
            formData.append("name", userName);
            formData.append("department", userDepartment);
            if (portraitFile) { formData.append("portrait", portraitFile); }
            
            updateUser(user.id, formData, 
                (data) => {
                    process.env.NODE_ENV === "development" && console.log("Success: User updated: ", data);
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
                        <h2 className="modal-title">Update User</h2>
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
                                        <AppStyles.ThemedInput theme={theme} type="password" className="form-control" value={userPassword} onChange={handlePasswordChange} onFocus={handlePasswordFocus} onBlur={handlePasswordBlur}></AppStyles.ThemedInput>
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
                        <AppStyles.ThemedButton theme={theme} type="submit" className="btn kwb-btn" onClick={handleUpdate}>Update</AppStyles.ThemedButton>
                    </AppStyles.ThemedModalFooter>
                </div>
            </div>
        </div>
    );
}

export default ManageUsersModalUpdate;
