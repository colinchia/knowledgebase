package me.colinchia.knowledgebase.repositories;

import me.colinchia.knowledgebase.entities.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TopicRepository extends JpaRepository<Topic, Integer> {
    @Query("SELECT t, COUNT(a) FROM Topic t LEFT JOIN t.articles a GROUP BY t")
    List<Object[]> findAllTopicsWithArticleCount();
}
