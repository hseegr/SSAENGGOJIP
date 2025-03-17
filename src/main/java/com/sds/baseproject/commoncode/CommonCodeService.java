package com.sds.baseproject.commoncode;

import com.sds.baseproject.commoncode.payload.CommonCodeSummary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.type.filter.AssignableTypeFilter;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * baseproject에서 사용되는 interface CommonCode 을 구현한 enum을 찾아 이를 list로 이용할 수 있도록 만들어주는 서비스.
 */

@Service
@RequiredArgsConstructor
public class CommonCodeService implements ApplicationListener<ContextRefreshedEvent> {
    private final ApplicationContext applicationContext;

    private Map<String, List<CommonCodeSummary>> commonCodeMap = new HashMap<>();


    public void put(Class<CommonCode> code) {
        String key = code.getSimpleName().toUpperCase();
        if (commonCodeMap.containsKey(key)) {
            throw new DuplicateKeyException("Common Codes are has same key : " + key);
        }

        CommonCode[] enumConstants = code.getEnumConstants();
        List<CommonCodeSummary> list = Arrays.stream(enumConstants).map(CommonCodeSummary::new).collect(Collectors.toList());
        this.commonCodeMap.put(key, list);
    }

    public List<CommonCodeSummary> get(String key) {
        return commonCodeMap.get(key.toUpperCase());
    }

    public Map<String, List<CommonCodeSummary>> get(String[] keys) {
        HashMap<String, List<CommonCodeSummary>> map = new HashMap<>();
        for (String key : keys) {
            String upperCasedKey = key.toUpperCase();
            map.put(upperCasedKey, commonCodeMap.getOrDefault(upperCasedKey, new ArrayList<>()));
        }
        return map;
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        ClassPathScanningCandidateComponentProvider provider =
                new ClassPathScanningCandidateComponentProvider(false);
        provider.addIncludeFilter(new AssignableTypeFilter(CommonCode.class));

        try {
            Set<BeanDefinition> beanDefs = provider.findCandidateComponents(this.getBasePackage());
            for (BeanDefinition beanDefinition : beanDefs) {
                Class<?> aClass = Class.forName(beanDefinition.getBeanClassName());
                if (CommonCode.class.isAssignableFrom(aClass)) {
                    this.put((Class<CommonCode>) aClass);
                }
            }
        } catch (ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    private String getBasePackage() throws ClassNotFoundException {
        String[] beanNames = applicationContext.getBeanNamesForAnnotation(SpringBootApplication.class);
        if (beanNames.length == 0) {
            throw new ClassNotFoundException("Fail to find the class which has @SpringBootApplication");
        }
        return applicationContext.getBean(beanNames[0]).getClass().getPackageName();
    }
}
