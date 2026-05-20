package com.rotepet.common;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;

/**
 * Один найденный вариант маршрута (то, что отдаём наружу — на фронт и в RankingService).
 * Деньги храним в минорных единицах (центах), чтобы избежать проблем с double.
 *
 * @param type            вид транспорта (для иконки на фронте и для фильтров)
 * @param legs        список отрезков (для прямого рейса — один элемент)
 * @param price      цена в центах валюты
 * @param currency        ISO-код валюты ("EUR", "USD"...)
 * @param duration полная длительность маршрута в минутах (включая пересадки)
 * @param provider        кто отдал данные ("duffel", "navitia", "flixbus")
 */
public record TripOption(
        TransportType type,
        List<Leg> legs,
        BigDecimal price,
        String currency,
        Duration duration,
        String provider
) {}
