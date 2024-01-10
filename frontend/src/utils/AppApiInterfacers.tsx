type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";
type CallbackFunction = (data: any) => void;
type EntityId = number;

async function apiRequest(
    url: string, 
    method: RequestMethod, 
    body: any | null, 
    onSuccess: CallbackFunction, 
    onError: CallbackFunction
): Promise<void> {
    try {
        const token = localStorage.getItem("jwtToken");
        const headers: HeadersInit = { "Authorization": `Bearer ${token}` };
        let requestOptions: RequestInit = { method, headers };

        if (method !== "GET") {
            if (body instanceof FormData) {
                requestOptions.body = body;
            } else {
                headers["Content-Type"] = "application/json";
                requestOptions.body = JSON.stringify(body);
            }
        }
        
        const response = await fetch(url, requestOptions);
        const data = await response.json();
        if (response.ok) {
            onSuccess(data);
        } else {
            onError(data);
        }
    } catch (error) {
        onError(error);
    }
}


// Manage Articles
export const getAllArticles = (onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/articles`;
    apiRequest(url, "GET", null, onSuccess, onError);
};

export const createArticle = (articleData: FormData, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/articles`;
    apiRequest(url, "POST", articleData, onSuccess, onError);
};

export const updateArticle = (articleId: EntityId, articleData: FormData, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/articles/${articleId}`;
    apiRequest(url, "PUT", articleData, onSuccess, onError);
};

export const deleteArticle = (articleId: EntityId, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/articles/${articleId}`;
    apiRequest(url, "DELETE", null, onSuccess, onError);
};


// Manage Topics
export const getAllTopics = (onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/topics`;
    apiRequest(url, "GET", null, onSuccess, onError);
};

export const createTopic = (topicData: FormData, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/topics`;
    apiRequest(url, "POST", topicData, onSuccess, onError);
};

export const updateTopic = (topicId: EntityId, topicData: FormData, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/topics/${topicId}`;
    apiRequest(url, "PUT", topicData, onSuccess, onError);
};

export const deleteTopic = (topicId: EntityId, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/topics/${topicId}`;
    apiRequest(url, "DELETE", null, onSuccess, onError);
};


// Manage Assets
export const getAllAssets = (onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/assets`;
    apiRequest(url, "GET", null, onSuccess, onError);
};

export const createAsset = (assetData: FormData, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/assets`;
    apiRequest(url, "POST", assetData, onSuccess, onError);
};

export const deleteAsset = (assetId: EntityId, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/assets/${assetId}`;
    apiRequest(url, "DELETE", null, onSuccess, onError);
};


// Manage Users
export const getAllUsers = (onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/users`;
    apiRequest(url, "GET", null, onSuccess, onError);
};

export const createUser = (userData: FormData, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/users`;
    apiRequest(url, "POST", userData, onSuccess, onError);
};

export const updateUser = (userId: EntityId, userData: FormData, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`;
    apiRequest(url, "PUT", userData, onSuccess, onError);
};

export const deleteUser = (userId: EntityId, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/users/${userId}`;
    apiRequest(url, "DELETE", null, onSuccess, onError);
};


// Modal Settings
export const updateSettings = (userId: EntityId, userData: FormData, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/users/settings/${userId}`;
    apiRequest(url, "PUT", userData, onSuccess, onError);
};


// Home
export const getPinnedArticles = (userId: EntityId, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/users/pinned-articles/${userId}`;
    apiRequest(url, "GET", null, onSuccess, onError);
};

export const pinArticle = (userId: EntityId, articleId: EntityId, pinState: boolean, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/users/pin-article/${userId}/${articleId}`;
    const body = { pin: pinState };
    apiRequest(url, "POST", body, onSuccess, onError);
}

export const findAllTopicsWithArticleCount = (onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/topics/count`;
    apiRequest(url, "GET", null, onSuccess, onError);
};


// Topic
export const getArticlesByTopicId = (topicId: EntityId, onSuccess: CallbackFunction, onError: CallbackFunction) => {
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/articles/by-topic/${topicId}`;
    apiRequest(url, "GET", null, onSuccess, onError);
};
