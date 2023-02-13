from flask import Flask, jsonify, request
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)

@app.route("/")
def home():
    return '백준 크롤링을 위한 서버'

@app.route('/data', methods=["GET"])
def data():
    probId = request.args.get("probId")

    headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(f'https://www.acmicpc.net/problem/{probId}',headers=headers)
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
            samples[i] = {"input": inputval.get_text(), "output":outputval.get_text()}
            i += 1

    crawled_data = {
    "prob_desc" : prob_desc,
    "prob_input" : prob_input,
    "prob_output" : prob_output,
    "samples" : samples
    }

    return jsonify(crawled_data)

# http://localhost:5000
if __name__ == "__main__":
    app.run('0.0.0.0',port=5000,debug=True)