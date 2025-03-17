package com.sds.baseproject.error.service;

import com.sds.baseproject.error.payload.ErrorDetail;
import com.sds.baseproject.error.payload.ErrorSearchRequest;
import com.sds.baseproject.error.payload.ErrorSummary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ErrorService {

    Page<ErrorSummary> getErrorList(ErrorSearchRequest searchRequest, Pageable pageable);

    ErrorDetail getErrorDetail(Long errorId);

    Long saveError(String message, Exception ex);

}
