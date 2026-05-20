package com.rotepet.adapter.flight;

import com.rotepet.adapter.flight.dto.DuffelRequestDto;
import com.rotepet.adapter.flight.dto.DuffelResponseDTO;
import com.rotepet.common.SearchRequest;
import com.rotepet.common.TripOption;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class DuffelMapperTest {

    private final DuffelMapper mapper = new DuffelMapper();

    @Test
    void toDuffelRequest_mapsFromToAndDate() {
        SearchRequest request = new SearchRequest("BER", "CDG", LocalDate.of(2026, 8, 1), 1);

        DuffelRequestDto.Wrapper result = mapper.toDuffelRequest(request);

        assertThat(result.data().slices()).hasSize(1);
        assertThat(result.data().slices().get(0).origin()).isEqualTo("BER");
        assertThat(result.data().slices().get(0).destination()).isEqualTo("CDG");
        assertThat(result.data().slices().get(0).departure_date()).isEqualTo("2026-08-01");
        assertThat(result.data().passengers()).hasSize(1);
        assertThat(result.data().passengers().get(0).type()).isEqualTo("adult");
        assertThat(result.data().cabin_class()).isEqualTo("economy");
    }

    @Test
    void toTripOption_nullResponse_returnsEmptyList() {
        assertThat(mapper.toTripOption(null)).isEmpty();
    }

    @Test
    void toTripOption_nullData_returnsEmptyList() {
        assertThat(mapper.toTripOption(new DuffelResponseDTO.Wrapper(null))).isEmpty();
    }

    @Test
    void toTripOption_nullOffers_returnsEmptyList() {
        assertThat(mapper.toTripOption(new DuffelResponseDTO.Wrapper(new DuffelResponseDTO.Data(null)))).isEmpty();
    }

    @Test
    void toTripOption_validResponse_mapsTripOption() {
        var response = buildResponse("150.00", "EUR", "Lufthansa");

        List<TripOption> results = mapper.toTripOption(response);

        assertThat(results).hasSize(1);
        TripOption option = results.get(0);
        assertThat(option.price()).isEqualByComparingTo("150.00");
        assertThat(option.currency()).isEqualTo("EUR");
        assertThat(option.provider()).isEqualTo("duffel");
        assertThat(option.legs()).hasSize(1);
        assertThat(option.legs().get(0).carrier()).isEqualTo("Lufthansa");
        assertThat(option.legs().get(0).from()).isEqualTo("Berlin");
        assertThat(option.legs().get(0).to()).isEqualTo("Paris");
    }

    @Test
    void toTripOption_nullCarrier_usesUnknown() {
        var segment = new DuffelResponseDTO.Segment(
                new DuffelResponseDTO.Place("Berlin", "BER"),
                new DuffelResponseDTO.Place("Paris", "CDG"),
                "2026-08-01T10:00:00",
                "2026-08-01T12:30:00",
                null
        );
        var response = new DuffelResponseDTO.Wrapper(
                new DuffelResponseDTO.Data(List.of(
                        new DuffelResponseDTO.Offer("1", "100.00", "EUR",
                                List.of(new DuffelResponseDTO.Slice("PT2H", List.of(segment))))
                ))
        );

        List<TripOption> results = mapper.toTripOption(response);

        assertThat(results.get(0).legs().get(0).carrier()).isEqualTo("Unknown");
    }

    private DuffelResponseDTO.Wrapper buildResponse(String amount, String currency, String carrier) {
        var segment = new DuffelResponseDTO.Segment(
                new DuffelResponseDTO.Place("Berlin", "BER"),
                new DuffelResponseDTO.Place("Paris", "CDG"),
                "2026-08-01T10:00:00",
                "2026-08-01T12:30:00",
                new DuffelResponseDTO.Carrier("", carrier)
        );
        var slice = new DuffelResponseDTO.Slice("PT2H30M", List.of(segment));
        var offer = new DuffelResponseDTO.Offer("offer-1", amount, currency, List.of(slice));
        return new DuffelResponseDTO.Wrapper(new DuffelResponseDTO.Data(List.of(offer)));
    }
}
