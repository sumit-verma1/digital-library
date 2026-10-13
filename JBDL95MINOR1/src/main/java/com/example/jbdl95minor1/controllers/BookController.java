package com.example.jbdl95minor1.controllers;

import com.example.jbdl95minor1.dtos.CreateBookRequest;
import com.example.jbdl95minor1.dtos.CreateBookResponse;
import com.example.jbdl95minor1.services.BookService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/book")
public class BookController {

    @Autowired
    BookService bookService;


//    needs to be secure
//    admin
    @PostMapping("/create")
    public CreateBookResponse create(@Valid @RequestBody CreateBookRequest createBookRequest){
        return this.bookService.create(createBookRequest.toBook());
    }


//    needs to be secure
//    both can access
    @GetMapping("/get")
    public CreateBookResponse get(@RequestParam Integer id){
        return  this.bookService.get(id);
    }
}

/*
*
* int sum (int a , int b){
* return a+b+1;
* }
* */
