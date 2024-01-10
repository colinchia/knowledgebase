import React from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";

type HeaderProps = {
    showBackButton?: boolean;
    title?: string;
    goBack?: () => void;
};

function Header({ showBackButton = true, title = "", goBack }: HeaderProps) {
    const { theme } = useAppContext();

    return (
        <header className="container kwb-header">
            <div className="row">
                <div className="col-sm-12">
                    {showBackButton && (
                        <AppStyles.ThemedButton theme={theme} className="btn mb-3 kwb-btn" onClick={goBack}>
                            <i className="bi bi-arrow-left kwb-btn-icon"></i>
                            Back
                        </AppStyles.ThemedButton>
                    )}
                    <h1>{title}</h1>
                    <hr />
                </div>
            </div>
        </header>
    );
}

export default Header;
