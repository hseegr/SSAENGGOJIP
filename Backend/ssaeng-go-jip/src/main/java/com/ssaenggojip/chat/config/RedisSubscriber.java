package com.ssaenggojip.chat.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssaenggojip.chat.dto.ChatMessageResponseDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Slf4j
@Component
@RequiredArgsConstructor
public class RedisSubscriber implements MessageListener {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            String json = new String(message.getBody(), StandardCharsets.UTF_8);
            ChatMessageResponseDto msg = objectMapper.readValue(json, ChatMessageResponseDto.class);

            messagingTemplate.convertAndSend("/sub/chat-room." + msg.getChatRoomId(), msg);
        } catch (Exception e) {
            log.error("RedisSubscriber 메시지 처리 실패", e);
        }
    }
}

