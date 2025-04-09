package com.ssaenggojip.property.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class SearchResponse {
    Integer total;
    List<SearchProperty> properties;
}
