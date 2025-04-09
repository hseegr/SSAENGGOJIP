package com.ssaenggojip.property.dto.request;
import com.ssaenggojip.common.enums.TransportationType;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class TransportTimeRequest {
    @NotBlank
    private Double latitude;

    @NotBlank
    private Double longitude;

    @NotBlank
    private Long propertyId;

    private TransportationType transportationType;

}
