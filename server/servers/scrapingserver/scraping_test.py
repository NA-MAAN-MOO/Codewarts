import requests
from bs4 import BeautifulSoup
import json


headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
data = requests.get('https://www.acmicpc.net/problem/27000',headers=headers)
soup = BeautifulSoup(data.text, 'html.parser')

prob_desc = soup.select_one('#problem_description').get_text()
prob_input = soup.select_one('#problem_input').get_text()
prob_output = soup.select_one('#problem_output').get_text()

samples = {}
for i in range(1, 50):
    inputval = soup.select_one(f'#sample-input-{i}')
    if (inputval == None):
        break
    else:
        outputval = soup.select_one(f'#sample-output-{i}')
        samples[i] = inputval.get_text(), outputval.get_text()
        i += 1

crawled_data = {
"prob_desc" : prob_desc,
"prob_input" : prob_input,
"prob_output" : prob_output,
"samples" : samples

}

print(json.dumps(crawled_data))