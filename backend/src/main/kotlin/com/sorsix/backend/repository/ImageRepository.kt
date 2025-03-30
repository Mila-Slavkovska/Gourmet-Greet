package com.sorsix.backend.repository

import com.sorsix.backend.domain.model.Image
import org.springframework.data.jpa.repository.JpaRepository

interface ImageRepository : JpaRepository<Image, Long> {
}