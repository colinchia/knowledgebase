import React from "react";
import { Link } from "react-router-dom";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";

function DashboardGallery() {
    const { theme, profileRole } = useAppContext();

    return (
        <div className="container">
            <div className="row mb-4">
                <div className="col-lg mb-4">
                    <Link to="/admin/manage-assets" className="text-decoration-none">
                        <AppStyles.ThemedDashboardGalleryCard theme={theme} className="card h-100 kwb-dashboard-gallerycard">
                            <div className="img-wrapper kwb-dashboard-galleryimgwrapper">
                                <img src={`${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/assets/dashboard-gallery-manage-assets.jpg`} className="card-img-top" />
                            </div>
                            <AppStyles.ThemedDashboardGalleryCardBody theme={theme} className="card-body kwb-dashboard-gallerycardbody">
                                <h5 className="card-title kwb-dashboard-gallerycardtitle">Manage Assets</h5>
                                <p className="card-text">Manage uploaded file resources</p>
                            </AppStyles.ThemedDashboardGalleryCardBody>
                        </AppStyles.ThemedDashboardGalleryCard>
                    </Link>
                </div>
                <div className="col-lg mb-4">
                    <Link to="/admin/manage-topics" className="text-decoration-none">
                        <AppStyles.ThemedDashboardGalleryCard theme={theme} className="card h-100 kwb-dashboard-gallerycard">
                            <div className="img-wrapper kwb-dashboard-galleryimgwrapper">
                                <img src={`${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/assets/dashboard-gallery-manage-topics.jpg`} className="card-img-top" />
                            </div>
                            <AppStyles.ThemedDashboardGalleryCardBody theme={theme} className="card-body kwb-dashboard-gallerycardbody">
                                <h5 className="card-title kwb-dashboard-gallerycardtitle">Manage Topics</h5>
                                <p className="card-text">Create, edit, or delete topics</p>
                            </AppStyles.ThemedDashboardGalleryCardBody>
                        </AppStyles.ThemedDashboardGalleryCard>
                    </Link>
                </div>
                <div className="col-lg mb-4">
                    <Link to="/admin/manage-articles" className="text-decoration-none">
                        <AppStyles.ThemedDashboardGalleryCard theme={theme} className="card h-100 kwb-dashboard-gallerycard">
                            <div className="img-wrapper kwb-dashboard-galleryimgwrapper">
                                <img src={`${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/assets/dashboard-gallery-manage-articles.jpg`} className="card-img-top" />
                            </div>
                            <AppStyles.ThemedDashboardGalleryCardBody theme={theme} className="card-body kwb-dashboard-gallerycardbody">
                                <h5 className="card-title kwb-dashboard-gallerycardtitle">Manage Articles</h5>
                                <p className="card-text">Add new articles, edit existing ones, or remove articles</p>
                            </AppStyles.ThemedDashboardGalleryCardBody>
                        </AppStyles.ThemedDashboardGalleryCard>
                    </Link>
                </div>
                {profileRole === "ADMIN" && (
                    <div className="col-lg mb-4">
                        <Link to="/admin/manage-users" className="text-decoration-none">
                            <AppStyles.ThemedDashboardGalleryCard theme={theme} className="card h-100 kwb-dashboard-gallerycard">
                                <div className="img-wrapper kwb-dashboard-galleryimgwrapper">
                                    <img src={`${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/assets/dashboard-gallery-manage-users.jpg`} className="card-img-top" />
                                </div>
                                <AppStyles.ThemedDashboardGalleryCardBody theme={theme} className="card-body kwb-dashboard-gallerycardbody">
                                    <h5 className="card-title kwb-dashboard-gallerycardtitle">Manage Users</h5>
                                    <p className="card-text">Control user access, permissions, and roles</p>
                                </AppStyles.ThemedDashboardGalleryCardBody>
                            </AppStyles.ThemedDashboardGalleryCard>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DashboardGallery;
