package com.rotepet.adapter.transit.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.Instant;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TransitousResponseDto {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Root(List<Itinerary> itineraries) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Itinerary(Instant startTime, Instant endTime, long duration, List<Leg> legs) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Leg(
            Instant startTime,
            Instant endTime,
            Place from,
            Place to,
            String mode,
            String route,
            String agencyName,
            String headsign,
            Boolean transitLeg,
            Integer routeType
    ) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Place(String name, double lat, double lon) {}
}
