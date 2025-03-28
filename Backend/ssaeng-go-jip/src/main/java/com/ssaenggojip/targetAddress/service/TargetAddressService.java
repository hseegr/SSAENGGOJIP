package com.ssaenggojip.targetAddress.service;

import com.ssaenggojip.targetAddress.converter.TargetAddressConverter;
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
}
