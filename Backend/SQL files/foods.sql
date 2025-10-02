USE project;

DROP TABLE IF EXISTS food;

CREATE TABLE food (
    fid INT PRIMARY KEY,
    fName VARCHAR(255),
    ftype VARCHAR(2),
    url VARCHAR(300),
    category VARCHAR(10),
    rate INT,
    cuisine VARCHAR(50),
    CONSTRAINT chtype CHECK (ftype IN ('B', 'L', 'S', 'D'))
);

INSERT INTO food (fid, fName, ftype, url, category, rate, cuisine) VALUES
(1, 'Dosa', 'B', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRHu-vEn4T3y8SSfgMjXyP64CZl8DXjSt5yhw&s', 'Veg', 50, 'Indian'),
(2, 'Chilly Parota', 'D', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZSs-Y3epMOzGMblyXuY1boLk1KtVtRCBVww&s', 'Non-Veg', 90, 'Indian'),
(3, 'Idly', 'B', 'https://madhurasrecipe.com/wp-content/uploads/2021/10/idli_premix_featured.jpg', 'Veg', 50, 'Indian'),
(4, 'Chicken Biriyani', 'L', 'https://bonmasala.com/wp-content/uploads/2022/10/mutton-biriyani-recipe.jpeg', 'Non-Veg', 200, 'Indian'),
(5, 'Fish Fry', 'L', 'https://www.spiceindiaonline.com/wp-content/uploads/2017/04/Meen-Varuval-Tilapia-Fish-Fry-2.jpg', 'Non-Veg', 200, 'Indian'),
(6, 'Butter Chicken', 'L', 'https://static.vecteezy.com/system/resources/thumbnails/031/415/202/small_2x/top-view-tasty-food-chicken-tikka-plate-isolated-on-a-black-background-ai-generated-photo.jpg', 'Non-Veg', 350, 'Indian'),
(7, 'Sushi', 'D', 'https://upload.wikimedia.org/wikipedia/commons/6/60/Sushi_platter.jpg', 'Non-Veg', 500, 'Japanese'),
(8, 'Pasta Carbonara', 'D', 'https://www.thespruceeats.com/thmb/ovIQQQxQajADuIE2lqhgqq7ppyE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/pasta-carbonara-recipe-5210168-hero-01-80090e56abc04ca19d88ebf7fad1d157.jpg', 'Non-Veg', 400, 'Italian'),
(9, 'Chow Mein', 'L', 'https://www.shutterstock.com/image-photo/chow-mein-noodles-served-bowl-600nw-2502135033.jpg', 'Non-Veg', 250, 'Chinese'),
(10, 'Paneer Tikka', 'D', 'https://spicecravings.com/wp-content/uploads/2020/10/Paneer-Tikka-Featured-1.jpg', 'Veg', 280, 'Indian'),
(11, 'Pancakes', 'B', 'https://static.vecteezy.com/system/resources/previews/030/625/217/large_2x/pancakes-image-hd-free-photo.jpg', 'Veg', 180, 'American'),
(12, 'Dosa', 'B', 'https://media.istockphoto.com/id/1364757902/photo/crispy-crepes-made-of-barnyard-millets-and-lentils-commonly-known-as-barnyard-millet-ghee.jpg?s=612x612&w=0&k=20&c=OujKblDoHPThj7fcxLL1FBfzRNlHK6ZwNYVXnqDhDBU=', 'Veg', 120, 'Indian'),
(13, 'Burger', 'L', 'https://cdn.pixabay.com/photo/2023/03/05/11/02/burger-7831127_640.jpg', 'Non-Veg', 220, 'American');

-- Verify the updates
SELECT * FROM food;
