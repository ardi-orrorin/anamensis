package com.anamensis.server.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "job_execution")
@Getter
@Setter
public class JobExecution {

    @Id
    private String jobName;

    @Enumerated(EnumType.STRING)
    private JobStatus status;
}
