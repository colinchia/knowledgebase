import { useState } from "react";

type SidebarContext = {
    sidebarWidth: number;
    contentMargin: number;
    accountSize: number;
    navLinkHidden: boolean;
    toggleNav: () => void;
};

/**
 * Global Contexts for Sidebar/Content Widths
 */
export const useSidebarContext = (): SidebarContext => {
    const [sidebarWidth, setSidebarWidth] = useState<number>(250);
    const [contentMargin, setContentMargin] = useState<number>(250);
    const [accountSize, setAccountSize] = useState<number>(120);
    const [navLinkHidden, setNavLinkHidden] = useState<boolean>(false);

    const toggleNav = () => {
        if (sidebarWidth === 250) {
            setSidebarWidth(60);
            setContentMargin(60);
            setAccountSize(20);
            setNavLinkHidden(true);
        } else {
            setSidebarWidth(250);
            setContentMargin(250);
            setAccountSize(120);
            setNavLinkHidden(false);
        }
    };

    return {
        sidebarWidth,
        contentMargin,
        accountSize,
        navLinkHidden,
        toggleNav
    };
};
