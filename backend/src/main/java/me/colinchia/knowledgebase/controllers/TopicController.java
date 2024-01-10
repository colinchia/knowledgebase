package me.colinchia.knowledgebase.controllers;

import jakarta.persistence.EntityNotFoundException;
import me.colinchia.knowledgebase.entities.Topic;
import me.colinchia.knowledgebase.services.TopicService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/topics")
public class TopicController {
    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @GetMapping
    public ResponseEntity<?> getAllTopics() {
        try {
            List<Topic> topics = topicService.getAllTopics();
            return ResponseEntity.status(HttpStatus.OK).body(topics);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while retrieving all topics"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTopicById(@PathVariable int id) {
        try {
            Optional<Topic> topic = topicService.getTopicById(id);
            if (topic.isPresent()) {
                return ResponseEntity.status(HttpStatus.OK).body(topic.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Topic not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while retrieving the topic"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createTopic(@RequestParam("slug") String slug,
                                         @RequestParam("title") String title,
                                         @RequestParam(value = "description", required = false) String description,
                                         @RequestParam(value = "icon", required = false) String icon) {
        try {
            Topic topic = new Topic();
            topic.setSlug(slug);
            topic.setTitle(title);

            if (description != null && !description.trim().isEmpty()) {
                topic.setDescription(description);
            }
            if (icon != null && !icon.trim().isEmpty()) {
                topic.setIcon(icon);
            }

            Topic createdTopic = topicService.createTopic(topic);
            return ResponseEntity.status(HttpStatus.OK).body(createdTopic);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while creating the topic"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTopic(@PathVariable int id,
                                         @RequestParam("slug") String slug,
                                         @RequestParam("title") String title,
                                         @RequestParam(value = "description", required = false) String description,
                                         @RequestParam(value = "icon", required = false) String icon) {
        try {
            Optional<Topic> topic = topicService.getTopicById(id);
            if (!topic.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Topic not found"));
            }

            Topic existingTopic = topic.get();
            existingTopic.setSlug(slug);
            existingTopic.setTitle(title);

            if (description != null && !description.trim().isEmpty()) {
                existingTopic.setDescription(description);
            }
            if (icon != null && !icon.trim().isEmpty()) {
                existingTopic.setIcon(icon);
            }

            Topic updatedTopic = topicService.updateTopic(existingTopic);
            return ResponseEntity.status(HttpStatus.OK).body(updatedTopic);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while updating the topic"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable int id) {
        try {
            topicService.deleteTopic(id);
            return ResponseEntity.status(HttpStatus.OK).body(Collections.singletonMap("message", "Topic successfully deleted"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "Topic not found"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while deleting the topic"));
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> findAllTopicsWithArticleCount() {
        try {
            List<Object[]> topicsWithCount = topicService.findAllTopicsWithArticleCount();
            if (topicsWithCount != null && !topicsWithCount.isEmpty()) {
                return ResponseEntity.status(HttpStatus.OK).body(topicsWithCount);
            } else {
                return ResponseEntity.status(HttpStatus.OK).body(Collections.singletonMap("message", "No topics available"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while retrieving topics with article count"));
        }
    }
}
