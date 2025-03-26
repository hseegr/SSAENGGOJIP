package com.ssaenggojip.property.repository;

import com.ssaenggojip.property.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PropertyRepository extends JpaRepository<Property, Long> {
}
