import React from "react";
import { useNavigate } from "react-router-dom";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";

type SidebarProps = {
    toggleNav: () => void;
    sidebarWidth: number;
    accountSize: number;
    navLinkHidden: boolean;
};

function Sidebar({ toggleNav, sidebarWidth, accountSize, navLinkHidden }: SidebarProps) {
    const { openModal, theme, profilePortrait, initPage } = useAppContext();
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate(initPage);
    };

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const handleSidebarClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.currentTarget.id === "sidebar") {
            toggleNav();
        }
    };

    return (
        <AppStyles.ThemedSidebar theme={theme} id="sidebar" className="kwb-sidebar" style={{ width: `${sidebarWidth}px` }} onClick={handleSidebarClick}>
            <div>
                <a 
                    className="rounded-circle mb-4 mt-3 kwb-sidebar-profileimage" 
                    style={{ backgroundImage: `url(${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/portraits/${profilePortrait.split("\\").pop()})`, width: `${accountSize}px`, height: `${accountSize}px` }} 
                    onClick={(e) => { e.stopPropagation(); openModal("ModalSettings") }}></a>
                <AppStyles.ThemedSidebarLink theme={theme} className="kwb-sidebar-link" onClick={(e) => { e.stopPropagation(); handleHomeClick(); }}>
                    <i className="bi bi-house-door-fill"></i>
                    <span className={`${navLinkHidden ? "kwb-hidden" : ""}`}>Home</span>
                </AppStyles.ThemedSidebarLink>
            </div>
            <div>
                <AppStyles.ThemedSidebarLink theme={theme} className="kwb-sidebar-link" onClick={(e) => { e.stopPropagation(); logout(); }}>
                    <i className="bi bi-door-open-fill"></i>
                    <span className={`${navLinkHidden ? "kwb-hidden" : ""}`}>Logout</span>
                </AppStyles.ThemedSidebarLink>
            </div>
        </AppStyles.ThemedSidebar>
    );
}

export default Sidebar;
