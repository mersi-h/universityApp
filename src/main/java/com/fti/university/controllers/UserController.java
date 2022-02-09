package com.fti.university.controllers;

import com.fti.university.models.ERole;
import com.fti.university.models.Role;
import com.fti.university.models.User;
import com.fti.university.repository.RoleRepository;
import com.fti.university.repository.UserRepository;
import com.fti.university.services.UserService;
import com.querydsl.core.types.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.querydsl.binding.QuerydslPredicate;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins="http://localhost:4200")
@RequestMapping("/university/user")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder encoder;

    @PostConstruct
    public void generateAdmin() {
        User user=new User();
        user.setUsername("admin");
        user.setPassword(encoder.encode("admin"));
        user.setEmail("admin@admin.com");
        List<Role> roles=new ArrayList<>();
        roles.add(roleRepository.findByName(ERole.ADMIN).get());
        user.setRole(roles);
        if(!userRepository.existsByUsername("admin")){
            userRepository.save(user);
        }
    }

    /**
     * @param username
     * @param courseName
     * @return
     */
    @PostMapping(value = "/joinCourse/username/{username}")
    public ResponseEntity<?> joinCourse(@PathVariable String username,@RequestBody String courseName){
        return userService.joinCourse(username,courseName);
    }

    /**
     * @param username
     * @param courseName
     * @return
     */
    @PostMapping(value = "/leaveCourse/username/{username}")
    public ResponseEntity<?> leaveCourse(@PathVariable String username,@RequestBody String courseName){
        return userService.leaveCourse(username,courseName);
    }

    /**
     * @param username
     * @return
     */
    @GetMapping(value = "/allCourses/username/{username}")
    public ResponseEntity<?> getCoursesByUser(@PathVariable String username){
        return userService.getCoursesByUser(username);
    }

    /**
     * @param userId
     * @return
     */
    @GetMapping(value = "/getUser/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId){
        return new ResponseEntity<>(userRepository.findById(userId).get(), HttpStatus.OK);
    }

    /**
     * @param username
     * @return
     */
    @GetMapping(value = "/getUserByUsername/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username){
        return new ResponseEntity<>(userRepository.findByUsername(username).get(), HttpStatus.OK);
    }

    /**
     * @param predicate
     * @param pageable
     * @return
     */
    @GetMapping(value = "/all")
    public ResponseEntity<Page<User>> getAllUsers(@QuerydslPredicate Predicate predicate,
                                                  @PageableDefault(sort = {"username"}, direction = Sort.Direction.DESC) Pageable pageable) {
        if(predicate==null){
            return new ResponseEntity<>(userRepository.findAll(pageable),HttpStatus.OK);
        }
        return new ResponseEntity<>(userRepository.findAll(predicate,pageable),HttpStatus.OK);
    }

    /**
     * @param userId
     * @param updatedUser
     * @return
     */
    @PostMapping(value= "/updateUser/{userId}")
    public ResponseEntity<?> editUser(@PathVariable String userId,@RequestBody User updatedUser){
        Optional<User> user=userRepository.findById(userId);
        if(user.isPresent()){
            if(!user.get().getUsername().equals(updatedUser.getUsername()) && userRepository.findByUsername(updatedUser.getUsername()).isPresent()) {
                    return new ResponseEntity<>("This username is taken!", HttpStatus.BAD_REQUEST);
            }
            return new ResponseEntity<>(userRepository.save(updatedUser), HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
