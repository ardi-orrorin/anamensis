package com.anamensis.config.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
class SecurityConfig {

    @Value("\${server.access.ip}")
    lateinit var ACCESS_IP: String

    @Value("\${server.access.local-name}")
    lateinit var LOCAL_NAME: String

    @Value("\${server.access.enabled}")
    var ACCESS_ENABLED: Boolean = false


    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        if (!ACCESS_ENABLED) return http.build()

        http.securityMatcher {
            !(it.remoteAddr.equals(ACCESS_IP) && it.localAddr.equals(ACCESS_IP) && it.localName.equals(LOCAL_NAME))
        }

        http.authorizeHttpRequests {
            it.anyRequest().authenticated()
        }

        return http.build()
    }
}