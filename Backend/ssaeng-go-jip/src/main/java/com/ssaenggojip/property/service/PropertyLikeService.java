package com.ssaenggojip.property.service;

import com.ssaenggojip.apipayload.code.status.ErrorStatus;
import com.ssaenggojip.apipayload.exception.GeneralException;
import com.ssaenggojip.property.converter.PropertyConverter;
import com.ssaenggojip.property.dto.response.SearchProperty;
import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.entity.PropertyLike;
import com.ssaenggojip.property.repository.PropertyLikeRepository;
import com.ssaenggojip.property.repository.PropertyRepository;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PropertyLikeService {

    private final PropertyLikeRepository propertyLikeRepository;
    private final PropertyRepository propertyRepository;

    @Transactional(readOnly = true)
    public List<SearchProperty> getLikeProperties(User user) {
        List<PropertyLike> propertyLikeList = propertyLikeRepository.findByUser(user);

        return propertyLikeList.stream()
                .map(propertyLike -> PropertyConverter.mapToDto(propertyLike.getProperty(), true, false))
                .toList();
    }

    @Transactional
    public void toggleLikeProperty(User user, Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new GeneralException(ErrorStatus.UNABLE_TO_GET_PROPERTY_INFO));

        Optional<PropertyLike> propertyLike = propertyLikeRepository.findByUserAndProperty(user, property);

        if (propertyLike.isPresent()) {
            propertyLikeRepository.delete(propertyLike.get());
        } else {
            propertyLikeRepository.save(PropertyLike.builder()
                            .property(property)
                            .user(user)
                            .build());
        }
    }
    @Transactional(readOnly = true)
    public List<Long> getLikePropertyIds(User user) {
        return propertyLikeRepository.findPropertyIdsByUser(user);
    }
}
