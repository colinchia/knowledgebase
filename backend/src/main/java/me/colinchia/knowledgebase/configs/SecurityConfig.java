package me.colinchia.knowledgebase.configs;

import me.colinchia.knowledgebase.utils.JwtRequestFilterUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    private final JwtRequestFilterUtil jwtRequestFilterUtil;

    public SecurityConfig(JwtRequestFilterUtil jwtRequestFilterUtil) {
        this.jwtRequestFilterUtil = jwtRequestFilterUtil;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/").permitAll()
                        .requestMatchers("/login/**").permitAll()
                        .requestMatchers("/home/**", "/article/**", "/topic/**").hasAnyRole("READER", "EDITOR", "ADMIN")
                        .requestMatchers("/admin/manage-users/**").hasRole("ADMIN")
                        .requestMatchers("/admin/**").hasAnyRole("EDITOR", "ADMIN")
                        .requestMatchers("/api/assets/serve/**").permitAll()
                        .requestMatchers("/api/users/pinned-articles/**", "/api/users/pin-article/**", "/api/users/settings/**").permitAll()
                        .requestMatchers("/api/users/**").hasRole("ADMIN")
                        .requestMatchers("/api/**").hasAnyRole("READER", "EDITOR", "ADMIN")
                        .anyRequest().authenticated()
                )
                .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtRequestFilterUtil, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
}
