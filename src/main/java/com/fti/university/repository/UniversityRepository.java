package com.fti.university.repository;

import com.fti.university.models.University;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniversityRepository extends MongoRepository<University, String> {
    University findByName(String name);
}
