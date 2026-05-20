package com.rotepet.adapter.flight;

import com.rotepet.common.SearchRequest;
import com.rotepet.common.TripOption;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DuffelService {
    private final DuffelClient duffelClient;
    private final DuffelMapper duffelMapper;
    public DuffelService(DuffelClient duffelClient, DuffelMapper duffelMapper) {
        this.duffelClient = duffelClient;
        this.duffelMapper = duffelMapper;
    }

    public List<TripOption> search(SearchRequest request){
        return duffelMapper.toTripOption(
                    duffelClient.fetchOffers(
                            duffelMapper.toDuffelRequest(request)
                    )
        );
    }
}
