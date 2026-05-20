package com.rotepet.wishlist;

import com.rotepet.auth.User;
import com.rotepet.auth.UserRepository;
import com.rotepet.common.SearchRequest;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;

    public WishlistService(WishlistRepository wishlistRepository, UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
    }

    public List<WishlistItem> getWishlist(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found: " + email));
        return wishlistRepository.findAllByUserId(user.getId());
    }

    public WishlistItem save(String email, SearchRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found: " + email));
        WishlistItem item = new WishlistItem(
                user.getId(),
                request.from(),
                request.to(),
                request.date(),
                Instant.now()
        );
        return wishlistRepository.save(item);
    }

    public void delete(String email, String itemId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found: " + email));
        WishlistItem item = wishlistRepository.findById(itemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Wishlist item not found"));
        if (!item.getUserId().equals(user.getId())) {
            throw new AccessDeniedException("Access denied");
        }
        wishlistRepository.deleteById(itemId);
    }
}
