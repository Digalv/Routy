package com.rotepet.web;

import com.rotepet.auth.UserRepository;
import com.rotepet.wishlist.WishlistRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.greaterThan;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class CitiesControllerIT {

    @Autowired MockMvc mockMvc;

    @MockBean UserRepository userRepository;
    @MockBean WishlistRepository wishlistRepository;

    @Test
    void getCities_returnsNonEmptyList() throws Exception {
        mockMvc.perform(get("/api/cities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(greaterThan(0)));
    }

    @Test
    void getCities_containsBerlinAndParis() throws Exception {
        mockMvc.perform(get("/api/cities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == 'berlin')]").exists())
                .andExpect(jsonPath("$[?(@.id == 'paris')]").exists());
    }

    @Test
    void getCities_isPublicEndpoint_noAuthRequired() throws Exception {
        mockMvc.perform(get("/api/cities"))
                .andExpect(status().isOk());
    }
}
