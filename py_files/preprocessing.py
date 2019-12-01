import pandas as pd
from nltk import RegexpTokenizer
from nltk.corpus import stopwords
from datetime import datetime
from time import strptime
import requests

GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyA7qQFHxq1Xv4kNSoRh8eazfmA6WQfHaRs'


def clean_review(raw_file_path, save_file_path):
    df = pd.read_csv(raw_file_path)
    new_df = pd.DataFrame()
    netflix_df = pd.DataFrame()
    stop_words = set(stopwords.words('english'))
    for index, row in df.iterrows():
        keep = True
        for c in df.columns:
            if row[c] == 'none':
                keep = False
        if keep:
            new_df.loc[index, 'company'] = row['company']
            new_df.loc[index, 'location'] = row['location']

            new_df.loc[index, 'dates'] = datetime(int(row['dates'].split(', ')[-1]),
                                                  int(strptime(row['dates'].split(', ')[0].split(' ')[1], '%b').tm_mon),
                                                  int(row['dates'].split(', ')[0].split(' ')[2]))
            new_df.loc[index, 'overall-ratings'] = int(float(row['overall-ratings']))
            new_df.loc[index, 'work-balance-stars'] = int(float(row['work-balance-stars']))
            new_df.loc[index, 'culture-values-stars'] = int(float(row['culture-values-stars']))
            new_df.loc[index, 'carrer-opportunities-stars'] = int(float(row['carrer-opportunities-stars']))
            new_df.loc[index, 'comp-benefit-stars'] = int(float(row['comp-benefit-stars']))
            new_df.loc[index, 'senior-mangemnet-stars'] = int(float(row['senior-mangemnet-stars']))

            categories = ["summary", "pros", "cons", "advice-to-mgmt"]
            raw_text = ''
            cleaned_text = ''
            context = ""
            for category in categories:
                if type(row[category]) == str and row[category] != 'none':
                    context += row[category] + " "
            raw_text += context
            cleaned_text += ' '.join(
                [i.lower() for i in RegexpTokenizer(r'\w+').tokenize(context) if not i.lower() in stop_words])

            new_df.loc[index, 'raw_comments'] = raw_text
            # new_df.loc[index, 'cleaned_comments'] = cleaned_text
    new_df.to_csv(save_file_path, index=False)


def get_lat_long(src_file_path, tgt_file_path):
    global GOOGLE_MAPS_API_URL
    loc_df = pd.DataFrame()
    with open(src_file_path, 'r') as file:
        for idx, line in enumerate(file.readlines()):
            loc = line.replace('\n', '')
            params = {
                'address': loc,
                'sensor': 'false',
            }

            # Do the request and get the response data
            req = requests.get(GOOGLE_MAPS_API_URL, params=params)
            res = req.json()
            # Use the first result
            result = res['results'][0]
            geodata = dict()
            geodata['lat'] = result['geometry']['location']['lat']
            geodata['lng'] = result['geometry']['location']['lng']
            geodata['address'] = result['formatted_address']

            print('{} (lat, lng) = ({lat}, {lng})'.format(loc, **geodata))
            loc_df.loc[idx, 'location'] = loc
            loc_df.loc[idx, 'lat'] = '{lat}'.format(**geodata)
            loc_df.loc[idx, 'lng'] = '{lng}'.format(**geodata)
    loc_df.to_csv(tgt_file_path, index=False)


def update_lat_lng(src_file_path, lat_lng_file_path, tgt_file_path):
    df = pd.read_csv(src_file_path)
    loc_df = pd.read_csv(lat_lng_file_path)

    loc_dict = loc_df.set_index('location').T.to_dict('list')

    for idx, row in df.iterrows():
        address = row['location']
        try:
            df.loc[idx, 'latitude'] = loc_dict[address][0]
            df.loc[idx, 'longtitude'] = loc_dict[address][1]
        except Exception as e:
            print(address)
    print(df)
    df.to_csv(tgt_file_path, index=False)


if __name__ == '__main__':
    clean_review(raw_file_path='/home/karen/workspace/ABSA_glassdoor/dataset/employee_reviews.csv',
                 save_file_path='/home/karen/workspace/ABSA_glassdoor/ABSA_LSTM_pt_update/employee_reviews_cleaned.csv')

    # df = pd.read_csv('/opt/lampp/htdocs/DS330/final/dataset/employee_review_updated.csv')
    # df[df['company'] == 'google'].to_csv('google.csv', index=False)
    # df[df['company'] == 'amazon'].to_csv('amazon.csv', index=False)
    # df[df['company'] == 'microsoft'].to_csv('microsoft.csv', index=False)
    # df[df['company'] == 'facebook'].to_csv('facebook.csv', index=False)
    # df[df['company'] == 'apple'].to_csv('apple.csv', index=False)
    # df[df['company'] == 'netflix'].to_csv('netflix.csv', index=False)

    # get_lat_long(src_file_path='locations.csv',
    #              tgt_file_path='locations_lat_lng.csv')
    update_lat_lng(src_file_path='/home/karen/workspace/ABSA_glassdoor/ABSA_LSTM_pt_update/employee_reviews_cleaned.csv',
                   lat_lng_file_path='/home/karen/workspace/ABSA_glassdoor/ABSA_LSTM_pt_update/locations_lat_lng.csv',
                   tgt_file_path='/opt/lampp/htdocs/DS330/final/dataset/employee_review_raw_comments.csv')

