package com.ssaenggojip.property.controller;

import com.ssaenggojip.apipayload.ApiResponse;
import com.ssaenggojip.auth.annotation.AuthUser;
import com.ssaenggojip.property.dto.response.SearchProperty;
import com.ssaenggojip.property.service.PropertyLikeService;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/properties/likes")
@RequiredArgsConstructor
public class PropertyLikeController {

    private final PropertyLikeService propertyLikeService;

    @GetMapping
    public ApiResponse<List<SearchProperty>> getLikeProperties(@AuthUser User user) {
        return ApiResponse.onSuccess(propertyLikeService.getLikeProperties(user));
    }

    @PostMapping("/{propertyId}")
    public ApiResponse<Void> toggleLikeProperty(@AuthUser User user, @PathVariable Long propertyId) {
        propertyLikeService.toggleLikeProperty(user, propertyId);
        return ApiResponse.onSuccess(null);
    }
}
