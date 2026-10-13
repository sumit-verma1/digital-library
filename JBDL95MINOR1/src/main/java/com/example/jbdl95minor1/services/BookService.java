package com.example.jbdl95minor1.services;

import com.example.jbdl95minor1.dtos.CreateBookResponse;
import com.example.jbdl95minor1.models.Author;
import com.example.jbdl95minor1.models.Book;
import com.example.jbdl95minor1.repositories.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    @Autowired
    BookRepository bookRepository;

    @Autowired
    AuthorService authorService;


//    public List<Book> getBooksByStudentId(Integer studentId){
//        return this.bookRepository.findByStudentId(studentId);
//    }


    /*
    * 1. extract author
    * 2.save author in author service
    * 3.get updated author
    * 4.store this updated author into book
    * 5.save book in book repo
    * 6.return
    *
    * */
    public CreateBookResponse create(Book book) {

        Author author = book.getAuthor();
        author = this.authorService.createAuthor(author);
        book.setAuthor(author);

        book = this.bookRepository.save(book);

        return CreateBookResponse.builder()
                .book(book)
                .build();

    }

    public CreateBookResponse get(Integer id) {
        Book book = this.bookRepository.findById(id).orElse(null);

        return CreateBookResponse.builder()
                .book(book)
                .build();
    }

    public Book saveBook(Book book){
        return this.bookRepository.save(book);
    }
}
