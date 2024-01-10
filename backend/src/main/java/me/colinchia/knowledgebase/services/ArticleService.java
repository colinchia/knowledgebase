package me.colinchia.knowledgebase.services;

import me.colinchia.knowledgebase.entities.Article;
import me.colinchia.knowledgebase.repositories.ArticleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {
    private final ArticleRepository articleRepository;

    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    public Optional<Article> getArticleById(int id) {
        return articleRepository.findById(id);
    }

    public Article createArticle(Article article) {
        return articleRepository.save(article);
    }

    public Article updateArticle(Article article) {
        return articleRepository.save(article);
    }

    public void deleteArticle(int id) {
        articleRepository.deleteById(id);
    }

    public List<Article> getArticlesByTopicId(int topicId) {
        return articleRepository.getArticlesByTopicId(topicId);
    }

    public List<Article> getArticlesByAssetId(int assetId) {
        return articleRepository.getArticlesByAssetId(assetId);
    }
}
