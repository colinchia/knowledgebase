declare global {
    /**
     * Core Entity Types
     */
    type Article = {
        id: number;
        slug: string;
        title: string;
        description: string;
        author: string;
    };

    type Asset = {
        id: number;
        filename: string;
        filepath: string;
        filetype: string;
        filesize: number;
        thumbnail: string;
    };

    type Topic = {
        id: number;
        slug: string;
        title: string;
        description: string | null;
        icon: string;
    };

    type User = {
        id: number;
        email: string;
        password: string;
        role: string;
        name: string;
        department: string;
        portrait: string;
        theme: string;
    };
    

    /**
     * Other Miscellaneous Types
     */
    type FilterMapping = {
        "filter-image": string[];
        "filter-video": string[];
        "filter-audio": string[];
        "filter-document": string[];
    };
    
    type IconPrefix = "far" | "fas";

    type IconName =
        | "lightbulb"
        | "screwdriver-wrench"
        | "calendar"
        | "brain"
        | "triangle-exclamation"
        | "desktop"
        | "user-shield"
        | "book-open"
        | "chalkboard-teacher"
        | "tools"
        | "file-alt"
        | "video"
        | "comments"
        | "users"
        | "chart-line"
        | "hands-helping"
        | "medal"
        | "envelope"
        | "clipboard-list"
        | "cogs"
        | "question-circle"
        | "bell"
        | "code"
        | "lock"
        | "wifi"
        | "print"
        | "database"
        | "sync-alt"
        | "life-ring"
        | "user-graduate"
        | "globe"
        | "building"
        | "mobile-alt"
        | "laptop-code"
        | "folder-open"
        | "exchange-alt"
        | "user-cog"
        | "paper-plane"
        | "bullhorn"
        | "balance-scale"
        | "clipboard"
        | "shopping-cart"
        | "rocket"
        | "handshake"
        | "search-dollar"
        | "user-tie"
        | "briefcase"
        | "comment-dots"
        | "hourglass-half"
        | "battery-half"
    ;

    type Icon = {
        iconPrefix: IconPrefix;
        iconName: IconName;
    };

    type OpenSections = {
        [key: string]: boolean;
    };

    type Theme = {
        [key: string]: string;
    };
};

export {};
