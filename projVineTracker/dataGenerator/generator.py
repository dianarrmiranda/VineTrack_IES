import asyncio
import datetime

import requests
import mysql.connector
import random
from sender import *

class Generator:
    def __init__(self, data):
        self.data = data
        self.sender = Send()
        self.sender.connect()
        self.vines = []
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

        # obter os ids das vinhas por ordem que foram adicionadas, do mais antigo para o mais recente
        self.cursor = self.connection.cursor()
        self.cursor.execute('SELECT id FROM vine ORDER BY id ASC')
        self.allIds = self.cursor.fetchall()
        self.id = None
        self.idIndex = 0
        if len(self.allIds) != 0:
            self.id = self.allIds[self.idIndex][0]


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

            self.cursor = self.connection.cursor()
            self.numberOfVines = self.cursor.execute('SELECT COUNT(*) FROM vine')
            self.numberOfVines = self.cursor.fetchone()[0]

            self.cursor = self.connection.cursor()
            self.cursor.execute('SELECT id FROM vine ORDER BY id ASC')
            self.allIds = self.cursor.fetchall()

            if len(self.allIds) != 0:
                if self.idIndex < len(self.allIds) - 1:
                    self.idIndex += 1
                else:
                    self.idIndex = 0

                self.id = self.allIds[self.idIndex][0]

                print(f'Vine {self.id} - Moisture')

                # vine = self.vines[self.id]
                self.cursor = self.connection.cursor()
                self.cursor.execute('SELECT * FROM vine WHERE id = %s', (self.id,))
                info = self.cursor.fetchall()
                if len(info) == 0:
                    continue
                info = info[0]
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

                if values[1][-2] < 35:
                    # vai haver uma probabilidade de 50% de regar
                    if random.randint(0, 1) == 1:
                        newValue = values[1][-2] + random.uniform(15, 25)

                    else:
                        newValue = self.decrease_moisture(decreaseValue[0], decreaseValue[1], values[1][-2])

                elif values[1][-2] - values[0][-2] > 0:
                    # vai aumentar até cheagar ao valor de humidade ideal
                    ideal = {'bud': [70, 80], 'flower': [80, 90], 'fruit': [80, 90], 'maturity': [60, 70]}

                    idealValues = ideal[phase]

                    # já está no valor ideal
                    if idealValues[0] < values[1][-2] < idealValues[1]:
                        newValue = self.decrease_moisture(decreaseValue[0], decreaseValue[1], values[1][-2])

                    else:
                        newValue = random.uniform(idealValues[0], idealValues[1])

                else:
                    newValue = self.decrease_moisture(decreaseValue[0], decreaseValue[1], values[1][-2])

                newValue = round(newValue, 2)
                message = {
                    'id': self.id,
                    'sensor': 'moisture',
                    'value': newValue
                }
                self.sender.send(message)

            if self.numberOfVines != 0:
                await asyncio.sleep(60/self.numberOfVines)
            else:
                await asyncio.sleep(60/1)

    async def temperature(self):

        locales = requests.get('http://api.ipma.pt/public-data/forecast/locations.json')
        locales = locales.json()

        locales = {locale['local']: locale['globalIdLocal'] for locale in locales}

        last_hour = 0
        last_day = datetime.date.today().strftime('%Y-%m-%d')
        change_day = False

        while True:
            self.connection = mysql.connector.connect(
                host='database',
                user='root',
                password='root',
                database='VTdb'
            )

            if self.id:
                self.cursor = self.connection.cursor()
                self.cursor.execute('SELECT city FROM vine WHERE id = %s', (self.id,))
                city = self.cursor.fetchone()[0]

                print(f'Vine {self.id} - Temperature')

                temp = requests.get(f'http://api.ipma.pt/public-data/forecast/aggregate/{locales[city]}.json')
                temp = temp.json()

                temp = {hour['dataPrev']: hour['tMed'] for hour in temp if 'tMed' in hour }

                today = datetime.date.today().strftime('%Y-%m-%d')
                time = datetime.datetime.now().strftime('%H')

                if last_hour == 0:
                    last_hour = int(time)
                elif last_hour + 1 == 24:
                    change_day = True
                    last_hour = 0
                    time = '00'
                else:
                    last_hour = last_hour + 1
                    time = str(last_hour)

                if last_day != today:
                    change_day = False
                    last_day = today

                if change_day == False and today == last_day:
                    last_day = today
                    
                    
                    print("last_hour: ", last_hour)
                    time = f'{time}:00:00'
                    temperture = float(temp[f'{today}T{time}'])

                    message = {
                        'id': self.id,
                        'sensor': 'temperature',
                        'value': temperture,
                        'day': today,
                        'date': time
                    }

                    self.sender.send(message)

                
            

            if self.numberOfVines != 0:
                await asyncio.sleep(60/self.numberOfVines)
            else:
                await asyncio.sleep(60/1)

    async def nutrients(self):
        for sensor in self.data:
            if sensor['sensor'] == 'nutrients':
                maxValue = sensor['range']['max']
                minValue = sensor['range']['min']
                phases = sensor['phase']

        while True:

            # values were added, we need to connect again
            self.connection = mysql.connector.connect(
                host='database',
                user='root',
                password='root',
                database='VTdb'
            )
            self.cursor = self.connection.cursor()
            self.numberOfVines = self.cursor.execute('SELECT COUNT(*) FROM vine')
            self.numberOfVines = self.cursor.fetchone()[0]

            self.cursor = self.connection.cursor()
            self.cursor.execute('SELECT id FROM vine ORDER BY id ASC')
            self.allIds = self.cursor.fetchall()

            if self.idIndex < len(self.allIds) - 1:
                self.idIndex += 1
            else:
                self.idIndex = 0

            self.id = self.allIds[self.idIndex][0]

            print(f'Vine {self.id} - Nutrients')

            # vine = self.vines[self.id]
            self.cursor = self.connection.cursor()
            self.cursor.execute('SELECT * FROM vine WHERE id = %s', (self.id,))
            info = self.cursor.fetchall()
            
            if len(info) == 0:
                continue
            info = info[0]
            phase = info[5]
            # temperature = info[7]
            nutrients = info[8] # Nutrientes vai ser do tipo [ (Nitrogen, 0.5), (Phosphorus, 0.5), (Potassium, 0.5), (Calcium, 0.5), (Magnesium, 0.5), (Chloride, 0.5) ]
            
            for nutrient in nutrients:
                if phase == 'flower':
                    match nutrient[0]: # Switch case precisa de correr em python 3.10
                        case 'Nitrogen':
                            if nutrient[1] > 1.6 and nutrient[1] < 2.7:
                                nutrient[1] += 0.1
                        case 'Phosphorus':
                            if nutrient[1] > 0.14 and nutrient[1] < 0.55:
                                nutrient[1] += 0.1
                        case 'Potassium':
                            if nutrient[1] > 0.65 and nutrient[1] < 1.3:
                                nutrient[1] += 0.1
                        case 'Calcium':
                            if nutrient[1] > 1.2 and nutrient[1] < 2.2:
                                nutrient[1] += 0.1
                        case 'Magnesium':
                            if nutrient[1] > 0.16 and nutrient[1] < 0.55:
                                nutrient[1] += 0.1
                        case 'Chloride':
                            if nutrient[1] < 0.5:
                                nutrient[1] += 0.1
                        case _:
                            print("Invalid nutrient")
                elif phase == 'fruit':
                    # repetir o codigo em cima, mas com os valores de nutrientes para a fase de fruit
                    pass
                else:
                    print("Phase without reference values")
            # if temperature < 12:
            #     decreaseValue = phases[phase]['cool']
            # elif temperature < 18:
            #     decreaseValue = phases[phase]['moderate']
            # elif temperature < 24:
            #     decreaseValue = phases[phase]['warm']
            # else:
            #     decreaseValue = phases[phase]['hot']
            # # obter a fase da vinha
            # # usar as descidas do ficheiro de dados para simular a descida da humidade (random)
            # # caso regue?
            # self.cursor = self.connection.cursor()
            # self.cursor.execute(f'SELECT * FROM track where vine_id = {self.id} ORDER BY date DESC LIMIT 2')
            # values = self.cursor.fetchall()
            # values = values[::-1]

            # if values[1][-2] < 35:
            #     # vai haver uma probabilidade de 50% de regar
            #     if random.randint(0, 1) == 1:
            #         newValue = values[1][-2] + random.uniform(15, 25)

            #     else:
            #         newValue = self.decrease_moisture(decreaseValue[0], decreaseValue[1], values[1][-2])

            # elif values[1][-2] - values[0][-2] > 0:
            #     # vai aumentar até cheagar ao valor de humidade ideal
            #     ideal = {'bud': [70, 80], 'flower': [80, 90], 'fruit': [80, 90], 'maturity': [60, 70]}

            #     idealValues = ideal[phase]

            #     # já está no valor ideal
            #     if idealValues[0] < values[1][-2] < idealValues[1]:
            #         newValue = self.decrease_moisture(decreaseValue[0], decreaseValue[1], values[1][-2])

            #     else:
            #         newValue = random.uniform(idealValues[0], idealValues[1])

            # else:
            #     newValue = self.decrease_moisture(decreaseValue[0], decreaseValue[1], values[1][-2])

            # newValue = round(newValue, 2) # pus 2 casas porque os valores são muito pequenos
            message = {
                'id': self.id,
                'sensor': 'nutrients',
                #'value': newValue
            }
            self.sender.send(message)

            await asyncio.sleep(60/self.numberOfVines) # envia dados a cada minuto para cada vinha
