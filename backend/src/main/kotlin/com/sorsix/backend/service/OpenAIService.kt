package com.sorsix.backend.service

import com.sorsix.backend.domain.dto.RecipeAddDto
import com.sorsix.backend.domain.model.CalorieEstimationAIRequest
import com.sorsix.backend.domain.model.IngredientsRecipeAiRequest
import com.sorsix.backend.repository.OpenAIRepository
import org.json.JSONArray
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class OpenAIService(
    private val restTemplate: RestTemplate,
    private val openAIRepository: OpenAIRepository,
    @Value("\${openai.api.key}")
    private val apiKey: String
) {
    private val apiUrl = "https://api.openai.com/v1/chat/completions"

    fun processDescription(instructions: String, description: String): String {
        val headers = HttpHeaders()
        headers.contentType = MediaType.APPLICATION_JSON
        headers.setBearerAuth(apiKey!!)

        val message = JSONObject()
        message.put("role", "user")
        message.put(
            "content",
            "$instructions $description"
        )

        val messages = JSONArray()
        messages.put(message)

        val requestBody = JSONObject()
        requestBody.put("model", "gpt-3.5-turbo")
        requestBody.put("messages", messages)

        val entity = HttpEntity(requestBody.toString(), headers)
        val response = restTemplate.postForObject(apiUrl, entity, String::class.java)
        val jsonResponse = JSONObject(response)

        return jsonResponse.getJSONArray("choices")
            .getJSONObject(0)
            .getJSONObject("message")
            .getString("content")
            .trim { it <= ' ' }
    }

    fun suggestRecipes(ingredientsRecipeAiRequest: IngredientsRecipeAiRequest): String {
        val prompt = "For the given list of ingredients i have at home suggest recipes i can make at the moment. " +
                "Answer only with a  JSON object containing of two lists of recipe names, don't add any additional information. " +
                "The JSON object should look like this:\n" +
                "{\n" +
                "   \"recipesWithIngredients\": [\"Recipe1\", \"Recipe2\", ...],\n" +
                "   \"otherRecipes\": [\"Recipe1\", \"Recipe2\", ...] \n" +
                "}\n" +
                "In the first list of recipes give recipes that contain only the provided ingredients and are of that recipe type and in the " +
                "second list give recipe names that contain the provided ingredients and are of that recipe type and other ingredients as well."

        return processDescription(prompt, ingredientsRecipeAiRequest.toJson())
    }

    fun createAiRecipeJson(ingredientsRecipeAiRequest: IngredientsRecipeAiRequest): RecipeAddDto {
        val aiRecipeString = createAIRecipe(ingredientsRecipeAiRequest)
        val jsonObject = JSONObject(aiRecipeString)
        return RecipeAddDto(
            title = jsonObject.getString("title"),
            description = jsonObject.getString("description"),
            ingredients = jsonObject.getJSONArray("ingredients").let { array ->
                (0 until array.length()).map { array.getString(it) }
            },
            categories = emptyList(),
            steps = jsonObject.getJSONArray("steps").let { array ->
                (0 until array.length()).map { array.getString(it) }
            },
            cookingTime = jsonObject.getInt("cookingTime"),
            servings = jsonObject.getInt("servings"),
            ownerId = 0
        )
    }

    private fun createAIRecipe(ingredientsRecipeAiRequest: IngredientsRecipeAiRequest): String{
        val prompt = "For the given list of ingredients i have at home create or find a recipe containing those ingredients, " +
                "but you can use additional ingredients and of that recipe type that i can make at home. Answer only with a JSON object that " +
                "looks like this:\n" +
                "{\n" +
                "  \"title\": \"...\",\n" +
                "  \"description\": \"...\",\n" +
                "  \"ingredients\": [\"Ingredient1\", \"\", \"ingredient2\", ...],\n" +
                "  \"steps\": [\"Step1\", \"Step2\", ...],\n" +
                "  \"cookingTime\": ...,\n" +
                "  \"servings\": ...\n" +
                "}\n" +
                "The cookingTime is in minutes and give a longer description. In the steps don't add the number of the step, " +
                "just the text of the step. The list of ingredients is given below:"

        return processDescription(prompt, ingredientsRecipeAiRequest.toJson())
    }

    fun estimateCalories(calorieEstimationRequest: CalorieEstimationAIRequest): String {
        val prompt = "For the given list of ingredients and steps and servings for a recipe I need calorie and nutrition estimation per serving. " +
                "Answer only with a json called calorieEstimation with calories,protein,carbs and fat as number fields, don't add any additional information. "

        return processDescription(prompt, calorieEstimationRequest.toJson())
    }
}