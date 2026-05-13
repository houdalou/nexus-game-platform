package com.example.game_platform.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PopularGameDTO {

    private Long id;
    private String title;
    private String category;
    private Long playCount;
}
