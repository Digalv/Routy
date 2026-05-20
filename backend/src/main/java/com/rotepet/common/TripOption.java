package com.rotepet.common;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;

public record TripOption(
        TransportType type,
        List<Leg> legs,
        BigDecimal price,
        String currency,
        Duration duration,
        String provider
) {}
