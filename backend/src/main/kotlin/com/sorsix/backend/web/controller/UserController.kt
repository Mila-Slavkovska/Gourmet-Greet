package com.sorsix.backend.web.controller

import com.sorsix.backend.domain.dto.UserAddDto
import com.sorsix.backend.domain.dto.UserDto
import com.sorsix.backend.domain.dto.UserEditDto
import com.sorsix.backend.domain.model.User
import com.sorsix.backend.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@CrossOrigin
@RestController
@RequestMapping("/api/users")
class UserController(
    private val _userService: UserService
) {
    @GetMapping
    fun getUsers(): List<UserDto> = _userService.getAllUsers().map { it.toDto() }

    @GetMapping("/{id}")
    fun getRecipeById(@PathVariable("id") id: Long): ResponseEntity<UserDto> =
        _userService.getUserById(id)?.let {
            ResponseEntity.ok(it.toDto())
        } ?: ResponseEntity.notFound().build()

    @PostMapping
    fun createUser(@RequestBody userDto: UserAddDto): ResponseEntity<UserDto> =
        _userService.createUser(userDto).let { ResponseEntity.ok(it.toDto()) }

    @PutMapping("/{id}")
    fun editUser(@RequestBody userDto: UserEditDto, @PathVariable id: Long): ResponseEntity<Any> =
        _userService.editUser(id, userDto)?.let { ResponseEntity.ok(it.toDto()) }
            ?: ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "Failed to edit user"))

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: Long): ResponseEntity<User> {
        _userService.deleteUserById(id)
        return ResponseEntity.noContent().build()
    }
}
