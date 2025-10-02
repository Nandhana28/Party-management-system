USE project;
DROP TABLE IF EXISTS eventDetails;
CREATE TABLE eventDetails (
    EId varchar(10),
    ENAME varchar(300),
    startDate date,
    endDate date,
    noOfDays int,
    noOfHours float,
    location varchar(150),
    etype varchar(150),
    noOfguests int
);

ALTER TABLE eventDetails MODIFY EId varchar(10) PRIMARY KEY;
ALTER TABLE eventDetails DROP COLUMN edescription;

-- Insert 5 past events (before today)
INSERT INTO eventDetails (EId, ENAME, location, startDate, endDate, noOfHours, noOfguests, etype, noOfDays)
VALUES  
('E001', 'Graduation Party 2023', 'itc grand chola, chennai', '2023-06-15', '2023-06-15', 4, 80, 'past', DATEDIFF('2023-06-15', '2023-06-15')),  
('E002', 'Christmas Celebration 2022', 'taj falaknuma palace, hyderabad', '2022-12-25', '2022-12-25', 5, 200, 'past', DATEDIFF('2022-12-25', '2022-12-25')),  
('E003', 'Birthday Bash 2024', 'jw marriott banquet hall, bengaluru', '2024-03-10', '2024-03-10', 4, 50, 'past', DATEDIFF('2024-03-10', '2024-03-10')),  
('E004', 'Corporate Annual Party 2023', 'the residency, coimbatore', '2023-08-20', '2023-08-20', 5, 150, 'past', DATEDIFF('2023-08-20', '2023-08-20')),  
('E005', 'Wedding Ceremony 2023', 'the raviz kovalam, thiruvananthapuram', '2023-05-10', '2023-05-10', 6, 300, 'past', DATEDIFF('2023-05-10', '2023-05-10'));

-- Insert 5 events happening today (same date as CURDATE())
INSERT INTO eventDetails (EId, ENAME, location, startDate, endDate, noOfHours, noOfguests, etype, noOfDays)
VALUES  
('E006', 'Graduation Party 2025', 'grand hyatt convention center, hyderabad', CURDATE(), CURDATE(), 4, 90, 'today', DATEDIFF(CURDATE(), CURDATE())),  
('E007', 'Christmas Celebration 2025', 'radisson blu wedding hall, mysuru', CURDATE(), CURDATE(), 4, 120, 'today', DATEDIFF(CURDATE(), CURDATE())),  
('E008', 'Birthday Bash 2025', 'meenakshi banquet hall, madurai', CURDATE(), CURDATE(), 4, 60, 'today', DATEDIFF(CURDATE(), CURDATE())),  
('E009', 'Corporate Annual Party 2025', 'lulu convention center, thrissur', CURDATE(), CURDATE(), 4, 200, 'today', DATEDIFF(CURDATE(), CURDATE())),  
('E010', 'Wedding Ceremony 2025', 'royal orchid banquet hall, coimbatore', CURDATE(), CURDATE(), 4, 250, 'today', DATEDIFF(CURDATE(), CURDATE()));

-- Insert 5 future events (after today)
INSERT INTO eventDetails (EId, ENAME, location, startDate, endDate, noOfHours, noOfguests, etype, noOfDays)
VALUES  
('E011', 'Graduation Party 2026', 'the westin wedding hall, chennai', '2026-06-15', '2026-06-15', 4, 100, 'upcoming', DATEDIFF('2026-06-15', '2026-06-15')),  
('E012', 'Christmas Celebration 2026', 'novotel convention center, hyderabad', '2026-12-25', '2026-12-25', 5, 200, 'upcoming', DATEDIFF('2026-12-25', '2026-12-25')),  
('E013', 'Birthday Bash 2026', 'vivanta banquet hall, mangaluru', '2026-04-05', '2026-04-05', 4, 75, 'upcoming', DATEDIFF('2026-04-05', '2026-04-05')),  
('E014', 'Corporate Annual Party 2026', 'the grand sheraton hall, bengaluru', '2026-08-20', '2026-08-20', 5, 150, 'upcoming', DATEDIFF('2026-08-20', '2026-08-20')),  
('E015', 'Wedding Ceremony 2026', 'gokulam park banquet hall, kochi', '2026-05-10', '2026-05-10', 6, 300, 'upcoming', DATEDIFF('2026-05-10', '2026-05-10'));

-- Select all events
SELECT * FROM eventDetails;
