package com.example.jbdl95minor1.repositories;

import com.example.jbdl95minor1.models.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Repository;

import java.util.concurrent.TimeUnit;

@Repository
public class RedisRepository {

    @Autowired
    RedisTemplate<String,Object> redisTemplate;

    private static final String KEY_PREFIX = "student::";
    private static final Long KEY_EXPIRY = 3600L;

    private String getKey(Integer studentId){
        return KEY_PREFIX + studentId;
    }

    public void create(Student student){
        this.redisTemplate.opsForValue().set(getKey(student.getId()),student,KEY_EXPIRY, TimeUnit.SECONDS);
    }

    public Student get(Integer studentId){
        return (Student) this.redisTemplate.opsForValue().get(getKey(studentId));
    }

    public void delete(Integer studentId){
        this.redisTemplate.delete(getKey(studentId));
    }
}
