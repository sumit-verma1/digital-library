package com.example.jbdl95minor1.repositories;

import com.example.jbdl95minor1.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserRepository extends JpaRepository<User, String> {

}
