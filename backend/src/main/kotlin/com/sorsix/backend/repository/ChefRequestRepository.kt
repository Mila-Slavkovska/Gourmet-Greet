package com.sorsix.backend.repository

import com.sorsix.backend.domain.enum.CategoryType
import com.sorsix.backend.domain.enum.RequestStatus
import com.sorsix.backend.domain.model.ChefRequest
import org.springframework.data.jpa.repository.JpaRepository

interface ChefRequestRepository : JpaRepository<ChefRequest, Long> {
    fun findAllByStatus(type: RequestStatus): List<ChefRequest>
}