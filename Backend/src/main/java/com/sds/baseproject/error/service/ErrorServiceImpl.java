package com.sds.baseproject.error.service;

import com.sds.baseproject.error.converter.ErrorConverter;
import com.sds.baseproject.error.entity.Error;
import com.sds.baseproject.error.payload.ErrorDetail;
import com.sds.baseproject.error.payload.ErrorSearchRequest;
import com.sds.baseproject.error.payload.ErrorSummary;
import com.sds.baseproject.error.repository.GlobalErrorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;

@Service
@RequiredArgsConstructor
@Slf4j
public class ErrorServiceImpl implements ErrorService {
    private final GlobalErrorRepository globalErrorRepository;
    private final ErrorConverter errorConverter;

    @Override
    public ErrorDetail getErrorDetail(Long errorId) {
        return this.errorConverter.toErrorDetail(this.globalErrorRepository.getReferenceById(errorId));
    }

    @Override
    public Page<ErrorSummary> getErrorList(ErrorSearchRequest searchRequest, Pageable pageable) {
        return this.globalErrorRepository.search(searchRequest, pageable).map(this.errorConverter::toErrorSummary);
    }

    @Override
    public Long saveError(String message, Exception ex) {
        try {
            Error error = new Error();
            String errorMessage = message;
            if (StringUtils.hasText(errorMessage)) {
                errorMessage += " : ";
            }
            errorMessage += (StringUtils.hasText(ex.getMessage()) ?
                    ex.getMessage() :
                    "Message is Empty in " + ex.getClass().getSimpleName());
            error.setMessage(errorMessage);
            error.setStacktrace(Arrays.toString(ex.getStackTrace()));
            error = this.globalErrorRepository.save(error);
            return error.getErrorId();
        } catch (Exception e) {
            log.error("Fail to save the error on the repository: " + message);
        }
        return null;
    }

}
