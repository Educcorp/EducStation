import mysql.connector #importacion de la libreria mysql.connector
mydb = mysql.connector.connect( #conexion de la base de datos 
 #nombre del host 
  host="localhost", 
  #nombre del usuario 
  user="Educcorp",
  #contraseña del usuario
  password="yourpassword" 
)

mycursor = mydb.cursor()

mycursor.execute("CREATE DATABASE mydatabase")

