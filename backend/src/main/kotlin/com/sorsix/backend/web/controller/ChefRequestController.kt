package com.sorsix.backend.web.controller

import com.sorsix.backend.domain.dto.ChefRequestDto
import com.sorsix.backend.domain.enum.RequestStatus
import com.sorsix.backend.service.ChefRequestService
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/chef-requests")
class ChefRequestController(
    private val chefRequestService: ChefRequestService
) {
    @GetMapping
    fun getRequestsByStatus(@RequestParam status: RequestStatus): List<ChefRequestDto> {
        return chefRequestService.getRequestsByStatus(status)
    }

    @PostMapping
    fun createRequest(@RequestParam requestMessage: String): ResponseEntity<Any> {
        val savedRequest = chefRequestService.createRequest(requestMessage)
        return savedRequest?.let { ResponseEntity.ok(it.toDto()) } ?: ResponseEntity.badRequest().build()
    }

    @PostMapping("/approve/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun approveRequest(@PathVariable id: Long): ResponseEntity<ChefRequestDto> =
        chefRequestService.approveRequest(id)?.let { ResponseEntity.ok(it.toDto()) }
            ?: ResponseEntity.notFound().build()

    @PostMapping("/reject/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun rejectRequest(@PathVariable id: Long): ResponseEntity<ChefRequestDto> =
        chefRequestService.rejectRequest(id)?.let { ResponseEntity.ok(it.toDto()) }
            ?: ResponseEntity.notFound().build()
}
