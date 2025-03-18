package com.sds.baseproject.error.repository;

import com.sds.baseproject.error.entity.Error;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface GlobalErrorRepository extends JpaRepository<Error, Long>, GlobalErrorRepositoryCustom {
}
