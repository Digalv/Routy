package com.rotepet.common;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record City(
        String id,
        String name,
        String country,
        String iata,
        Double lat,
        Double lon
) {}
