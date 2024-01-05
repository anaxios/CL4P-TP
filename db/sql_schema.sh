#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL

CREATE TABLE Users (
    UserID VARCHAR(255) PRIMARY KEY,
    UserName VARCHAR(255) NOT NULL,
    UserValidationKey VARCHAR(255) UNIQUE,
    APIKey VARCHAR(255),
    AIModelName VARCHAR(255),
    IsAllowed BOOLEAN DEFAULT TRUE
);

CREATE TABLE Bots (
    BotID VARCHAR(255) PRIMARY KEY,
    BotName VARCHAR(255) NOT NULL
);

CREATE TABLE Servers (
    ServerID VARCHAR(255) PRIMARY KEY,
    ServerName VARCHAR(255) NOT NULL,
    APIKey VARCHAR(255),
    AIModelName VARCHAR(255),
    IsAllowed BOOLEAN DEFAULT TRUE
);

CREATE TABLE Channels (
    ChannelID VARCHAR(255) PRIMARY KEY,
    ChannelName VARCHAR(255) NOT NULL,
    ServerID VARCHAR(255),
    FOREIGN KEY (ServerID) REFERENCES Servers(ServerID),
    IsAllowed BOOLEAN DEFAULT FALSE
);

CREATE TABLE ChatLogs (
    ChatID SERIAL PRIMARY KEY,
    UserID VARCHAR(255),
    BotID VARCHAR(255),
    ChannelID VARCHAR(255),
    MessageFromUser TEXT,
    MessageFromBot TEXT,
    UserMessageVectorID VARCHAR(255),
    BotMessageVectorID VARCHAR(255),
    TimeStamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (BotID) REFERENCES Bots(BotID),
    FOREIGN KEY (ChannelID) REFERENCES Channels(ChannelID)
);

CREATE TABLE TextVectors (
    VectorID VARCHAR(255) PRIMARY KEY,
    TextData TEXT NOT NULL,
    AssociatedUserID VARCHAR(255),
    AssociatedBotID VARCHAR(255),
    AssociatedChannelID VARCHAR(255),
    FOREIGN KEY (AssociatedUserID) REFERENCES Users(UserID),
    FOREIGN KEY (AssociatedBotID) REFERENCES Bots(BotID),
    FOREIGN KEY (AssociatedChannelID) REFERENCES Channels(ChannelID)
);

EOSQL

# export const sqlSchema = `
#     CREATE TABLE Users (
#         UserID INT PRIMARY KEY,
#         UserName VARCHAR(255) NOT NULL,
#         UserEmail VARCHAR(255) UNIQUE NOT NULL,
#         APIKey VARCHAR(255),
#         AIModelName VARCHAR(255)
#     );
    
#     CREATE TABLE Bots (
#         BotID INT PRIMARY KEY,
#         BotName VARCHAR(255) NOT NULL
#     );
    
#     CREATE TABLE Servers (
#         ServerID INT PRIMARY KEY,
#         ServerName VARCHAR(255) NOT NULL
#     );
    
#     CREATE TABLE Channels (
#         ChannelID INT PRIMARY KEY,
#         ChannelName VARCHAR(255) NOT NULL,
#         ServerID INT,
#         FOREIGN KEY (ServerID) REFERENCES Servers(ServerID)
#     );
    
#     CREATE TABLE ChatLogs (
#         ChatID INT AUTO_INCREMENT PRIMARY KEY,
#         UserID INT,
#         BotID INT,
#         ChannelID INT,
#         MessageFromUser TEXT,
#         MessageFromBot TEXT,
#         UserMessageVectorID VARCHAR(255),
#         BotMessageVectorID VARCHAR(255),
#         TimeStamp DATETIME DEFAULT CURRENT_TIMESTAMP,
#         FOREIGN KEY (UserID) REFERENCES Users(UserID),
#         FOREIGN KEY (BotID) REFERENCES Bots(BotID),
#         FOREIGN KEY (ChannelID) REFERENCES Channels(ChannelID)
#     );
    
#     CREATE TABLE TextVectors (
#         VectorID VARCHAR(255) PRIMARY KEY,
#         TextData TEXT NOT NULL,
#         UserID INT,
#         BotID INT,
#         ChannelID INT,
#         FOREIGN KEY (UserID) REFERENCES Users(UserID),
#         FOREIGN KEY (BotID) REFERENCES Bots(BotID),
#         FOREIGN KEY (ChannelID) REFERENCES Channels(ChannelID),
#         FOREIGN KEY (ServerID) REFERENCES Servers(ServerID)
#     );
    
# `;
