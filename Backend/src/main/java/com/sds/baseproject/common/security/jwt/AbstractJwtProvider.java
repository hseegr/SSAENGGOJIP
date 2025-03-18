package com.sds.baseproject.common.security.jwt;

import com.sds.baseproject.common.security.util.KeyExpander;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * JWT 토큰 생성, 검증을 위한 base class.
 */
@Slf4j
public abstract class AbstractJwtProvider {

    protected long expiration;

    protected SecretKey key;

    protected AbstractJwtProvider(String secret, long expiration) {
        this.expiration = expiration;
        this.key = Keys.hmacShaKeyFor(KeyExpander.expandKey(secret.getBytes(), 64));
    }


    public String generateToken(String username) {
        return Jwts.builder().subject(username).expiration(new Date(System.currentTimeMillis() + expiration)).signWith(this.key).compact();
    }

    public String extractUserName(String token) {
        return this.getClaims(token).getSubject();
    }

    public boolean validateToken(String token) {

        try {
            if (StringUtils.hasText(token)) {
                Jwts.parser().verifyWith(this.key).build().parseSignedClaims(token);
                return true;
            }
        } catch (MalformedJwtException ex) {
            log.error("Invalid JWT token : {}", token, ex);
        } catch (ExpiredJwtException ex) {
            log.error("Expired JWT token : {}", token, ex);
        } catch (UnsupportedJwtException ex) {
            log.error("Unsupported JWT token : {}", token, ex);
        } catch (IllegalArgumentException ex) {
            log.error("JWT claims string is empty. : {}", token, ex);
        } catch (Exception ex) {
            log.error("Invalid JWT token : {}", token, ex);
        }
        return false;
    }

    private Claims getClaims(String token) {
        return Jwts.parser().verifyWith(this.key).build().parseSignedClaims(token).getPayload();
    }
}
