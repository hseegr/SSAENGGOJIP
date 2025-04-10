package com.ssaenggojip.recommend.service;

import com.ssaenggojip.facility.repository.FacilityRepository;
import com.ssaenggojip.facility.service.FacilityService;
import com.ssaenggojip.property.entity.Property;
import com.ssaenggojip.property.repository.PropertyRepository;
import com.ssaenggojip.recommend.dto.request.RecommendByPreferencesRequest;
import com.ssaenggojip.recommend.dto.request.RecommendByLocationRequest;
import com.ssaenggojip.recommend.dto.response.FacilityPreferencesResponse;
import com.ssaenggojip.recommend.dto.request.UpdateFacilityPreferencesRequest;
import com.ssaenggojip.recommend.dto.response.RecommendPropertyListResponse;
import com.ssaenggojip.user.entity.User;
import com.ssaenggojip.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RecommendService {
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final FacilityService facilityService;
    private final FacilityRepository facilityRepository;

    private static final Double DEFAULT_RADIUS = 2000d;

    @Transactional(readOnly = true)
    public FacilityPreferencesResponse getPreferences(User user) {
        return FacilityPreferencesResponse.from(
                facilityService.getAllFacilityTypes().getFacilityTypeList(),
                user.getFacilityPreferences());
    }

    @Transactional
    public void updatePreferences(UpdateFacilityPreferencesRequest request, User user) {
        user.setFacilityPreferences(request.getFacilityPreferences());
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public RecommendPropertyListResponse findByLocation(RecommendByLocationRequest request) {
        Double latitude = request.getLatitude();
        Double longitude = request.getLongitude();
        Double radius = request.getRadius();
        List<Property> properties = propertyRepository.findByLocation(longitude, latitude, radius);
        return RecommendPropertyListResponse.from(properties);
    }

    @Transactional(readOnly = true)
    public RecommendPropertyListResponse findTopKByPreferences(
            User user,
            RecommendByPreferencesRequest request
    ) {
        String preferences = Arrays.toString(user.getFacilityPreferences().toArray());
        List<Property> properties = propertyRepository.findTopKByVector(
                request.getLongitude(),
                request.getLatitude(),
                request.getRadius(),
                preferences,
                request.getK()
        );
        return RecommendPropertyListResponse.from(properties);
    }

    @Transactional(readOnly = true)
    public RecommendPropertyListResponse findTopKByProperty(Long propertyId, Integer k) {
        Property property = propertyRepository.getReferenceById(propertyId);
        String facilityNearness = Arrays.toString(property.getFacilityNearness().toArray());
        List<Property> properties = propertyRepository.findTopKByVector(
                property.getLongitude(),
                property.getLatitude(),
                DEFAULT_RADIUS,
                facilityNearness,
                k
        );
        return RecommendPropertyListResponse.from(properties);
    }

    @Transactional(readOnly = true)
    public Set<Long> filterRecommendedIds(Set<Long> ids, User user) {
        String preferences = Arrays.toString(user.getFacilityPreferences().toArray());
        return propertyRepository.findIdsByIsRecommended(
                ids,
                preferences
        );
    }

    public void test() {
        List<Long> ids = Arrays.asList(2556L, 3746L, 16127L, 22789L, 12813L, 21162L, 14528L, 22368L, 3715L, 29687L,
                20025L, 30285L, 24515L, 5207L, 8994L, 7554L, 18985L, 4692L, 32244L, 23862L,
                15034L, 13616L, 20890L, 12264L, 18179L, 13182L, 29068L, 27583L, 26231L, 9308L,
                3609L, 16379L, 3169L, 31978L, 8527L, 3960L, 9819L, 37704L, 13387L, 31913L,
                13595L, 36948L, 15653L, 20074L, 35098L, 1057L, 16062L, 14192L, 34171L, 706L,
                22831L, 2917L, 35924L, 1314L, 35271L, 21109L, 15301L, 6872L, 23207L, 20598L,
                20002L, 15183L, 6738L, 16432L, 31112L, 26813L, 34685L, 2505L, 17201L, 21694L,
                9845L, 33224L, 35071L, 17923L, 10387L, 33095L, 19165L, 27773L, 33035L, 22898L,
                17525L, 31156L, 36772L, 13269L, 27004L, 12428L, 17739L, 23718L, 31513L, 31198L,
                12858L, 7883L, 31732L, 28949L, 35723L, 30143L, 11813L, 3972L, 34925L, 31290L,
                12631L, 25042L, 3157L, 9311L, 35015L, 37087L, 7172L, 7594L, 24545L, 32614L
        );
        Set<Long> ids2 = new HashSet<>(ids);
        String preferences = Arrays.toString(new Double[] {
                1., 1., 1., 1., 1., 1., 1., 1.
        });
        Set<Long> recommendedIds = propertyRepository.findIdsByIsRecommended(
                ids2,
                preferences
        );

        System.out.println(Arrays.toString(recommendedIds.toArray()));
        System.out.println("총 " + recommendedIds.size() + "개");
    }

}
