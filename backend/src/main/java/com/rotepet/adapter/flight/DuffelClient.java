package com.rotepet.adapter.flight;

import com.rotepet.adapter.flight.dto.DuffelRequestDto;
import com.rotepet.adapter.flight.dto.DuffelResponseDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class DuffelClient {

    private final RestClient duffelRestClient;

    public DuffelClient(RestClient duffelRestClient) {
        this.duffelRestClient = duffelRestClient;
    }

    public DuffelResponseDTO.Wrapper fetchOffers(DuffelRequestDto.Wrapper requestBody) {
        return duffelRestClient.post()
                .uri("/air/offer_requests")
                .body(requestBody)
                .retrieve()
                .body(DuffelResponseDTO.Wrapper.class);
    }
}