package com.fti.university.repository;

import com.fti.university.models.Course;
import com.fti.university.models.QCourse;
import com.querydsl.core.BooleanBuilder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;
import org.springframework.stereotype.Repository;

import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends MongoRepository<Course, String>, QuerydslPredicateExecutor<Course>, QuerydslBinderCustomizer<QCourse> {

    Course findByName(String name);
    Boolean existsByName(String name);
    List<Course> findByUsers_Id(String id);

    @Query(value="{$and:[{acknowledged : false}, {'users.username': ?0}]}")
    List<Course> findByNotAcknowledgedAndUsers_Username(String username);

    @Override
    default void customize(QuerydslBindings bindings, QCourse root) {
        bindings.bind(QCourse.course.name).all((name, collection) -> {
            BooleanBuilder result = new BooleanBuilder();
            collection.forEach(o -> result.or(name.containsIgnoreCase(o)));
            return Optional.of(result);
        });
    }
}
