package com.fti.university.controllers;

import com.fti.university.models.ERole;
import com.fti.university.models.Role;
import com.fti.university.models.University;
import com.fti.university.models.User;
import com.fti.university.repository.UniversityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins="http://localhost:4200")
@RequestMapping("/university/universities")
public class UniversityController {

    @Autowired
    private UniversityRepository universityRepository;

    @PostConstruct
    public void generateUniversities() {
        if(universityRepository.findAll().isEmpty()) {
            University university1 = new University();
            university1.setName("Universiteti Politeknik i Tiranes");
            University university2 = new University();
            university2.setName("Universiteti i Tiranes");
            University university3 = new University();
            university3.setName("Universiteti Bujqesor i Tiranes");
            University university4 = new University();
            university4.setName("Universiteti i Mjeksise se Tiranes");
            universityRepository.save(university1);
            universityRepository.save(university2);
            universityRepository.save(university3);
            universityRepository.save(university4);
        }
    }

    /**
     * @return
     */
    @GetMapping(value = "/all")
    public ResponseEntity<?> getAllUniversities(){
        return new ResponseEntity<>(universityRepository.findAll(), HttpStatus.OK);
    }

    /**
     * @param name
     * @return
     */
    @GetMapping(value = "/getByName/{name}")
    public ResponseEntity<?> getUniversityByName(@PathVariable String name){
        try {
            University university=universityRepository.findByName(name);
            return new ResponseEntity<>(university,HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>("No university found with name:"+name,HttpStatus.NOT_FOUND);
        }
    }
}
