package com.ssaenggojip.property.entity.request;
import com.ssaenggojip.common.enums.TransportationType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class TransportTimeRequest {
    @NotBlank
    private String address;

    @NotBlank
    private Long propertyId;

    @NotBlank
    private TransportationType transportationType;
}
