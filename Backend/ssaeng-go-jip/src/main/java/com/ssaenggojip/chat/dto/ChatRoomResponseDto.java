package com.ssaenggojip.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponseDto {
    private String id;
    private String name;
    private List<String> line;
    private Integer userCount;
    private String lastMessage;
    private BigDecimal latitude;
    private BigDecimal longitude;
}
