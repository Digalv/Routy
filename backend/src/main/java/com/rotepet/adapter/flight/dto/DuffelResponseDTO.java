package com.rotepet.adapter.flight.dto;


import java.util.List;

public class DuffelResponseDTO {
    public record Wrapper(Data data) {}
    public record Data(List<Offer> offers) {}
    public record Offer(String id, String total_amount, String total_currency, List<Slice> slices) {}
    public record Slice(String duration, List<Segment> segments) {}
    public record Segment(Place origin, Place destination, String departing_at, String arriving_at, Carrier operating_carrier) {}
    public record Place(String city_name, String iata_code) {}
    public record Carrier(String logo_symbol_url, String name) {}
}

