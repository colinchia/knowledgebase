import React, { createContext, useContext, ReactNode, Context } from "react";
import { useThemeContext } from "src/contexts/AppContextThemes";
import { useModalContext } from "src/contexts/AppContextModals";
import { useSettingContext } from "src/contexts/AppContextSettings";
import { useSidebarContext } from "src/contexts/AppContextSidebars";

type AppContext = {
    sidebarWidth: number;
    contentMargin: number;
    accountSize: number;
    navLinkHidden: boolean;
    toggleNav: () => void;
    theme: Theme;
    updateTheme: (theme: string) => void;
    activeModal: { name: string | null; data?: any };
    openModal: (name: string, data?: any) => void;
    closeModal: () => void;
    triggerDocketRefresh: () => void;
    refreshDocket: boolean;
    profileRole: string;
    setProfileRole: (role: string) => void;
    profileDepartment: string;
    setProfileDepartment: (profileDepartment: string) => void;
    profilePortrait: string;
    setProfilePortrait: (portrait: string) => void;
    profileName: string;
    setProfileName: (name: string) => void;
    initPage: string;
    setInitPage: (page: string) => void;
};

const AppContext: Context<AppContext| undefined> = createContext<AppContext| undefined>(undefined);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
    const { sidebarWidth, contentMargin, accountSize, navLinkHidden, toggleNav } = useSidebarContext();
    const { theme, updateTheme } = useThemeContext();
    const { activeModal, openModal, closeModal, triggerDocketRefresh, refreshDocket } = useModalContext();
    const { profileRole, setProfileRole, profileDepartment, setProfileDepartment, profilePortrait, setProfilePortrait, profileName, setProfileName, initPage, setInitPage } = useSettingContext();

    return (
        <AppContext.Provider value={{
            sidebarWidth, contentMargin, accountSize, navLinkHidden, toggleNav,
            theme, updateTheme,
            activeModal, openModal, closeModal, triggerDocketRefresh, refreshDocket, 
            profileRole, setProfileRole, profileDepartment, setProfileDepartment, profilePortrait, setProfilePortrait, profileName, setProfileName, initPage, setInitPage }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContext=> {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within the ContextProvider");
    }
    return context;
};
