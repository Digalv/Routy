package com.rotepet.common;

import java.time.Instant;

public record Leg(
        String from,
        String to,
        Instant departure,
        Instant arrival,
        String carrier
) {}
