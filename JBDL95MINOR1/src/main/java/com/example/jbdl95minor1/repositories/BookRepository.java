package com.example.jbdl95minor1.repositories;

import com.example.jbdl95minor1.models.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book,Integer> {
    List<Book> findByStudentId(Integer studentId);
}
