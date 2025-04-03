package com.ssaenggojip.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.ZonedDateTime;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponseDto {
    private String id;
    private Long userId;
    private String chatRoomId;
    private String nickname;
    private String content;
    private Boolean isActive;
    private ZonedDateTime createdAt;
}
