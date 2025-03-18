package com.sds.baseproject.error.repository;

import com.sds.baseproject.error.entity.Error;
import com.sds.baseproject.error.payload.ErrorSearchRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface GlobalErrorRepositoryCustom {
    Page<Error> search(ErrorSearchRequest searchRequest, Pageable pageable);


}
