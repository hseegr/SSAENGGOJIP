package com.ssaenggojip.chat.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Document(collection = "chatRoom")
public class ChatRoom {
    @Id
    private String id;
    private String name;
    private Integer userCount;
    private String lastMessage;
    private List<Location> locationList;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Location {
        private String line;
        private BigDecimal latitude;
        private BigDecimal longitude;
    }
}
