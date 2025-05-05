package com.sorsix.backend.domain.model

import com.fasterxml.jackson.annotation.JsonIgnore
import com.sorsix.backend.domain.dto.UserDto
import com.sorsix.backend.domain.dto.UserSimpleDto
import com.sorsix.backend.domain.enum.UserRole
import jakarta.persistence.*
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

@Entity
@Table(name = "recipe_users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(unique = true, nullable = false)
    val email: String,

    @Column(nullable = false)
    val userPassword: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val role: UserRole = UserRole.USER,

    @Column(nullable = false)
    val firstName: String,

    @Column(nullable = false)
    val lastName: String,

    @Column(nullable = false, unique = true)
    val phoneNumber: String,

    @ManyToMany(cascade = [CascadeType.MERGE, CascadeType.PERSIST], fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_favourite_recipes",
        joinColumns = [JoinColumn(name = "user_id")],
        inverseJoinColumns = [JoinColumn(name = "recipe_id")]
    )
    @JsonIgnore
    val favouriteRecipes: MutableSet<Recipe> = mutableSetOf(),

    @OneToMany(fetch = FetchType.EAGER, mappedBy = "owner", cascade = [CascadeType.PERSIST, CascadeType.MERGE])
    @JsonIgnore
    var ownedRecipes: MutableList<Recipe> = mutableListOf(),
) : UserDetails {

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

    fun toSimpleDto(): UserSimpleDto {
        return UserSimpleDto(
            id = this.id,
            firstName = this.firstName,
            lastName = this.lastName,
            email = this.email,
            phoneNumber = this.phoneNumber,
            role = this.role.name,
            favoriteRecipes = favouriteRecipes.map { it.id },
            ownedRecipes = ownedRecipes.map { it.id }

        )
    }

    override fun getAuthorities(): Collection<GrantedAuthority> {
        return listOf(SimpleGrantedAuthority("ROLE_${role.name}"))
    }

    override fun getPassword(): String {
        return userPassword
    }

    override fun getUsername(): String {
        return email
    }

    override fun isAccountNonExpired(): Boolean = true

    override fun isAccountNonLocked(): Boolean = true

    override fun isCredentialsNonExpired(): Boolean = true

    override fun isEnabled(): Boolean = true

    override fun toString(): String {
        return "User(id=$id, email='$email', firstName='$firstName', lastName='$lastName', phoneNumber='$phoneNumber', role=$role)"
    }
}
