package com.rotepet.wishlist;

import com.rotepet.auth.User;
import com.rotepet.auth.UserRepository;
import com.rotepet.common.SearchRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.server.ResponseStatusException;

import java.lang.reflect.Field;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WishlistServiceTest {

    @Mock WishlistRepository wishlistRepository;
    @Mock UserRepository userRepository;
    @InjectMocks WishlistService wishlistService;

    private User user;

    @BeforeEach
    void setUp() throws Exception {
        user = new User("user@example.com", "hashed", Instant.now());
        Field id = User.class.getDeclaredField("id");
        id.setAccessible(true);
        id.set(user, "user-id-1");
    }

    @Test
    void getWishlist_returnsItemsForUser() {
        WishlistItem item = new WishlistItem("user-id-1", "berlin", "paris", LocalDate.now(), Instant.now());
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(wishlistRepository.findAllByUserId("user-id-1")).thenReturn(List.of(item));

        List<WishlistItem> result = wishlistService.getWishlist("user@example.com");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getFrom()).isEqualTo("berlin");
    }

    @Test
    void getWishlist_userNotFound_throwsIllegalStateException() {
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> wishlistService.getWishlist("ghost@example.com"))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void save_persistsItemAndReturnsIt() {
        SearchRequest request = new SearchRequest("berlin", "paris", LocalDate.now().plusDays(1), 1);
        WishlistItem saved = new WishlistItem("user-id-1", "berlin", "paris", request.date(), Instant.now());
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(wishlistRepository.save(any(WishlistItem.class))).thenReturn(saved);

        WishlistItem result = wishlistService.save("user@example.com", request);

        assertThat(result.getUserId()).isEqualTo("user-id-1");
        assertThat(result.getFrom()).isEqualTo("berlin");
        assertThat(result.getTo()).isEqualTo("paris");
    }

    @Test
    void save_userNotFound_throwsIllegalStateException() {
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> wishlistService.save("ghost@example.com",
                new SearchRequest("a", "b", LocalDate.now().plusDays(1), 1)))
                .isInstanceOf(IllegalStateException.class);
    }

    @Test
    void delete_ownerDeletesItem_succeeds() throws Exception {
        WishlistItem item = new WishlistItem("user-id-1", "berlin", "paris", LocalDate.now(), Instant.now());
        Field itemId = WishlistItem.class.getDeclaredField("id");
        itemId.setAccessible(true);
        itemId.set(item, "item-id-1");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(wishlistRepository.findById("item-id-1")).thenReturn(Optional.of(item));

        wishlistService.delete("user@example.com", "item-id-1");

        verify(wishlistRepository).deleteById("item-id-1");
    }

    @Test
    void delete_itemNotFound_throwsResponseStatusException() {
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(wishlistRepository.findById("missing")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> wishlistService.delete("user@example.com", "missing"))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void delete_anotherUsersItem_throwsAccessDeniedException() throws Exception {
        WishlistItem item = new WishlistItem("other-user-id", "berlin", "paris", LocalDate.now(), Instant.now());
        Field itemId = WishlistItem.class.getDeclaredField("id");
        itemId.setAccessible(true);
        itemId.set(item, "item-id-2");

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(wishlistRepository.findById("item-id-2")).thenReturn(Optional.of(item));

        assertThatThrownBy(() -> wishlistService.delete("user@example.com", "item-id-2"))
                .isInstanceOf(AccessDeniedException.class);

        verify(wishlistRepository, never()).deleteById(any());
    }
}
