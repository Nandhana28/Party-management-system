USE project;

DROP TABLE IF EXISTS hall;

CREATE TABLE hall (
    hallid INT PRIMARY KEY,
    hallName VARCHAR(400),
    hallAmount INT,
    city VARCHAR(200),
    state VARCHAR(200)
);

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (1, 'sri venkateshwara hall', 10000, 'chennai', 'tamilnadu');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (2, 'the residency', 20000, 'coimbatore', 'tamilnadu');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (3, 'leela palace banquet hall', 50000, 'bengaluru', 'karnataka');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (4, 'grand hyatt convention center', 75000, 'hyderabad', 'telangana');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (5, 'the raviz kovalam', 60000, 'thiruvananthapuram', 'kerala');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (6, 'gokulam park banquet hall', 25000, 'kochi', 'kerala');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (7, 'itc grand chola', 80000, 'chennai', 'tamilnadu');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (8, 'jw marriott banquet hall', 70000, 'bengaluru', 'karnataka');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (9, 'novotel convention center', 55000, 'hyderabad', 'telangana');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (10, 'radisson blu wedding hall', 30000, 'mysuru', 'karnataka');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (11, 'lulu convention center', 450000, 'thrissur', 'kerala');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (12, 'taj falaknuma palace', 90000, 'hyderabad', 'telangana');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (13, 'the westin wedding hall', 65000, 'chennai', 'tamilnadu');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (14, 'sangam banquet hall', 18000, 'tiruchirappalli', 'tamilnadu');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (15, 'the gateway hotel hall', 40000, 'madurai', 'tamilnadu');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (16, 'meenakshi banquet hall', 22000, 'madurai', 'tamilnadu');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (17, 'park hyatt convention center', 85000, 'hyderabad', 'telangana');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (18, 'the grand sheraton hall', 72000, 'bengaluru', 'karnataka');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (19, 'royal orchid banquet hall', 48000, 'coimbatore', 'tamilnadu');

INSERT INTO hall (hallid, hallName, hallAmount, city, state)  
VALUES (20, 'vivanta banquet hall', 50000, 'mangaluru', 'karnataka');