package com.anamensis.server.provider;

import io.awspring.cloud.ses.SimpleEmailServiceJavaMailSender;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import software.amazon.awssdk.services.ses.SesClient;

@Component
@RequiredArgsConstructor
public class AwsSesMailProvider {

    private final SesClient sesClient;

    @Value("${aws.ses.from}")
    private String from;

    public void verifyEmail(String code, String to) throws MessagingException {
        sendEmail("Verify your email", "Your verification code is: " + code, to, from);
    }

    public void sendEmail(String subject, String content, String to, String from) throws MessagingException {
        SimpleEmailServiceJavaMailSender mailSender = new SimpleEmailServiceJavaMailSender(sesClient);

        MimeMessage mimeMessage = mailSender.createMimeMessage();

        mimeMessage.setSender(new InternetAddress(to));
        mimeMessage.setRecipient(MimeMessage.RecipientType.TO, new InternetAddress(to));
        mimeMessage.setFrom(from);
        mimeMessage.setSubject(subject);
        mimeMessage.setContent(content, "text/html; charset=UTF-8");

        mailSender.send(mimeMessage);
    }
}
