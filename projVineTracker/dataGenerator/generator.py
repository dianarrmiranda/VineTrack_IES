import asyncio
import datetime
import time

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
        while True:

            try: 
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
                self.idIndex = 0

                while len(self.allIds) == 0:
                    time.sleep(60)
                    self.connection = mysql.connector.connect(
                        host='database',
                        user='root',
                        password='root',
                        database='VTdb'
                    )
                    self.cursor = self.connection.cursor()
                    self.cursor.execute('SELECT id FROM vine ORDER BY id ASC')
                    self.allIds = self.cursor.fetchall()
                    print("self.allIds: ", self.allIds)
                    print("No vine IDs found. Waiting for 60 seconds before trying again.")
                    

                self.id = self.allIds[self.idIndex][0]

                break
            except mysql.connector.Error as err:
                print(f"Error: {err}")
                self.numberOfVines = 0
                self.id = None
                self.idIndex = 0
                
                time.sleep(60)

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
            try: 
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
                    self.cursor.execute(f"SELECT * FROM track where type='moisture' and vine_id = {self.id} ORDER BY date DESC LIMIT 2")
                    values = self.cursor.fetchall()
                    values = values[::-1]
                    if values[1][-2] < 35:
                        # vai haver uma probabilidade de 80% de regar
                        if random.randint(0, 100) < 80:
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
            except mysql.connector.Error as err:
                print(f"Error: {err}")
                if self.numberOfVines != 0:
                    await asyncio.sleep(60/self.numberOfVines)
                else:
                    await asyncio.sleep(60/1)

    async def temperature(self):

        locales = requests.get('http://api.ipma.pt/public-data/forecast/locations.json')
        locales = locales.json()

        locales = {locale['local']: locale['globalIdLocal'] for locale in locales}

        last_hours = {}
        last_day = datetime.date.today().strftime('%Y-%m-%d')


        while True:
            try:
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

                    if self.id not in last_hours:
                        last_hours[self.id] = [int(time), False]
                    else:
                        if last_hours[self.id][0] + 1 == 24:
                            last_hours[self.id][1] = True 
                            last_hours[self.id][0] = 0
                            time = '00'
                        else:
                            last_hours[self.id][0] = last_hours[self.id][0] + 1
                            time = str(last_hours[self.id][0])

                    if last_day != today:
                        last_hours[self.id][1] = False 
                        last_day = today

                    if last_hours[self.id][1]  == False and today == last_day:
                        last_day = today
                                            
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
            except mysql.connector.Error as err:
                print(f"Error: {err}")
                if self.numberOfVines != 0:
                    await asyncio.sleep(60/self.numberOfVines)
                else:
                    await asyncio.sleep(60/1)

    async def weatherAlerts(self):
        locales = requests.get('http://api.ipma.pt/public-data/forecast/locations.json')
        locales = locales.json()

        locales = {locale['local']: locale['idAreaAviso'] for locale in locales}

        while True:
            try:
                self.connection = mysql.connector.connect(
                    host='database',
                    user='root',
                    password='root',
                    database='VTdb'
                )

                if self.id:
                    print(f'Vine {self.id} - Weather Alerts')

                    self.cursor = self.connection.cursor()
                    self.cursor.execute('SELECT city FROM vine WHERE id = %s', (self.id,))
                    city = self.cursor.fetchone()[0]

                    idAreaAviso = locales[city]

                    alerts = requests.get(f'https://api.ipma.pt/open-data/forecast/warnings/warnings_www.json')
                    alerts = alerts.json()

                    alerts = [alert for alert in alerts if alert['idAreaAviso'] == idAreaAviso]
                    value = {}

                    for alert in alerts:
                        if str(alert['awarenessTypeName']) == 'Vento' or str(alert['awarenessTypeName']) == 'Precipitação' or str(alert['awarenessTypeName']) == 'Trovoada' or str(alert['awarenessTypeName']) == 'Neve' or str(alert['awarenessTypeName']) == 'Nevoeiro': 
                            value[str(alert['awarenessTypeName'])] = [str(alert['startTime']), str(alert['endTime']), str(alert['awarenessLevelID']), str(alert['text'])]

                    message = {
                        'id': self.id,
                        'sensor': 'weatherAlerts',
                        'value': str(value)
                    }

                    self.sender.send(message)

                if self.numberOfVines != 0:
                    await asyncio.sleep(60/self.numberOfVines)
                else:
                    await asyncio.sleep(60/1)
                    
            except mysql.connector.Error as err:
                print(f"Error: {err}")
                if self.numberOfVines != 0:
                    await asyncio.sleep(60/self.numberOfVines)
                else:
                    await asyncio.sleep(60/1)
