package com.example.game_platform.dto;

import java.util.List;

public class QuestionDTO {

    private String content;
    private List<String> options;
    private String correctAnswer;

    public QuestionDTO() {}

    public QuestionDTO(String content, List<String> options, String correctAnswer) {
        this.content = content;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }
}