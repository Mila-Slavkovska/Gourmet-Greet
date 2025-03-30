package com.sorsix.backend.domain.model

import jakarta.persistence.*

@Entity
data class Image(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @Lob
    @Column(name = "image", nullable = false)
    val image: ByteArray,
)