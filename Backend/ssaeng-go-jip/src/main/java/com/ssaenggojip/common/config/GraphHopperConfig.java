package com.ssaenggojip.common.config;

import com.graphhopper.GraphHopper;
import com.graphhopper.config.Profile;
import com.graphhopper.reader.osm.GraphHopperOSM;
import com.graphhopper.routing.util.BikeFlagEncoder;
import com.graphhopper.routing.util.CarFlagEncoder;
import com.graphhopper.routing.util.EncodingManager;
import com.graphhopper.routing.util.FootFlagEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class GraphHopperConfig {

    @Value("${graphhopper.osm-file-path}")
    private String osmPath;

    @Value("${graphhopper.graph-cache-path}")
    private String graphFolder;

    @Bean
    public GraphHopper graphHopper() {
//        String osmPath = Paths.get("src/main/ources/map-data/south-korea-latest.osm.pbf").toString();
//
//        String graphFolder = "graph-cache";res

        // ✅ 이동 수단 추가: 자동차, 자전거, 도보
        EncodingManager encodingManager = new EncodingManager.Builder()
                .add(new CarFlagEncoder())
                .add(new BikeFlagEncoder())
                .add(new FootFlagEncoder())
                .build();

        // ✅ 각각의 vehicle 이름과 동일한 profile을 등록해야 함!
        List<Profile> profiles = List.of(
                new Profile("car").setVehicle("car").setWeighting("fastest"),
                new Profile("bike").setVehicle("bike").setWeighting("fastest"),
                new Profile("foot").setVehicle("foot").setWeighting("fastest")
        );

        GraphHopper hopper = new GraphHopperOSM()
                .forServer()
                .setDataReaderFile(osmPath)
                .setGraphHopperLocation(graphFolder)
                .setEncodingManager(encodingManager)
                .setProfiles(profiles) // ✅ 꼭 넣어줘야 setProfile() 호출 시 인식됨
                .importOrLoad();

        return hopper;
    }
}
