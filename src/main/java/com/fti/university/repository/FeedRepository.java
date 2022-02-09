package com.fti.university.repository;

import com.fti.university.models.Course;
import com.fti.university.models.Feed;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FeedRepository extends MongoRepository<Feed, String> {
    Feed findByUserId(String userId);

    List<Feed> findAllByOrderByCreatedDesc();
    //void delete(Optional<Feed> feed);
}
