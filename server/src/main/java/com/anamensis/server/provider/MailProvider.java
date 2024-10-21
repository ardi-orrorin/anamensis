package com.anamensis.server.provider;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.angus.mail.util.MailConnectException;
import org.json.JSONObject;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Properties;

@Slf4j
@Component
@RequiredArgsConstructor
public class MailProvider {

    private final JavaMailSender mailSender;

    private final ConfigurableApplicationContext context;

    public Mono<Boolean> testConnection(JSONObject value) {
        JavaMailSenderImpl mailSenderImpl = new JavaMailSenderImpl();

        setJavaMailSender(mailSenderImpl, value);

        try {
            mailSenderImpl.testConnection();
            return Mono.just(true);
        } catch (MessagingException e) {
            return Mono.error(e);
        }
    }

    public Mono<Boolean> updateConnection(JSONObject value) {
        if(!value.getBoolean("enabled")) return Mono.just(true);

        JavaMailSenderImpl mailSenderImpl = (JavaMailSenderImpl) mailSender;

        setJavaMailSender(mailSenderImpl, value);

        return Mono.just(true);
    }

    private void setJavaMailSender(JavaMailSenderImpl mailSenderImpl, JSONObject value) {
        mailSenderImpl.setProtocol("smtp");

        mailSenderImpl.setHost(value.get("host").toString());
        mailSenderImpl.setPort(Integer.parseInt(value.get("port").toString()));
        mailSenderImpl.setUsername(value.get("username").toString());
        mailSenderImpl.setPassword(value.get("password").toString());

        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.ssl.trust", "*");
        mailSenderImpl.setJavaMailProperties(properties);

    }

    public Mono<Boolean> sendMessage(MailMessage message) {
        MimeMailMessage mimeMailMessage = new MimeMailMessage(mailSender.createMimeMessage());
        mimeMailMessage.setTo(message.to);
        mimeMailMessage.setSubject(message.subject);
        mimeMailMessage.setText(message.text);

        mailSender.send(mimeMailMessage.getMimeMessage());
        return Mono.just(true);
    }

    public record MailMessage(
        String to,
        String subject,
        String text
    ) {}

}
