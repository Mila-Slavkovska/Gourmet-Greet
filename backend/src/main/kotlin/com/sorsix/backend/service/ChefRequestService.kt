package com.sorsix.backend.service

import com.sorsix.backend.domain.dto.ChefRequestDto
import com.sorsix.backend.domain.enum.RequestStatus
import com.sorsix.backend.domain.enum.UserRole
import com.sorsix.backend.domain.model.ChefRequest
import com.sorsix.backend.repository.ChefRequestRepository
import jakarta.persistence.EntityNotFoundException
import org.springframework.data.repository.findByIdOrNull
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
class ChefRequestService(
    private val chefRequestRepository: ChefRequestRepository,
    private val userService: UserService,
    private val emailService: EmailService
) {
    fun getRequestById(id: Long): ChefRequest? = chefRequestRepository.findByIdOrNull(id)

    fun getRequestsByStatus(status: RequestStatus): List<ChefRequestDto> {
        return chefRequestRepository.findAllByStatus(status).map { it.toDto() }
    }

    fun createRequest(requestMessage: String): ChefRequest? {
        val user = userService.getUserFromAuthentication(SecurityContextHolder.getContext().authentication)
        val createdChefRequest = ChefRequest(
            user = user,
            message = requestMessage,
        )
        return chefRequestRepository.save(createdChefRequest)
    }

    fun approveRequest(id: Long): ChefRequest? {
        val request = getRequestById(id) ?: throw EntityNotFoundException("ChefRequest with id $id not found")
        val updatedRequest  = request.copy(status = RequestStatus.APPROVED)
        chefRequestRepository.save(updatedRequest)
        emailService.sendApprovalEmail(request.user.email)
        userService.changeUserRole(request.user.id, UserRole.CHEF)
        return updatedRequest
    }

    fun rejectRequest(id: Long): ChefRequest? {
        val request = getRequestById(id) ?: throw EntityNotFoundException("ChefRequest with id $id not found")
        val updatedRequest  = request.copy(status = RequestStatus.REJECTED)
        return chefRequestRepository.save(updatedRequest)
    }

    fun userHasPendingRequest(): Boolean {
        val user = userService.getUserFromAuthentication(SecurityContextHolder.getContext().authentication)
        return chefRequestRepository.existsByUserEmailAndStatus(user.email, RequestStatus.PENDING)
    }

}