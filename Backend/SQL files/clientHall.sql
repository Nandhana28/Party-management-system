USE project;

DROP TABLE IF EXISTS clienthall;

CREATE TABLE clienthall (
    client_id INT NOT NULL,
    event_id VARCHAR(10) NOT NULL,
    hall_id INT NOT NULL,
    totalamount INT,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES eventdetails(EId) ON DELETE CASCADE,
    FOREIGN KEY (hall_id) REFERENCES hall(hallid) ON DELETE CASCADE,
    PRIMARY KEY (client_id, event_id, hall_id)
);
