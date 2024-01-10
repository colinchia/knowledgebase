import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { findAllTopicsWithArticleCount } from "src/utils/AppApiInterfacers";

type TopicWithDetails = Topic & {
    articleCount: number;
};

function HomeGalleryAllTopics() {
    const { theme } = useAppContext();
    const [topics, setTopics] = useState<TopicWithDetails[]>([]);
    const [searchedTopics, setSearchedTopics] = useState<TopicWithDetails[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    useEffect(() => {
        handleFindAllTopicsWithArticleCount();
    }, []);

    useEffect(() => {
        searchTopics();
    }, [searchTerm, topics]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const searchTopics = () => {
        if (searchTerm) {
            const searched = topics.filter(topic =>
                topic.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchedTopics(searched);
        } else {
            setSearchedTopics(topics);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleFindAllTopicsWithArticleCount = () => {
        findAllTopicsWithArticleCount(
            (data: [Topic, number][]) => {
                const formattedData = data.map(([topic, count]) => ({ ...topic, articleCount: count }));
                setTopics(formattedData);
                setSearchedTopics(formattedData);
            },
            (error) => {
                console.error("Error:", error);
            }
        );
    };
    
    return (
        <AppStyles.ThemedHomeGalleryAllTopics theme={theme} className="container kwb-card kwb-home-galleryalltopics">
            <div className="row mb-3">
                <div className="col-sm-2 d-flex align-items-center kwb-home-galleryalltopicstitle">
                    All Topics
                </div>
                <div className="col-sm-10">
                    <AppStyles.ThemedInput theme={theme} type="text" className="form-control" placeholder="Search for topics..." value={searchTerm} onChange={handleSearchChange} />
                </div>
            </div>
            <div id="galleryalltopics" className="row mb-3 row-cols-3 row-cols-md-6 g-3 collapse kwb-home-galleryalltopicsrow">
                {searchedTopics
                    .filter(topic => topic.articleCount > 0)
                    .map((topic, index) => (
                    <div className="col" key={index}>
                        <Link to="/topic" state={{ topicObject: topic }} className="text-decoration-none text-reset">
                            <AppStyles.ThemedHomeGalleryAllTopicsCard theme={theme} className="kwb-home-galleryalltopicscard">
                                <FontAwesomeIcon className="mb-2" icon={topic.icon.split(" ") as [any, any]} size="lg" /><br />
                                <span className="fw-semibold">{topic.title}</span><br />
                                <span>{topic.articleCount} articles</span>
                            </AppStyles.ThemedHomeGalleryAllTopicsCard>
                        </Link>
                    </div>
                ))}
            </div>
            <div className="row">
                <div className="col-sm-12 d-flex justify-content-center">
                    <AppStyles.ThemedButton theme={theme} className="btn kwb-btn" type="button" onClick={toggleExpand} data-bs-toggle="collapse" href="#galleryalltopics">
                        {isExpanded ? "Show Less" : "Show More"}
                    </AppStyles.ThemedButton>
                </div>
            </div>
        </AppStyles.ThemedHomeGalleryAllTopics>
    );
}

export default HomeGalleryAllTopics;
