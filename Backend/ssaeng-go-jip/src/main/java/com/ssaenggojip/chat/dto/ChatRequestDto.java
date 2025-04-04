package com.ssaenggojip.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequestDto {

    public enum MessageType {
        TALK, DELETE, REPORT
    }

    private MessageType messageType;
    private String messageId;
    private String chatRoomId;
    private Boolean isAnonymous;
    private String content;
}
