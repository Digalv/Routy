package com.rotepet.wishlist;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;

@Document("wishlist")
public class WishlistItem {

    @Id
    private String id;

    private String userId;
    private String from;
    private String to;
    private LocalDate date;
    private Instant savedAt;

    public WishlistItem() {}

    public WishlistItem(String userId, String from, String to, LocalDate date, Instant savedAt) {
        this.userId = userId;
        this.from = from;
        this.to = to;
        this.date = date;
        this.savedAt = savedAt;
    }

    public String getId() { return id; }
    public String getUserId() { return userId; }
    public String getFrom() { return from; }
    public String getTo() { return to; }
    public LocalDate getDate() { return date; }
    public Instant getSavedAt() { return savedAt; }
}
