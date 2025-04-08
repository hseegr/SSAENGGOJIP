package com.ssaenggojip.common.config;

import com.graphhopper.GraphHopper;
import com.graphhopper.reader.osm.GraphHopperOSM;
import com.graphhopper.routing.util.BikeFlagEncoder;
import com.graphhopper.routing.util.CarFlagEncoder;
import com.graphhopper.routing.util.EncodingManager;
import com.graphhopper.routing.util.FootFlagEncoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Paths;

@Configuration
public class GraphHopperConfig {

    @Bean
    public GraphHopper graphHopper() {
        String osmPath = Paths.get("src/main/resources/map-data/south-korea-latest.osm.pbf").toString();
        String graphFolder = "graph-cache";

        // ✅ 이동 수단 추가: 자동차, 자전거, 도보
        EncodingManager encodingManager = new EncodingManager.Builder()
                .add(new CarFlagEncoder())
                .add(new BikeFlagEncoder())
                .add(new FootFlagEncoder())
                .build();

        GraphHopper hopper = new GraphHopperOSM() // ✅ 여기만 GraphHopperOSM 으로 바꾸면 해결
                .forServer()
                .setDataReaderFile(osmPath)
                .setGraphHopperLocation(graphFolder)
                .setEncodingManager(encodingManager)
                .importOrLoad();

        return hopper;
    }
}
