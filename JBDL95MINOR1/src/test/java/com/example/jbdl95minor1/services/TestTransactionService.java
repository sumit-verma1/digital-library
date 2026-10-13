package com.example.jbdl95minor1.services;

import com.example.jbdl95minor1.dtos.CreateBookResponse;
import com.example.jbdl95minor1.dtos.CreateStudentResponse;
import com.example.jbdl95minor1.dtos.GetStudentResponse;
import com.example.jbdl95minor1.models.*;
import com.example.jbdl95minor1.repositories.TransactionRepository;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@RunWith(MockitoJUnitRunner.class)
public class TestTransactionService {


//    TransactionService transactionService = new TransactionService();

//    @Test
//    public void testSum(){
//
//        Integer actual = this.transactionService.sum(5,6);
//        Integer expected = 11;
//
//        Assert.assertEquals(expected, actual);
//
//    }


    @InjectMocks            // Mocks the exact behavior of class and attach it to the current test class (similar to Ioc and Di but dont say this in interviews)
    TransactionService transactionService;

    @Mock                       // Mock is creating a dummy random object with name as TransactionRepo amd attach it to Transaction svc(injected mock class)
    TransactionRepository transactionRepository;


    @Mock
    BookService bookService;

    @Mock
    StudentService studentService;

    @Test
    public void testCalculate(){

        Book book = Book.builder()
                .id(1)
                .name("Book 1")
                .build();

        Student student = Student.builder()
                .id(1)
                .name("Student 1")
                .build();

        Transaction transaction = Transaction.builder()
                .id(1)
                .transactionType(TransactionType.ISSUANCE)
                .transactionStatus(TransactionStatus.SUCCESS)
                .book(book)
                .student(student)
                .updatedOn(new Date(1754056558000L))
                .build();

        Mockito.when(transactionRepository.findTopByStudentAndBookAndTransactionTypeAndTransactionStatusOrderByIdDesc(
                Mockito.eq(student),
                Mockito.eq(book),
                Mockito.eq(TransactionType.ISSUANCE),
                Mockito.eq(TransactionStatus.SUCCESS)
        )).thenReturn(transaction);


//        setting @value using reflectionutils
        ReflectionTestUtils.setField(transactionService, "dayLimit", 15);
        ReflectionTestUtils.setField(transactionService, "finePerDay", 100);

        Integer actualOutput = transactionService.calculate(book, student);
        Integer expectedOutput = 35000;

        Assert.assertEquals(expectedOutput, actualOutput);

    }


    @Test
    public void testCalculateWithNoFine(){

        Book book = Book.builder()
                .id(1)
                .name("Book 1")
                .build();

        Student student = Student.builder()
                .id(1)
                .name("Student 1")
                .build();

        Transaction transaction = Transaction.builder()
                .id(1)
                .transactionType(TransactionType.ISSUANCE)
                .transactionStatus(TransactionStatus.SUCCESS)
                .book(book)
                .student(student)
                .updatedOn(new Date(1785593597000L))
                .build();

        Mockito.when(transactionRepository.findTopByStudentAndBookAndTransactionTypeAndTransactionStatusOrderByIdDesc(
                Mockito.eq(student),
                Mockito.eq(book),
                Mockito.eq(TransactionType.ISSUANCE),
                Mockito.eq(TransactionStatus.SUCCESS)
        )).thenReturn(transaction);


//        setting @value using reflectionutils
        ReflectionTestUtils.setField(transactionService, "dayLimit", 15);
        ReflectionTestUtils.setField(transactionService, "finePerDay", 100);

        Integer actualOutput = transactionService.calculate(book, student);
        Integer expectedOutput = 0;

        Assert.assertEquals(expectedOutput, actualOutput);

    }


    @Test
    public void testReturn() throws Exception {

        Student student = Student.builder()
                .id(1)
                .name("Student 1")
                .build();

        Book book = Book.builder()
                .id(1)
                .name("Book 1")
                .student(student)
                .build();



        String expectedOutput = UUID.randomUUID().toString();

        Transaction transaction = Transaction.builder()
                .student(student)
                .book(book)
                .transactionType(TransactionType.ISSUANCE)
                .transactionStatus(TransactionStatus.INITIATED)
                .updatedOn(new Date(1785593597000L))
                .txnId(expectedOutput)
                .fine(0)
                .build();

        CreateBookResponse createBookResponse = CreateBookResponse.builder()
                .book(book)
                .build();

        GetStudentResponse getStudentResponse = GetStudentResponse.builder()
                .student(student)
                .build();

        Mockito.when(bookService.get(Mockito.eq(book.getId()))).thenReturn(createBookResponse);
        Mockito.when(studentService.getStudent(Mockito.eq(student.getId()))).thenReturn(getStudentResponse);


        Mockito.when(transactionRepository.save(Mockito.any(Transaction.class))).thenReturn(transaction);

        Mockito.when(bookService.saveBook(Mockito.eq(book))).thenReturn(book);

        Mockito.when(transactionRepository.findTopByStudentAndBookAndTransactionTypeAndTransactionStatusOrderByIdDesc(
                Mockito.eq(student),
                Mockito.eq(book),
                Mockito.eq(TransactionType.ISSUANCE),
                Mockito.eq(TransactionStatus.SUCCESS)
        )).thenReturn(transaction);


//        setting @value using reflectionutils
        ReflectionTestUtils.setField(transactionService, "dayLimit", 15);
        ReflectionTestUtils.setField(transactionService, "finePerDay", 100);

        String actualOutput = transactionService.initiateReturn(student.getId(),book.getId());

    }

    @Test(expected = Exception.class)
    public void testInitiateReturnWithException() throws Exception {
        Student student = Student.builder()
                .id(1)
                .name("Student 1")
                .build();

        Book book = Book.builder()
                .id(1)
                .name("Book 1")
                .student(student)
                .build();


        CreateBookResponse createBookResponse = CreateBookResponse.builder()
                .book(book)
                .build();

        GetStudentResponse getStudentResponse = GetStudentResponse.builder()
                .student(student)
                .build();

        Mockito.when(bookService.get(Mockito.eq(book.getId()))).thenReturn(createBookResponse);
        Mockito.when(studentService.getStudent(Mockito.eq(student.getId()))).thenReturn(getStudentResponse);

        String actualOutput = transactionService.initiateReturn(student.getId(),book.getId());
    }
}
