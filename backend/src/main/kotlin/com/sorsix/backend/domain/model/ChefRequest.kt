package com.sorsix.backend.domain.model

import com.sorsix.backend.domain.dto.ChefRequestDto
import com.sorsix.backend.domain.dto.ReviewDto
import com.sorsix.backend.domain.enum.RequestStatus
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
data class ChefRequest(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    val timestamp: LocalDateTime = LocalDateTime.now(),

    @Enumerated(EnumType.STRING)
    val status: RequestStatus = RequestStatus.PENDING,

    val message: String
) {
    fun toDto(): ChefRequestDto {
        return ChefRequestDto(
            id = this.id,
            userEmail = user.email,
            timeStamp = timestamp.toString(),
            status = status.name,
            message = message
        )
    }
}
