package me.colinchia.knowledgebase.controllers;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import me.colinchia.knowledgebase.entities.Article;
import me.colinchia.knowledgebase.entities.Asset;
import me.colinchia.knowledgebase.entities.Topic;
import me.colinchia.knowledgebase.services.ArticleService;
import me.colinchia.knowledgebase.services.AssetService;
import me.colinchia.knowledgebase.services.TopicService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {
    private final ArticleService articleService;
    private final AssetService assetService;
    private final TopicService topicService;

    public ArticleController(ArticleService articleService, AssetService assetService, TopicService topicService) {
        this.articleService = articleService;
        this.assetService = assetService;
        this.topicService = topicService;
    }

    @GetMapping
    public ResponseEntity<?> getAllArticles() {
        try {
            List<Article> articles = articleService.getAllArticles();
            return ResponseEntity.status(HttpStatus.OK).body(articles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while retrieving all articles"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getArticleById(@PathVariable int id) {
        try {
            Optional<Article> article = articleService.getArticleById(id);
            if (article.isPresent()) {
                return ResponseEntity.status(HttpStatus.OK).body(article.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Article not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while retrieving the article"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createArticle(@RequestParam("slug") String slug,
                                           @RequestParam("title") String title,
                                           @RequestParam("description") String description,
                                           @RequestParam("author") String author,
                                           @RequestParam(value = "assetIds", required = false) String assetIds,
                                           @RequestParam(value = "topicIds", required = false) String topicIds) {
        try {
            Article article = new Article();
            article.setSlug(slug);
            article.setTitle(title);
            article.setDescription(description);
            article.setAuthor(author);

            if (assetIds != null && !assetIds.trim().isEmpty()) {
                Set<Asset> assets = convertJsonToAssetSet(assetIds);
                article.setAssets(assets);
            }
            if (topicIds != null && !topicIds.trim().isEmpty()) {
                Set<Topic> topics = convertJsonToTopicSet(topicIds);
                article.setTopics(topics);
            }

            Article createdArticle = articleService.createArticle(article);
            return ResponseEntity.status(HttpStatus.OK).body(createdArticle);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while creating the article"));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateArticle(@PathVariable int id,
                                           @RequestParam("slug") String slug,
                                           @RequestParam("title") String title,
                                           @RequestParam("description") String description,
                                           @RequestParam(value = "assetIds", required = false) String assetIds,
                                           @RequestParam(value = "topicIds", required = false) String topicIds) {
        try {
            Optional<Article> article = articleService.getArticleById(id);
            if (!article.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Article not found"));
            }

            Article existingArticle = article.get();
            existingArticle.setSlug(slug);
            existingArticle.setTitle(title);
            existingArticle.setDescription(description);
            
            if (assetIds != null && !assetIds.trim().isEmpty()) {
                Set<Asset> assets = convertJsonToAssetSet(assetIds);
                existingArticle.setAssets(assets);
            }
            if (topicIds != null && !topicIds.trim().isEmpty()) {
                Set<Topic> topics = convertJsonToTopicSet(topicIds);
                existingArticle.setTopics(topics);
            }

            Article updatedArticle = articleService.updateArticle(existingArticle);
            return ResponseEntity.status(HttpStatus.OK).body(updatedArticle);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while updating the article"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArticle(@PathVariable int id) {
        try {
            articleService.deleteArticle(id);
            return ResponseEntity.status(HttpStatus.OK).body(Collections.singletonMap("message", "Article successfully deleted"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Article not found"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while deleting the article"));
        }
    }

    @GetMapping("/by-topic/{topicId}")
    public ResponseEntity<?> getArticlesByTopicId(@PathVariable int topicId) {
        try {
            List<Article> articles = articleService.getArticlesByTopicId(topicId);
            if (articles.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "No articles found for the given topic"));
            }
            return ResponseEntity.status(HttpStatus.OK).body(articles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while retrieving articles by topic"));
        }
    }

    private Set<Asset> convertJsonToAssetSet(String json) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        List<Integer> ids = mapper.readValue(json, new TypeReference<List<Integer>>() {});
        return ids.stream()
                .map(assetService::getAssetById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
    }

    private Set<Topic> convertJsonToTopicSet(String json) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        List<Integer> ids = mapper.readValue(json, new TypeReference<List<Integer>>() {});
        return ids.stream()
                .map(topicService::getTopicById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .collect(Collectors.toSet());
    }
}
