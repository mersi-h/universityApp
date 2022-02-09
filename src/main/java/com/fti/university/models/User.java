package com.fti.university.models;


import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@Document(collection = "user")
public class User {

    @Id
    private String id;

    @NotNull
    @Size(min = 3,max = 20)
    private String username;

    private String firstName;

    private String lastName;

    private String profilePicture;

    @NotNull
    @Size(max=120)
    private String password;

    @Size(max=30)
    private String email;

    private List<Role> role;

    private List<String> courses=new ArrayList<>();

    private List<String> friends=new ArrayList<>();

    private List<FriendRequest> friendRequests=new ArrayList<>();

    public User() {

    }
    public User(String username, String firstName, String lastName,String email, String password) {
        this.username=username;
        this.password=password;
        this.email=email;
        this.firstName=firstName;
        this.lastName=lastName;
    }
}
