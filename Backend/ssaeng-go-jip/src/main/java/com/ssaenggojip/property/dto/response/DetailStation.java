package com.ssaenggojip.property.dto.response;

import com.ssaenggojip.common.enums.Line;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@RequiredArgsConstructor
public class DetailStation {
    private Long id;
    private String name;
    private Line line;
}
