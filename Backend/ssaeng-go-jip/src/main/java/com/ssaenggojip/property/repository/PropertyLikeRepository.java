package com.ssaenggojip.property.repository;

import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.entity.PropertyLike;
import com.ssaenggojip.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PropertyLikeRepository extends JpaRepository<PropertyLike, Long> {
    List<PropertyLike> findByUser(User user);
    Optional<PropertyLike> findByUserAndProperty(User user, Property property);

    @Query("SELECT pl.property.id FROM PropertyLike pl WHERE pl.user = :user")
    List<Long> findPropertyIdsByUser(@Param("user") User user);

}
