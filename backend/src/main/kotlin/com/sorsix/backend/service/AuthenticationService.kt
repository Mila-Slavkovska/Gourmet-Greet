package com.sorsix.backend.service

import com.sorsix.backend.config.JwtService
import com.sorsix.backend.domain.enum.UserRole
import com.sorsix.backend.domain.model.User
import com.sorsix.backend.repository.UserRepository
import com.sorsix.backend.web.controller.auth.AuthenticationRequest
import com.sorsix.backend.web.controller.auth.AuthenticationResponse
import com.sorsix.backend.web.controller.auth.RegisterRequest
import jakarta.transaction.Transactional
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthenticationService(
    val repository: UserRepository,
    val passwordEncoder: PasswordEncoder,
    val jwtService: JwtService,
    val authenticationManager: AuthenticationManager
) {
    @Transactional
    fun register(request: RegisterRequest): AuthenticationResponse {

        val user = User(
            firstName = request.firstName,
            lastName = request.lastName,
            email = request.email,
            userPassword = passwordEncoder.encode(request.password),
            phoneNumber = request.phoneNumber,
            role = UserRole.USER
        )
        repository.save(user)
        val jwtToken = jwtService.generateToken(user)
        return AuthenticationResponse(token = jwtToken)
    }

    @Transactional
    fun authenticate(request: AuthenticationRequest): AuthenticationResponse {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(request.email, request.password)
        )
        val user = repository.findByEmail(request.email)
            ?: throw IllegalArgumentException("Invalid email")
        val jwtToken = jwtService.generateToken(user)
        return AuthenticationResponse(token = jwtToken)
    }

}