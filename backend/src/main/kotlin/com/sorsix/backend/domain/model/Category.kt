package com.sorsix.backend.domain.model

import com.sorsix.backend.domain.enum.CategoryType
import jakarta.persistence.*

@Entity
data class Category(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(nullable = false, unique = true)
    val name: String,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val categoryType: CategoryType
)
