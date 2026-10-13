package com.example.jbdl95minor1.dtos;


import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateStudentResponse {

    private Integer id;

    private Date createdOn;
}
