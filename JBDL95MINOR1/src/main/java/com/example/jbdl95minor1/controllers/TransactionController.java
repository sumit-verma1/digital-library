package com.example.jbdl95minor1.controllers;

import com.example.jbdl95minor1.models.TransactionType;
import com.example.jbdl95minor1.models.User;
import com.example.jbdl95minor1.services.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/txn")
public class TransactionController {

    @Autowired
    TransactionService transactionService;


//  secure
//  student
    @PostMapping("/initiate")
    public String createTxn(@RequestParam Integer bookId,
                            @RequestParam TransactionType transactionType) throws Exception {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        User user = (User) authentication.getPrincipal();
        if (user.getStudent() == null) {
            throw new IllegalArgumentException("Only students with an active profile can initiate book transactions.");
        }
        Integer studentId = user.getStudent().getId();
        return transactionService.initiate(studentId,bookId,transactionType);

    }
}
