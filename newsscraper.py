import json
import requests


key='AIzaSyDjFArWaYiHSMWp6J4HK9-yffwLSB-UuZ8'
cseid='57c0778e4a59c4e6d'

url = 'https://www.googleapis.com/customsearch/v1'

request_result=requests.get(url,
    params={
        'key': key,
        'cx': cseid,
        'q': 'ice raid news',
        'num': 10,
        'tbm':'nws',
        'sort':'date'
    }
)

request_result.raise_for_status()
req = request_result.json()

for item in req['items']:
    print(item['link'])

#ice_news = open("ice_news.json", "w")
#json.dump(request_result.json(), ice_news, indent=2)
#ice_news.close()