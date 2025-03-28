package com.ssaenggojip.common.service;

import com.ssaenggojip.apiPayload.code.status.ErrorStatus;
import com.ssaenggojip.apiPayload.exception.GeneralException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class MailService {

    private final JavaMailSender emailSender;

    public void sendEmail(String toEmail, String title, String text) {
        MimeMessage mimeMessage = createMimeMessage(toEmail, title, text);

        try {
            emailSender.send(mimeMessage);
        } catch (RuntimeException e) {
            throw new GeneralException(ErrorStatus.UNABLE_TO_SEND_EMAIL);
        }
    }

    private MimeMessage createMimeMessage(String toEmail, String title, String text) {
        MimeMessage mimeMessage = emailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setTo(toEmail);
            helper.setSubject(title);
            helper.setText(text, true);
        } catch (MessagingException e) {
            throw new GeneralException(ErrorStatus.UNABLE_TO_SEND_EMAIL);
        }

        return mimeMessage;
    }

}
