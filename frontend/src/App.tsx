import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { ContextProvider, useAppContext } from "src/AppContext";
import { Login, Dashboard, ManageArticles, ManageAssets, ManageTopics, ManageUsers, Home, Article, Topic, ModalSettings } from "src/views";
import "src/App.scss";
library.add(far, fas);

function ModalManager() {
    const { activeModal } = useAppContext();
    switch (activeModal.name) {
        case "ModalSettings": return <ModalSettings { ...activeModal.data } />;
        default: return null;
    }
}

function App() {
    return (
        <ContextProvider>
            <div className="App">
                <Router>
                    <ModalManager />
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/admin/dashboard" element={<Dashboard />} />
                        <Route path="/admin/manage-topics" element={<ManageTopics />} />
                        <Route path="/admin/manage-articles" element={<ManageArticles />} />
                        <Route path="/admin/manage-users" element={<ManageUsers />} />
                        <Route path="/admin/manage-assets" element={<ManageAssets />} />
                        <Route path="/home" element={<Home />} />
                        <Route path="/topic" element={<Topic />} />
                        <Route path="/article" element={<Article />} />
                    </Routes>
                </Router>
            </div>
        </ContextProvider>
    );
}

export default App;
