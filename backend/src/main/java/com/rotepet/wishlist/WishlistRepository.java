package com.rotepet.wishlist;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface WishlistRepository extends MongoRepository<WishlistItem, String> {
    List<WishlistItem> findAllByUserId(String userId);
}
