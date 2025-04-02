package com.ssaenggojip.property.dto.response;

import com.ssaenggojip.common.enums.FacilityType;
import lombok.Data;

@Data
public class DetailFacility {

    FacilityType facilityType;
    Double latitude;
    Double longitude;
}
