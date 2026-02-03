drop database if exists PruebaLivenotes;
create database PruebaLivenotes;
USE PruebaLivenotes;

CREATE TABLE Usuarios (
    UserID VARCHAR(50) PRIMARY KEY,
    Nickname VARCHAR(100),
    Gmail VARCHAR(100),
    Password VARCHAR(255),
    Rol VARCHAR(50)
);

CREATE TABLE Permisos (
    Rol VARCHAR(50) PRIMARY KEY,
    Permisos TEXT
);

CREATE TABLE Cuentas_Bancarias (
    UserID VARCHAR(50),
    CuentaId VARCHAR(50),
    Nombre VARCHAR(100),
    Balance DECIMAL(15, 2),
    PRIMARY KEY (UserID, CuentaId),
    FOREIGN KEY (UserID) REFERENCES Usuarios(UserID)
);

CREATE TABLE Movimientos (
    UserID VARCHAR(50),
    MovimientoID VARCHAR(50),
    Fecha DATE,
    Destinatario VARCHAR(100),
    Importe DECIMAL(15, 2),
    Origen VARCHAR(100),
    Metodo VARCHAR(50),
    PRIMARY KEY (UserID, MovimientoID),
    FOREIGN KEY (UserID) REFERENCES Usuarios(UserID)
);

CREATE TABLE Eventos (
    EventoID VARCHAR(50) PRIMARY KEY,
    UserID VARCHAR(50),
    Fecha DATE,
    Titulo VARCHAR(200),
    Añadido DATETIME,
    Hora_Empiece TIME,
    Hora_Fin TIME,
    FOREIGN KEY (UserID) REFERENCES Usuarios(UserID)
);

CREATE TABLE Notificacion (
    EventoID VARCHAR(50),
    Notificacion VARCHAR(50),
    Texto TEXT,
    PRIMARY KEY (EventoID, Notificacion),
    FOREIGN KEY (EventoID) REFERENCES Eventos(EventoID)
);

CREATE TABLE MoodEntries (
    UserID VARCHAR(50),
    Fecha DATE,
    Mood VARCHAR(50),
    Razon TEXT,
    PRIMARY KEY (UserID, Fecha),
    FOREIGN KEY (UserID) REFERENCES Usuarios(UserID)
);

CREATE TABLE Habit_Tracker (
    UserID VARCHAR(50),
    Fecha DATE,
    HabitID VARCHAR(50),
    Nombre_Habito VARCHAR(200),
    Completado BOOLEAN DEFAULT FALSE,
    Notas TEXT,
    PRIMARY KEY (UserID, Fecha, HabitID),
    FOREIGN KEY (UserID) REFERENCES Usuarios(UserID)
);

CREATE TABLE ToDo_List (
    UserID VARCHAR(50),
    ToDoID VARCHAR(50),
    Title VARCHAR(200),
    PRIMARY KEY (UserID, ToDoID),
    FOREIGN KEY (UserID) REFERENCES Usuarios(UserID)
);

CREATE TABLE Item (
    ItemID VARCHAR(50),
    ToDoItem VARCHAR(50),
    UserID VARCHAR(50),
    ToDoID VARCHAR(50),
    Tarea VARCHAR(200),
    Estado VARCHAR(50),
    Nivel INT,
    PRIMARY KEY (ItemID),
    FOREIGN KEY (UserID, ToDoID) REFERENCES ToDo_List(UserID, ToDoID)
);

CREATE TABLE Schedule (
    UserID VARCHAR(50),
    ToDoID VARCHAR(50),
    HorarioID VARCHAR(50),
    Duracion INT,
    PRIMARY KEY (UserID, ToDoID, HorarioID),
    FOREIGN KEY (UserID, ToDoID) REFERENCES ToDo_List(UserID, ToDoID)
);

CREATE TABLE Item_Schedule (
    UserID VARCHAR(50),
    ToDoID VARCHAR(50),
    HorarioID VARCHAR(50),
    Tarea VARCHAR(200),
    Dificultad INT,
    Urgencia INT,
    Importancia INT,
    PRIMARY KEY (UserID, ToDoID, HorarioID),
    FOREIGN KEY (UserID, ToDoID, HorarioID) REFERENCES Schedule(UserID, ToDoID, HorarioID)
);

ALTER TABLE Usuarios
ADD FOREIGN KEY (Rol) REFERENCES Permisos(Rol);
