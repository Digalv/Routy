package com.rotepet.orchestrator;

import com.rotepet.adapter.flight.DuffelService;
import com.rotepet.adapter.transit.TransitousService;
import com.rotepet.common.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class SearchOrchestratorService {

    private static final Logger log = LoggerFactory.getLogger(SearchOrchestratorService.class);

    private final DuffelService duffelService;
    private final TransitousService transitousService;
    private final CityRegistry cityRegistry;

    public SearchOrchestratorService(DuffelService duffelService,
                                     TransitousService transitousService,
                                     CityRegistry cityRegistry) {
        this.duffelService = duffelService;
        this.transitousService = transitousService;
        this.cityRegistry = cityRegistry;
    }

    public List<TripOption> search(SearchRequest request) {
        City fromCity = cityRegistry.getCity(request.from());
        City toCity = cityRegistry.getCity(request.to());

        if (fromCity == null) throw new UnknownCityException("Город отправления не найден: " + request.from());
        if (toCity == null) throw new UnknownCityException("Город прибытия не найден: " + request.to());

        List<CompletableFuture<List<TripOption>>> futures = new ArrayList<>();

        futures.add(CompletableFuture.supplyAsync(() ->
                duffelService.search(new SearchRequest(fromCity.iata(), toCity.iata(), request.date(), 1))
        ));

        futures.add(CompletableFuture.supplyAsync(() ->
                transitousService.search(request, fromCity, toCity)
        ));

        BigDecimal multiplier = BigDecimal.valueOf(request.passengers());

        return futures.stream()
                .flatMap(f -> {
                    try {
                        return f.join().stream();
                    } catch (Exception e) {
                        log.error("Провайдер вернул ошибку, пропускаем: {}", e.getMessage());
                        return java.util.stream.Stream.empty();
                    }
                })
                .map(option -> request.passengers() == 1 ? option :
                        new TripOption(
                                option.type(),
                                option.legs(),
                                option.price().multiply(multiplier),
                                option.currency(),
                                option.duration(),
                                option.provider()
                        ))
                .toList();
    }
}
