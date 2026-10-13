package com.example.jbdl95minor1.services;

import com.example.jbdl95minor1.models.*;
import com.example.jbdl95minor1.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class TransactionService {

    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    StudentService studentService;

    @Autowired
    BookService bookService;

    @Value("${book.day.limit}")
    Integer dayLimit;

    @Value("${student.book.limit}")
    Integer studentLimit;

    @Value("${fine.per.Day}")
    Integer finePerDay;



    public String initiate(Integer studentId, Integer bookId, TransactionType transactionType) throws Exception {

        switch (transactionType){
            case ISSUANCE:
                return initiateIssuance(studentId,bookId);
            case RETURN:
                return initiateReturn(studentId,bookId);
            default:
                throw new Exception("invalid transaction type");

        }
    }

    /*
    * 1.Data Retrieval
    *
    *   a.book
    *   b.student
    *
    * 2. Validations
    *
    *   a.if student is null or book is null
    *   b.if book is assigned to someone else
    *   c.if student limit exceeds
    *
    * 3.create txn with status as initiated
    * 4. Allot/assign book to the student
    * 5.make it success
    * 6.if txn got failed handle it
    *
    * */

    private String initiateIssuance(Integer studentId, Integer bookId) throws Exception {

//        Data Extraction

        Student student = this.studentService.getStudent(studentId).getStudent();
        Book book = this.bookService.get(bookId).getBook();


//        Validations

        if(student == null || student.getStatus() == StudentStatus.INACTIVE){
            throw new Exception("invalid student");
        }

        if(book == null || book.getStudent()!=null){
            throw new Exception("book is not available");
        }

        List<Book> issuedBooks = student.getBooks();
        if(issuedBooks != null && issuedBooks.size() >= studentLimit){
            throw new Exception("Issue limit of " + studentLimit + " books exceeded for student.");
        }

        Transaction transaction = Transaction.builder()
                .student(student)
                .book(book)
                .transactionType(TransactionType.ISSUANCE)
                .transactionStatus(TransactionStatus.INITIATED)
                .txnId(UUID.randomUUID().toString())
                .fine(0)
                .build();

        Transaction savedTransaction = this.transactionRepository.save(transaction);

        try {

            book.setStudent(student);
            this.bookService.saveBook(book);

            transaction.setTransactionStatus(TransactionStatus.SUCCESS);
            this.transactionRepository.save(transaction);
        }
        catch (Exception e){

            transaction.setTransactionStatus(TransactionStatus.FAILURE);
            this.transactionRepository.save(transaction);

            if(book.getStudent()!=null){
                book.setStudent(null);
                this.bookService.saveBook(book);
            }

        }

        return transaction.getTxnId();
    }

    public String initiateReturn(Integer studentId, Integer bookId) throws Exception {

        Student student = this.studentService.getStudent(studentId).getStudent();
        Book book = this.bookService.get(bookId).getBook();


        //        Validations

        if(student == null || student.getStatus() == StudentStatus.INACTIVE){
            throw new Exception("invalid student");
        }

        if(book == null || book.getStudent()==null || book.getStudent().getId()!= studentId){
            throw new Exception("book is not even assigned");
        }

        Transaction transaction = Transaction.builder()
                .student(student)
                .book(book)
                .transactionType(TransactionType.RETURN)
                .transactionStatus(TransactionStatus.INITIATED)
                .txnId(UUID.randomUUID().toString())
                .build();

        Transaction savedTransaction = this.transactionRepository.save(transaction);


        int fine = this.calculate(book,student);



        try {

            savedTransaction.setFine(fine);
            transactionRepository.save(savedTransaction);
            book.setStudent(null);
            this.bookService.saveBook(book);

            savedTransaction.setTransactionStatus(TransactionStatus.SUCCESS);
            this.transactionRepository.save(savedTransaction);
        }
        catch (Exception e){

            savedTransaction.setTransactionStatus(TransactionStatus.FAILURE);
            this.transactionRepository.save(savedTransaction);

            if(book.getStudent()==null){
                book.setStudent(student);
                this.bookService.saveBook(book);
                savedTransaction.setFine(0);
            }

        }

        return savedTransaction.getTxnId();
    }

    /*
    * find that txn -> respective issuance
    * get updatedOn
    * difference
    * calcukate fine
    *
    * */

    public Integer calculate(Book book, Student student){

        Transaction transaction = this.transactionRepository.findTopByStudentAndBookAndTransactionTypeAndTransactionStatusOrderByIdDesc(
                student,book,TransactionType.ISSUANCE,TransactionStatus.SUCCESS
        );

        if (transaction == null || transaction.getUpdatedOn() == null) {
            return 0;
        }

        Long issuedTxnTime = transaction.getUpdatedOn().getTime();
        Long timeDiffInMillis = System.currentTimeMillis() - issuedTxnTime;

        Long timeDiffDays = TimeUnit.DAYS.convert(timeDiffInMillis,TimeUnit.MILLISECONDS);

        if(timeDiffDays > this.dayLimit){
            return (timeDiffDays.intValue()-this.dayLimit)*finePerDay;
        }

        return 0;

    }

    public Integer sum(Integer a, Integer b){
        return a+b;
    }

}
