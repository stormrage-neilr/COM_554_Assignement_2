drop database if exists b00451753;
CREATE database b00451753;

use b00451753;

drop table if exists News_Items;

create table News_Items(
	Link varchar(256) not null,
	Title varchar(256) not null,
	Image_Source varchar(256) not null,
	Description text not null,
	Channels text not null,
	Publish_Date varchar(32) not null,
	Views int);

drop PROCEDURE if exists sp1_insert;
delimiter //
CREATE PROCEDURE sp1_insert(
  IN inputLink varchar(256) ,
  IN inputTitle varchar(256) ,
  IN inputImageSource varchar(256) ,
  IN inputDescription text ,
  IN inputChannels text ,
  IN inputPublishDate varchar(32))
BEGIN
INSERT INTO News_Items(Link, Title, Image_Source, Description, Channels, Publish_Date, Views)
(SELECT inputLink, inputTitle, inputImageSource, inputDescription, inputChannels, inputPublishDate, 0
WHERE (SELECT COUNT(*) FROM News_Items WHERE News_Items.Link = inputLink) = 0);
END ;//
delimiter ;
