package com.qudtn.findLandMine;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class WebMvcConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/*")  // CORS를 적용할 패턴 설정
                .allowedOrigins("http://localhost:3000")  // 허용할 Origin 설정
                .allowedMethods("GET", "POST", "PUT", "DELETE")  // 허용할 HTTP 메서드 설정
                .allowCredentials(true);  // Credentials(쿠키, 인증 등)을 허용할지 여부
    }
}
