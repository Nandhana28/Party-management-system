import mysql.connector

# Establish a connection to the MySQL server
conn = mysql.connector.connect(
    host='localhost',         # or use the IP address where the MySQL server is running
    user='root',              # your MySQL username
    password='',  # your MySQL password
    database='project'        # the database you want to connect to
)

# Check if the connection is successful
if conn.is_connected():
    print("✅ Successfully connected to the database")
else:
    print("❌ Failed to connect")

# Create a cursor object
cursor = conn.cursor()

# Example: Querying the database to fetch existing records
cursor.execute("SELECT * FROM Login1")
for row in cursor.fetchall():
    print(row)

# Insert a new record into the Login1 table
cursor.execute("INSERT INTO Login1(username, pass) VALUES (%s, %s)", ("Ritujaa", "jaswant"))
conn.commit()  # Don't forget to commit the transaction!

# Fetch and print the updated table (after the INSERT)
cursor.execute("SELECT * FROM Login1")
for row in cursor.fetchall():
    print(row)

# Close the cursor and connection when done
cursor.close()
conn.close()
