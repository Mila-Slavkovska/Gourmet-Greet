package com.sorsix.backend.service

import com.sorsix.backend.domain.dto.UserAddDto
import com.sorsix.backend.domain.dto.UserEditDto
import com.sorsix.backend.domain.enum.UserRole
import com.sorsix.backend.domain.model.User
import com.sorsix.backend.repository.RecipeRepository
import com.sorsix.backend.repository.UserRepository
import jakarta.transaction.Transactional
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.security.core.Authentication
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UsernameNotFoundException

//TODO: only admin users should have permission
@Service
class UserService(
    private val _userRepository: UserRepository,
    private val _recipeRepository: RecipeRepository
) {
    fun getAllUsers(): List<User> = _userRepository.findAll()

    fun getUserById(id: Long): User? = _userRepository.findByIdOrNull(id)

    fun getUserByEmail(email: String): User? = _userRepository.findByEmail(email)

    fun createUser(userDTO: UserAddDto): User {
        // TODO: validations
        val user = User(
            firstName = userDTO.firstName,
            lastName = userDTO.lastName,
            email = userDTO.email,
            userPassword = userDTO.password,
            phoneNumber = userDTO.phoneNumber,
            role = UserRole.valueOf(userDTO.userRole)
        )

        return _userRepository.save(user)
    }

    fun editUser(id: Long, userDTO: UserEditDto) =
        // TODO: validations
        getUserById(id)?.let {
            val currentUser = it.copy(
                firstName = userDTO.firstName,
                lastName = userDTO.lastName,
                phoneNumber = userDTO.phoneNumber,
                role = UserRole.valueOf(userDTO.userRole)
            )
            _userRepository.save(currentUser)
        }

    @Transactional
    fun deleteUserById(id: Long): User? {
        val user = _userRepository.findById(id).orElse(null) ?: return null

        user.ownedRecipes.forEach { it.owner = null }
        _recipeRepository.saveAll(user.ownedRecipes)

        _userRepository.delete(user)

        return user
    }

    @Transactional
    fun getUserFromAuthentication(authentication: Authentication): User {
        val userDetails: UserDetails = authentication.principal as UserDetails
        return _userRepository.findByEmail(userDetails.username)
            ?: throw UsernameNotFoundException("User not found")
    }
}

