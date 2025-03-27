package com.ssaenggojip.common.config;

import com.pgvector.PGvector;
import jakarta.annotation.PostConstruct;
import org.postgresql.PGConnection;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Component;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;


@Component
public class PGvectorInitializer {
    private final DataSource dataSource;

    public PGvectorInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @PostConstruct
    public void init() {
        try (Connection conn = dataSource.getConnection()) {
            // PGvector 데이터 타입을 등록
            PGvector.registerTypes(conn);
            System.out.println("PGvector type registered successfully!");
        } catch (SQLException e) {
            e.printStackTrace();
            System.err.println("Failed to register PGvector type.");
        }
    }
//    @Bean
//    public Boolean registerPGvectorType(DataSource dataSource) throws SQLException {
//        try (Connection connection = dataSource.getConnection()) {
//            PGvector.addVectorType(connection);
//            PGConnection pgConnection = connection.unwrap(PGConnection.class);
//            PGvector.registerTypes(connection); // PGvector 타입 등록
//        }
//        return true; // 타입 등록이 완료되었으므로 true를 반환
//    }
//
//    @Bean
//    public PlatformTransactionManager transactionManager(DataSource dataSource) {
//        return new DataSourceTransactionManager(dataSource);
//    }
}
