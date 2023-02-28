import os
import time
from pymongo import MongoClient
import json
from bs4 import BeautifulSoup
import requests
from dotenv import load_dotenv
# load .env
load_dotenv()


mongoPassword = os.environ.get('mongoPassword')


client = MongoClient(
    f'mongodb+srv://juncheol:{mongoPassword}@cluster0.v0izvl3.mongodb.net/?retryWrites=true&w=majority')
db = client.codewart
collection = db.probs

# 백준 서버에 요청
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
s = 17682    # 시작문제넘버
e = 19999    # 종료문제넘버

miss = []

for num in range(s, e+1):
    data2 = requests.get(
        f'https://solved.ac/api/v3/problem/show?problemId={num}', headers=headers)

    if (data2.status_code != 200):
        miss.append(num)
        if (data2.status_code == 429):
            print(num, ":", "too many requests")
            break
        else:
            print(num, ":", "something is wrong")
        continue

    # Convert byte string to regular string
    data2_dict = json.loads(data2.text)

    # define the filter for the document to update
    filters = {"probId": num}

    # define the update operation
    update = {"$set": {"solvedAC": data2_dict}}

    # DB에 업데이트하기
    result = collection.update_one(filters, update)

    # print the result of the update operation
    print(num, ":", result.modified_count)
    # time.sleep(1)


print(miss)

# crawled_data = {
# "probId":probId,
# "prob_desc" : prob_desc,
# "prob_input" : prob_input,
# "prob_output" : prob_output,
# "samples" : samples,
# "source" : source
# }
