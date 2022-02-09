package com.fti.university.repository;


import com.fti.university.models.QCourse;
import com.fti.university.models.QUser;
import com.fti.university.models.User;
import com.querydsl.core.BooleanBuilder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.querydsl.binding.QuerydslBinderCustomizer;
import org.springframework.data.querydsl.binding.QuerydslBindings;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String>, QuerydslPredicateExecutor<User>, QuerydslBinderCustomizer<QUser> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    @Override
    default void customize(QuerydslBindings bindings, QUser root) {
        bindings.bind(QUser.user.username).all((username, collection) -> {
            BooleanBuilder result = new BooleanBuilder();
            collection.forEach(o -> result.or(username.containsIgnoreCase(o)));
            return Optional.of(result);
        });
    }
}
