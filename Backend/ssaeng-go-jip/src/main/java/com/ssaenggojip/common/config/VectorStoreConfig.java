package com.ssaenggojip.common.config;

import com.ssaenggojip.recommend.CustomEmbeddingModel;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VectorStoreConfig {
    @Bean
    public EmbeddingModel embeddingModel() {
        return new CustomEmbeddingModel();
    }
}
