package com.shikong.model;

/**
 * Title：
 * Author:black
 * Createtime:2016-08-22 16:31
 */
public class Message {

    private String code;

    private String message;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public User getContent() {
        return content;
    }

    public void setContent(User content) {
        this.content = content;
    }

    private User content;
}
