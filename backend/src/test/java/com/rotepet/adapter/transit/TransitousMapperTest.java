package com.rotepet.adapter.transit;

import com.rotepet.adapter.transit.dto.TransitousResponseDto;
import com.rotepet.common.TripOption;
import com.rotepet.common.TransportType;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class TransitousMapperTest {

    private final TransitousMapper mapper = new TransitousMapper();

    private static final TransitousResponseDto.Place FROM = new TransitousResponseDto.Place("Berlin Hbf", 52.5, 13.4);
    private static final TransitousResponseDto.Place TO   = new TransitousResponseDto.Place("Paris Nord", 48.8, 2.3);

    private TransitousResponseDto.Leg intercityLeg(String mode, Integer routeType) {
        return new TransitousResponseDto.Leg(
                Instant.parse("2026-08-01T08:00:00Z"),
                Instant.parse("2026-08-01T13:00:00Z"),
                FROM, TO, mode, "ICE 123", "DB", "Paris", true, routeType
        );
    }

    private TransitousResponseDto.Itinerary itinerary(List<TransitousResponseDto.Leg> legs) {
        return new TransitousResponseDto.Itinerary(
                Instant.parse("2026-08-01T08:00:00Z"),
                Instant.parse("2026-08-01T13:00:00Z"),
                18000L,
                legs
        );
    }

    @Test
    void toTripOptions_nullResponse_returnsEmptyList() {
        assertThat(mapper.toTripOptions(null)).isEmpty();
    }

    @Test
    void toTripOptions_nullItineraries_returnsEmptyList() {
        assertThat(mapper.toTripOptions(new TransitousResponseDto.Root(null))).isEmpty();
    }

    @Test
    void toTripOptions_intercityByRouteType_includesItinerary() {
        var leg = intercityLeg("RAIL", 101);
        var result = mapper.toTripOptions(new TransitousResponseDto.Root(List.of(itinerary(List.of(leg)))));

        assertThat(result).hasSize(1);
        assertThat(result.get(0).type()).isEqualTo(TransportType.TRAIN);
        assertThat(result.get(0).provider()).isEqualTo("transitous");
    }

    @Test
    void toTripOptions_intercityByRailMode_includesItinerary() {
        var leg = intercityLeg("RAIL", null);
        var result = mapper.toTripOptions(new TransitousResponseDto.Root(List.of(itinerary(List.of(leg)))));

        assertThat(result).hasSize(1);
    }

    @Test
    void toTripOptions_onlySuburbanTrain_excludesItinerary() {
        var leg = intercityLeg("BUS", 3);
        var result = mapper.toTripOptions(new TransitousResponseDto.Root(List.of(itinerary(List.of(leg)))));

        assertThat(result).isEmpty();
    }

    @Test
    void toTripOptions_walkLegsAreFilteredOut() {
        var walkLeg = new TransitousResponseDto.Leg(
                Instant.parse("2026-08-01T07:50:00Z"),
                Instant.parse("2026-08-01T08:00:00Z"),
                FROM, FROM, "WALK", null, null, null, false, null
        );
        var trainLeg = intercityLeg("RAIL", 101);

        var result = mapper.toTripOptions(new TransitousResponseDto.Root(
                List.of(itinerary(List.of(walkLeg, trainLeg)))
        ));

        assertThat(result).hasSize(1);
        assertThat(result.get(0).legs()).hasSize(1);
        assertThat(result.get(0).legs().get(0).carrier()).isEqualTo("DB");
    }

    @Test
    void toTripOptions_legWithNullAgency_usesMode() {
        var leg = new TransitousResponseDto.Leg(
                Instant.parse("2026-08-01T08:00:00Z"),
                Instant.parse("2026-08-01T13:00:00Z"),
                FROM, TO, "RAIL", "IC", null, "Paris", true, 101
        );
        var result = mapper.toTripOptions(new TransitousResponseDto.Root(List.of(itinerary(List.of(leg)))));

        assertThat(result.get(0).legs().get(0).carrier()).isEqualTo("RAIL");
    }

    @Test
    void toTripOptions_priceIsPositive() {
        var leg = intercityLeg("RAIL", 100);
        var result = mapper.toTripOptions(new TransitousResponseDto.Root(List.of(itinerary(List.of(leg)))));

        assertThat(result.get(0).price()).isPositive();
        assertThat(result.get(0).currency()).isEqualTo("EUR");
    }

    @Test
    void toTripOptions_durationMappedFromItinerary() {
        var leg = intercityLeg("RAIL", 102);
        List<TripOption> result = mapper.toTripOptions(
                new TransitousResponseDto.Root(List.of(itinerary(List.of(leg))))
        );

        assertThat(result.get(0).duration().getSeconds()).isEqualTo(18000L);
    }
}
