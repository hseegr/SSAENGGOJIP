package com.ssaenggojip.chat.converter;

import com.ssaenggojip.chat.dto.ChatRoomResponseDto;
import com.ssaenggojip.chat.entity.ChatRoom;

public class ChatRoomConverter {

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
}
