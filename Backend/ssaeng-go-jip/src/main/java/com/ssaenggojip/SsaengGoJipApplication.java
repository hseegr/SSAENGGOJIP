package com.ssaenggojip;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SsaengGoJipApplication {

    public static void main(String[] args) {
        SpringApplication.run(SsaengGoJipApplication.class, args);
    }

}
