import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";

type BrowserIconsProps = {
    onIconSelect: (icon: Icon) => void;
    onClose: () => void;
};

const BrowserIcons = ({ onIconSelect, onClose }: BrowserIconsProps) => {
    const { theme } = useAppContext();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const iconPickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (iconPickerRef.current && !iconPickerRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [onClose]);

    const iconList: Icon[] = [
        { iconPrefix: "far", iconName: "lightbulb" } as Icon,
        { iconPrefix: "fas", iconName: "screwdriver-wrench" } as Icon,
        { iconPrefix: "far", iconName: "calendar" } as Icon,
        { iconPrefix: "fas", iconName: "brain" } as Icon,
        { iconPrefix: "fas", iconName: "triangle-exclamation" } as Icon,
        { iconPrefix: "fas", iconName: "desktop" } as Icon,
        { iconPrefix: "fas", iconName: "user-shield" } as Icon,
        { iconPrefix: "fas", iconName: "book-open" } as Icon,
        { iconPrefix: "fas", iconName: "chalkboard-teacher" } as Icon,
        { iconPrefix: "fas", iconName: "tools" } as Icon,
        { iconPrefix: "far", iconName: "file-alt" } as Icon,
        { iconPrefix: "fas", iconName: "video" } as Icon,
        { iconPrefix: "far", iconName: "comments" } as Icon,
        { iconPrefix: "fas", iconName: "users" } as Icon,
        { iconPrefix: "fas", iconName: "chart-line" } as Icon,
        { iconPrefix: "fas", iconName: "hands-helping" } as Icon,
        { iconPrefix: "fas", iconName: "medal" } as Icon,
        { iconPrefix: "fas", iconName: "envelope" } as Icon,
        { iconPrefix: "fas", iconName: "clipboard-list" } as Icon,
        { iconPrefix: "fas", iconName: "cogs" } as Icon,
        { iconPrefix: "fas", iconName: "question-circle" } as Icon,
        { iconPrefix: "far", iconName: "bell" } as Icon,
        { iconPrefix: "fas", iconName: "code" } as Icon,
        { iconPrefix: "fas", iconName: "lock" } as Icon,
        { iconPrefix: "fas", iconName: "wifi" } as Icon,
        { iconPrefix: "fas", iconName: "print" } as Icon,
        { iconPrefix: "fas", iconName: "database" } as Icon,
        { iconPrefix: "fas", iconName: "sync-alt" } as Icon,
        { iconPrefix: "fas", iconName: "life-ring" } as Icon,
        { iconPrefix: "fas", iconName: "user-graduate" } as Icon,
        { iconPrefix: "fas", iconName: "globe" } as Icon,
        { iconPrefix: "fas", iconName: "building" } as Icon,
        { iconPrefix: "fas", iconName: "mobile-alt" } as Icon,
        { iconPrefix: "fas", iconName: "laptop-code" } as Icon,
        { iconPrefix: "far", iconName: "folder-open" } as Icon,
        { iconPrefix: "fas", iconName: "exchange-alt" } as Icon,
        { iconPrefix: "fas", iconName: "user-cog" } as Icon,
        { iconPrefix: "far", iconName: "paper-plane" } as Icon,
        { iconPrefix: "fas", iconName: "bullhorn" } as Icon,
        { iconPrefix: "fas", iconName: "balance-scale" } as Icon,
        { iconPrefix: "far", iconName: "clipboard" } as Icon,
        { iconPrefix: "fas", iconName: "shopping-cart" } as Icon,
        { iconPrefix: "fas", iconName: "rocket" } as Icon,
        { iconPrefix: "far", iconName: "handshake" } as Icon,
        { iconPrefix: "fas", iconName: "search-dollar" } as Icon,
        { iconPrefix: "fas", iconName: "user-tie" } as Icon,
        { iconPrefix: "fas", iconName: "briefcase" } as Icon,
        { iconPrefix: "fas", iconName: "comment-dots" } as Icon,
        { iconPrefix: "far", iconName: "hourglass-half" } as Icon,
        { iconPrefix: "fas", iconName: "battery-half" } as Icon,
    ].filter(icon => icon.iconName.includes(searchTerm));
    
    return (
        <div ref={iconPickerRef} className="kwb-browsericons">
            <div className="kwb-browsericons-search">
                <AppStyles.ThemedInput theme={theme} type="text" className="form-control" placeholder="Search icons..." value={searchTerm} style={{ height: "37px" }} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <AppStyles.ThemedBrowserIconsDropdown theme={theme} className="kwb-browsericons-dropdown">
                <div className="kwb-browsericons-iconlist">
                    {iconList.map(icon => (
                        <div key={`${icon.iconPrefix} ${icon.iconName}`} className="kwb-browsericons-iconitem" onClick={() => onIconSelect(icon)}>
                            <FontAwesomeIcon icon={[icon.iconPrefix, icon.iconName]} size="lg" />
                        </div>
                    ))}
                </div>
            </AppStyles.ThemedBrowserIconsDropdown>
        </div>
    );
};

export default BrowserIcons;
