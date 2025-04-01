package com.ssaenggojip.chat.controller;

import com.ssaenggojip.apipayload.ApiResponse;
import com.ssaenggojip.chat.dto.ChatMessageResponseDto;
import com.ssaenggojip.chat.dto.ChatRequestDto;
import com.ssaenggojip.chat.service.ChatMessageService;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ChatMessageController {

    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat-messages")
    public void sendMessage(Message<?> headers, @Payload ChatRequestDto message) {
        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.wrap(headers);
        User user = (User) accessor.getSessionAttributes().get("user");

        chatMessageService.sendMessage(user, message);
    }

    @GetMapping("/chat-rooms/{chatRoomId}")
    public ApiResponse<List<ChatMessageResponseDto>> getChatMessages(
            @PathVariable String chatRoomId,
            @RequestParam() String lastMessageId) {
        return ApiResponse.onSuccess(chatMessageService.getMessages(chatRoomId, lastMessageId));
    }
}
