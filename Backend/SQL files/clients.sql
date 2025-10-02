DROP TABLE IF EXISTS clients;
CREATE TABLE clients (
    id INT PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    middleName VARCHAR(50),
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    dob DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    userName VARCHAR(50) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    clientID INT
);