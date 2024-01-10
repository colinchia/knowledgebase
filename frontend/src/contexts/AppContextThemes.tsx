import { useState } from "react";

type ThemeContext = {
    theme: Theme;
    updateTheme: (themeName: string) => void;
};

/**
 * Global Contexts for UI Theme Settings
 */
export const useThemeContext = (): ThemeContext => {
    const themes = {
        THEMEDEFAULT: {
            sidebarBackground: "#252525",
            sidebarLink: "#ffffff",
            sidebarLinkHover: "#af936c",
    
            cardAllTopicsBackground: "#f5f5f5",
            cardAllTopicsBorder: "transparent",
    
            background: "#ffffff",
            backgroundSecondary: "#a9a9a9",
            border: "rgba(63, 63, 63, .2)",
            text: "#333333",
            textSecondary: "rgba(63, 63, 63, .3)",
            link: "#af936c",
            linkHover: "#f1d7b3",
            input: "",
            inputDisabled: "",
            closeBtn: "none",
    
            buttonBackground: "#af936c",
            buttonText: "#ffffff",
            buttonBackgroundHover: "#f1d7b3",
            buttonTextHover: "#ffffff",
    
            buttonOutlineBackground: "transparent",
            buttonOutlineBorder: "#af936c",
            buttonOutlineText: "#af936c",
            buttonOutlineBackgroundHover: "#af936c",
            buttonOutlineTextHover: "#ffffff",
    
            buttonSecondaryBackground: "#7c7c7c",
            buttonSecondaryText: "#ffffff",
            buttonSecondaryBackgroundHover: "#b3b3b3",
            buttonSecondaryTextHover: "#ffffff",
    
            buttonSecondaryOutlineBackground: "transparent",
            buttonSecondaryOutlineBorder: "#7c7c7c",
            buttonSecondaryOutlineText: "#7c7c7c",
            buttonSecondaryOutlineBackgroundHover: "#7c7c7c",
            buttonSecondaryOutlineTextHover: "#ffffff",
    
            docketCardBackground: "lightgray",
            docketCardBorder: "white",
        },
        THEMELIGHT: {
            sidebarBackground: "#edeae9",
            sidebarLink: "#333333",
            sidebarLinkHover: "#a9a9a9",
    
            cardAllTopicsBackground: "#f5f5f5",
            cardAllTopicsBorder: "transparent",
    
            background: "#ffffff",
            backgroundSecondary: "#edeae9",
            border: "rgba(63, 63, 63, .2)",
            text: "#333333",
            textSecondary: "rgba(63, 63, 63, .3)",
            link: "#c26666",
            linkHover: "#ffc1c1",
            input: "",
            inputDisabled: "",
            closeBtn: "none",
    
            buttonBackground: "#c26666",
            buttonText: "#ffffff",
            buttonBackgroundHover: "#ffc1c1",
            buttonTextHover: "#ffffff",
    
            buttonOutlineBackground: "transparent",
            buttonOutlineBorder: "#c26666",
            buttonOutlineText: "#c26666",
            buttonOutlineBackgroundHover: "#ffc1c1",
            buttonOutlineTextHover: "#ffffff",
    
            buttonSecondaryBackground: "#7c7c7c",
            buttonSecondaryText: "#ffffff",
            buttonSecondaryBackgroundHover: "#b3b3b3",
            buttonSecondaryTextHover: "#ffffff",
    
            buttonSecondaryOutlineBackground: "transparent",
            buttonSecondaryOutlineBorder: "#7c7c7c",
            buttonSecondaryOutlineText: "#7c7c7c",
            buttonSecondaryOutlineBackgroundHover: "#7c7c7c",
            buttonSecondaryOutlineTextHover: "#ffffff",
    
            docketCardBackground: "lightgray",
            docketCardBorder: "white",
        },
        THEMEDARK: {
            sidebarBackground: "#1e1e1e",
            sidebarLink: "#e6e6e6",
            sidebarLinkHover: "#ffffff",
    
            cardAllTopicsBackground: "#26282b",
            cardAllTopicsBorder: "rgba(255, 255, 255, .3)",
    
            background: "#252525",
            backgroundSecondary: "#1e1e1e",
            border: "rgba(255, 255, 255, .3)",
            text: "#ffffff",
            textSecondary: "rgba(255, 255, 255, .3)",
            link: "#6991e7",
            linkHover: "#9bb5ec",
            input: "#464d55",
            inputDisabled: "#212529",
            closeBtn: "invert(1) grayscale(100%) brightness(200%)",
    
            buttonBackground: "#6991e7",
            buttonText: "#ffffff",
            buttonBackgroundHover: "#9bb5ec",
            buttonTextHover: "#ffffff",
    
            buttonOutlineBackground: "transparent",
            buttonOutlineBorder: "#6991e7",
            buttonOutlineText: "#6991e7",
            buttonOutlineBackgroundHover: "#6991e7",
            buttonOutlineTextHover: "#ffffff",
    
            buttonSecondaryBackground: "#7c7c7c",
            buttonSecondaryText: "#ffffff",
            buttonSecondaryBackgroundHover: "#b3b3b3",
            buttonSecondaryTextHover: "#ffffff",
    
            buttonSecondaryOutlineBackground: "transparent",
            buttonSecondaryOutlineBorder: "#7c7c7c",
            buttonSecondaryOutlineText: "#7c7c7c",
            buttonSecondaryOutlineBackgroundHover: "#7c7c7c",
            buttonSecondaryOutlineTextHover: "#ffffff",
    
            docketCardBackground: "#1e1e1e",
            docketCardBorder: "rgba(255, 255, 255, .3)",
        },
    };
    
    const [theme, setTheme] = useState<Theme>(themes.THEMEDEFAULT);

    // Update theme dynamically from settings modal
    const updateTheme = (themeName: string) => {
        const newTheme = themes[themeName as keyof typeof themes] || themes.THEMEDEFAULT;
        setTheme(newTheme); // Set new theme css
        localStorage.setItem("sessionTheme", themeName); // Set new theme name
    };

    return {
        theme,
        updateTheme
    };
};
