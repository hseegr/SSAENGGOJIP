package com.ssaenggojip.chat.converter;

import com.ssaenggojip.chat.dto.ChatMessageResponseDto;
import com.ssaenggojip.chat.dto.ChatRoomResponseDto;
import com.ssaenggojip.chat.entity.ChatMessage;
import com.ssaenggojip.chat.entity.ChatRoom;

import java.time.ZoneId;

public class ChatConverter {

    public static ChatRoomResponseDto toChatRoomResponseDto(ChatRoom chatRoom) {
        return ChatRoomResponseDto.builder()
                .id(chatRoom.getId())
                .name(chatRoom.getName())
                .userCount(chatRoom.getUserCount())
                .lastMessage(chatRoom.getLastMessage())
                .locationList(
                        chatRoom.getLocationList().stream()
                                .map(loc -> ChatRoomResponseDto.LocationResponseDto.builder()
                                        .line(loc.getLine())
                                        .latitude(loc.getLatitude())
                                        .longitude(loc.getLongitude())
                                        .build())
                                .toList()
                )
                .build();
    }

    public static ChatMessageResponseDto toChatMessageResponseDto(ChatMessage chatMessage) {
        return ChatMessageResponseDto.builder()
                .id(chatMessage.getId())
                .userId(chatMessage.getUserId())
                .chatRoomId(chatMessage.getChatRoomId())
                .nickname(chatMessage.getNickname())
                .content(chatMessage.getContent())
                .isActive(chatMessage.getIsActive())
                .createdAt(chatMessage.getCreatedAt().toInstant().atZone(ZoneId.of("Asia/Seoul")))
                .build();
    }
}
