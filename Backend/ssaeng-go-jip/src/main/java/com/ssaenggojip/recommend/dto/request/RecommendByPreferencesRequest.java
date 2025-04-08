package com.ssaenggojip.recommend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class RecommendByPreferencesRequest {
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
    @NotNull
    private Double radius;
    @NotNull
    private Integer k;
}
