package com.fti.university.services;

import com.fti.university.models.Course;
import com.fti.university.models.User;
import com.fti.university.repository.CourseRepository;
import com.fti.university.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private CourseService courseService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CourseRepository courseRepository;

    /**
     * @param username
     * @param courseName
     * @return
     */
    public ResponseEntity<?> joinCourse(String username,String courseName){
        try{
            User user=userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
            List<String> courses=user.getCourses();
            if(courses.contains(courseName)){
                return new ResponseEntity<>("You have already joined this course.", HttpStatus.CONFLICT);
            }
            else{
                courses.add(courseName);
                user.setCourses(courses);
                userRepository.save(user);
                courseService.addUserToCourse(courseName,username);
                return new ResponseEntity<>(HttpStatus.OK);
            }
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param username
     * @param courseName
     * @return
     */
    public ResponseEntity<?> leaveCourse(String username,String courseName){
        try{
            User user=userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
            List<String> courses=user.getCourses();
            if(courses.contains(courseName)){
                courses.remove(courseName);
                user.setCourses(courses);
                courseService.deleteUserFromCourse(courseName,username);
                return new ResponseEntity<>(userRepository.save(user),HttpStatus.OK);
            }
            else{
                return new ResponseEntity<>("You are not part of this course.",HttpStatus.CONFLICT);
            }
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param username
     * @return
     */
    public ResponseEntity<?> getCoursesByUser(String username){
        try {
            User user=userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
            return new ResponseEntity<>(user.getCourses(),HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
