package com.parkzen.ParkZen_stress_free_parking_experience.security;


import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.context.annotation.Bean;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        // disable CSRF
        http.csrf(csrf -> csrf.disable());

        // allow requests without authentication
        http.authorizeHttpRequests(authorize ->
                authorize.requestMatchers("/api/users/**").permitAll()
                        .requestMatchers("/api/owners/**").permitAll()
                        .requestMatchers("/api/admins/**").permitAll()
                        .anyRequest().authenticated()
        );
        return http.build();
    }
}
