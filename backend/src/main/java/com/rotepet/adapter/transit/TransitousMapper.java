package com.rotepet.adapter.transit;

import com.rotepet.adapter.transit.dto.TransitousResponseDto;
import com.rotepet.common.Leg;
import com.rotepet.common.TransportType;
import com.rotepet.common.TripOption;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;
import java.util.Random;
import java.util.Set;

@Component
public class TransitousMapper {

    private static final Logger log = LoggerFactory.getLogger(TransitousMapper.class);

    // GTFS Extended Route Types для дальних/скоростных поездов
    private static final Set<Integer> INTERCITY_ROUTE_TYPES = Set.of(100, 101, 102, 103, 105);
    private static final Random RANDOM = new Random();

    public List<TripOption> toTripOptions(TransitousResponseDto.Root response) {
        if (response == null || response.itineraries() == null) {
            log.warn("Transitous: пустой или null ответ. response={}", response);
            return List.of();
        }
        log.debug("Transitous: получено {} маршрутов", response.itineraries().size());
        return response.itineraries().stream()
                .filter(this::hasIntercityLeg)
                .map(this::toTripOption)
                .toList();
    }

    // Итинерарий включается если хотя бы одна нога — скоростной/дальний поезд
    private boolean hasIntercityLeg(TransitousResponseDto.Itinerary itinerary) {
        return itinerary.legs().stream().anyMatch(this::isIntercityLeg);
    }

    private TripOption toTripOption(TransitousResponseDto.Itinerary itinerary) {
        // Показываем все транзитные ноги — без разрывов
        List<Leg> legs = itinerary.legs().stream()
                .filter(l -> !"WALK".equals(l.mode()))
                .map(l -> new Leg(
                        l.from().name(),
                        l.to().name(),
                        l.startTime(),
                        l.endTime(),
                        l.agencyName() != null ? l.agencyName() : l.mode()
                ))
                .toList();

        BigDecimal price = legs.stream()
                .map(l -> BigDecimal.valueOf(20 + RANDOM.nextInt(61)))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new TripOption(
                TransportType.TRAIN,
                legs,
                price,
                "EUR",
                Duration.ofSeconds(itinerary.duration()),
                "transitous"
        );
    }

    private boolean isIntercityLeg(TransitousResponseDto.Leg leg) {
        if (leg.routeType() != null) {
            return INTERCITY_ROUTE_TYPES.contains(leg.routeType());
        }
        return "RAIL".equals(leg.mode());
    }
}
