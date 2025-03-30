package com.sorsix.backend.domain.model

import com.fasterxml.jackson.annotation.JsonIgnore
import com.sorsix.backend.domain.dto.UserDto
import com.sorsix.backend.domain.enum.UserRole
import jakarta.persistence.*

@Entity
@Table(name = "recipe_users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(unique = true, nullable = false)
    val email: String,

    @Column(nullable = false)
    val password: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: UserRole = UserRole.USER,

    @Column(nullable = false)
    val firstName: String,

    @Column(nullable = false)
    val lastName: String,

    @Column(nullable = false, unique = true)
    val phoneNumber: String,

    @ManyToMany(cascade = [CascadeType.MERGE, CascadeType.PERSIST])
    @JoinTable(
        name = "user_favourite_recipes",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "recipe_id")]
    )
    @JsonIgnore
    val favouriteRecipes: Set<Recipe> = emptySet(),

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "owner", cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    @JsonIgnore
    var ownedRecipes: MutableList<Recipe> = mutableListOf(),
) {

    fun getFullName() = "$firstName $lastName"

    fun toDto(): UserDto {
        return UserDto(
            id = this.id,
            firstName = this.firstName,
            lastName = this.lastName,
            email = this.email,
            phoneNumber = this.phoneNumber,
            favorites = this.favouriteRecipes.map { it.toDto() }.toSet(),
            userRole = this.role.toString(),
            ownedRecipes = this.ownedRecipes.map { it.toDto() }
        )
    }

}
