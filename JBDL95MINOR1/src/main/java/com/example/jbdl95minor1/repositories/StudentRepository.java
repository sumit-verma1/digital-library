package com.example.jbdl95minor1.repositories;

import com.example.jbdl95minor1.models.Student;
import com.example.jbdl95minor1.models.StudentStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface StudentRepository extends JpaRepository<Student,Integer> {


    @Transactional
    @Modifying
    @Query("update Student s set s.status = ?2 where s.id = ?1")
    void deActivate(Integer id, StudentStatus status);
}
