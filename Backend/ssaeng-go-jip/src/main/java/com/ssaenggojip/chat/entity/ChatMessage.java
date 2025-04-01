package com.ssaenggojip.chat.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Document(collection = "chatMessage")
public class ChatMessage {
    @Id
    private String id;
    private Long userId;
    private String chatRoomId;
    private String nickname;
    private String content;
    @CreatedDate
    private Date createdAt;
    private Integer reportCount;
    private Boolean isDeleted;
}
