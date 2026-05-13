package com.example.game_platform.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserDTO {

    private String username;
    private String email;
    private String password;
    private String avatarUrl;
}