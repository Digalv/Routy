package com.rotepet.adapter.flight.dto;

import java.util.List;

public class DuffelRequestDto {
    public record Wrapper(Data data) {}
    public record Data(List<Slice> slices, List<Passenger> passengers, String cabin_class) {}
    public record Slice(String origin, String destination, String departure_date) {}
    public record Passenger(String type) {}
}
