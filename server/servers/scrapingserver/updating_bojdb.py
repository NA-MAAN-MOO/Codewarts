import requests
from bs4 import BeautifulSoup
import json
from pymongo import MongoClient

client = MongoClient('mongodb+srv://juncheol:0000@cluster0.v0izvl3.mongodb.net/?retryWrites=true&w=majority')
db = client.codewart
collection = db.probs

# 백준 서버에 요청
headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
s = 1000    # 시작문제넘버
e = 1001    # 종료문제넘버

for num in range(s, e+1):
    probId = num
    data = requests.get(f'https://www.acmicpc.net/problem/{probId}',headers=headers)
    soup = BeautifulSoup(data.text, 'html.parser')

    try:
        prob_desc = soup.select_one('#problem_description').get_text()
    except:
        continue
    try: 
        source = soup.select_one('#source > p > a:nth-child(2)').get_text()
    except: 
        source = ''

    samples = {}
    for i in range(1, 50):
        inputval = soup.select_one(f'#sample-input-{i}')
        if (inputval == None):
            break
        else:
            outputval = soup.select_one(f'#sample-output-{i}')
            samples[str(i)] = {"input": inputval.get_text(), "output":outputval.get_text()}
            i += 1

    crawled_data = {
    "probId":probId,
    "prob_desc" : prob_desc,
    "prob_input" : prob_input,
    "prob_output" : prob_output,
    "samples" : samples,
    "source" : source
    }

    # DB에 삽입하기
    collection.insert_one(crawled_data)



