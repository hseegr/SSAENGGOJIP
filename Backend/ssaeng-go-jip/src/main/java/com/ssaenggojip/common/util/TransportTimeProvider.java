package com.ssaenggojip.common.util;

import org.springframework.stereotype.Component;

@Component

public class TransportTimeProvider {
    private static final double EARTH_RADIUS_KM = 6371.0;

    public int getWalkMinutes(double lat1, double lng1, double lat2, double lng2) {
        double distanceKm = calculateDistanceKm(lat1, lng1, lat2, lng2);
        double timeMinutes = distanceKm / 4.8 / 60.0;
        return (int) Math.ceil(timeMinutes);
    }
    public double calculateDistanceKm(double lat1, double lng1, double lat2, double lng2) {
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lng2 - lng1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
