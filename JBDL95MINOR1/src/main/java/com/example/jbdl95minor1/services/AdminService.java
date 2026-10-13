package com.example.jbdl95minor1.services;


import com.example.jbdl95minor1.dtos.CreateStudentResponse;
import com.example.jbdl95minor1.models.Admin;
import com.example.jbdl95minor1.models.Authority;
import com.example.jbdl95minor1.models.User;
import com.example.jbdl95minor1.repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminRepository adminRepository;

    public Long createAdmin(Admin admin) {
        User user = admin.getUser();
        user = this.userService.createUser(user, Authority.ADMIN);
        admin.setUser(user);

        Admin savedAdmin = this.adminRepository.save(admin);
        return savedAdmin.getId();
    }
}
