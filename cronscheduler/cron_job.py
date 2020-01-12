import requests
import schedule
import time
import json
import scraper
import google_sheets


def job():
    print("Running Task")
    main_process()


def main_process():
    json_data = google_sheets.get_data()
    
    for job in json_data:
        if job['fields']['id'] == 'DELETED': 
            continue

        result = scraper.scrape(job['fields']['url'], job['fields']['selector'])

        header = {
            "Content-Type" : "application/json",
        }

        if job['fields']['initial_value'] == '':
            payload = {
                'id': job['fields']['id'],
                'initial_value': result[0].text,
                'error': job['fields']['error']
            }

            print(json.dumps(payload))
            
            r = requests.put('http://localhost:5000/jobs', data = json.dumps(payload), headers=header)
        else:
            if job['fields']['condition'] and job['fields']['value']:
                print('CHECKING CONDITION')
                condition = job['fields']['condition']
                value = job['fields']['value']
                initial_value = job['fields']['initial_value']
                condition_status = None
                
                if condition == '<':
                    condition_status = initial_value < value
                elif condition == '>':
                    condition_status = initial_value > value
                else:
                    condition_status = initial_value == value
                print(f'{initial_value} == {value}: {initial_value == value}')
                print(f'THIS IS CONDITION STATUS: {condition_status}')
                if condition_status:
                    print('value met condition')
                    payload = {
                        'id': job['fields']['id'],
                        'user_id': job['fields']['user_id']
                    }
                    r_sms = requests.post('http://localhost:5000/send-sms', data = json.dumps(payload), headers=header)
                    print(f'SEND SMS: {r_sms.status_code}')
                    r_del = requests.delete('http://localhost:5000/jobs', data = json.dumps(payload), headers=header)
                    print(f'DELETE: {r_del.status_code}')
            else:
                if result[0].text != job['fields']['initial_value']:
                    print(f'VALUE CHANGED')
                    payload = {
                        'id': job['fields']['id'],
                        'user_id': job['fields']['user_id']
                    }
                    r_sms = requests.post('http://localhost:5000/send-sms', data = json.dumps(payload), headers=header)
                    print(f'SEND SMS: {r_sms.status_code}')
                    r_del = requests.delete('http://localhost:5000/jobs', data = json.dumps(payload), headers=header)
                    print(f'DELETE: {r_del.status_code}')
            

def main():
    schedule.every(1).minutes.do(job)
    while 1:
        schedule.run_pending()
        time.sleep(1)


if __name__ == '__main__':
    main()