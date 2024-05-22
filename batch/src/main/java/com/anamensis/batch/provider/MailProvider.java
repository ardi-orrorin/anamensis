package com.anamensis.batch.provider;

import com.anamensis.batch.entity.UserConfigSmtp;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import jakarta.mail.MessagingException;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.Properties;

public class MailProvider {

    JavaMailSenderImpl mailSenderImpl;
    MimeMessageHelper mimeMailMessage;

    public Mono<Void> send() {
        return Mono.fromRunnable(() -> {
            mailSenderImpl.send(mimeMailMessage.getMimeMessage());
        });
    }

    public void testConnection() throws MessagingException {
        mailSenderImpl.testConnection();
    }

    private MailProvider(Builder builder) {
        this.mailSenderImpl = builder.mailSenderImpl;
        this.mimeMailMessage = builder.mimeMailMessage;
    }

    public static class Builder {
        JavaMailSenderImpl mailSenderImpl = new JavaMailSenderImpl();
        MimeMessageHelper mimeMailMessage = new MimeMessageHelper(mailSenderImpl.createMimeMessage());

        public Builder config(UserConfigSmtp userConfigSmtp) {
            this.mailSenderImpl.setHost(userConfigSmtp.getHost());
            this.mailSenderImpl.setPort(Integer.parseInt(userConfigSmtp.getPort()));
            this.mailSenderImpl.setUsername(userConfigSmtp.getUsername());
            this.mailSenderImpl.setPassword(userConfigSmtp.getPassword());
            this.mailSenderImpl.setProtocol("smtp");

            Properties properties = new Properties();
            properties.put("mail.smtp.auth", "true");
            properties.put("mail.smtp.starttls.enable", "true");


            if (userConfigSmtp.getUseSSL()) {
                properties.put("mail.smtp.ssl.trust", "*");
            }

            this.mailSenderImpl.setJavaMailProperties(properties);
            return this;
        }

        public Builder message(UserConfigSmtp userConfigSmtp, String subject, String content, String model) {
            try {
                String body = "";

                if(model != null && !model.isEmpty()){
                    Template template = new Template("mail", content, null);
                    body = FreeMarkerTemplateUtils.processTemplateIntoString(template, model);
                } else {
                    body = content;
                }

                this.mimeMailMessage.setTo(userConfigSmtp.getFromEmail());
                this.mimeMailMessage.setFrom(userConfigSmtp.getFromEmail());
                this.mimeMailMessage.setSubject(subject);
                this.mimeMailMessage.setText(body, true);
            } catch (MessagingException | IOException | TemplateException e) {
                throw new RuntimeException(e);
            }
            return this;
        }

        public MailProvider build() {
            return new MailProvider(this);
        }
    }
}
