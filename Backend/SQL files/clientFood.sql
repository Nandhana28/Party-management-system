USE project;

-- Drop the table if it exists already
DROP TABLE IF EXISTS clientfood;

-- Create the clientfood table
CREATE TABLE clientfood (
    client_id INT NOT NULL,
    event_id VARCHAR(10) NOT NULL,
    food_id INT NOT NULL,
    quantity INT,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES eventdetails(EId) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES food(fid) ON DELETE CASCADE,
    PRIMARY KEY (client_id, event_id, food_id)
);


-- Add the total_cost column
ALTER TABLE clientfood
ADD COLUMN total_cost INT;
