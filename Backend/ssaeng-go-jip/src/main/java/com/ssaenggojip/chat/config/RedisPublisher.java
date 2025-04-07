package com.ssaenggojip.chat.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssaenggojip.chat.dto.ChatMessageResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class RedisPublisher {
    private final StringRedisTemplate redisTemplate;
    private final ChannelTopic topic;  // "chat" 같은 채널명
    private final ObjectMapper objectMapper;

    public void publish(ChatMessageResponseDto messageDto) {
        try {
            String json = objectMapper.writeValueAsString(messageDto);
            redisTemplate.convertAndSend(topic.getTopic(), json);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("메시지 직렬화 실패", e);
        }
    }
}

