package com.dearme.backend.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;
import java.net.URISyntaxException;

/**
 * Bridges Render/Neon's single {@code DATABASE_URL} env var into a Spring
 * {@link DataSource}, without hand-facing individual {@code spring.datasource.*}
 * keys on the hosting platform.
 *
 * <p>Render injects the Postgres connection as one string, e.g.
 * {@code postgres://user:pass@host.neon.tech/dbname?sslmode=require}. Spring Boot
 * needs {@code spring.datasource.url} in JDBC form plus a driver. This config
 * translates the {@code postgres://} URL into {@code jdbc:postgresql://} <em>only</em>
 * when {@code DATABASE_URL} is set (the deployed environment). Locally there is no
 * {@code DATABASE_URL}, the bean is not registered, and Spring Boot auto-configures
 * the MySQL/JPA connection from {@code application.properties} as before.</p>
 *
 * <p>The {@code @Primary} {@link DataSource} suppresses Boot's auto-configured
 * datasource while deployed (Boot backs off when a bean exists), leaving
 * {@code spring.jpa.hibernate.ddl-auto=update} intact. Hibernate 6 auto-detects
 * the Postgres dialect from the JDBC connection.</p>
 */
@Configuration
public class DatabaseUrlConfig {

    @Bean
    @Primary
    @ConditionalOnProperty(name = "DATABASE_URL")
    public DataSource dataSource() throws URISyntaxException {
        String databaseUrl = System.getenv("DATABASE_URL");
        URI uri = new URI(databaseUrl);

        String userInfo = uri.getUserInfo();
        String username = null;
        String password = null;
        if (userInfo != null) {
            int idx = userInfo.indexOf(':');
            if (idx >= 0) {
                username = userInfo.substring(0, idx);
                password = userInfo.substring(idx + 1);
            } else {
                username = userInfo;
            }
        }

        StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://");
        jdbcUrl.append(uri.getHost());
        if (uri.getPort() > 0) {
            jdbcUrl.append(':').append(uri.getPort());
        }
        jdbcUrl.append(uri.getPath());
        if (uri.getQuery() != null) {
            jdbcUrl.append('?').append(uri.getQuery());
        }

        return DataSourceBuilder.create()
                .driverClassName("org.postgresql.Driver")
                .url(jdbcUrl.toString())
                .username(username)
                .password(password)
                .build();
    }

}