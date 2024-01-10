import React from "react";

const currentYear = new Date().getFullYear();

function Footer() {
    return (
        <footer className="mt-auto py-3 kwb-footer">
            <div className="container text-center">
                <span>{currentYear}. This app is open source. Feel free to use, modify, and distribute.</span>
            </div>
        </footer>
    );
}

export default Footer;
