package com.anamensis.server.provider;

import com.anamensis.server.entity.UserConfigSmtp;
import jakarta.mail.MessagingException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMailMessage;

import java.util.Properties;

//@SpringBootTest
public class MailProviderTest {

    JavaMailSenderImpl mailSenderImpl = new JavaMailSenderImpl();
    MimeMailMessage mimeMailMessage = new MimeMailMessage(mailSenderImpl.createMimeMessage());

    UserConfigSmtp userConfig = new UserConfigSmtp();

    @BeforeEach
    void setUp() {
        userConfig.setHost("smtp.gmail.com");
        userConfig.setPort("587");
        userConfig.setUsername("");
        userConfig.setPassword("");
        userConfig.setFromEmail("");
        userConfig.setUseSSL(true);
    }

    @Test
    void builderTest() {
        new MailProvider.Builder()
                .config(userConfig)
                .message(userConfig, "Test", "Hello World")
                .build()
                .send();
    }


    void config(UserConfigSmtp userConfigSmtp) {
        mailSenderImpl.setHost(userConfigSmtp.getHost());
        mailSenderImpl.setPort(Integer.parseInt(userConfigSmtp.getPort()));
        mailSenderImpl.setUsername(userConfigSmtp.getUsername());
        mailSenderImpl.setPassword(userConfigSmtp.getPassword());
        mailSenderImpl.setProtocol("smtp");

        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");

        if(userConfigSmtp.getUseSSL()) {
            properties.put("mail.smtp.ssl.trust", "*");
        }
        mailSenderImpl.setJavaMailProperties(properties);
    }

    void message(UserConfigSmtp userConfigSmtp, String subject, String content) {
        mimeMailMessage.setTo(userConfigSmtp.getFromEmail());
        mimeMailMessage.setFrom(userConfigSmtp.getFromEmail());
        mimeMailMessage.setSubject(subject);
        mimeMailMessage.setText(content);
    }

    void send() {
        mailSenderImpl.send(mimeMailMessage.getMimeMessage());
    }

    @Test
    void sendmailBuilderTest(){
        config(userConfig);
        message(userConfig, "Test", "Hello World");
        send();
    }

    @Test
    void testSendMail() throws MessagingException {

        JavaMailSenderImpl mailSenderImpl = new JavaMailSenderImpl();
//        mailSenderImpl.setHost("");
//        mailSenderImpl.setPort();
//        mailSenderImpl.setUsername("");
//        mailSenderImpl.setPassword("");

        mailSenderImpl.setHost("smtp.naver.com");
        mailSenderImpl.setPort(587);
        mailSenderImpl.setUsername("");
        mailSenderImpl.setPassword("");
        mailSenderImpl.setProtocol("smtp");

        mailSenderImpl.testConnection();


        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.ssl.trust", "*");
        mailSenderImpl.setJavaMailProperties(properties);


        MimeMailMessage mimeMailMessage = new MimeMailMessage(mailSenderImpl.createMimeMessage());
        mimeMailMessage.setTo("");
        mimeMailMessage.setFrom("");
        mimeMailMessage.setSubject("Test");
        mimeMailMessage.setText("Hello World");

        mailSenderImpl.send(mimeMailMessage.getMimeMessage());
    }
}
