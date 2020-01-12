import requests
import schedule
import time
import json
import re
import scraper
import google_sheets

def job():
    print("Running Task")
    main_process()


def regex_sub(string):
    return re.sub("[^0-9.]", "", string)


def main_process():
    json_data = google_sheets.get_data()
    
    for job in json_data:
        if job['fields']['id'] == 'DELETED': 
            continue

        result = scraper.scrape(job['fields']['url'], job['fields']['selector'])
        text = result[0].text

        header = {
            "Content-Type" : "application/json",
        }

        if job['fields']['initial_value'] == '':
            print(job['fields']['condition'] in ['"<"', '">"'])
            initial_value = regex_sub(text) if job['fields']['condition'] in ['"<"', '">"'] else text
            print(initial_value)
       
            payload = {
                'id': job['fields']['id'],
                'initial_value': initial_value,
                'error': job['fields']['error']
            }

            print(json.dumps(payload))
            
            r = requests.put('http://localhost:8080/jobs', data = json.dumps(payload), headers=header)
        else:
            if job['fields']['condition'] and job['fields']['value']:
                print('CHECKING CONDITION')
                condition = job['fields']['condition']
                target_value = job['fields']['value']
                value = text
                condition_status = None
                
                if condition == '"<"':
                    print(f'comparing <')
                    value = float(regex_sub(text))
                    target_value = float(regex_sub(target_value))
                    condition_status = target_value < value
                    print(f'{target_value}')
                    print(f'{value}')
                    print(target_value < value)
                 
                elif condition == '">"':
                    print(f'comparing >')
                    value = float(regex_sub(text))
                    target_value = float(regex_sub(target_value))
                    condition_status = target_value > value
                    print(f'{target_value}')
                    print(f'{value}')
                elif condition == '"!="':
                    print(f'comparing !=')
                    condition_status = target_value != value
                else:
                    print(f'comparing =')
                    condition_status = target_value == value
 
                if condition_status:
                    print('value met condition')
                    payload = {
                        'id': job['fields']['id'],
                        'user_id': job['fields']['user_id']
                    }
                    r_sms = requests.post('http://localhost:8080/send-sms', data = json.dumps(payload), headers=header)
                    print(f'SEND SMS: {r_sms.status_code}')
                    r_del = requests.delete('http://localhost:8080/jobs', data = json.dumps(payload), headers=header)
                    print(f'DELETE: {r_del.status_code}')
            else:
                if text != job['fields']['initial_value']:
                    print(f'VALUE CHANGED')
                    payload = {
                        'id': job['fields']['id'],
                        'user_id': job['fields']['user_id']
                    }
                    r_sms = requests.post('http://localhost:8080/send-sms', data = json.dumps(payload), headers=header)
                    print(f'SEND SMS: {r_sms.status_code}')
                    r_del = requests.delete('http://localhost:8080/jobs', data = json.dumps(payload), headers=header)
                    print(f'DELETE: {r_del.status_code}')
            

def main():
    # schedule.every(1).minutes.do(job)
    # while 1:
    #     schedule.run_pending()
    #     time.sleep(1)
    job()


if __name__ == '__main__':
    main()