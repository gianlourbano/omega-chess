package com.balottacpp.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.Data;

@RestController
@RequestMapping("healthcheck")
public class HealthCheck {

    @Data
    class HealthCheckResponse {
        public String status;
    }

    @RequestMapping("")
    @CrossOrigin(origins = "http://localhost:3000")
    public HealthCheckResponse healthCheck() {
        return new HealthCheckResponse() {{
            setStatus("OK");
        }};
    }
    
}
