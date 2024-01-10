package me.colinchia.knowledgebase.services;

import me.colinchia.knowledgebase.entities.Asset;
import me.colinchia.knowledgebase.repositories.AssetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AssetService {
    private final AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public Optional<Asset> getAssetById(int id) {
        return assetRepository.findById(id);
    }

    public Asset createAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    public Asset updateAsset(Asset asset) {
        return assetRepository.save(asset);
    }

    public void deleteAsset(int id) {
        assetRepository.deleteById(id);
    }
}
