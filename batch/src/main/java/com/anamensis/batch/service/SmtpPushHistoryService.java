package com.anamensis.batch.service;

import com.anamensis.batch.entity.SmtpPushHistory;
import com.anamensis.batch.entity.UserConfigSmtp;
import com.anamensis.batch.mapper.SmtpPushHistoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SmtpPushHistoryService {

    private final SmtpPushHistoryMapper smtpPushHistoryMapper;

    public void save(SmtpPushHistory smtpPushHistory) {
        smtpPushHistoryMapper.save(smtpPushHistory);
    }

    public void save(SmtpPushHistory smtpPushHistory, String message, String status) {
        smtpPushHistory.setMessage(message);
        smtpPushHistory.setStatus(status);
        smtpPushHistory.setCreateAt(LocalDateTime.now());
        smtpPushHistoryMapper.save(smtpPushHistory);
    }

    @Transactional
    public void save(UserConfigSmtp userConfigSmtp, String subject, String content, String message, String status) {
        SmtpPushHistory smtpPushHistory = new SmtpPushHistory();
        smtpPushHistory.setUserPk(userConfigSmtp.getUserPk());
        smtpPushHistory.setUserConfigSmtpPk(userConfigSmtp.getId());
        smtpPushHistory.setSubject(subject);
        smtpPushHistory.setContent(content);
        smtpPushHistory.setMessage(message);
        smtpPushHistory.setStatus(status);
        smtpPushHistory.setCreateAt(LocalDateTime.now());
        smtpPushHistoryMapper.save(smtpPushHistory);
    }
}
