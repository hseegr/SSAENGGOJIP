package com.ssaenggojip.auth.websocket;

import com.ssaenggojip.auth.JwtUtil;
import com.ssaenggojip.user.entity.User;
import com.ssaenggojip.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        URI uri = request.getURI();
        String query = uri.getQuery();

        String accessToken = extractAccessTokenFromQuery(query);
        String refreshToken = extractRefreshTokenFromCookies(request.getHeaders().get("Cookie"));

        log.info("JwtHandshakeInterceptor access token={}", accessToken);

        if (accessToken == null || refreshToken == null) {
            return false;
        }

        if (!jwtUtil.validateAccessToken(accessToken) || !jwtUtil.validateRefreshToken(refreshToken)) {
            return false;
        }

        Long userId = Long.valueOf(jwtUtil.getSubject(accessToken));
        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return false;
        }

        attributes.put("user", user);
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {}

    private String extractAccessTokenFromQuery(String query) {
        if (query == null || query.isEmpty()) return null;

        // query string 예: "access-token=abc.def.ghi&foo=bar"
        String[] params = query.split("&");
        for (String param : params) {
            String[] keyValue = param.split("=");
            if (keyValue.length == 2 && keyValue[0].equals("access-token")) {
                return keyValue[1];
            }
        }
        return null;
    }


    private String extractRefreshTokenFromCookies(List<String> cookieHeaders) {
        if (cookieHeaders == null) return null;

        for (String header : cookieHeaders) {
            String[] cookies = header.split(";");
            for (String cookie : cookies) {
                String[] keyValue = cookie.trim().split("=");
                if (keyValue.length == 2 && keyValue[0].equals("refresh-token")) {
                    return keyValue[1];
                }
            }
        }
        return null;
    }

}

