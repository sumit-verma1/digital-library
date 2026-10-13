package com.example.jbdl95minor1.repositories;

import com.example.jbdl95minor1.models.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction,Integer> {
    Transaction findTopByStudentAndBookAndTransactionTypeAndTransactionStatusOrderByIdDesc(Student student, Book book, TransactionType transactionType, TransactionStatus transactionStatus);
}
