import asyncio
import mysql.connector

class Generator:
    def __init__(self, data):
        self.data = data
        self.vines = []
        self.id = 0
        self.numberOfVines = 0
        # ligação com a base de dados
        connection = mysql.connector.connect(
            host='172.22.0.2',
            user='root',
            password='root',
            database='VTdb'
        )
        self.cursor = connection.cursor()
        self.numberOfVines = self.cursor.execute('SELECT COUNT(*) FROM vine')
        self.numberOfVines = self.cursor.fetchone()[0]

    async def moisture(self):
        for sensor in self.data:
            if sensor['sensor'] == 'moisture':
                maxValue = sensor['range']['max']
                minValue = sensor['range']['min']
                phases = sensor['decrease']['phase']

        while True:
            self.id += 1
            if self.id > self.numberOfVines:
                self.id = 1

            vine = self.vines[self.id]
            decreaseValue = phases[vine.phase][vine.temperature]
            # obter a fase da vinha
            # usar as descidas do ficheiro de dados para simular a descida da humidade (random)
            # caso regue?
            self.cursor.execute('SELECT * FROM track where vine_id = 1 ORDER BY date DESC LIMIT 2')
            values = self.cursor.fetchall()
            for row in values:
                print(row)

            # enviar para a queue

            await asyncio.sleep(60/self.numberOfVines) # sleep por 1 minuto para cada vinha