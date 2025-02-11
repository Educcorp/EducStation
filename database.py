import sqlite3

# Nombre del archivo de la base de datos
db_name = "educcorp_blog.db"

# Establecer conexión con la base de datos
conn = sqlite3.connect(db_name)  # Crea el archivo si no existe
cursor = conn.cursor()

print("Conexión exitosa a la base de datos SQLite:", db_name)
 #importacion de la libreria mysql.connector
 #creacion de tablas en la base de datos 
 

