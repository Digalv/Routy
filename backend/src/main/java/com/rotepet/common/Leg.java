package com.rotepet.common;

import java.time.Instant;

/**
 * Один отрезок маршрута (один рейс / поезд / автобус).
 * Несколько Leg'ов составляют TripOption (для пересадок).
 *
 * @param fromCode    IATA / станция / автостанция отправления
 * @param toCode      IATA / станция / автостанция прибытия
 * @param departure   момент отправления (UTC)
 * @param arrival     момент прибытия (UTC)
 * @param carrier     перевозчик ("Lufthansa", "DB", "FlixBus" и т.п.)
 */
public record Leg(
        String from,
        String to,
        Instant departure,
        Instant arrival,
        String carrier
) {}
