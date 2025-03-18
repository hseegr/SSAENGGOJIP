package com.sds.baseproject.error.converter;

import com.sds.baseproject.error.entity.Error;
import com.sds.baseproject.error.payload.ErrorDetail;
import com.sds.baseproject.error.payload.ErrorSummary;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ErrorConverter {
    ErrorDetail toErrorDetail(Error error);

    ErrorSummary toErrorSummary(Error error);
}
