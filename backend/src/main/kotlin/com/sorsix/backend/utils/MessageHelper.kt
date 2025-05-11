package com.sorsix.backend.utils

fun generateApprovalEmail(): String {
    return """
        <html>
        <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fffaf5; color: #333; padding: 20px;">
            <div style="max-width: 600px; margin: auto; border: 1px solid #e0dcd5; border-radius: 12px; padding: 30px; background-color: #ffffff;">
                <div style="text-align: center;">
                    <h2 style="color: #6d4c41;">Welcome to the Chef’s Circle!</h2>
                </div>
                <p>Dear Gourmet,</p>
                <p>
                    We are absolutely delighted to inform you that you’ve been <strong style="color: #8d6e63;">promoted to Chef</strong> within the Gourmet Greet family!
                </p>
                <p>
                    Please log in again to access your new tools and privileges as a chef. We're confident you’ll make magic in the kitchen!
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="http://localhost:4200/login" style="background-color: #d7ccc8; color: #4e342e; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold;">
                        Log In Now
                    </a>
                </div>
                <p style="font-style: italic; font-size: 0.9em; color: #888;">
                    This is an automated message from the Gourmet Greet Team.
                </p>
                <p style="text-align: center; font-size: 0.8em; color: #bbb;">
                    © 2025 Gourmet Greet. All rights reserved.
                </p>
            </div>
        </body>
        </html>
    """.trimIndent()
}