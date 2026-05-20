package com.rotepet.wishlist;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rotepet.auth.User;
import com.rotepet.auth.UserRepository;
import com.rotepet.common.SearchRequest;
import com.rotepet.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WishlistControllerIT {

    @Autowired MockMvc mockMvc;
    @Autowired ObjectMapper objectMapper;
    @Autowired JwtService jwtService;

    @MockBean WishlistService wishlistService;
    @MockBean UserRepository userRepository;
    @MockBean WishlistRepository wishlistRepository;

    private static final String EMAIL = "test@example.com";
    private String authHeader;

    @BeforeEach
    void setup() {
        User user = new User(EMAIL, "hashed", Instant.now());
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        authHeader = "Bearer " + jwtService.generateToken(EMAIL);
    }

    @Test
    void getWishlist_withoutAuth_returns403() throws Exception {
        mockMvc.perform(get("/api/wishlist"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getWishlist_authenticated_returnsEmptyList() throws Exception {
        when(wishlistService.getWishlist(EMAIL)).thenReturn(List.of());

        mockMvc.perform(get("/api/wishlist").header("Authorization", authHeader))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void save_authenticated_returnsCreated() throws Exception {
        SearchRequest req = new SearchRequest("berlin", "paris", LocalDate.now().plusDays(5), 1);
        WishlistItem saved = new WishlistItem("user-id", "berlin", "paris", req.date(), Instant.now());
        when(wishlistService.save(eq(EMAIL), any())).thenReturn(saved);

        mockMvc.perform(post("/api/wishlist")
                        .header("Authorization", authHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.from").value("berlin"))
                .andExpect(jsonPath("$.to").value("paris"));
    }

    @Test
    void delete_ownItem_returnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/wishlist/item-1")
                        .header("Authorization", authHeader))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_anotherUsersItem_returns403() throws Exception {
        doThrow(new AccessDeniedException("Access denied"))
                .when(wishlistService).delete(eq(EMAIL), eq("item-2"));

        mockMvc.perform(delete("/api/wishlist/item-2")
                        .header("Authorization", authHeader))
                .andExpect(status().isForbidden());
    }

    @Test
    void delete_nonExistentItem_returns404() throws Exception {
        doThrow(new ResponseStatusException(HttpStatus.NOT_FOUND))
                .when(wishlistService).delete(eq(EMAIL), eq("missing"));

        mockMvc.perform(delete("/api/wishlist/missing")
                        .header("Authorization", authHeader))
                .andExpect(status().isNotFound());
    }
}
