import asyncio

class Generator:
    def __init__(self, data):
        self.data = data
        self.vines = []
        self.id = 0
        self.numberOfVines = 0
        # ligação com a base de dados

    async def moisture(self):
        for sensor in self.data:
            if sensor['sensor'] == 'moisture':
                maxValue = sensor['range']['max']
                minValue = sensor['range']['min']
                phases = sensor['decrease']['phase']

        while True:
            self.id += 1
            if self.id == self.numberOfVines:
                self.id = 0

            vine = self.vines[self.id]
            decreaseValue = phases[vine.phase][vine.temperature]
            # obter a fase da vinha
            # usar as descidas do ficheiro de dados para simular a descida da humidade (random)
            # caso regue?

            # enviar para a queue

            await asyncio.sleep(60/self.numberOfVines) # sleep por 1 minuto para cada vinha