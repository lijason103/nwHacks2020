import requests

def get_data():
    r = requests.get('http://localhost:8080/all-jobs')
    return r.json()

if __name__ == '__main__':
    get_data()