import sys
import json
from PIL import Image
from selenium import webdriver
from collections import defaultdict
import requests

# Function for calculating colors
def distance(c1,c2):
    (r1,g1,b1) = c1
    (r2,g2,b2) = c2
    return math.sqrt((r1 - r2)**2 + (g1 - g2) ** 2 + (b1 - b2) **2)

# Take the first argument as website info
# Need the full URL with http[s]://....com/
try:
    WEBSITE = sys.argv[1]
    site_name = WEBSITE.split('://')[1]
# Should add another split to exclude '/info' sites
except:
# Instead of taking the name, do a get to siterequests
    NEWSITE_URL = 'http://localhost:5000/newsites/'
    NEWSITE_DELETE = 'http://localhost:5000/newsites/{}/'
    sitelist_data = requests.get(NEWSITE_URL).json()
    site = sitelist_data['data'][0]
    WEBSITE = site['domain']
    site_id = site['id']
    # if 'http' in WEBSITE:
    #     WEBSITE = site_name
    site_name = WEBSITE.split('://')[1]
    site_delete = requests.delete(NEWSITE_DELETE.format(site_id))

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
# with open('colors.json') as f:
#     color_list = json.loads(f.read())

# # key = rgb, val = name
# color_dict = {}
# for color_in in color_list:
#     r = color_in['rgb']['r']
#     g = color_in['rgb']['g']
#     b = color_in['rgb']['b']
#     rgb = (r,g,b)
#     # Add color rgb to color_dict
#     color_dict[rgb] = color_in['name']

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
        color_id = color_data['data'][0]['id']
        color_ids.append(color_id)
    else:
        # TODO: calculate closest distance to a color
        # color_name = 'Black'
        
        # colors = list(rgb_code_dictionary.keys())
        # closest_colors = sorted(colors, key=lambda color: distance(color, point))
        # closest_color = closest_colors[0]
        # code = rgb_code_dictionary[closest_color]

        # Get color name
        # Request colorgroup by name
        # CG_URL = 'http://localhost:5000/colorgroups/?primary={}'.format(color_name)
        # cg_data = requests.get(CG_URL).json()
        # cg_id = cg_data['data'][0]['id']
        # POST REQUEST
        post_data = {'hexval':hexval, 'rgb':rgb}
        # post_data = {'hexval':hexval, 'rgb':rgb, 'colorgroup':cg_id}
        result = requests.post(URL, json=post_data).json()
        print(result)
        # POST RESPONSE IS DIFFERENT FROM GET - NO "DATA"
        color_ids.append(result['id'])

# If it was able to successfully add colors, start adding site to the db
if color_ids:
    data = {
        'domain':site_name,
        'colors':color_ids
    }
    # Sanity check - shouldn't be a massive number of 
    if len(color_ids) < 8:
        site_post = 'http://localhost:5000/sites/'
        site_post_result = requests.post(site_post, json=data).json()
        print(site_post_result)
    else:
        print('Too many colors to add: {}'.format(len(color_ids)))
