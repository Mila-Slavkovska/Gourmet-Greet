package com.sorsix.backend.repository

import com.sorsix.backend.domain.model.OpenAIResponse
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface OpenAIRepository: JpaRepository<OpenAIResponse, Long> {
}