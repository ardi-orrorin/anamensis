package com.anamensis.server.repository;

import com.anamensis.server.entity.JobExecution;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobExecutionRepository extends JpaRepository<JobExecution, String> {
}
