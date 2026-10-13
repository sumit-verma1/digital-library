package com.example.jbdl95minor1.dtos;

import com.example.jbdl95minor1.models.Student;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetStudentResponse {

    Student student;
}
