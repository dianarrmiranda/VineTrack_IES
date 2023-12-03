import asyncio
import json
import time

from generator import Generator

if __name__ == '__main__':
    data_file = 'data/dataValues.json'
    with open(data_file) as json_file:
        data = json.load(json_file)

    generator = Generator(data)
    loop = asyncio.get_event_loop()
    
    while len(generator.allIds) == 0:
        print("No vine IDs found. Waiting for 60 seconds before trying again.")
        time.sleep(60)

    tasks = []
    allIds = generator.allIds
    for id in allIds:
        generator.id = id
        tasks.append(loop.create_task(generator.moisture()))
        tasks.append(loop.create_task(generator.nutrients()))
        tasks.append(loop.create_task(generator.temperature()))
        tasks.append(loop.create_task(generator.weatherAlerts()))

    loop.run_until_complete(asyncio.gather(*tasks))
    loop.close()