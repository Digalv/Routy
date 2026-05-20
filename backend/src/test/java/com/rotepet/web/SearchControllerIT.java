package com.rotepet.web;

import com.rotepet.auth.UserRepository;
import com.rotepet.common.Leg;
import com.rotepet.common.TransportType;
import com.rotepet.common.TripOption;
import com.rotepet.common.UnknownCityException;
import com.rotepet.orchestrator.SearchOrchestratorService;
import com.rotepet.wishlist.WishlistRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SearchControllerIT {

    @Autowired MockMvc mockMvc;

    @MockBean SearchOrchestratorService searchOrchestrator;
    @MockBean UserRepository userRepository;
    @MockBean WishlistRepository wishlistRepository;

    private static final String DATE = LocalDate.now().plusDays(30).toString();

    @Test
    void search_validRequest_returns200WithResults() throws Exception {
        Leg leg = new Leg("Berlin", "Paris", Instant.now(), Instant.now().plusSeconds(7200), "Lufthansa");
        TripOption option = new TripOption(TransportType.FLIGHT, List.of(leg),
                new BigDecimal("150.00"), "EUR", Duration.ofHours(2), "duffel");
        when(searchOrchestrator.search(any())).thenReturn(List.of(option));

        mockMvc.perform(get("/api/search")
                        .param("from", "berlin")
                        .param("to", "paris")
                        .param("date", DATE)
                        .param("passengers", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].type").value("FLIGHT"))
                .andExpect(jsonPath("$[0].provider").value("duffel"));
    }

    @Test
    void search_unknownCity_returns400() throws Exception {
        when(searchOrchestrator.search(any())).thenThrow(new UnknownCityException("Unknown: atlantis"));

        mockMvc.perform(get("/api/search")
                        .param("from", "atlantis")
                        .param("to", "paris")
                        .param("date", DATE)
                        .param("passengers", "1"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());
    }

    @Test
    void search_invalidPassengersCount_returns400() throws Exception {
        mockMvc.perform(get("/api/search")
                        .param("from", "berlin")
                        .param("to", "paris")
                        .param("date", DATE)
                        .param("passengers", "10"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void search_noResults_returnsEmptyList() throws Exception {
        when(searchOrchestrator.search(any())).thenReturn(List.of());

        mockMvc.perform(get("/api/search")
                        .param("from", "berlin")
                        .param("to", "paris")
                        .param("date", DATE)
                        .param("passengers", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void search_isPublicEndpoint_noAuthRequired() throws Exception {
        when(searchOrchestrator.search(any())).thenReturn(List.of());

        mockMvc.perform(get("/api/search")
                        .param("from", "berlin")
                        .param("to", "paris")
                        .param("date", DATE)
                        .param("passengers", "1"))
                .andExpect(status().isOk());
    }
}
