import requests
from bs4 import BeautifulSoup


def scrape(url, selector=''):
    r = requests.get(url)
    soup = BeautifulSoup(r.text, "html.parser")
    return soup.select(selector)


if __name__ == '__main__':
    url = 'https://www.rottentomatoes.com/'
    selector = '.middle_col a'
    scrape(url, selector)