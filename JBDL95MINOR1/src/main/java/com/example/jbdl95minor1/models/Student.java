package com.example.jbdl95minor1.models;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Student implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private StudentStatus status;

    @Column(nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @OneToMany(mappedBy = "student", fetch = FetchType.EAGER)
    @JsonIgnoreProperties("student")
    private List<Book> books;

    @OneToOne
    @JoinColumn
    @JsonIgnoreProperties("student")
    private User user;

    @CreationTimestamp
    private Date createdOn;

    @UpdateTimestamp
    private Date updatedOn;
}


/*
* pros and cons of bi directional mapping
* pros
* 1. need not to write manual quries as hibernate does it for u;
*
* cons:
*
* 1. its calculating even if we dont want (hibernate)
* 2.cyclic dependency
*
*
* */


/*
*
*
* how many types  of users we have
*
* 2 kinds (student and admin)
*
*
* both will implement
*
* we can have assosiation
*
* we can define first a user and then
*
* all kinds of user can have a association with this table
*
* (loosely coupled)
*
* what is association?
*
*
* User
* Admin
* Student
*
* User Admin    (1:1)
* User Student  (1:1)
*
*
*
*
*
*
*
*
* */