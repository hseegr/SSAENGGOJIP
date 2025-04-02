package com.ssaenggojip.chat.controller;

import com.ssaenggojip.apipayload.ApiResponse;
import com.ssaenggojip.auth.annotation.AuthUser;
import com.ssaenggojip.chat.dto.ChatRoomResponseDto;
import com.ssaenggojip.chat.service.ChatRoomService;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chat-rooms")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @GetMapping("/popular")
    public ApiResponse<List<ChatRoomResponseDto>> getPopularChatRoom() {
        return ApiResponse.onSuccess(chatRoomService.getPopularChatRoom());
    }

    @GetMapping("/search")
    public ApiResponse<List<ChatRoomResponseDto>> searchChatRoom(@RequestParam("keyword") String keyword) {
        return ApiResponse.onSuccess(chatRoomService.searchChatRoom(keyword));
    }

    @GetMapping("/mine")
    public ApiResponse<List<ChatRoomResponseDto>> getMyChatRoom(@AuthUser User user) {
        return ApiResponse.onSuccess(chatRoomService.getMyChatRoom(user));
    }

    @PostMapping("/{chatRoomId}/enter")
    public ApiResponse<Void> enterChatRoom(@AuthUser User user, @PathVariable String chatRoomId) {
        chatRoomService.enterChatRoom(user, chatRoomId);
        return ApiResponse.onSuccess(null);
    }

    @PostMapping("/{chatRoomId}/leave")
    public ApiResponse<Void> leaveChatRoom(@AuthUser User user, @PathVariable String chatRoomId) {
        chatRoomService.leaveChatRoom(user, chatRoomId);
        return ApiResponse.onSuccess(null);
    }
}
