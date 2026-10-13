package com.example.jbdl95minor1.dtos;

import com.example.jbdl95minor1.models.Gender;
import com.example.jbdl95minor1.models.Student;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateStudentRequest {

    private String name;

    private String email;

    private Gender gender;

    public Student toStudent(){
        return Student.builder()
                .name(name)
                .email(email)
                .gender(gender)
                .build();
    }
}
