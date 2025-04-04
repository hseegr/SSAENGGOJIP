package com.ssaenggojip.property.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SearchResponse {
    Integer total;
    SearchProperty[] properties;
}
