package com.anamensis.server.provider;

import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("local")
class AwsSesMailProviderTest {

    @SpyBean
    private AwsSesMailProvider awsSesMailProvider;

    @Test
    void sendEmail() throws MessagingException {

        awsSesMailProvider.sendEmail("테스트 메일", "aws ses 테스트 매일",  "","");


    }
}