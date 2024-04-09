package com.anamensis.server.controller;

import com.anamensis.server.dto.request.UserRequest;
import com.anamensis.server.dto.response.UserResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.reactive.server.EntityExchangeResult;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.util.MultiValueMap;


@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("local")
class UserControllerTest {

    private Logger log = org.slf4j.LoggerFactory.getLogger(UserControllerTest.class);


    @LocalServerPort
    private int port;


    private WebTestClient webTestClient;

    String token;


    @BeforeEach
    @Order(1)
    void setUp() {
        webTestClient = WebTestClient.bindToServer().baseUrl("http://localhost:" + port + "/user").build();
    }

    @BeforeEach
    @Order(2)
    void setupLogin() {
//        MultiValueMap<String, String> formData = new org.springframework.util.LinkedMultiValueMap<>();
//        formData.add("username", "admin");
//        formData.add("password", "admin");

        UserRequest.Login login = new UserRequest.Login();
        login.setUsername("admin");
        login.setPassword("admin");

        EntityExchangeResult<UserResponse.Login> result =
                webTestClient.post()
                        .uri("/login")
                        .headers(httpHeaders -> {
                            httpHeaders.set("Device", "chrome");
                            httpHeaders.set("Location", "seoul");
                        })
                        .contentType(MediaType.APPLICATION_JSON)
                        .bodyValue(login)
                        .exchange()
                        .expectStatus().isOk()
                        .expectBody(UserResponse.Login.class)
                        .returnResult();
        token = result.getResponseBody().getToken();
    }


    @Test
    void login() {

//        MultiValueMap<String, String> formData = new org.springframework.util.LinkedMultiValueMap<>();
//        formData.add("username", "admin");
//        formData.add("password", "admin");

        UserRequest.Login login = new UserRequest.Login();
        login.setUsername("admin");
        login.setPassword("admin");

        EntityExchangeResult<String> result =
        webTestClient.post()
                .uri("/login")
                .contentType(MediaType.APPLICATION_JSON)
                .headers(httpHeaders -> {
                    httpHeaders.set("Device", "chrome");
                    httpHeaders.set("Location", "seoul");
                })
                .bodyValue(login)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult();


        log.info(result.toString());
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

//        log.info(result.toString());

        log.info(result.getResponseBody().toString());
    }

    @Test
    void list() {
        EntityExchangeResult result =
        webTestClient.get()
                .uri(uriBuilder -> {
                    uriBuilder.path("/histories");
                    uriBuilder.queryParam("page", 1);
                    uriBuilder.queryParam("size", 10);
                    return uriBuilder.build();
                })
                .header("Authorization","Bearer " + token)
                .exchange()
                .expectStatus().isOk()
                .expectBody(String.class)
                .returnResult();

        log.info("result : {} ", result.getResponseBody());
    }
}