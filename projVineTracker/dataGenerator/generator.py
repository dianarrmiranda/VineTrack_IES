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
                    phase = info[7]
                    temperature = info[9]
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
                    if values[1][-2] < 40:
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

                    dic = {}

                    for hour in temp:
                        if 'tMed' in hour:
                            dic[hour['dataPrev']] = hour['tMed']
                        else:
                            dic[hour['dataPrev']] = str((float(hour['tMin']) + float(hour['tMax'])) / 2)

                    today = datetime.date.today().strftime('%Y-%m-%d')
                    time = datetime.datetime.now().strftime('%H')

                    if self.id not in last_hours:
                        last_hours[self.id] = [int(time), False, today]
                    else:
                        if last_hours[self.id][0] + 1 == 24:
                            last_hours[self.id][1] = True 
                            last_hours[self.id][0] = 00
                            last_hours[self.id][2] = today
                            time = '00'
                        elif last_hours[self.id][2] != today:
                            last_hours[self.id][1] = False 
                            last_hours[self.id][0] = int(time)
                            last_hours[self.id][2] = today
                        else:
                            last_hours[self.id][0] = last_hours[self.id][0] + 1
                            last_hours[self.id][1] = False
                            last_hours[self.id][2] = today
                            time = str(last_hours[self.id][0]).zfill(2)

                    if last_hours[self.id][1]  == False and today == last_hours[self.id][2]:
                                            
                        time = f'{time}:00:00'
                        temperture = float(dic[f'{today}T{time}'])

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
                            if str(alert['awarenessTypeName']) not in value:
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

    async def nutrients(self):
        for sensor in self.data:
            if sensor['sensor'] == 'nutrients':
                maxValue = sensor['range']['max']
                minValue = sensor['range']['min']
                phases = sensor['phase']

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

                if self.idIndex < len(self.allIds) - 1:
                    self.idIndex += 1
                else:
                    self.idIndex = 0

                self.id = self.allIds[self.idIndex][0]

                print(f'Vine {self.id} - Nutrients')

                # vine = self.vines[self.id]
                self.cursor = self.connection.cursor()
                self.cursor.execute('SELECT * FROM nutrient WHERE id = %s', (self.id,))
                info = self.cursor.fetchall()

                if len(info) == 0:
                    continue
                print(info) # O info vai ter o id, a fase e os nutrientes da tabela nutrient
                info = info[0]
                phase = info[-1]
                # Nutrientes vai ser do tipo [ (Nitrogen, 0.5), (Phosphorus, 0.5), (Potassium, 0.5), (Calcium, 0.5), (Magnesium, 0.5), (Chloride, 0.5) ]
                nutrients = {
                    "Nitrogen": info[1],
                    "Phosphorus": info[2],
                    "Potassium": info[3],
                    "Calcium": info[4],
                    "Magnesium": info[5],
                    "Chloride": info[6]
                }
                self.cursor = self.connection.cursor()
                self.cursor.execute(f'SELECT * FROM track where vine_id = {self.id} ORDER BY date DESC LIMIT 2')
                values = self.cursor.fetchall()
                values = values[::-1]

                idealPFlower = { "Nitrogen": [1.6,2.7],"Phosphorus": [0.14, 0.55],"Potassium": [0.65, 1.3],"Calcium": [1.2, 2.2],"Magnesium": [0.16, 0.55],"Chloride": [0.5]} 
                idealPFruit = { "Nitrogen": [1.5,2.4],"Phosphorus": [0.12, 0.45],"Potassium": [0.55, 1.05],"Calcium": [1.5, 2.4],"Magnesium": [0.2, 0.6],"Chloride": [0.5]}
                
                for nutrient, value in nutrients.items():
                    match nutrient: # Switch case precisa de correr em python 3.10
                        case 'Nitrogen':
                            if values[1][-2] < 1.3: # com este valor, o agirultor vai colocar o nutriente em falta, já que está abaixo do valor ideal de qualquer fase
                            
                            # vai haver uma probabilidade de 20% de o agricultor colocar o nutriente em falta
                                if random.randint(0, 4) == 1:
                                    nutrients["Nitrogen"] = values[1][-2] + round(random.uniform(15, 25),2)
                                else:
                                    nutrients["Nitrogen"] = round(self.decrease_moisture(phases["flower"]["Nitrogen"][0], phases["flower"]["Nitrogen"][1], values[1][-2]),2)
                            elif values[1][-2] - values[0][-2] > 0:
                                # vai aumentar até cheagar ao valor de humidade ideal
                                
                                if phase == 'flower':
                                    if value > 1.6 and value < 2.7:
                                    
                                    #já está no valor ideal
                                        nutrients["Nitrogen"] = round(self.decrease_moisture(phases["flower"]["Nitrogen"][0], phases["flower"]["Nitrogen"][1], values[1][-2]),2)
                                    else:
                                        nutrients["Nitrogen"] = round(random.uniform(idealPFlower["Nitrogen"][0], idealPFlower["Nitrogen"][1]),2)
                                elif phase == 'fruit':
                                    if value > 1.5 and value < 2.4:
                                    
                                    #já está no valor ideal
                                        nutrients["Nitrogen"] = round(self.decrease_moisture(phases["fruit"]["Nitrogen"][0], phases["fruit"]["Nitrogen"][1], values[1][-2]),2)
                                    else:
                                        nutrients["Nitrogen"] = round(random.uniform(idealPFruit["fruit"]["Nitrogen"][0], idealPFruit["fruit"]["Nitrogen"][1]),2)
                            else:
                                nutrients["Nitrogen"] = round(self.decrease_moisture(phases["fruit"]["Nitrogen"][0], phases["fruit"]["Nitrogen"][1], values[1][-2]),2) # Colocar aqui um dividir por 2 para ser mais lento????
                        case 'Phosphorus':
                            if value > 0.14 and value < 0.55:
                                value += 0.1
                        case 'Potassium':
                            if value > 0.65 and value < 1.3:
                                value += 0.1
                        case 'Calcium':
                            if value > 1.2 and value < 2.2:
                                value += 0.1
                        case 'Magnesium':
                            if value > 0.16 and value < 0.55:
                                value += 0.1
                        case 'Chloride':
                            if values[1][-2] < 0.4:
                            
                            # vai haver uma probabilidade de 30% de o valor passar dos 0.5
                                if random.randint(0, 9) == 1:
                                    nutrients["Chloride"] = round(values[1][-2] + random.uniform(35, 45),2)
                                else:
                                    nutrients["Chloride"]  = round(self.decrease_moisture(0,phases["flower"]["Chloride"][0], values[1][-2]),2)
                            elif values[1][-2] - values[0][-2] > 0:
                                # vai aumentar até chegar ao valor limite
                                
                                if value > 0.5:
                                # Já está a passar o valor limite
                                    nutrients["Chloride"]  = round(self.decrease_moisture(0,phases["flower"]["Chloride"][0], values[1][-2]),2)
                                else:
                                    nutrients["Chloride"]  = round(random.uniform(0,idealPFruit["Chloride"][0]),2)
                            else:
                                nutrients["Chloride"]  = round(self.decrease_moisture(0,phases["flower"]["Chloride"][0], values[1][-2]),2)
                        case _:
                            print("Invalid nutrient")
                            pass
                
                message = {
                    'id': self.id,
                    'sensor': 'nutrients',
                    'phase': phase,
                    'value': nutrients
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
