package com.sds.baseproject.mattermost.util;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;

/**
 * 개발자 센터에서 제공하는 OPEN API 중 SSAFY 메세지(Mattermost API)를 호출하기 위한 기능을 구현한 Util Class
 */
@Component
@RequiredArgsConstructor
public class MattermostUtil {
    /**
     * 개발자 센터에서 발급 받은 OPEN API KEY
     */
    @Value("${ssafyproject.openapi.key}")
    private String openApiKey;

    /**
     * OPEN API 호출을 위한 BASE_URL
     */
    @Value("${ssafyproject.openapi.url}")
    private String openApiUrl;

    /**
     * OPEN API 호출을 위한 HTTP 클라이언트
     */
    private RestTemplate restTemplate;

    /**
     * 호출할 API의 VERSION
     */
    private static final String VERSION = "v4";

    /**
     * RestTemplate 생성 및 초기화.
     * Mattermost API 호출용이기 때문에 RestTemplate이 Spring Container에 의해 생성/주입되지 않고,
     * PostConstruct를 이용하여 Util 내부에서만 사용하는 객체로 생성 및 초기화.
     */
    @PostConstruct
    private void initializeRestTemplate() {
        // SNAKE_CASE를 CAMEL_CASE로 변환하기 위한 objectMapper 생성
        // payload를 CAMEL_CASE로 전달하기 위함
        ObjectMapper objectMapper =
                new ObjectMapper()
                        .setPropertyNamingStrategy(new PropertyNamingStrategies.SnakeCaseStrategy())
                        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // 생성한 objectMapper를 messageConverters에 추가
        List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
        MappingJackson2HttpMessageConverter converter =
                new MappingJackson2HttpMessageConverter(objectMapper);
        messageConverters.add(converter);

        // RestTemplate을 명시적으로 생성 및 초기화
        RestTemplate template = new RestTemplate();
        template.setMessageConverters(messageConverters);
        this.restTemplate = template;
    }

    /**
     * RestTemplate을 사용하여 API 호출.
     * Request/Response body 타입이 API에 따라 가변적이므로 Generic Type으로 구현.
     *
     * @param path            API 경로 (EndPoint)
     * @param queryParameters 요청 파라미터 (API 별 상이)
     * @param method          HTTP method (API의 행위 명시)
     * @param body            Request body (일반적으로 POST, PUT, PATCH 요청시 전달하는 payload)
     * @param responseType    Response body를 매핑할 클래스 (JSON 응답 결과를 Java Object로 변환)
     * @return API 응답 결과
     */
    public <T, U> ResponseEntity<T> callApi(
            String path,
            MultiValueMap<String, String> queryParameters,
            HttpMethod method,
            U body,
            Class<T> responseType) {
        // 응답 결과를 담을 ResponseEntity 선언
        ResponseEntity<T> response;

        try {
            // API 호출을 위한 RequestEntity를 생성
            // 호출가능한 전체 URI는 generateMMUri를 통해 구성
            RequestEntity<U> requestEntity =
                    RequestEntity.method(method, this.generateMMUri(path, queryParameters))
                            .contentType(MediaType.APPLICATION_JSON)
                            .body(body);

            // API 호출을 수행하고, 응답 결과 수신
            response = this.restTemplate.exchange(requestEntity, responseType);
        } catch (HttpStatusCodeException exception) {
            // API 호출 실패 처리 (HTTP Status Code 4XX,5XX)
            response = new ResponseEntity<>(exception.getStatusCode());
        }

        return response;
    }

    /**
     * BASE_URL, API 경로, 요청 파라미터, API 버전, OPEN API KEY를 이용하여 호출가능한 전체 API URI 생성
     * PROD 기준으로, 게시물 ID "6ypqqcjjd3npfrpw4p878m59uh" 를 조회하는 GET 요청 구성 예시
     * EX) BASE_URL : "https://project.ssafy.com/ssafy/open-api"
     * API 버전 : "/v4"
     * API 종류 : "/mm"
     * API 경로 : "/posts/6ypqqcjjd3npfrpw4p878m59uh"
     * API 인증 정보 : "?apiKey=ABCDEFGHIJKLMN"
     * -> 전체 API URI : https://project.ssafy.com/ssafy/open-api/v4/mm/posts/6ypqqcjjd3npfrpw4p878m59uh?apiKey=ABCDEFGHIJKLMN
     *
     * @param path            API 경로 (EndPoint)
     * @param queryParameters 요청 파라미터 (API 별 상이)
     * @return 전체 API URI
     */
    private URI generateMMUri(String path, MultiValueMap<String, String> queryParameters) {
        // URI를 생성하기 위한 UriComponentsBuilder를 구성
        UriComponentsBuilder mmUriCompBuilder =
                UriComponentsBuilder.fromUriString(openApiUrl) // URI의 시작은 BASE_URL
                        .pathSegment(VERSION) // API 버전
                        .pathSegment("mm") // API 종류 (Mattermost Util에서만 사용하기 때문에 mm로 고정)
                        .pathSegment(path) // API 경로 (EndPoint)
                        .queryParam("apiKey", openApiKey); // API 인증 정보 (OPEN_API_KEY)

        if (queryParameters != null) {
            mmUriCompBuilder.queryParams(queryParameters); // 요청 파라미터
        }

        // UriComponentsBuilder로 부터 URI를 추출
        return mmUriCompBuilder.build().toUri();
    }
}
