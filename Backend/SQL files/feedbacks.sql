USE project;
-- DROP TABLE feedbacks;
CREATE TABLE feedbacks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    message VARCHAR(500) NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5), -- Ratings from 1 to 5
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Feedback
INSERT INTO feedbacks (name, message, rating) VALUES 
('Alice Johnson', 'Amazing event! Everything was perfectly planned.', 5),
('Michael Brown', 'Had a great time at the wedding reception. Thanks for the great service!', 4),
('Sophia Lee', 'Loved the decorations and the arrangements. Highly recommend!', 5),
('Daniel Wilson', 'Corporate event was smooth and well-organized. Thank you!', 4),
('Emma White', 'Christmas party was magical! Will book again next year.', 5);