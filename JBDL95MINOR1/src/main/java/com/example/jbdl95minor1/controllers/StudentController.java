package com.example.jbdl95minor1.controllers;

import com.example.jbdl95minor1.dtos.*;
import com.example.jbdl95minor1.models.User;
import com.example.jbdl95minor1.services.StudentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student")
public class StudentController {

    @Autowired
    StudentService studentService;

//    @PostMapping("/create2")
//    public DummyResponse createWithList(@RequestBody CreateStudentRequest createStudentRequest,
//                                        @RequestParam(value = "book-list",required = false,defaultValue = "false")
//                                                Boolean bookList){
//        return this.studentService.createWithList(createStudentRequest.toStudent(),bookList);
//    }

//    (authentication and authorisation)
//    needs to be secure or no (no need of authentication)

    @PostMapping("/create")
    public CreateStudentResponse create(@Valid @RequestBody CreateStudentRequest createStudentRequest){
        return this.studentService.create(createStudentRequest.toStudent());
    }


//    needs to be secure
//    both admin and student
//    we need to have 2 endpoints
    @GetMapping("/get")
    public GetStudentResponse get(){
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        User user = (User) authentication.getPrincipal();
        if (user.getStudent() == null) {
            throw new IllegalArgumentException("No student profile linked to user account: " + user.getUsername());
        }
        Integer studentId = user.getStudent().getId();
        return this.studentService.getStudent(studentId);
    }



//only admin access
    @GetMapping("/get/admin")
    public GetStudentResponse getByAdmin(@RequestParam Integer id){
        return this.studentService.getStudent(id);
    }

//    needs to be secure
//    only student can have access
    @PutMapping("/update")
    public GetStudentResponse update(@RequestBody UpdateStudentRequest updateStudentRequest){
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        User user = (User) authentication.getPrincipal();
        if (user.getStudent() == null) {
            throw new IllegalArgumentException("No student profile linked to user account: " + user.getUsername());
        }
        Integer studentId = user.getStudent().getId();
        return this.studentService.update(updateStudentRequest.toStudent(),studentId);
    }

//    needs to be secure
//    only student
    @DeleteMapping("/delete")
    public void delete(){
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        User user = (User) authentication.getPrincipal();
        if (user.getStudent() == null) {
            throw new IllegalArgumentException("No student profile linked to user account: " + user.getUsername());
        }
        Integer studentId = user.getStudent().getId();
        this.studentService.delete(studentId);
    }

}

/*
*
* student
* admin
* */

/**/