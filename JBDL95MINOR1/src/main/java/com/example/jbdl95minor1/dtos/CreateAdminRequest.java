package com.example.jbdl95minor1.dtos;


import com.example.jbdl95minor1.models.Admin;
import com.example.jbdl95minor1.models.User;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAdminRequest {

    @NotBlank(message = "Username cannot be blank")
    private String username;

    @NotBlank(message = "Password cannot be blank")
    private String password;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    public Admin toAdmin() {
        return Admin.builder()
                .name(name)
                .user(
                        User.builder()
                                .username(username)
                                .password(password)
                                .build()
                )
                .build();
    }
}
