package com.fti.university.controllers;

import com.fti.university.models.ERole;
import com.fti.university.models.Role;
import com.fti.university.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import javax.annotation.PostConstruct;

@Controller
public class RoleController {

    @Autowired
    private RoleRepository roleRepository;


    @PostConstruct
    public void generateDefaultRoles() {

        Role role = new Role();
        role.setName(ERole.ADMIN);
        Role role1 = new Role();
        role1.setName(ERole.USER);
        if(!roleRepository.existsByName("ADMIN") && !roleRepository.existsByName("USER")){
            roleRepository.save(role);
            roleRepository.save(role1);
        }
    }
}
