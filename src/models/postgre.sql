


CREATE TABLE libBook(
    book_id serial PRIMARY KEY,
    isbn bigint not null check(isbn > 0),
    title varchar(255) not null, 
    description varchar(255) not null,
    publisher varchar(255) not null,
    author varchar(255) not null,
    isAvailable boolean default true,
    publishedDate date not null,
    category TEXT[]
    
    );
    
    
create table userk(
    user_id serial PRIMARY KEY,
    firstname varchar(255) not null,
    lastname varchar(255) not null,
    email varchar(255) unique not null,
    passhash varchar(255) not null,
    isAdmin boolean default false,
    creationDate date not null
    );
 
 create table borrowings (
    borrowing_id serial primary key,
    user_id integer,
    book_id integer,
    borrowDate date not null,
    returnDate date,
    foreign key (user_id) references userk (user_id) on delete cascade,
    foreign key (book_id) references libBook (book_id) on delete cascade
   );
     
     
     
 insert into libBook
 (isbn, title, description, publisher, author, isAvailable, publishedDate, category)
 values(9781593275846, 'Eloquent JavaScript, Second Edition', 'JavaScript lies at the heart', 'No Starch Press', 'Marijn Haverbeke', true, '2014-12-31' , Array['Coding', 'Classics']),
       (9781449331818, 'Learning JavaScript Design Patterns', 'you ll learn how to write beautiful code', 'O Reilly Media', 'Addy Osmani', true, '2012-12-31' , Array['Coding', 'Classics']),
       (9781449365035, 'Speaking JavaScript', 'Like it or not, JavaScript is everywhere', 'O Reilly Media', 'Axel Rauschmayer', true, '2014-12-31' , Array['Coding', 'Classics']);


 insert into userk
 (firstname, lastname, email, passhash, isAdmin, creationDate)
 values('Stepashka', 'Zaicev', 'stepa_007@gmail.com', 'wedwedwedwed', false, '2014-12-31'),
         ('Hrusha', 'Porosenkov', 'hru_77@gmail.com', 'wedwedwedwed', false, '2014-12-31'),
       ('Karkusha', 'Voronova', 'kar99@gmail.com', 'edededed', true, '2014-12-31');


insert into borrowings
(user_id, book_id, borrowDate, returnDate)
values(1, 2, '2020-10-27', null), (2,1, '2020-08-31','2020-09-05');

select * from libBook;
select * from userk;
select * from borrowings;
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
     