import React, { useState, ReactNode } from "react";

type TooltipProps = {
    text: string;
    children: ReactNode;
};

function Tooltip({ text, children }: TooltipProps) {
    const [showTooltip, setShowTooltip] = useState<boolean>(false);

    return (
        <div 
            className="kwb-tooltip" 
            onMouseEnter={() => setShowTooltip(true)} 
            onMouseLeave={() => setShowTooltip(false)}
        >
            {children}
            {showTooltip && (
                <div className="kwb-tooltip-content">
                    {text}
                </div>
            )}
        </div>
    );
}

export default Tooltip;
