import sys
from PIL import Image
from selenium import webdriver
from collections import defaultdict
import requests

# Take the first argument as website info
# Need the full URL with http[s]://....com/
WEBSITE = sys.argv[1]
site_name = WEBSITE.split('://')[1]
# Should add another split to exclude '/info' sites
filename = site_name + '.png'

# WITH OPTIONS: DON'T LOAD IMAGES
chrome_options = webdriver.ChromeOptions()
prefs = {"profile.managed_default_content_settings.images": 2}
chrome_options.add_experimental_option("prefs", prefs)
driver = webdriver.Chrome(options=chrome_options)

# WITHOUT OPTIONS: LOAD IMAGES
# driver = webdriver.Chrome()

# Load the website and take screenshot
driver.get(WEBSITE)
screenshot = driver.save_screenshot(filename)
driver.quit()

# Compile the image
im = Image.open(filename)
by_color = defaultdict(int)
for pixel in im.getdata():
    by_color[pixel] += 1
d = by_color
s = [(k, d[k]) for k in sorted(d, key=d.get, reverse=True)]

# Check to see if the site already exists in the database
site_check = 'http://localhost:5000/sites/?domain__icontains={}'.format(site_name)
print(site_check)
site_result = requests.get(site_check).json()
if site_result['data']:
    print(site_result['data'])
    print('Site already exists, exiting.')
    exit(0)

# If site doesn't exist in the database, start processing the colors
color_ids = []
for rgba, occurrence in s:
    # Only colors displayed on 5000 or more pixels are considered
    if int(occurrence) < 5000:
        # List is already sorted, so this should end it.
        break
    rgb = rgba[0:3]
    print(rgb)
    hexval = '%02x%02x%02x' % rgb
    print(hexval)
    URL = 'http://localhost:5000/colors/'
    
    # GET COLOR
    GET_URL = URL + '?hexval__iexact={}'.format(hexval)
    print(GET_URL)
    # GET ID from URL
    color_data = requests.get(GET_URL).json()
    print(color_data)
    if color_data['data']:
        # TODO: Should return only 1 result
        color_id = color_data['data'][0]['id']
        color_ids.append(color_id)

    else:
        # POST REQUEST
        post_data = {'hexval':hexval, 'rgb':rgb}
        result = requests.post(URL, json=post_data).json()
        print(result)
        # POST RESPONSE IS DIFFERENT FROM GET - NO "DATA"
        color_ids.append(result['id'])

if color_ids:
    data = {
        'domain':site_name,
        'colors':color_ids
    }
    if len(color_ids) < 8:
        site_post = 'http://localhost:5000/sites/'
        site_post_result = requests.post(site_post, json=data).json()
        print(site_post_result)
    else:
        print('Too many colors to add: {}'.format(len(color_ids)))

    