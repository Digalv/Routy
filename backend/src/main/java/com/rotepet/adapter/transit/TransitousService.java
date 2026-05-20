package com.rotepet.adapter.transit;

import com.rotepet.common.City;
import com.rotepet.common.SearchRequest;
import com.rotepet.common.TripOption;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;

@Service
public class TransitousService {

    private final TransitousClient transitousClient;
    private final TransitousMapper transitousMapper;

    public TransitousService(TransitousClient transitousClient, TransitousMapper transitousMapper) {
        this.transitousClient = transitousClient;
        this.transitousMapper = transitousMapper;
    }

    public List<TripOption> search(SearchRequest request, City from, City to) {
        String time = ZonedDateTime.of(request.date(), LocalTime.of(8, 0), ZoneOffset.UTC).toString();
        return transitousMapper.toTripOptions(
                transitousClient.fetchPlan(from.lat(), from.lon(), to.lat(), to.lon(), time)
        );
    }
}
