package com.sorsix.backend.service

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

    fun suggestRecipes(ingredients: String): String {
        val prompt = "For the given list of ingredients i have at home suggest recipes i can make at the moment. " +
                "Answer only with a list of recipe names separated by commas, don't add any additional information. " +
                "In the first line answer give recipes that contain only the provided ingredients and in the second " +
                "line give recipe names that contain the provided ingredients and other ingredients as well."

        return processDescription(prompt, ingredients)
    }
}