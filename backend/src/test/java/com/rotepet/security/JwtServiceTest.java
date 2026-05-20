package com.rotepet.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class JwtServiceTest {

    private static final String SECRET = "AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8=";
    private static final long EXPIRATION_MS = 3_600_000L;

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRET, EXPIRATION_MS);
    }

    @Test
    void generateToken_containsEmail() {
        String token = jwtService.generateToken("user@example.com");

        assertThat(jwtService.extractEmail(token)).isEqualTo("user@example.com");
    }

    @Test
    void isTokenValid_validToken_returnsTrue() {
        String token = jwtService.generateToken("user@example.com");

        assertThat(jwtService.isTokenValid(token)).isTrue();
    }

    @Test
    void isTokenValid_expiredToken_returnsFalse() {
        JwtService shortLived = new JwtService(SECRET, 1L);
        String token = shortLived.generateToken("user@example.com");

        // wait for expiry
        try { Thread.sleep(50); } catch (InterruptedException ignored) {}

        assertThat(shortLived.isTokenValid(token)).isFalse();
    }

    @Test
    void isTokenValid_tamperedToken_returnsFalse() {
        String token = jwtService.generateToken("user@example.com");
        String tampered = token.substring(0, token.length() - 4) + "XXXX";

        assertThat(jwtService.isTokenValid(tampered)).isFalse();
    }

    @Test
    void generateToken_differentEmails_produceDifferentTokens() {
        String t1 = jwtService.generateToken("alice@example.com");
        String t2 = jwtService.generateToken("bob@example.com");

        assertThat(t1).isNotEqualTo(t2);
    }
}
