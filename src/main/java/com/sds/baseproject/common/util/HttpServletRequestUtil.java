package com.sds.baseproject.common.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.util.StringUtils;

public class HttpServletRequestUtil {
    private HttpServletRequestUtil() {

    }

    public static boolean isForwarded(HttpServletRequest request) {
        return request.getHeader("X-Forwarded-For") != null
                || request.getHeader("WL-PATH-TRIM") != null;
    }

    /**
     * Get IP Address from request.
     *
     * @param request source request.
     * @return IP address or null.
     */
    public static String getRemoteAddr(HttpServletRequest request) {

        String ip = request.getHeader("X-Forwarded-For");

        if (!StringUtils.hasText(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (!StringUtils.hasText(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (!StringUtils.hasText(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (!StringUtils.hasText(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (!StringUtils.hasText(ip)) {
            ip = request.getRemoteAddr();
        }
        if (StringUtils.hasText(ip)) {
            int firstIndex = ip.indexOf(":");
            int lastIndex = ip.lastIndexOf(":");
            if (lastIndex > 0 && firstIndex == lastIndex) {
                ip = ip.substring(0, lastIndex);
            }
        }
        return ip;
    }

}
