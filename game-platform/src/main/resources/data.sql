-- Clear old data
DELETE FROM answer;
DELETE FROM ratings;
DELETE FROM question;
DELETE FROM favorites;
DELETE FROM game;

-- ==========================================
-- GAMES
-- ==========================================
INSERT INTO game (title, description, category, image_url, slug) VALUES ('Quiz Protocol', 'Test your knowledge across all domains', 'QUIZ', null, 'quiz');
INSERT INTO game (title, description, category, image_url, slug) VALUES ('Snake Arcade', 'Classic snake, neon edition', 'ARCADE', null, 'snake');
INSERT INTO game (title, description, category, image_url, slug) VALUES ('Tetris Blocks', 'Stack the falling blocks', 'ARCADE', null, 'tetris');
INSERT INTO game (title, description, category, image_url, slug) VALUES ('Chess Master', 'Strategic board battles', 'CHESS', null, 'chess');

-- ==========================================
-- EASY QUESTIONS (10)
-- ==========================================
INSERT INTO question (content, category, difficulty) VALUES ('2 + 2 = ?', 'Math', 'EASY');
INSERT INTO question (content, category, difficulty) VALUES ('What is the square root of 64?', 'Math', 'EASY');
INSERT INTO question (content, category, difficulty) VALUES ('What is 12 squared?', 'Math', 'EASY');
INSERT INTO question (content, category, difficulty) VALUES ('What is the approximate value of Pi?', 'Math', 'EASY');
INSERT INTO question (content, category, difficulty) VALUES ('Capital of France?', 'Geography', 'EASY');
INSERT INTO question (content, category, difficulty) VALUES ('Which is the largest ocean on Earth?', 'Geography', 'EASY');
INSERT INTO question (content, category, difficulty) VALUES ('Which continent is Egypt located in?', 'Geography', 'EASY');
INSERT INTO question (content, category, difficulty) VALUES ('What is the chemical symbol for water?', 'Science', 'EASY');
INSERT INTO question (content, category, difficulty) VALUES ('Which planet is known as the Red Planet?', 'Science', 'EASY');
INSERT INTO question (content, category, difficulty) VALUES ('In which sport would you perform a slam dunk?', 'Sports', 'EASY');

INSERT INTO answer (answer_text, correct, question_id) SELECT '4', true, id FROM question WHERE content = '2 + 2 = ?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '3', false, id FROM question WHERE content = '2 + 2 = ?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '5', false, id FROM question WHERE content = '2 + 2 = ?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '22', false, id FROM question WHERE content = '2 + 2 = ?';

INSERT INTO answer (answer_text, correct, question_id) SELECT '8', true, id FROM question WHERE content = 'What is the square root of 64?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '6', false, id FROM question WHERE content = 'What is the square root of 64?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '7', false, id FROM question WHERE content = 'What is the square root of 64?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '9', false, id FROM question WHERE content = 'What is the square root of 64?';

INSERT INTO answer (answer_text, correct, question_id) SELECT '144', true, id FROM question WHERE content = 'What is 12 squared?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '121', false, id FROM question WHERE content = 'What is 12 squared?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '169', false, id FROM question WHERE content = 'What is 12 squared?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '132', false, id FROM question WHERE content = 'What is 12 squared?';

INSERT INTO answer (answer_text, correct, question_id) SELECT '3.14', true, id FROM question WHERE content = 'What is the approximate value of Pi?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '2.71', false, id FROM question WHERE content = 'What is the approximate value of Pi?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '1.62', false, id FROM question WHERE content = 'What is the approximate value of Pi?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '3.41', false, id FROM question WHERE content = 'What is the approximate value of Pi?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Paris', true, id FROM question WHERE content = 'Capital of France?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Berlin', false, id FROM question WHERE content = 'Capital of France?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Madrid', false, id FROM question WHERE content = 'Capital of France?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Rome', false, id FROM question WHERE content = 'Capital of France?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Pacific Ocean', true, id FROM question WHERE content = 'Which is the largest ocean on Earth?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Atlantic Ocean', false, id FROM question WHERE content = 'Which is the largest ocean on Earth?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Indian Ocean', false, id FROM question WHERE content = 'Which is the largest ocean on Earth?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Arctic Ocean', false, id FROM question WHERE content = 'Which is the largest ocean on Earth?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Africa', true, id FROM question WHERE content = 'Which continent is Egypt located in?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Asia', false, id FROM question WHERE content = 'Which continent is Egypt located in?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Europe', false, id FROM question WHERE content = 'Which continent is Egypt located in?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'South America', false, id FROM question WHERE content = 'Which continent is Egypt located in?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'H2O', true, id FROM question WHERE content = 'What is the chemical symbol for water?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'CO2', false, id FROM question WHERE content = 'What is the chemical symbol for water?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'O2', false, id FROM question WHERE content = 'What is the chemical symbol for water?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'HO', false, id FROM question WHERE content = 'What is the chemical symbol for water?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Mars', true, id FROM question WHERE content = 'Which planet is known as the Red Planet?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Venus', false, id FROM question WHERE content = 'Which planet is known as the Red Planet?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Jupiter', false, id FROM question WHERE content = 'Which planet is known as the Red Planet?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Saturn', false, id FROM question WHERE content = 'Which planet is known as the Red Planet?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Basketball', true, id FROM question WHERE content = 'In which sport would you perform a slam dunk?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Volleyball', false, id FROM question WHERE content = 'In which sport would you perform a slam dunk?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Tennis', false, id FROM question WHERE content = 'In which sport would you perform a slam dunk?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Football', false, id FROM question WHERE content = 'In which sport would you perform a slam dunk?';

-- ==========================================
-- MEDIUM QUESTIONS (10)
-- ==========================================
INSERT INTO question (content, category, difficulty) VALUES ('How many players are on a soccer team?', 'Sports', 'MEDIUM');
INSERT INTO question (content, category, difficulty) VALUES ('How many rings are on the Olympic flag?', 'Sports', 'MEDIUM');
INSERT INTO question (content, category, difficulty) VALUES ('Which country has won the most FIFA World Cups?', 'Sports', 'MEDIUM');
INSERT INTO question (content, category, difficulty) VALUES ('What gas do plants absorb from the atmosphere?', 'Science', 'MEDIUM');
INSERT INTO question (content, category, difficulty) VALUES ('How many bones are in the adult human body?', 'Science', 'MEDIUM');
INSERT INTO question (content, category, difficulty) VALUES ('What is the hardest natural substance on Earth?', 'Science', 'MEDIUM');
INSERT INTO question (content, category, difficulty) VALUES ('What is the smallest country in the world?', 'Geography', 'MEDIUM');
INSERT INTO question (content, category, difficulty) VALUES ('What is the longest river in the world?', 'Geography', 'MEDIUM');
INSERT INTO question (content, category, difficulty) VALUES ('What is 5 factorial (5!)?', 'Math', 'MEDIUM');
INSERT INTO question (content, category, difficulty) VALUES ('Who has won the most NBA championships?', 'Sports', 'MEDIUM');

INSERT INTO answer (answer_text, correct, question_id) SELECT '11', true, id FROM question WHERE content = 'How many players are on a soccer team?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '9', false, id FROM question WHERE content = 'How many players are on a soccer team?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '13', false, id FROM question WHERE content = 'How many players are on a soccer team?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '7', false, id FROM question WHERE content = 'How many players are on a soccer team?';

INSERT INTO answer (answer_text, correct, question_id) SELECT '5', true, id FROM question WHERE content = 'How many rings are on the Olympic flag?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '4', false, id FROM question WHERE content = 'How many rings are on the Olympic flag?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '6', false, id FROM question WHERE content = 'How many rings are on the Olympic flag?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '7', false, id FROM question WHERE content = 'How many rings are on the Olympic flag?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Brazil', true, id FROM question WHERE content = 'Which country has won the most FIFA World Cups?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Germany', false, id FROM question WHERE content = 'Which country has won the most FIFA World Cups?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Argentina', false, id FROM question WHERE content = 'Which country has won the most FIFA World Cups?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Italy', false, id FROM question WHERE content = 'Which country has won the most FIFA World Cups?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Carbon dioxide', true, id FROM question WHERE content = 'What gas do plants absorb from the atmosphere?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Oxygen', false, id FROM question WHERE content = 'What gas do plants absorb from the atmosphere?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Nitrogen', false, id FROM question WHERE content = 'What gas do plants absorb from the atmosphere?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Hydrogen', false, id FROM question WHERE content = 'What gas do plants absorb from the atmosphere?';

INSERT INTO answer (answer_text, correct, question_id) SELECT '206', true, id FROM question WHERE content = 'How many bones are in the adult human body?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '186', false, id FROM question WHERE content = 'How many bones are in the adult human body?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '216', false, id FROM question WHERE content = 'How many bones are in the adult human body?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '196', false, id FROM question WHERE content = 'How many bones are in the adult human body?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Diamond', true, id FROM question WHERE content = 'What is the hardest natural substance on Earth?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Gold', false, id FROM question WHERE content = 'What is the hardest natural substance on Earth?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Iron', false, id FROM question WHERE content = 'What is the hardest natural substance on Earth?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Granite', false, id FROM question WHERE content = 'What is the hardest natural substance on Earth?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Vatican City', true, id FROM question WHERE content = 'What is the smallest country in the world?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Monaco', false, id FROM question WHERE content = 'What is the smallest country in the world?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'San Marino', false, id FROM question WHERE content = 'What is the smallest country in the world?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Liechtenstein', false, id FROM question WHERE content = 'What is the smallest country in the world?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Nile', true, id FROM question WHERE content = 'What is the longest river in the world?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Amazon', false, id FROM question WHERE content = 'What is the longest river in the world?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Yangtze', false, id FROM question WHERE content = 'What is the longest river in the world?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Mississippi', false, id FROM question WHERE content = 'What is the longest river in the world?';

INSERT INTO answer (answer_text, correct, question_id) SELECT '120', true, id FROM question WHERE content = 'What is 5 factorial (5!)?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '25', false, id FROM question WHERE content = 'What is 5 factorial (5!)?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '100', false, id FROM question WHERE content = 'What is 5 factorial (5!)?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '60', false, id FROM question WHERE content = 'What is 5 factorial (5!)?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Bill Russell', true, id FROM question WHERE content = 'Who has won the most NBA championships?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Michael Jordan', false, id FROM question WHERE content = 'Who has won the most NBA championships?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'LeBron James', false, id FROM question WHERE content = 'Who has won the most NBA championships?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Kobe Bryant', false, id FROM question WHERE content = 'Who has won the most NBA championships?';

-- ==========================================
-- HARD QUESTIONS (15)
-- ==========================================
INSERT INTO question (content, category, difficulty) VALUES ('Who was the first President of the United States?', 'History', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('In which year did World War II end?', 'History', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('Which ancient wonder of the world still stands today?', 'History', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('Who discovered America in 1492?', 'History', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('Which empire was ruled by Julius Caesar?', 'History', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('Which language is used for Spring Boot?', 'Programming', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('What does HTML stand for?', 'Programming', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('Which symbol is used for single-line comments in JavaScript?', 'Programming', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('What does CSS stand for?', 'Programming', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('Which data structure uses LIFO?', 'Programming', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('Who wrote the theory of relativity?', 'Science', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('What is the speed of light approximately?', 'Science', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('In what year did the Berlin Wall fall?', 'History', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('What is the derivative of x^2?', 'Math', 'HARD');
INSERT INTO question (content, category, difficulty) VALUES ('Which element has the atomic number 79?', 'Science', 'HARD');

INSERT INTO answer (answer_text, correct, question_id) SELECT 'George Washington', true, id FROM question WHERE content = 'Who was the first President of the United States?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Thomas Jefferson', false, id FROM question WHERE content = 'Who was the first President of the United States?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Abraham Lincoln', false, id FROM question WHERE content = 'Who was the first President of the United States?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'John Adams', false, id FROM question WHERE content = 'Who was the first President of the United States?';

INSERT INTO answer (answer_text, correct, question_id) SELECT '1945', true, id FROM question WHERE content = 'In which year did World War II end?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '1939', false, id FROM question WHERE content = 'In which year did World War II end?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '1918', false, id FROM question WHERE content = 'In which year did World War II end?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '1950', false, id FROM question WHERE content = 'In which year did World War II end?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Great Pyramid of Giza', true, id FROM question WHERE content = 'Which ancient wonder of the world still stands today?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Hanging Gardens', false, id FROM question WHERE content = 'Which ancient wonder of the world still stands today?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Colossus of Rhodes', false, id FROM question WHERE content = 'Which ancient wonder of the world still stands today?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Lighthouse of Alexandria', false, id FROM question WHERE content = 'Which ancient wonder of the world still stands today?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Christopher Columbus', true, id FROM question WHERE content = 'Who discovered America in 1492?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Vasco da Gama', false, id FROM question WHERE content = 'Who discovered America in 1492?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Marco Polo', false, id FROM question WHERE content = 'Who discovered America in 1492?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Ferdinand Magellan', false, id FROM question WHERE content = 'Who discovered America in 1492?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Roman Empire', true, id FROM question WHERE content = 'Which empire was ruled by Julius Caesar?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Ottoman Empire', false, id FROM question WHERE content = 'Which empire was ruled by Julius Caesar?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'British Empire', false, id FROM question WHERE content = 'Which empire was ruled by Julius Caesar?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Mongol Empire', false, id FROM question WHERE content = 'Which empire was ruled by Julius Caesar?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Java', true, id FROM question WHERE content = 'Which language is used for Spring Boot?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Python', false, id FROM question WHERE content = 'Which language is used for Spring Boot?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'C++', false, id FROM question WHERE content = 'Which language is used for Spring Boot?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'PHP', false, id FROM question WHERE content = 'Which language is used for Spring Boot?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'HyperText Markup Language', true, id FROM question WHERE content = 'What does HTML stand for?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'HighText Machine Language', false, id FROM question WHERE content = 'What does HTML stand for?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'HyperText Multi Language', false, id FROM question WHERE content = 'What does HTML stand for?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Home Tool Markup Language', false, id FROM question WHERE content = 'What does HTML stand for?';

INSERT INTO answer (answer_text, correct, question_id) SELECT '//', true, id FROM question WHERE content = 'Which symbol is used for single-line comments in JavaScript?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '/*', false, id FROM question WHERE content = 'Which symbol is used for single-line comments in JavaScript?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '#', false, id FROM question WHERE content = 'Which symbol is used for single-line comments in JavaScript?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '--', false, id FROM question WHERE content = 'Which symbol is used for single-line comments in JavaScript?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Cascading Style Sheets', true, id FROM question WHERE content = 'What does CSS stand for?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Computer Style Sheets', false, id FROM question WHERE content = 'What does CSS stand for?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Creative Style Sheets', false, id FROM question WHERE content = 'What does CSS stand for?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Colorful Style Sheets', false, id FROM question WHERE content = 'What does CSS stand for?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Stack', true, id FROM question WHERE content = 'Which data structure uses LIFO?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Queue', false, id FROM question WHERE content = 'Which data structure uses LIFO?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Array', false, id FROM question WHERE content = 'Which data structure uses LIFO?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Linked List', false, id FROM question WHERE content = 'Which data structure uses LIFO?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Albert Einstein', true, id FROM question WHERE content = 'Who wrote the theory of relativity?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Isaac Newton', false, id FROM question WHERE content = 'Who wrote the theory of relativity?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Galileo Galilei', false, id FROM question WHERE content = 'Who wrote the theory of relativity?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Stephen Hawking', false, id FROM question WHERE content = 'Who wrote the theory of relativity?';

INSERT INTO answer (answer_text, correct, question_id) SELECT '300,000 km/s', true, id FROM question WHERE content = 'What is the speed of light approximately?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '150,000 km/s', false, id FROM question WHERE content = 'What is the speed of light approximately?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '400,000 km/s', false, id FROM question WHERE content = 'What is the speed of light approximately?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '250,000 km/s', false, id FROM question WHERE content = 'What is the speed of light approximately?';

INSERT INTO answer (answer_text, correct, question_id) SELECT '1989', true, id FROM question WHERE content = 'In what year did the Berlin Wall fall?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '1991', false, id FROM question WHERE content = 'In what year did the Berlin Wall fall?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '1987', false, id FROM question WHERE content = 'In what year did the Berlin Wall fall?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '1990', false, id FROM question WHERE content = 'In what year did the Berlin Wall fall?';

INSERT INTO answer (answer_text, correct, question_id) SELECT '2x', true, id FROM question WHERE content = 'What is the derivative of x^2?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'x', false, id FROM question WHERE content = 'What is the derivative of x^2?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'x^2', false, id FROM question WHERE content = 'What is the derivative of x^2?';
INSERT INTO answer (answer_text, correct, question_id) SELECT '2', false, id FROM question WHERE content = 'What is the derivative of x^2?';

INSERT INTO answer (answer_text, correct, question_id) SELECT 'Gold', true, id FROM question WHERE content = 'Which element has the atomic number 79?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Silver', false, id FROM question WHERE content = 'Which element has the atomic number 79?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Platinum', false, id FROM question WHERE content = 'Which element has the atomic number 79?';
INSERT INTO answer (answer_text, correct, question_id) SELECT 'Mercury', false, id FROM question WHERE content = 'Which element has the atomic number 79?';