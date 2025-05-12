package com.sorsix.backend.service

import com.sorsix.backend.utils.generateApprovalEmail
import jakarta.mail.internet.MimeMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service

@Service
class EmailService(private val mailSender: JavaMailSender) {

    fun sendApprovalEmail(userEmail: String) {
        val mimeMessage: MimeMessage = mailSender.createMimeMessage()
        val helper = MimeMessageHelper(mimeMessage, true, "UTF-8")

        helper.setTo(userEmail)
        helper.setSubject("🎉 You're Now a Chef!")

        val htmlContent = generateApprovalEmail()

        helper.setText(htmlContent, true)

        mailSender.send(mimeMessage)
    }
}
