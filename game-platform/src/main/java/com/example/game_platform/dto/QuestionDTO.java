package com.example.game_platform.dto;

import java.util.List;

// DTO for quiz question information
public class QuestionDTO {

    private String content;
    private List<String> options;
    private String correctAnswer;

    // Default constructor
    public QuestionDTO() {}

    // Constructor with all fields
    public QuestionDTO(String content, List<String> options, String correctAnswer) {
        this.content = content;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    // Get question content
    public String getContent() {
        return content;
    }

    // Set question content
    public void setContent(String content) {
        this.content = content;
    }

    // Get answer options
    public List<String> getOptions() {
        return options;
    }

    // Set answer options
    public void setOptions(List<String> options) {
        this.options = options;
    }

    // Get correct answer
    public String getCorrectAnswer() {
        return correctAnswer;
    }

    // Set correct answer
    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
}