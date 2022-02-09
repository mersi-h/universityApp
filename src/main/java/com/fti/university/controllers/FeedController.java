package com.fti.university.controllers;

import com.fti.university.models.Course;
import com.fti.university.models.Feed;
import com.fti.university.services.FeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@CrossOrigin(origins="http://localhost:4200")
@RequestMapping("/university/feed")
public class FeedController {

    @Autowired
    private FeedService feedService;


    @GetMapping(value="/allFeeds")
    public ResponseEntity<List<Feed>> getAllPosts(){
        return feedService.getAllPosts();
    }

    /**
     * @param id
     * @return
     */
    @DeleteMapping(value = "/id/{id}")
    public ResponseEntity<HttpStatus> deletePost(@PathVariable("id") String id){
        return feedService.deletePost(id);
    }

    /**
     * @param feed
     * @return
     */
    @PostMapping(value = "/addFeed")
    public ResponseEntity<?> addPost(@RequestBody Feed feed) {

        return feedService.addPost(feed);
    }

    /**
     * @param feed
     * @return
     */
    @PutMapping(value ="/update")
    public ResponseEntity<?> updatePost(@RequestBody Feed feed){
        return feedService.updatePost(feed);
    }
}
