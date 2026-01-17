import json

buffer=""
base_json = open("icescrape_json.txt", "r") 
parsed_json = open("icescrape_pretty.json", "w")
for line in base_json:
    line = line.replace("\n", "").replace("\r", "").replace("\t", "")
    buffer+=line
    try:
        data = json.loads(buffer)
        json.dump(data, parsed_json,indent=2)
        buffer=""
    except Exception as e:
        # Incomplete JSON, continue accumulating
        print(e)
        print(":(")
        continue
    #print(buffer)
    buffer=""

