Use project;
-- DROP TABLE eventTypes;
CREATE TABLE eventTypes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(500) NOT NULL
);
INSERT INTO eventTypes (name, description) VALUES ('Birthday Party', '"Make your birthday unforgettable with a fun-filled celebration. Enjoy customized themes, delicious cakes, and exciting entertainment. Let us handle everything while you create joyful memories!"');
INSERT INTO eventTypes (name, description) VALUES ('Wedding Reception', '"Celebrate love in elegance with a beautifully planned wedding reception. From breathtaking décor to exquisite dining, we ensure every detail is perfect. Cherish the moment while we make it magical!"');
INSERT INTO eventTypes (name, description) VALUES ('Corporate party', '"Elevate your company’s celebrations with a seamless, professional event. Enjoy elegant venues, engaging activities, and top-notch catering. Strengthen connections while we handle all the details!"');
INSERT INTO eventTypes (name, description) VALUES ('Christmas party', '"Celebrate the holiday season with a magical Christmas party! Enjoy festive décor, delightful treats, and joyful entertainment. Relax and soak in the holiday spirit while we bring the magic to life!"');
INSERT INTO eventTypes (name, description) VALUES ('Graduation party', '"Honor your achievement with a graduation party to remember! From customized décor to exciting entertainment, we’ll make your celebration stress-free. Gather your loved ones and enjoy your big day!"');