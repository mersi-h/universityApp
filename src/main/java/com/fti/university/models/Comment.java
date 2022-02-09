package com.fti.university.models;

public class Comment {

    String userId;

    String content;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Comment(){

    }
    public Comment(String userId, String content) {
        this.userId = userId;
        this.content = content;
    }

}
