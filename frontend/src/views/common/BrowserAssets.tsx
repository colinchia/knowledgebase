import React, { useEffect, useState } from "react";
import { AppStyles } from "src/AppStyles";
import { useAppContext } from "src/AppContext";
import { getAllAssets } from "src/utils/AppApiInterfacers";

type BrowserAssetsProps = {
    onAssetSelected: (asset: Asset) => void;
    selectedAssets: Asset[];
};

function BrowserAssets({ onAssetSelected, selectedAssets }: BrowserAssetsProps) {
    const { theme } = useAppContext();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [textInputEnabled, setTextInputEnabled] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = () => {
        getAllAssets(
            (data) => {
                process.env.NODE_ENV === "development" && console.log("Success: Fetched all assets");
                setAssets(data);
            }, 
            (error) => {
                console.error("Error: ", error);
            }
        );
    };
    
    const handleShowAssets = () => {
        setTextInputEnabled(!textInputEnabled);
    };

    return (
        <div>
            <div className="input-group">
                <button className="btn btn-secondary kwb-btn" type="button" data-bs-toggle="collapse" data-bs-target="#assetcontainer" onClick={handleShowAssets}>Attach Asset</button>
                <AppStyles.ThemedInput theme={theme} type="text" className="form-control" placeholder="Search and attach files from the asset library" disabled={!textInputEnabled} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="collapse" id="assetcontainer">
                <AppStyles.ThemedAssetContainer theme={theme} className="kwb-asset-container">
                    <div className="row">
                        {assets
                            .filter(asset => !selectedAssets.some(selectedAsset => selectedAsset.id === asset.id))
                            .filter(asset => asset.filename.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(asset => (
                                <div key={asset.id} className="col-sm-2" onClick={() => onAssetSelected(asset)}>
                                    <div className="card kwb-asset-tile">
                                        <div className="position-relative">
                                            <div className="card-img-top bg-secondary d-flex justify-content-center align-items-center text-white kwb-docket-card-imagecontainer">
                                                <img src={`${process.env.REACT_APP_API_BASE_URL}/api/assets/serve/thumbnails/${asset.thumbnail.split("\\").pop()}`} className="kwb-docket-card-image" />
                                            </div>
                                        </div>
                                        <div className="card-footer text-truncate kwb-docket-cardfooter">
                                            {asset.filename}
                                        </div>
                                    </div>
                                </div>
                        ))}
                    </div>
                </AppStyles.ThemedAssetContainer>
            </div>
        </div>
    );
}

export default BrowserAssets;
