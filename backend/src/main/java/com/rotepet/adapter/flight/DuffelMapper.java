package com.rotepet.adapter.flight;


import com.rotepet.adapter.flight.dto.DuffelRequestDto;
import com.rotepet.adapter.flight.dto.DuffelResponseDTO;
import com.rotepet.common.Leg;
import com.rotepet.common.SearchRequest;
import com.rotepet.common.TransportType;
import com.rotepet.common.TripOption;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Component
public class DuffelMapper {

    public DuffelRequestDto.Wrapper toDuffelRequest(SearchRequest request) {
        return new DuffelRequestDto.Wrapper(
                new DuffelRequestDto.Data(
                        List.of(new DuffelRequestDto.Slice(
                                request.from(),
                                request.to(),
                                request.date().toString()
                        )),
                        List.of(new DuffelRequestDto.Passenger("adult")),
                        "economy"
                )
        );
    }

    public List<TripOption> toTripOption(DuffelResponseDTO.Wrapper response) {
        if (response == null || response.data() == null || response.data().offers() == null) {
            return List.of();
        }
        return response.data().offers().stream()
                .map(offer -> {
                    List<Leg> legs = offer.slices().stream()
                            .flatMap(slice -> slice.segments().stream())
                            .map(ds -> new Leg(
                                    ds.origin().city_name(),
                                    ds.destination().city_name(),
                                    LocalDateTime.parse(ds.departing_at()).toInstant(ZoneOffset.UTC),
                                    LocalDateTime.parse(ds.arriving_at()).toInstant(ZoneOffset.UTC),
                                    ds.operating_carrier() != null ? ds.operating_carrier().name() : "Unknown"
                            ))
                            .toList();

                    Duration duration = Duration.parse(offer.slices().getFirst().duration());

                    return new TripOption(
                            TransportType.FLIGHT,
                            legs,
                            new BigDecimal(offer.total_amount()),
                            offer.total_currency(),
                            duration,
                            "duffel"
                    );
                })
                .toList();
    }
}
