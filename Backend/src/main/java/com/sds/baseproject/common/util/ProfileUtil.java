package com.sds.baseproject.common.util;

import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.stereotype.Component;

@Component
public class ProfileUtil {
    private static Environment env;

    private ProfileUtil(Environment environment) {
        setEnv(environment);
    }

    private static void setEnv(Environment env) {
        ProfileUtil.env = env;
    }

    public static boolean hasProfile(String... profiles) {
        if (env == null) {
            return false;
        }
        return env.acceptsProfiles(Profiles.of(profiles));
    }
}
