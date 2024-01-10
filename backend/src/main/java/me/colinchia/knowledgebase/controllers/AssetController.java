package me.colinchia.knowledgebase.controllers;

import me.colinchia.knowledgebase.entities.Article;
import me.colinchia.knowledgebase.entities.Asset;
import me.colinchia.knowledgebase.services.ArticleService;
import me.colinchia.knowledgebase.services.AssetService;
import me.colinchia.knowledgebase.utils.ResourceUtil;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assets")
public class AssetController {
    private final AssetService assetService;
    private final ArticleService articleService;
    private final ResourceUtil resourceUtil;

    public AssetController(AssetService assetService, ArticleService articleService, ResourceUtil resourceUtil) {
        this.assetService = assetService;
        this.articleService = articleService;
        this.resourceUtil = resourceUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllAssets() {
        try {
            List<Asset> assets = assetService.getAllAssets();
            return ResponseEntity.status(HttpStatus.OK).body(assets);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while retrieving all assets"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAssetById(@PathVariable int id) {
        try {
            Optional<Asset> asset = assetService.getAssetById(id);
            if (asset.isPresent()) {
                return ResponseEntity.status(HttpStatus.OK).body(asset.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Asset not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while retrieving the asset"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createAsset(@RequestParam("files") MultipartFile[] files) {
        try {
            if (files == null || files.length == 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", "No files received"));
            }

            Path assetsDir = resourceUtil.getResourcesDir().resolve("assets");
            List<Asset> createdAssetList = new ArrayList<>();
            List<String> errorMessages = processFiles(files, assetsDir, createdAssetList);

            return errorMessages.isEmpty()
                    ? ResponseEntity.status(HttpStatus.OK).body(createdAssetList)
                    : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(String.join(", ", errorMessages));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while creating the assets"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAsset(@PathVariable int id,
                                         @RequestParam("filename") String filename,
                                         @RequestParam("filepath") String filepath,
                                         @RequestParam("filetype") String filetype) {
        try {
            Optional<Asset> optionalAsset = assetService.getAssetById(id);
            if (!optionalAsset.isPresent()) {
                return null;
            }

            Asset existingAsset = optionalAsset.get();
            existingAsset.setFilename(filename);
            existingAsset.setFilepath(filepath);
            existingAsset.setFiletype(filetype);

            Asset updatedAsset = assetService.updateAsset(existingAsset);
            return ResponseEntity.status(HttpStatus.OK).body(updatedAsset);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while updating the asset"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAsset(@PathVariable int id) {
        try {
            Optional<Asset> optionalAsset = assetService.getAssetById(id);
            if (optionalAsset.isPresent()) {
                Asset asset = optionalAsset.get();

                List<Article> usingArticles = articleService.getArticlesByAssetId(id);
                if (!usingArticles.isEmpty()) {
                    List<String> articleTitles = usingArticles.stream().map(Article::getTitle).collect(Collectors.toList());
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonMap("error", "One or more articles are still using this asset: " + articleTitles));
                }

                // Delete asset file and thumbnail
                Path filePath = Paths.get(asset.getFilepath());
                Path thumbnailPath = Paths.get(asset.getThumbnail());
                Files.deleteIfExists(filePath);
                Files.deleteIfExists(thumbnailPath);

                // Delete asset record from database
                assetService.deleteAsset(id);
                return ResponseEntity.status(HttpStatus.OK).body(Collections.singletonMap("message", "Article successfully deleted"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Asset not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while deleting the asset"));
        }
    }

    @GetMapping("/serve/{directory}/{filename:.+}")
    public ResponseEntity<?> serveFile(@PathVariable String directory, @PathVariable String filename) {
        try {
            Path assetsDir = resourceUtil.getResourcesDir();
            Path file = assetsDir.resolve(directory).resolve(filename).toAbsolutePath().normalize();
            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "File not found"));
            }

            String contentType = Files.probeContentType(file);
            ResponseEntity.BodyBuilder responseBuilder = ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(resource.contentLength()));

            if (isDownloadableFileType(filename)) {
                responseBuilder.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"");
            }

            return responseBuilder.body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "Failed to serve the file"));
        }
    }

    private boolean isDownloadableFileType(String filename) {
        String lowerCaseFilename = filename.toLowerCase();
        return lowerCaseFilename.endsWith(".doc") || lowerCaseFilename.endsWith(".docx") ||
                lowerCaseFilename.endsWith(".xls") || lowerCaseFilename.endsWith(".xlsx") ||
                lowerCaseFilename.endsWith(".ppt") || lowerCaseFilename.endsWith(".pptx");
    }

    private List<String> processFiles(MultipartFile[] files, Path assetsDir, List<Asset> createdAssetList) {
        List<String> errorMessages = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                Path filepath = resourceUtil.resolveUniqueFilename(assetsDir, file.getOriginalFilename());
                Files.copy(file.getInputStream(), filepath);
                String thumbnailPath = resourceUtil.createThumbnail(filepath.getFileName().toString(), file);
                Asset asset = buildAsset(filepath, thumbnailPath, file);
                createdAssetList.add(assetService.createAsset(asset));
            } catch (Exception e) {
                errorMessages.add("Failed to upload: " + file.getOriginalFilename());
            }
        }
        return errorMessages;
    }

    private Asset buildAsset(Path filepath, String thumbnailPath, MultipartFile file) {
        Asset asset = new Asset();
        asset.setFilename(filepath.getFileName().toString());
        asset.setFilepath(filepath.toString());
        asset.setThumbnail(thumbnailPath);
        asset.setFiletype(file.getContentType());
        asset.setFilesize(file.getSize());
        return asset;
    }
}
