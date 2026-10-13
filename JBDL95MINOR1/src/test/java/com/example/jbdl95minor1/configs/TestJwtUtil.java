package com.example.jbdl95minor1.configs;

import com.example.jbdl95minor1.models.Authority;
import com.example.jbdl95minor1.models.User;
import io.jsonwebtoken.Claims;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.springframework.test.util.ReflectionTestUtils;

public class TestJwtUtil {

    private JwtUtil jwtUtil;
    private static final String TEST_SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private static final Long TEST_EXPIRATION = 3600000L; // 1 hour

    @Before
    public void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtUtil, "expirationMs", TEST_EXPIRATION);
    }

    @Test
    public void testGenerateAndExtractUsername() {
        User user = User.builder()
                .username("john_doe")
                .password("password123")
                .authorities(Authority.STUDENT)
                .build();

        String token = jwtUtil.generateToken(user);
        Assert.assertNotNull(token);

        String extractedUsername = jwtUtil.extractUsername(token);
        Assert.assertEquals("john_doe", extractedUsername);
    }

    @Test
    public void testValidateTokenSuccess() {
        User user = User.builder()
                .username("jane_doe")
                .password("password123")
                .authorities(Authority.STUDENT)
                .build();

        String token = jwtUtil.generateToken(user);
        Boolean isValid = jwtUtil.validateToken(token, user);

        Assert.assertTrue(isValid);
    }

    @Test
    public void testValidateTokenFailureDifferentUser() {
        User user1 = User.builder()
                .username("user1")
                .password("pass")
                .authorities(Authority.STUDENT)
                .build();

        User user2 = User.builder()
                .username("user2")
                .password("pass")
                .authorities(Authority.STUDENT)
                .build();

        String token = jwtUtil.generateToken(user1);
        Boolean isValid = jwtUtil.validateToken(token, user2);

        Assert.assertFalse(isValid);
    }

    @Test
    public void testGenerateTokenWithCustomAuthority() {
        String token = jwtUtil.generateToken("admin_user", "ADMIN");
        Assert.assertNotNull(token);

        Claims claims = jwtUtil.extractAllClaims(token);
        Assert.assertEquals("ADMIN", claims.get("roles"));
        Assert.assertEquals("admin_user", claims.getSubject());
    }

    @Test
    public void testTokenNotExpiredInitially() {
        User user = User.builder()
                .username("active_user")
                .authorities(Authority.STUDENT)
                .build();

        String token = jwtUtil.generateToken(user);
        Assert.assertFalse(jwtUtil.isTokenExpired(token));
    }
}
