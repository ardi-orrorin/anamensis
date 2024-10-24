CREATE TABLE job_execution (
    job_name VARCHAR(255) NOT NULL,
    status VARCHAR(100) NOT NULL
);

ALTER TABLE job_execution ADD CONSTRAINT job_name_pk PRIMARY KEY (job_name);

INSERT INTO job_execution (job_name, status)
VALUES ('board-index-job', 'READY'),
       ('dummy-file-delete-job', 'READY');