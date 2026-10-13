package com.example.jbdl95minor1.dtos;

import com.example.jbdl95minor1.models.Gender;
import com.example.jbdl95minor1.models.Student;
import com.example.jbdl95minor1.models.StudentStatus;
import com.example.jbdl95minor1.models.User;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateStudentRequest {

    @NotBlank(message = "Username cannot be blank")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Please provide a valid email address")
    private String email;

    @NotNull(message = "Gender must be specified (MALE, FEMALE, OTHERS)")
    private Gender gender;

    public Student toStudent(){
        return Student.builder()
                .name(name)
                .email(email)
                .gender(gender)
                .status(StudentStatus.ACTIVE)
                .user(User.builder()
                        .username(username)
                        .password(password)
                        .build())
                .build();
    }
}
