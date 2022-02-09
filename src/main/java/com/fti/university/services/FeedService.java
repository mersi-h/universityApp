package com.fti.university.services;

import com.fti.university.controllers.CourseController;
import com.fti.university.controllers.FeedController;
import com.fti.university.models.Course;
import com.fti.university.models.Feed;
import com.fti.university.repository.CourseRepository;
import com.fti.university.repository.FeedRepository;
import com.fti.university.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FeedService {

    private final static Logger logger = LoggerFactory.getLogger(FeedController.class);

    @Autowired
    private FeedRepository feedRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    public ResponseEntity<List<Feed>> getAllPosts(){
        return new ResponseEntity<>(feedRepository.findAllByOrderByCreatedDesc(), HttpStatus.OK);
    }

    /**
     * @param feed
     * @return
     */
    public ResponseEntity<?> addPost(Feed feed){
        try {
            return new ResponseEntity<>(feedRepository.save(feed),HttpStatus.CREATED);
        }
        catch (Exception e){
            logger.error("Error adding content:  " + e.getMessage());
            return new ResponseEntity<>("Error adding content:  " + e.getMessage(),HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @param post
     * @return
     */
    public ResponseEntity<Feed> updatePost(Feed post){
        try{
            return new ResponseEntity<>(feedRepository.save(post),HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * @param userId
     * @return
     */
    public ResponseEntity<Feed> getFeedByUserId(String userId){
        try{
            Feed feed=feedRepository.findByUserId(userId);
            return new ResponseEntity<>(feed,HttpStatus.OK);
        }
        catch (Exception e){
            logger.error("Couldn't find post with this userid:"+userId);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    /**
     * @param id
     * @return
     */
    public ResponseEntity<HttpStatus> deletePost(String id){
        try{
            feedRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
