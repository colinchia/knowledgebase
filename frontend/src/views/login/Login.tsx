import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "src/AppContext";

function Login() {
    const { profileRole, setProfileRole, updateTheme, setProfilePortrait, setProfileName } = useAppContext();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loginEmail, setLoginEmail] = useState<string>("");
    const [loginPassword, setLoginPassword] = useState<string>("");

    const handleLogin = async () => {
        try {
            const payload = JSON.stringify({
                email: loginEmail,
                password: loginPassword
            });

            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: payload
            });

            const data = await response.json();

            if (data && data.token) {
                localStorage.setItem("jwtToken", data.token);
                localStorage.setItem("sessionId", data.id);
                localStorage.setItem("sessionPortrait", data.portrait);
                localStorage.setItem("sessionEmail", data.email);
                localStorage.setItem("sessionRole", data.role);
                localStorage.setItem("sessionName", data.name);
                localStorage.setItem("sessionDepartment", data.department);
                localStorage.setItem("sessionTheme", data.theme);
                setIsLoggedIn(true);
                setProfileRole(data.role);
                setProfileName(data.name);
                setProfilePortrait(data.portrait);
                updateTheme(data.theme);
            } else {
                console.error("Failed to login");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginPassword(e.target.value);
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 kwb-login-wrapper">
            <div id="login" className="container kwb-login">
                <div className="row flex-column-reverse flex-md-row">
                    <div className="col-md-6 d-flex align-items-center justify-content-center">
                        <img src={`${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/assets/welcome.jpg`} className="img-fluid" />
                    </div>
                    {isLoggedIn ? (
                        <div className="col-md-6 d-flex flex-column align-items-center justify-content-center kwb-login-form">
                            <h3 className="mb-4">Take me to the...</h3>
                            {isLoggedIn && (profileRole === "EDITOR" || profileRole === "ADMIN") && (
                                <Link to="/admin/dashboard" className="btn w-100 kwb-btn mb-3 kwb-login-link-outline"><i className="bi bi-key-fill kwb-btn-icon"></i>Admin Panel</Link>
                            )}
                            {isLoggedIn && (
                                <Link to="/home" className="btn w-100 kwb-btn kwb-login-link"><i className="bi bi-person-fill kwb-btn-icon"></i>User Site</Link>
                            )}
                        </div>
                    ) : (
                        <div className="col-md-6">
                            <h1>My Knowledgebase</h1>
                            <div className="mb-3">
                                <div className="mb-3">
                                    <label htmlFor="userEmail" className="form-label">Email</label>
                                    <input type="email" id="loginEmail" className="form-control" value={loginEmail} onChange={handleEmailChange} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="userPassword" className="form-label">Password</label>
                                    <input type="password" id="loginPassword" className="form-control" value={loginPassword} onChange={handlePasswordChange} />
                                </div>
                                <div className="mt-4 d-flex flex-column align-items-center">
                                    <button className="btn kwb-btn mb-2 kwb-login-button" onClick={handleLogin}>Login</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
