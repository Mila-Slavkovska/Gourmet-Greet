package com.sorsix.backend.repository

import com.sorsix.backend.domain.enum.CategoryType
import com.sorsix.backend.domain.model.Category
import org.springframework.data.jpa.repository.JpaRepository

interface CategoryRepository : JpaRepository<Category, Long> {
    fun findAllByCategoryType(categoryType: CategoryType): List<Category>
}