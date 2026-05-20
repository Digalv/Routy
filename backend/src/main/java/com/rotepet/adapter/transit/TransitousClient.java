package com.rotepet.adapter.transit;

import com.rotepet.adapter.transit.dto.TransitousResponseDto;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class TransitousClient {

    private final RestClient transitousRestClient;

    public TransitousClient(RestClient transitousRestClient) {
        this.transitousRestClient = transitousRestClient;
    }

    public TransitousResponseDto.Root fetchPlan(double fromLat, double fromLon,
                                                double toLat, double toLon,
                                                String time) {
        return transitousRestClient.get()
                .uri(b -> b.path("/api/v1/plan")
                        .queryParam("fromPlace", fromLat + "," + fromLon)
                        .queryParam("toPlace", toLat + "," + toLon)
                        .queryParam("time", time)
                        .build())
                .retrieve()
                .body(TransitousResponseDto.Root.class);
    }
}
