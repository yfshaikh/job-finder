CREATE DATABASE IF NOT EXISTS jobfinder;
USE jobfinder;


CREATE TABLE Job_Seekers (
  job_seeker_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  phone VARCHAR(20) UNIQUE,
  skills TEXT,
  resume_link TEXT,
  education VARCHAR(100),
  experience VARCHAR(250),
  introduction VARCHAR(250),
  about VARCHAR(250),
  profile_completed BOOLEAN DEFAULT false,
  profile_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Recruiters (
  recruiter_id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  company_description VARCHAR(250),
  company_website VARCHAR(100),
  phone VARCHAR(20) UNIQUE,
  company_location VARCHAR(100) NOT NULL,
  profile_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Job_Postings (
  job_id INT AUTO_INCREMENT PRIMARY KEY,
  recruiter_id INT NOT NULL,
  job_title VARCHAR(100) NOT NULL,
  job_description TEXT NOT NULL,
  salary_range VARCHAR(50),
  location VARCHAR(100) NOT NULL,
  company_name VARCHAR(100) NOT NULL,
  job_type VARCHAR(100) NOT NULL,
  experience_level VARCHAR(100) NOT NULL,
  date_posted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recruiter_id) REFERENCES Recruiters(recruiter_id) ON DELETE CASCADE
);



CREATE TABLE Applications (
  application_id INT AUTO_INCREMENT PRIMARY KEY,
  job_seeker_id INT NOT NULL,
  job_id INT NOT NULL,
  status ENUM('Pending', 'Shortlisted', 'Hired', 'Rejected') DEFAULT 'Pending',
  date_applied TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_seeker_id) REFERENCES Job_Seekers(job_seeker_id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES Job_Postings(job_id) ON DELETE CASCADE
);


-- /Applications/XAMPP/xamppfiles/bin/mysql -u root
-- SHOW DATABASES;
-- USE jobfinder;
-- SHOW TABLES;
-- DROP TABLE IF EXISTS jobfinder;
-- DROP DATABASE IF EXISTS jobfinder;



