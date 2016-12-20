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
	Publish_Date DATETIME not null,
	Views int);

drop PROCEDURE if exists sp1_insert;
delimiter //
CREATE PROCEDURE sp1_insert(
  IN inputLink varchar(256),
  IN inputTitle varchar(256),
  IN inputImageSource varchar(256),
  IN inputDescription text,
  IN inputChannel text,
  IN inputPublishDate varchar(20))
BEGIN
  if ((SELECT count(*) FROM News_Items WHERE News_Items.Link = inputLink) = 0) THEN
    INSERT INTO News_Items(Link, Title, Image_Source, Description, Channels, Publish_Date, Views)
    (SELECT inputLink, inputTitle, inputImageSource, inputDescription, inputChannel, STR_TO_DATE(inputPublishDate, '%d-%m-%Y %H:%i:%s'), 0);
  ELSEIF ((SELECT count(*) FROM News_Items WHERE News_Items.Channels like CONCAT("%", inputChannel, "%") AND News_Items.Link = inputLink) = 0) THEN
    UPDATE News_Items SET News_Items.Channels = CONCAT(News_Items.Channels, " | ", inputChannel) WHERE News_Items.Link = inputLink;
  END if;
END ;//
delimiter ;

drop PROCEDURE if exists sp2_getNewsByType;
delimiter //
CREATE PROCEDURE sp2_getNewsByType(
  IN inputType varchar(32))
BEGIN
  SELECT * FROM News_Items WHERE News_Items.Channels like CONCAT("%", inputType, "%")
  ORDER BY News_Items.Publish_Date DESC;
END ;//
delimiter ;

drop PROCEDURE if exists sp3_getNewsByLink;
delimiter //
CREATE PROCEDURE sp3_getNewsByLink(
  IN inputLink varchar(256))
BEGIN
  UPDATE News_Items SET News_Items.Views = News_Items.Views + 1 WHERE News_Items.Link = inputLink;
  SELECT * FROM News_Items WHERE News_Items.Link = inputLink;
END ;//
delimiter ;

drop PROCEDURE if exists sp4_getNewsByViews;
delimiter //
CREATE PROCEDURE sp4_getNewsByViews()
BEGIN
  SELECT * FROM News_Items WHERE News_Items.Views > 0
  ORDER BY News_Items.Views DESC;
END ;//
delimiter ;

drop PROCEDURE if exists sp5_getNewsBySearch;
delimiter //
CREATE PROCEDURE sp5_getNewsBySearch(
  IN inputSearchText varchar(256))
BEGIN
  SELECT * FROM News_Items WHERE News_Items.Title like CONCAT("%", inputSearchText, "%") OR News_Items.Description like CONCAT("%", inputSearchText, "%")
  ORDER BY News_Items.Publish_Date DESC;
END ;//
delimiter ;
