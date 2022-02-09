package com.fti.university.services;

import com.fti.university.controllers.CourseController;
import com.fti.university.models.Course;
import com.fti.university.models.User;
import com.fti.university.repository.CourseRepository;
import com.fti.university.repository.UserRepository;
import com.querydsl.core.types.Predicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {

    private final static Logger logger = LoggerFactory.getLogger(CourseController.class);

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * @param predicate
     * @param pageable
     * @return
     */
    public ResponseEntity<Page<Course>> getAllCourses(Predicate predicate, Pageable pageable){
        if(predicate==null) {
            return new ResponseEntity<>(courseRepository.findAll(pageable), HttpStatus.OK);
        }
        return new ResponseEntity<>(courseRepository.findAll(predicate,pageable),HttpStatus.OK);
    }

    /**
     * @param course
     * @return
     */
    public ResponseEntity<?> addCourse(Course course){
        try {
            validateCourse(course);
            return new ResponseEntity<>(courseRepository.save(course),HttpStatus.CREATED);
        }
        catch (Exception e){
            logger.error("Error adding content:  " + e.getMessage());
            return new ResponseEntity<>("Error adding content:  " + e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @param courseName
     * @return
     */
    public ResponseEntity<Course> getCourseByName(String courseName){
        try{
            Course course=courseRepository.findByName(courseName);
            return new ResponseEntity<>(course,HttpStatus.OK);
        }
        catch (Exception e){
            logger.error("Couldn't find course with this name:"+courseName);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * @param courseName
     * @return
     */
    public ResponseEntity<HttpStatus> deleteCourse(String courseName){
        try{
            Course course= courseRepository.findByName(courseName);
            if(course == null){
                logger.error("Request to delete with unknown course name:  " + courseName);
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            else{
                userRepository.findAll().forEach(user -> {
                    user.getCourses().remove(courseName);
                    userRepository.save(user);
                });
                courseRepository.delete(course);
                return new ResponseEntity<>(HttpStatus.OK);
            }
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param newCourse
     * @return
     */
    public ResponseEntity<?> editCourse(Course newCourse){
        Course course=courseRepository.findById(newCourse.getId()).get();
        try{
            if(!course.getName().equals(newCourse.getName()) && courseRepository.existsByName(newCourse.getName())){
                return new ResponseEntity<>("The course name exists and must be unique!",HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(courseRepository.save(newCourse),HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @param courseName
     * @param username
     * @return
     */
    public ResponseEntity<?> addUserToCourse(String courseName,String username){
        try{
            User user=userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
            Course course=courseRepository.findByName(courseName);
            if(course.getUsers()==null){
                List<User> courseParticipants=new ArrayList<>();
                courseParticipants.add(user);
                course.setUsers(courseParticipants);
                return new ResponseEntity<>(courseRepository.save(course),HttpStatus.OK);
            }
            else {
                List<User> courseParticipants = course.getUsers();
                if (courseParticipants.contains(user)) {
                    return new ResponseEntity<>("User already added to course.", HttpStatus.NOT_ACCEPTABLE);
                } else {
                    courseParticipants.add(user);
                    course.setUsers(courseParticipants);
                    return new ResponseEntity<>(courseRepository.save(course), HttpStatus.OK);
                }
            }
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param courseName
     * @param username
     * @return
     */
    public ResponseEntity<?> deleteUserFromCourse(String courseName,String username){
        try{
            User user=userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));
            Course course=courseRepository.findByName(courseName);
            List<User> courseParticipants=course.getUsers();
            courseParticipants.remove(user);
            course.setUsers(courseParticipants);
            System.out.println(course.getUsers());
            courseRepository.save(course);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * @param course
     * @throws Exception
     */
    public void validateCourse(Course course) throws Exception {
        if (course.getName().equals("") || course.getName() == null) {
            throw new Exception("Error adding Course: Name is required!");
        }
        if(courseRepository.existsByName(course.getName())){
            throw new Exception("This name has been taken,please enter another name.");
        }
    }

    /**
     * @param id
     * @return
     */
    public List<Course> getCoursesByUserId(String id){
        return courseRepository.findByUsers_Id(id);
    }

    /**
     * @param username
     * @return
     */
    public List<Course> getCoursesByUsernameAndNotAcknowledged(String username){
        return courseRepository.findByNotAcknowledgedAndUsers_Username(username);
    }
}
