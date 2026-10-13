package com.example.jbdl95minor1.services;

import com.example.jbdl95minor1.models.Author;
import com.example.jbdl95minor1.repositories.AuthorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthorService {

    @Autowired
    AuthorRepository authorRepository;

    public Author createAuthor(Author author) {

        return this.authorRepository.save(author);
    }
}
