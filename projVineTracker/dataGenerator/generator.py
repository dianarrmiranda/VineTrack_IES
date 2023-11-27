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

    def decrease_moisture(self, min, max, previousValue):
        value = random.uniform(min, max)
        if value < 0:
            value = 0
        value = round(value, 2)
        newValue = previousValue - value
        if newValue < 0:
            newValue = 0
        return newValue

    async def moisture(self):

        for sensor in self.data:
            if sensor['sensor'] == 'moisture':
                maxValue = sensor['range']['max']
                minValue = sensor['range']['min']
                phases = sensor['decrease']['phase']

        while True:

            # values were added, we need to connect again
            self.connection = mysql.connector.connect(
                host='database',
                user='root',
                password='root',
                database='VTdb'
            )
            
            self.id += 1
            if self.id > self.numberOfVines:
                self.id = 1

            # vine = self.vines[self.id]
            self.cursor = self.connection.cursor()
            self.cursor.execute('SELECT * FROM vine WHERE id = %s', (self.id,))
            info = self.cursor.fetchall()[0]
            phase = info[6]
            temperature = info[8]
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
            self.cursor = self.connection.cursor()
            self.cursor.execute(f'SELECT * FROM track where vine_id = {self.id} ORDER BY date DESC LIMIT 2')
            values = self.cursor.fetchall()
            values = values[::-1]

            if values[1][-1] < 35:
                # vai haver uma probabilidade de 50% de regar
                if random.randint(0, 1) == 1:
                    newValue = values[1][-1] + random.uniform(15, 25)

                else:
                    newValue = self.decrease_moisture(decreaseValue[0], decreaseValue[1], values[1][-1])

            elif values[1][-1] - values[0][-1] > 0:
                # vai aumentar até cheagar ao valor de humidade ideal
                ideal = {'bud': [70, 80], 'flower': [80, 90], 'fruit': [80, 90], 'maturity': [60, 70]}

                idealValues = ideal[phase]

                # já está no valor ideal
                if idealValues[0] < values[1][-1] < idealValues[1]:
                    newValue = self.decrease_moisture(decreaseValue[0], decreaseValue[1], values[1][-1])

                else:
                    newValue = random.uniform(idealValues[0], idealValues[1])

            else:
                newValue = self.decrease_moisture(decreaseValue[0], decreaseValue[1], values[1][-1])

            newValue = round(newValue, 2)
            message = {
                'id': self.id,
                'sensor': 'moisture',
                'value': newValue
            }
            self.sender.send(message)

            await asyncio.sleep(60/self.numberOfVines) # envia dados a cada minuto para cada vinha
