package com.rotepet.web;

import com.rotepet.common.SearchRequest;
import com.rotepet.common.TripOption;
import com.rotepet.orchestrator.SearchOrchestratorService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@Validated
@RestController
@RequestMapping("/api")
public class SearchController {

    private final SearchOrchestratorService orchestrator;

    public SearchController(SearchOrchestratorService orchestrator) {
        this.orchestrator = orchestrator;
    }

    @GetMapping("/search")
    public List<TripOption> search(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "1") @Min(1) @Max(9) int passengers
    ) {
        return orchestrator.search(new SearchRequest(from, to, date, passengers));
    }
}
