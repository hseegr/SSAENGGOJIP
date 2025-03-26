package com.ssaenggojip.common.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Component
@RequiredArgsConstructor
public class NicknameWordProvider {

    private final ObjectMapper objectMapper;

    private List<String> frontWords;
    private List<String> backWords;

    @PostConstruct
    public void init() throws IOException {
        ClassPathResource resource = new ClassPathResource("nickname_words.json");
        try (InputStream is = resource.getInputStream()) {
            JsonNode root = objectMapper.readTree(is);
            frontWords = objectMapper.convertValue(root.get("front"), new TypeReference<>() {});
            backWords = objectMapper.convertValue(root.get("back"), new TypeReference<>() {});
        }
    }

    public String getRandomNickname() {
        String front = frontWords.get(ThreadLocalRandom.current().nextInt(frontWords.size()));
        String back = backWords.get(ThreadLocalRandom.current().nextInt(backWords.size()));
        return front + " " + back;
    }
}
