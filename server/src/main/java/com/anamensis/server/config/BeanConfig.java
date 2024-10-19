package com.anamensis.server.config;

import com.anamensis.server.entity.SystemSetting;
import com.anamensis.server.entity.SystemSettingKey;
import com.anamensis.server.mapper.SystemSettingMapper;
import com.warrenstrange.googleauth.GoogleAuthenticator;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.VirtualThreadTaskExecutor;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMailMessage;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import software.amazon.awssdk.services.s3.S3Client;

import java.util.Properties;
import java.util.Random;

@Configuration
@RequiredArgsConstructor

public class BeanConfig {
    private final SystemSettingMapper systemSettingMapper;


    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public Random random() {
        return new Random();
    }

    @Bean
    public GoogleAuthenticator googleAuthenticator() {
        return new GoogleAuthenticator();
    }

    @Bean
    public VirtualThreadTaskExecutor virtualThreadTaskExecutor() {
        return new VirtualThreadTaskExecutor("virtual-thread-");
    }

    @Bean
    public JavaMailSender mailSender() {

        SystemSetting ss = systemSettingMapper.findByKey(SystemSettingKey.SMTP);

        String host = ss.getValue().get("host").toString();

        Properties properties = new Properties();
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.ssl.trust", "*");

        JavaMailSenderImpl mailSenderImpl = new JavaMailSenderImpl();
        mailSenderImpl.setProtocol("smtp");
        mailSenderImpl.setJavaMailProperties(properties);

        if(host == null || host.isEmpty()) {
            return new JavaMailSenderImpl();
        }

        mailSenderImpl.setHost(ss.getValue().get("host").toString());
        mailSenderImpl.setPort(Integer.parseInt(ss.getValue().get("port").toString()));
        mailSenderImpl.setUsername(ss.getValue().get("username").toString());
        mailSenderImpl.setPassword(ss.getValue().get("password").toString());

        return mailSenderImpl;
    }
}
