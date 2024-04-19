package com.anamensis.server.provider;

import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.model.*;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AwsSesMailProvider {

    private final AmazonSimpleEmailService amazonSimpleEmailService;

    @Value("${aws.ses.from}")
    private String from;

    public void verifyEmail(String code, String to) throws MessagingException {
        sendEmail("Verify your email", "Your verification code is: " + code, to, from);
    }

    public void sendEmail(String subject, String content, String to, String from) throws MessagingException {
        amazonSimpleEmailService.sendEmail(createSendMail(subject, content, to, from));
    }

    private SendEmailRequest createSendMail(String subject, String content, String to, String from) throws MessagingException {

        return new SendEmailRequest()
            .withDestination(new Destination().withToAddresses(to))
            .withMessage(new Message()
                .withBody(new Body()
                    .withHtml(new Content().withCharset("UTF-8").withData(content)))
                .withSubject(new Content().withCharset("UTF-8").withData(subject))
            )
            .withSource(from);

    }

}
