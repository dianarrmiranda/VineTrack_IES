import asyncio
import mysql.connector
import random
from sender import *

class Generator:
    def __init__(self, data):
        self.data = data
        self.sender = Send()
        self.sender.connect()
        self.vines = []
        self.id = 0
        self.numberOfVines = 0
        # ligação com a base de dados
        self.connection = mysql.connector.connect(
            host='database',
            user='root',
            password='root',
            database='VTdb'
        )
        self.cursor = self.connection.cursor()
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

            # vine = self.vines[self.id]
            self.cursor = self.connection.cursor()
            self.cursor.execute('SELECT * FROM vine WHERE id = %s', (self.id,))
            info = self.cursor.fetchall()[0]
            phase = info[6]
            temperature = info[8]
            temperature = int(temperature)
            if temperature < 12:
                decreaseValue = phases[phase]['cool']
            elif temperature < 18:
                decreaseValue = phases[phase]['moderate']
            elif temperature < 24:
                decreaseValue = phases[phase]['warm']
            else:
                decreaseValue = phases[phase]['hot']
            # obter a fase da vinha
            # usar as descidas do ficheiro de dados para simular a descida da humidade (random)
            # caso regue?
            self.cursor.execute('SELECT * FROM track where vine_id = 1 ORDER BY date DESC LIMIT 2')
            values = self.cursor.fetchall()
            values = values[::-1]
            if values[0][-1] - values[1][-1] > 0:
                # está a diminuir a humidade
                # obter um valor aleatório entre os valores de descida
                value = random.uniform(decreaseValue[0], decreaseValue[1])
                value = round(value, 2)

                newValue = values[1][-1] - value #  novo valor da humidade a enviar
                newValue = round(newValue, 2)
                message = {
                    'id': self.id,
                    'sensor': 'moisture',
                    'value': newValue
                }
                self.sender.send(message)

            await asyncio.sleep(60/self.numberOfVines) # sleep por 1 minuto para cada vinha