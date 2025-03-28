package com.ssaenggojip.targetAddress.service;

import com.ssaenggojip.apiPayload.code.status.ErrorStatus;
import com.ssaenggojip.apiPayload.exception.GeneralException;
import com.ssaenggojip.targetAddress.converter.TargetAddressConverter;
import com.ssaenggojip.targetAddress.dto.TargetAddressRequestDto;
import com.ssaenggojip.targetAddress.dto.TargetAddressResponseDto;
import com.ssaenggojip.targetAddress.entity.TargetAddress;
import com.ssaenggojip.targetAddress.repository.TargetAddressRepository;
import com.ssaenggojip.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TargetAddressService {

    private final TargetAddressRepository targetAddressRepository;

    @Transactional(readOnly = true)
    public List<TargetAddressResponseDto> getTargetAddress(User user) {
        List<TargetAddress> targetAddressList = targetAddressRepository.findByUser(user);

        return targetAddressList.stream()
                .map(TargetAddressConverter::toTargetAddressResponseDto)
                .toList();
    }

    @Transactional
    public List<TargetAddressResponseDto> addTargetAddress(User user, TargetAddressRequestDto request) {
        TargetAddress targetAddress = TargetAddressConverter.toTargetAddress(request);
        int size = getTargetAddress(user).size();

        if (size == 5) {
            throw new GeneralException(ErrorStatus.MAX_TARGET_ADDRESS);
        } else if (size == 0) {
            targetAddress.setIsDefault(true);
        } else {
            targetAddress.setIsDefault(false);
        }

        targetAddress.setUser(user);
        targetAddressRepository.save(targetAddress);
        return getTargetAddress(user);
    }
}
