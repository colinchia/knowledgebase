package me.colinchia.knowledgebase.repositories;

import me.colinchia.knowledgebase.entities.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Integer> {
    @Query("SELECT a FROM Article a JOIN a.topics t WHERE t.id = :topicId")
    List<Article> getArticlesByTopicId(@Param("topicId") int topicId);

    @Query("SELECT a FROM Article a JOIN a.assets s WHERE s.id = :assetId")
    List<Article> getArticlesByAssetId(@Param("assetId") int assetId);
}
