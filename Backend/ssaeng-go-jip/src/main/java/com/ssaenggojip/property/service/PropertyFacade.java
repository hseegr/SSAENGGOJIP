package com.ssaenggojip.property.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SearchFacade {

    private final StationService stationService;
    private final PropertyService propertyService;

    public SearchResponse searchProperties(SearchRequest request) {
        String search = request.getSearch();
        boolean isStationSearch = false;
        Double lat = null;
        Double lng = null;

        if (search != null && search.endsWith("역")) {
            Optional<Station> stationOpt = stationService.findByName(search);
            if (stationOpt.isEmpty()) {
                return SearchResponse.builder()
                        .total(0)
                        .properties(new SearchProperty[0])
                        .build();
            }
            Station station = stationOpt.get();
            isStationSearch = true;
            lat = station.getLatitude();
            lng = station.getLongitude();
        }

        return propertyService.searchWithFilter(request, isStationSearch, lat, lng);
    }
}