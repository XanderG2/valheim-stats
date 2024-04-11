import json
import os

files = list(os.walk("data/"))
files = ["data/"+file for file in files[0][2]]

totalData = {}

for file in files:
    with open(file, "r") as f:
        jsonData = json.loads(f.read())
    totalData.update(jsonData)

with open("all.json", "w") as f:
    f.write(json.dumps(totalData, indent=2))