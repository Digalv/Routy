package com.rotepet.orchestrator;

import com.rotepet.adapter.flight.DuffelService;
import com.rotepet.adapter.transit.TransitousService;
import com.rotepet.common.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SearchOrchestratorServiceTest {

    @Mock DuffelService duffelService;
    @Mock TransitousService transitousService;
    @Mock CityRegistry cityRegistry;
    @InjectMocks SearchOrchestratorService orchestratorService;

    private static final City BERLIN = new City("berlin", "Berlin", "DE", "BER", 52.52, 13.40);
    private static final City PARIS  = new City("paris",  "Paris",  "FR", "CDG", 48.85, 2.35);

    private TripOption flightOption(BigDecimal price) {
        Leg leg = new Leg("BER", "CDG", Instant.now(), Instant.now().plusSeconds(7200), "Lufthansa");
        return new TripOption(TransportType.FLIGHT, List.of(leg), price, "EUR", Duration.ofHours(2), "duffel");
    }

    private TripOption trainOption(BigDecimal price) {
        Leg leg = new Leg("Berlin Hbf", "Paris Nord", Instant.now(), Instant.now().plusSeconds(18000), "DB");
        return new TripOption(TransportType.TRAIN, List.of(leg), price, "EUR", Duration.ofHours(5), "transitous");
    }

    @Test
    void search_mergesResultsFromBothProviders() {
        SearchRequest request = new SearchRequest("berlin", "paris", LocalDate.now().plusDays(1), 1);
        when(cityRegistry.getCity("berlin")).thenReturn(BERLIN);
        when(cityRegistry.getCity("paris")).thenReturn(PARIS);
        when(duffelService.search(any())).thenReturn(List.of(flightOption(new BigDecimal("150.00"))));
        when(transitousService.search(any(), eq(BERLIN), eq(PARIS))).thenReturn(List.of(trainOption(new BigDecimal("80.00"))));

        List<TripOption> results = orchestratorService.search(request);

        assertThat(results).hasSize(2);
        assertThat(results).extracting(TripOption::type)
                .containsExactlyInAnyOrder(TransportType.FLIGHT, TransportType.TRAIN);
    }

    @Test
    void search_unknownFromCity_throwsUnknownCityException() {
        SearchRequest request = new SearchRequest("xyz", "paris", LocalDate.now().plusDays(1), 1);
        when(cityRegistry.getCity("xyz")).thenReturn(null);

        assertThatThrownBy(() -> orchestratorService.search(request))
                .isInstanceOf(UnknownCityException.class);
    }

    @Test
    void search_unknownToCity_throwsUnknownCityException() {
        SearchRequest request = new SearchRequest("berlin", "xyz", LocalDate.now().plusDays(1), 1);
        when(cityRegistry.getCity("berlin")).thenReturn(BERLIN);
        when(cityRegistry.getCity("xyz")).thenReturn(null);

        assertThatThrownBy(() -> orchestratorService.search(request))
                .isInstanceOf(UnknownCityException.class);
    }

    @Test
    void search_oneProviderFails_returnsResultsFromOther() {
        SearchRequest request = new SearchRequest("berlin", "paris", LocalDate.now().plusDays(1), 1);
        when(cityRegistry.getCity("berlin")).thenReturn(BERLIN);
        when(cityRegistry.getCity("paris")).thenReturn(PARIS);
        when(duffelService.search(any())).thenThrow(new RuntimeException("Duffel unavailable"));
        when(transitousService.search(any(), eq(BERLIN), eq(PARIS))).thenReturn(List.of(trainOption(new BigDecimal("80.00"))));

        List<TripOption> results = orchestratorService.search(request);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).type()).isEqualTo(TransportType.TRAIN);
    }

    @Test
    void search_bothProvidersFail_returnsEmptyList() {
        SearchRequest request = new SearchRequest("berlin", "paris", LocalDate.now().plusDays(1), 1);
        when(cityRegistry.getCity("berlin")).thenReturn(BERLIN);
        when(cityRegistry.getCity("paris")).thenReturn(PARIS);
        when(duffelService.search(any())).thenThrow(new RuntimeException("down"));
        when(transitousService.search(any(), any(), any())).thenThrow(new RuntimeException("down"));

        List<TripOption> results = orchestratorService.search(request);

        assertThat(results).isEmpty();
    }

    @Test
    void search_multiplePassengers_multipliesPrice() {
        SearchRequest request = new SearchRequest("berlin", "paris", LocalDate.now().plusDays(1), 3);
        when(cityRegistry.getCity("berlin")).thenReturn(BERLIN);
        when(cityRegistry.getCity("paris")).thenReturn(PARIS);
        when(duffelService.search(any())).thenReturn(List.of(flightOption(new BigDecimal("100.00"))));
        when(transitousService.search(any(), any(), any())).thenReturn(List.of());

        List<TripOption> results = orchestratorService.search(request);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).price()).isEqualByComparingTo(new BigDecimal("300.00"));
    }

    @Test
    void search_singlePassenger_priceUnchanged() {
        SearchRequest request = new SearchRequest("berlin", "paris", LocalDate.now().plusDays(1), 1);
        when(cityRegistry.getCity("berlin")).thenReturn(BERLIN);
        when(cityRegistry.getCity("paris")).thenReturn(PARIS);
        when(duffelService.search(any())).thenReturn(List.of(flightOption(new BigDecimal("100.00"))));
        when(transitousService.search(any(), any(), any())).thenReturn(List.of());

        List<TripOption> results = orchestratorService.search(request);

        assertThat(results.get(0).price()).isEqualByComparingTo(new BigDecimal("100.00"));
    }
}
