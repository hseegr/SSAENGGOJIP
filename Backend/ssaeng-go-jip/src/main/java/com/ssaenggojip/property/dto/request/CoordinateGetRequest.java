package com.ssaenggojip.property.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class CoordinateGetRequest {
    @NotNull
    List<Double> leftDown;

    @NotNull
    List<Double> rightUp;
}
