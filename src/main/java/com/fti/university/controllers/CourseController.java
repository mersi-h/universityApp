package com.fti.university.controllers;

import com.fti.university.models.Course;
import com.fti.university.models.User;
import com.fti.university.repository.CourseRepository;
import com.fti.university.repository.UserRepository;
import com.fti.university.services.CourseService;
import com.querydsl.core.types.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins="http://localhost:4200")
@RequestMapping("/university/course")
public class CourseController {

    @Autowired
    private CourseService courseService;

    /**
     * @param predicate
     * @param pageable
     * @return
     */
    @GetMapping(value = "/all")
    public ResponseEntity<Page<Course>> getAllCourses(@QuerydslPredicate Predicate predicate, @PageableDefault(sort = {"time"}, direction = Sort.Direction.DESC) Pageable pageable){
        return courseService.getAllCourses(predicate,pageable);
    }

    /**
     * @param id
     * @return
     */
    @GetMapping(value = "/user/id/{id}")
    public List<Course> getCoursesByUserId(@PathVariable("id") String id){
        return courseService.getCoursesByUserId(id);
    }

    /**
     * @param username
     * @return
     */
    @GetMapping(value = "/user/acknowledged/username/{username}")
    public List<Course> getCourseByUserIdAndAcknowledged(@PathVariable("username") String username){
        return courseService.getCoursesByUsernameAndNotAcknowledged(username);
    }

    /**
     * @param course
     * @return
     */
    @PostMapping(value = "/add")
    public ResponseEntity<?> addCourse(@RequestBody @Valid Course course) {
        return courseService.addCourse(course);
    }

    /**
     * @param courseName
     * @return
     */
    @GetMapping(value = "/name/{courseName}")
    public ResponseEntity<Course> getCourseByName(@PathVariable String courseName){
        return courseService.getCourseByName(courseName);
    }

    /**
     * @param courseName
     * @return
     */
    @DeleteMapping(value = "/delete/name/{courseName}")
    public ResponseEntity<HttpStatus> deleteCourse(@PathVariable String courseName){
        return courseService.deleteCourse(courseName);
    }

    /**
     * @param newCourse
     * @return
     */
    @PutMapping(value = "/edit")
    public ResponseEntity<?> editCourse(@RequestBody Course newCourse){
        return courseService.editCourse(newCourse);
    }

    /**
     * @param courseName
     * @param username
     * @return
     */
    @PostMapping(value = "/courseName/{courseName}/addUser")
    public ResponseEntity<?> addUserToCourse(@PathVariable String courseName,@RequestBody String username){
        return courseService.addUserToCourse(courseName,username);
    }

    /**
     * @param courseName
     * @param username
     * @return
     */
    @DeleteMapping(value = "/courseName/{courseName}/deleteUser/{username}")
    public ResponseEntity<?> deleteUserFromCourse(@PathVariable String courseName,@PathVariable String username){
        return courseService.deleteUserFromCourse(courseName,username);
    }


}
