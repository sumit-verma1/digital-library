package com.example.jbdl95minor1.dtos;

import com.example.jbdl95minor1.models.Book;
import lombok.*;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DummyResponse {

    private Integer id;

    private Date createdOn;

    private List<Book> bookList;
}
