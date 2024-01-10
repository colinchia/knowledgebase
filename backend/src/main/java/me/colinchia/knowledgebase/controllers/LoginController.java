package me.colinchia.knowledgebase.controllers;

import me.colinchia.knowledgebase.entities.User;
import me.colinchia.knowledgebase.services.UserService;
import me.colinchia.knowledgebase.utils.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/login")
public class LoginController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public LoginController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ResponseEntity<?> authenticateUser(@RequestBody Map<String, String> userCredentials) {
        User authenticatedUser = userService.authenticateUser(userCredentials.get("email"), userCredentials.get("password"));
        if (authenticatedUser != null) {
            // Generate JWT token
            String jwtToken = jwtUtil.generateToken(authenticatedUser.getEmail());

            // Send JWT and current user login data in response
            Map<String, Object> response = new HashMap<>();
            response.put("id", authenticatedUser.getId());
            response.put("email", authenticatedUser.getEmail());
            response.put("role", authenticatedUser.getRole());
            response.put("name", authenticatedUser.getName());
            response.put("department", authenticatedUser.getDepartment());
            response.put("portrait", authenticatedUser.getPortrait());
            response.put("theme", authenticatedUser.getTheme());
            response.put("token", jwtToken);

            return ResponseEntity.status(HttpStatus.OK).body(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("error", "This user is unauthorized"));
        }
    }
}
