import React, { useEffect, useState } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { getAllTopics } from "src/utils/AppApiInterfacers";

type BrowserTopicsProps = {
    onTopicSelected: (topic: Topic) => void;
    selectedTopics: Topic[];
};

function BrowserTopics({ onTopicSelected, selectedTopics }: BrowserTopicsProps) {
    const { theme } = useAppContext();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [textInputEnabled, setTextInputEnabled] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = () => {
        getAllTopics(
            (data) => {
                process.env.NODE_ENV === "development" && console.log("Success: Fetched all topics");
                setTopics(data);
            }, 
            (error) => {
                console.error("Error: ", error);
            }
        );
    };

    const handleShowTopics = () => {
        setTextInputEnabled(!textInputEnabled);
    };

    return (
        <div>
            <div className="input-group">
                <button type="button" className="btn btn-secondary kwb-btn" data-bs-toggle="collapse" data-bs-target="#topiccontainer" onClick={handleShowTopics}>Select Topic</button>
                <AppStyles.ThemedInput theme={theme} type="text" className="form-control" placeholder="Add one or more topics" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} disabled={!textInputEnabled} />
            </div>
            <div className="collapse" id="topiccontainer">
                <AppStyles.ThemedTopicContainer theme={theme} className="kwb-browsertopics-container">
                    {topics
                        .filter(topic => !selectedTopics.some(selectedTopic => selectedTopic.id === topic.id))
                        .filter(topic => topic.title.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(topic => (
                            <div key={topic.id} onClick={() => onTopicSelected(topic)}>
                                <button type="button" className="btn btn-outline-secondary kwb-btn">
                                    {topic.title}
                                </button>
                            </div>
                    ))}
                </AppStyles.ThemedTopicContainer>
            </div>
        </div>
    );
}

export default BrowserTopics;
