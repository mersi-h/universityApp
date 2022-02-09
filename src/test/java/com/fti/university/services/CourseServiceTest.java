package com.fti.university.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fti.university.models.Course;
import com.fti.university.repository.CourseRepository;
import org.assertj.core.api.Assertions;
import org.junit.Before;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringBootExceptionReporter;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;

import java.sql.Time;
import java.time.DateTimeException;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Date;

import static org.assertj.core.api.Assertions.*;

@DataMongoTest
public class CourseServiceTest{

    @TestConfiguration
    static class CourseServiceImplTest{
        @Bean
        public CourseService courseService(){
            return new CourseService(){

            };
        }
    }

    @Autowired
    private MongoTemplate mongoTemplate;

    @MockBean
    private CourseRepository courseRepository;



    //InjectMocks
    @Autowired
    private CourseService courseService;

    @Before
    public void init(){
        MockitoAnnotations.initMocks(this);
        addCourse();
    }
    void addCourse() {

        String newCourse = "{\"_id\":{\"$oid\":\"60d34cfedd132407724a53fa\"},\"name\":\"testName\",\"latitude\":22,\"longitude\":22,\"description\":\"testDesc\",\"universityName\":\"universiteti\",\"date\":{\"$date\":\"2021-06-23T15:02:22.597Z\"},\"time\":\"15:00\",\"comments\":[],\"acknowledged\":false,\"_class\":\"com.fti.university.models.Course\"}";

        try{
            Course course= new ObjectMapper().readValue(newCourse,Course.class);
            courseRepository.save(course);
        }catch (Exception e){
            e.printStackTrace();
        }

    }
    @Test
    void deleteCourse() {

//        mongoTemplate.save(new Course("testName",22.00,22.00,"testDesc","universiteti",LocalDateTime.now(),"15:00"));
        Course course=courseRepository.findByName("testName");
        courseService.deleteCourse(course.getName());
        assertThat(course.getName()).isEqualTo(null);
    }

    @Test
    void getCourseByName() {

        ResponseEntity<Course> course = courseService.getCourseByName("test");

        assertThat(course.getBody().getName()).isEqualTo("test");
    }

    @Test
    void validateCourse() throws Exception {
        //String newCourse = "{\"_id\":{\"$oid\":\"60d34cfedd132407724a53fa\"},\"name\":\"testName\",\"latitude\":22,\"longitude\":22,\"description\":\"testDesc\",\"universityName\":\"universiteti\",\"date\":{\"$date\":\"2021-06-23T15:02:22.597Z\"},\"time\":\"15:00\",\"comments\":[],\"acknowledged\":false,\"_class\":\"com.fti.university.models.Course\"}";
        Course course = new Course("test",23.00,32.00,"testdesc","universitetipoliteknik",LocalDateTime.now(), "12:32");


        assertThatThrownBy(() ->{
            courseService.validateCourse(course);
        });
    }


}