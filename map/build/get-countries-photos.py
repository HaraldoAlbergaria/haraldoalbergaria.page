#!/usr/bin/python3

from user import user_info
from locations import locations_dict
from countries import countries_dict

html_file = open('index.html', 'w')
html_file.write("<h1>{}</h1>".format(user_info['name']))

for country_code in locations_dict:
    html_file.write("<h2>{} ({}):</h2>".format(countries_dict[country_code][0], countries_dict[country_code][2]))
    country_locations = locations_dict[country_code]
    for location in country_locations:
       for photo in location[1]:
           html_file.write("<a href=\"https://www.flickr.com/photos/{}/{}/\" target=\"_blank\"><img src=\"{}\"></a> ".format(user_info['alias'], photo[0], photo[1]))
    html_file.write("<br>\n")

html_file.close()
