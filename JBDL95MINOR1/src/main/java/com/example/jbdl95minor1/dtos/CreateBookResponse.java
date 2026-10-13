package com.example.jbdl95minor1.dtos;

import com.example.jbdl95minor1.models.Book;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookResponse {

    private Book book;
}
