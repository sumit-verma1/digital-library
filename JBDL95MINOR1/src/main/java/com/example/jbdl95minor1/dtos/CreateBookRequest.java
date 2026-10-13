package com.example.jbdl95minor1.dtos;

import com.example.jbdl95minor1.models.Author;
import com.example.jbdl95minor1.models.Book;
import com.example.jbdl95minor1.models.Genre;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBookRequest {

    @NotBlank(message = "Book name cannot be blank")
    private String name;

    @NotNull(message = "Genre must be specified")
    private Genre genre;

    @NotBlank(message = "Author name cannot be blank")
    private String authorName;

    @NotBlank(message = "Author email cannot be blank")
    @Email(message = "Please provide a valid author email")
    private String email;

    public Book toBook(){

        return Book.builder()
                .name(name)
                .genre(genre)
                .author(Author.builder()
                        .name(authorName)
                        .email(email)
                        .build())
                .build();

    }
}
