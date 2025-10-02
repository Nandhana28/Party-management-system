USE project;

DROP TABLE IF EXISTS payment;

CREATE TABLE payment (
    client_id INT NOT NULL,
    event_id VARCHAR(10) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES eventdetails(EId) ON DELETE CASCADE,
    PRIMARY KEY (client_id, event_id)
);
