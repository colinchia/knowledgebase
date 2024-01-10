package me.colinchia.knowledgebase.controllers;

import jakarta.persistence.EntityNotFoundException;
import me.colinchia.knowledgebase.entities.Article;
import me.colinchia.knowledgebase.entities.User;
import me.colinchia.knowledgebase.services.UserService;
import me.colinchia.knowledgebase.utils.ResourceUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final ResourceUtil resourceUtil;

    public UserController(UserService userService, PasswordEncoder passwordEncoder, ResourceUtil resourceUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.resourceUtil = resourceUtil;
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            return ResponseEntity.status(HttpStatus.OK).body(users);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while retrieving all users"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id) {
        try {
            Optional<User> user = userService.getUserById(id);
            if (user.isPresent()) {
                return ResponseEntity.status(HttpStatus.OK).body(user.get());
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "User not found"));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while retrieving the user"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestParam("email") String email,
                                        @RequestParam("password") String password,
                                        @RequestParam("role") String role,
                                        @RequestParam("name") String name,
                                        @RequestParam("department") String department,
                                        @RequestParam(value = "portrait", required = false) MultipartFile portrait) throws Exception {
        try {
            Path portraitsDir = resourceUtil.getResourcesDir().resolve("portraits");
            if (!portraitsDir.toFile().exists()) {
                portraitsDir.toFile().mkdirs();
            }

            Path portraitPath;
            if (portrait != null && !portrait.isEmpty()) {
                // Use user-provided portrait
                String fileName = email.split("@")[0] + "_" + System.currentTimeMillis() + ".jpg";
                portraitPath = portraitsDir.resolve(fileName);
                resourceUtil.processAndSavePortrait(portrait, portraitPath);
            } else {
                // Use default portrait
                String defaultFileName = email.split("@")[0] + "_" + System.currentTimeMillis() + ".jpg";
                portraitPath = portraitsDir.resolve(defaultFileName);
                Files.copy(portraitsDir.resolve("portrait-default.jpg"), portraitPath);
            }
            
            User user = new User();
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            user.setName(name);
            user.setDepartment(department);
            user.setPortrait(portraitPath.toString());
            user.setTheme("THEMEDEFAULT");

            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.OK).body(createdUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while creating the user"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id,
                                        @RequestParam("email") String email,
                                        @RequestParam(value = "password", required = false) String password,
                                        @RequestParam("role") String role,
                                        @RequestParam("name") String name,
                                        @RequestParam("department") String department,
                                        @RequestParam(value = "portrait", required = false) MultipartFile portrait) throws Exception {
        try {
            Optional<User> optionalUser = userService.getUserById(id);
            if (!optionalUser.isPresent()) {
                return null;
            }

            User existingUser = optionalUser.get();
            existingUser.setEmail(email);
            if (password != null && !password.isEmpty()) {
                existingUser.setPassword(passwordEncoder.encode(password));
            }
            existingUser.setRole(role);
            existingUser.setName(name);
            existingUser.setDepartment(department);

            // Process and update portrait if new one is provided
            if (portrait != null && !portrait.isEmpty()) {
                Path portraitsDir = resourceUtil.getResourcesDir().resolve("portraits");
                String fileName = email.split("@")[0] + "_" + System.currentTimeMillis() + ".jpg";
                Path portraitPath = portraitsDir.resolve(fileName);
                resourceUtil.processAndSavePortrait(portrait, portraitPath);
                existingUser.setPortrait(portraitPath.toString());
            }

            User updatedUser = userService.updateUser(existingUser);
            return ResponseEntity.status(HttpStatus.OK).body(updatedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while updating the user"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.status(HttpStatus.OK).body(Collections.singletonMap("message", "User successfully deleted"));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.singletonMap("error", "User not found"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while deleting the user"));
        }
    }

    @GetMapping("/pinned-articles/{userId}")
    public ResponseEntity<?> getPinnedArticles(@PathVariable int userId) {
        try {
            Optional<User> userOptional = userService.getUserById(userId);
            if (!userOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOptional.get();
            Set<Article> pinnedArticles = user.getPinnedArticles();

            return ResponseEntity.status(HttpStatus.OK).body(pinnedArticles);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while retrieving all pinned articles"));
        }
    }

    @PostMapping("/pin-article/{userId}/{articleId}")
    public ResponseEntity<?> pinArticle(@PathVariable int userId,
                                        @PathVariable int articleId,
                                        @RequestBody Map<String, Object> requestBody) {
        try {
            Optional<User> userOptional = userService.getUserById(userId);
            if (!userOptional.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            User user = userOptional.get();
            boolean pin = (boolean) requestBody.get("pin");
            if (pin) {
                userService.pinArticle(user, articleId);
            } else {
                userService.unpinArticle(user, articleId);
            }

            return ResponseEntity.status(HttpStatus.OK).body(Collections.singletonMap("message", "Article successfully (un)pinned"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while (un)pinning the article"));
        }
    }

    @PutMapping("/settings/{userId}")
    public ResponseEntity<?> updateSettings(@PathVariable int userId,
                                            @RequestParam("email") String email,
                                            @RequestParam("name") String name,
                                            @RequestParam(value = "portrait", required = false) MultipartFile portrait,
                                            @RequestParam(value = "theme", required = false) String theme) throws Exception {
        try {
            Optional<User> optionalUser = userService.getUserById(userId);
            if (!optionalUser.isPresent()) {
                return null;
            }

            User existingUser = optionalUser.get();
            existingUser.setEmail(email);
            existingUser.setName(name);

            // Process and update portrait if new one is provided
            if (portrait != null && !portrait.isEmpty()) {
                Path portraitsDir = resourceUtil.getResourcesDir().resolve("portraits");
                String fileName = email.split("@")[0] + "_" + System.currentTimeMillis() + ".jpg";
                Path portraitPath = portraitsDir.resolve(fileName);
                resourceUtil.processAndSavePortrait(portrait, portraitPath);
                existingUser.setPortrait(portraitPath.toString());
            }

            if (theme != null && !theme.isEmpty()) {
                existingUser.setTheme(theme);
            }

            User updatedUser = userService.updateUser(existingUser);
            return ResponseEntity.status(HttpStatus.OK).body(updatedUser);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.singletonMap("error", "An error occurred while updating the settings"));
        }
    }
}
