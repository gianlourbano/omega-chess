package com.balottacpp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.balottacpp.backend.constants.Constants;

import ai.player.Darkboard;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class BackendApplication {

    private static final Logger logger = LoggerFactory.getLogger(BackendApplication.class);

    public static void main(String[] args) {
        String path = System.getProperty("user.home") + "/darkboard_data/";
        if (Constants.DEBUG) {
            logger.info(path);
        }
        Darkboard.initialize(path);

        SpringApplication.run(BackendApplication.class, args);
    }

}
