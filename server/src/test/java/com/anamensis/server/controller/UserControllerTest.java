package com.anamensis.server.controller;

import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.util.MultiValueMap;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("local")
class UserControllerTest {

    private Logger log = org.slf4j.LoggerFactory.getLogger(UserControllerTest.class);


    @LocalServerPort
    private int port;


    private WebTestClient webTestClient;


    @BeforeEach
    void setUp() {
        webTestClient = WebTestClient.bindToServer().baseUrl("http://localhost:" + port).build();
    }


    @Test
    void login() {

        MultiValueMap<String, String> formData = new org.springframework.util.LinkedMultiValueMap<>();
        formData.add("username", "admin");
        formData.add("password", "admin");

        EntityExchangeResult<String> result =
        webTestClient.post()
                .uri("/login")
                .bodyValue(formData)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult();


        log.info(result.getResponseBody());
//                .value(token -> assertTrue(token.startsWith("Bearer ")));
    }

//    @Test
//    void test() {
//        EntityExchangeResult<String> result =
//        webTestClient.get()
//                .uri("/test")
//                .header("Authorization","Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTcxMTI3NDUwMn0.njdXymw5_ObMIdoXX8berWpPPANfJtXeb9_ExcOjeMwEnNV0t_bUGAhrdLfHoujoutH7xxBXoBH7O6_oRAPxNQ")
//                .exchange()
//                .expectStatus().isOk()
//                .expectBody(String.class)
//                .returnResult();
//
//        log.info(result.getResponseBody());
//    }

    @Test
    void signup(){
//        MultiValueMap<String, String> formData = new org.springframework.util.LinkedMultiValueMap<>();
//        formData.add("userId", "admin2");
//        formData.add("pwd", "admin");
//        formData.add("name", "admin11");
//        formData.add("email", "test1332@test.com");
//        formData.add("phone", "010-2334-5678");

        UserRequest.Register register = new UserRequest.Register();
        register.setUserId("admin2");
        register.setPwd("admin");
        register.setName("admin11");
        register.setEmail("test12332@test.com");
        register.setPhone("010-2334-5678");


        EntityExchangeResult<UserResponse.Status> result =
        webTestClient.post()
                .uri("/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(register)
                .exchange()
                .expectStatus().isOk()
                .expectBody(UserResponse.Status.class)
                .returnResult();

        log.info(result.getResponseBody().toString());
    }

}