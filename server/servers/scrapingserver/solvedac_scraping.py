import requests
import os


for i in range(2, 31):
    image_url = f'https://static.solved.ac/tier_small/{i}.svg'
    response = requests.get(image_url)
    os.makedirs('images', exist_ok=True)
    if response.status_code == 200:
        with open(f"images/{i}.svg", "wb") as f:
            f.write(response.content)
            print("이미지 다운로드 완료")


