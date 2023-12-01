import asyncio
import json

from generator import Generator

if __name__ == '__main__':
    data_file = 'data/dataValues.json'
    with open(data_file) as json_file:
        data = json.load(json_file)

    generator = Generator(data)
    loop = asyncio.get_event_loop()

    #moisture = loop.create_task(generator.moisture())
    nutrient = loop.create_task(generator.nutrients())

    #loop.run_until_complete(asyncio.gather(moisture))
    loop.run_until_complete(asyncio.gather(nutrient))
    loop.close()