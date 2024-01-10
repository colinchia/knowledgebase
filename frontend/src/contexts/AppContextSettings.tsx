import { useState } from "react";

type SettingContext = {
    profileRole: string;
    setProfileRole: (role: string) => void;
    profileDepartment: string;
    setProfileDepartment: (department: string) => void;
    profilePortrait: string;
    setProfilePortrait: (portrait: string) => void;
    profileName: string;
    setProfileName: (name: string) => void;
    initPage: string;
    setInitPage: (page: string) => void;
};

/**
 * Global Contexts for Current Logged-in User Settings
 */
export const useSettingContext = (): SettingContext => {
    const [profileRole, setProfileRole] = useState<string>("");
    const [profileDepartment, setProfileDepartment] = useState<string>("");
    const [profilePortrait, setProfilePortrait] = useState<string>("");
    const [profileName, setProfileName] = useState<string>("");
    const [initPage, setInitPage] = useState<string>("");

    return {
        profileRole,
        setProfileRole,
        profileDepartment,
        setProfileDepartment,
        profilePortrait,
        setProfilePortrait,
        profileName,
        setProfileName,
        initPage,
        setInitPage
    };
};
