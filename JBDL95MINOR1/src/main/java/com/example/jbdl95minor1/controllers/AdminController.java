package com.example.jbdl95minor1.controllers;

import com.example.jbdl95minor1.dtos.CreateAdminRequest;
import com.example.jbdl95minor1.models.Admin;
import com.example.jbdl95minor1.services.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    AdminService adminService;

    @PostMapping("/create")
    public Long createAdmin(@Valid @RequestBody CreateAdminRequest createAdminRequest) {
        return this.adminService.createAdmin(createAdminRequest.toAdmin());
    }

}
