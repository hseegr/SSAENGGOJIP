package com.ssaenggojip.facility.repository;

import com.ssaenggojip.facility.domain.Facility;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FacilityRepository extends JpaRepository<Facility, Long> {
}
