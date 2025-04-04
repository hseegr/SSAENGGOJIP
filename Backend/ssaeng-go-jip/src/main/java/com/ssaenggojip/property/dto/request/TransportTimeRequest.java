package com.ssaenggojip.property.dto.request;
import com.ssaenggojip.common.enums.TransportationType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class TransportTimeRequest {
    @NotBlank
    private Double latitude;

    @NotBlank
    private Double longitude;

    @NotBlank
    private Long propertyId;

    @NotBlank
    private TransportationType transportationType;
}
