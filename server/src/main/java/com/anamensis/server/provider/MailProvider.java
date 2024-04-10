package com.anamensis.server.provider;

import com.anamensis.server.entity.UserConfigSmtp;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMailMessage;

import java.util.Properties;

public class MailProvider {

    JavaMailSenderImpl mailSenderImpl;
    MimeMailMessage mimeMailMessage;

    public MailProvider() {
        this.mailSenderImpl = new JavaMailSenderImpl();
        this.mimeMailMessage = new MimeMailMessage(mailSenderImpl.createMimeMessage());
    }

    public void setConfig(UserConfigSmtp userConfigSmtp) {
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
    }

    public void setMessage(UserConfigSmtp userConfigSmtp, String subject, String content) {
        this.mimeMailMessage.setTo(userConfigSmtp.getFromEmail());
        this.mimeMailMessage.setFrom(userConfigSmtp.getFromEmail());
        this.mimeMailMessage.setSubject(subject);
        this.mimeMailMessage.setText(content);
    }

    private MailProvider(Builder builder) {
        this.mailSenderImpl = builder.mailSenderImpl;
        this.mimeMailMessage = builder.mimeMailMessage;
    }

    public static class Builder {
        JavaMailSenderImpl mailSenderImpl = new JavaMailSenderImpl();
        MimeMailMessage mimeMailMessage = new MimeMailMessage(mailSenderImpl.createMimeMessage());

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

        public Builder message(UserConfigSmtp userConfigSmtp, String subject, String content) {
            this.mimeMailMessage.setTo(userConfigSmtp.getFromEmail());
            this.mimeMailMessage.setFrom(userConfigSmtp.getFromEmail());
            this.mimeMailMessage.setSubject(subject);
            this.mimeMailMessage.setText(content);
            return this;
        }

        public MailProvider build() {
            return new MailProvider(this);
        }
    }

    public void send() {
        this.mailSenderImpl.send(mimeMailMessage.getMimeMessage());
    }

}
