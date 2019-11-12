import json

from flask import Flask
from flask_mongoengine import MongoEngine
from flask_mongorest import MongoRest
from flask_mongorest.views import ResourceView
from flask_mongorest.resources import Resource
from flask_mongorest import operators as ops
from flask_mongorest import methods
from mongoengine.fields import *
from mongoengine.fields import BooleanField, StringField, ListField, IntField
from getpass import getpass

app = Flask(__name__)

# Settings


# DB_MODE = 'remote'
DB_MODE = 'local'

# IS_DEBUG=True
IS_DEBUG=False

if DB_MODE == 'remote':
    try:
        with open('db_pass.txt') as f:
            mongo_pass = f.read()
    except FileNotFoundError:
        mongo_pass = getpass('No password file found, enter mongodb password:\n')

    app.config.update(
        MONGODB_HOST = 'mongodb://cluster0-shard-00-00-aaxvq.mongodb.net:27017,cluster0-shard-00-01-aaxvq.mongodb.net:27017,cluster0-shard-00-02-aaxvq.mongodb.net:27017/?ssl=true&authSource=admin&retryWrites=true&w=majority',
        MONGODB_PORT = 27017,
        MONGODB_DB = 'mongorest_test',
        MONGODB_USERNAME = 'wayne',
        MONGODB_PASSWORD = mongo_pass
    )
elif DB_MODE == 'local':
    app.config.update(
        MONGODB_HOST = 'localhost',
        MONGODB_PORT = 27017,
        MONGODB_DB = 'mongorest_example_app',
    )

db = MongoEngine(app)
api = MongoRest(app)

class ColorGroup(db.Document):
    primary = db.StringField(max_length=128)
    secondary = db.StringField(max_length=128)
    grayscale = db.BooleanField()
    Range = db.ListField(db.IntField())

class SiteGetter(db.EmbeddedDocument):
    src = db.StringField(max_length=128)
    options = db.ListField(db.StringField())

class SiteGetterResource(Resource):
    document = SiteGetter

class Color(db.Document):
    hexval = db.StringField(max_length=8, required=True) #0x000000
    rgb = db.ListField(db.StringField(max_length=3), required=True)
    colorgroup = db.ReferenceField(ColorGroup)
    # pass


class Site(db.Document):
    domain = db.StringField(unique=True, required=True)
    sitegetter = db.EmbeddedDocumentField(SiteGetter)
    colors = db.ListField(db.ReferenceField(Color)) # TODO: Does this need to be db.Ref?
    color = db.ReferenceField(Color)

class ColorGroupResource(Resource):
    document = ColorGroup

class ColorResource(Resource):
    document = Color
    related_resources = {
        'colorgroup':ColorGroupResource
    }
    filters = {
        'hexval': [ops.Exact, ops.Startswith]
    }
    # rename_fields = {
    #     'hexval':'hex'
    # }


class SiteResource(Resource):
    document = Site
    related_resources = {
        'sitegetter':SiteGetterResource,
        'colors':ColorResource
    }
    filters = {
        'domain': [ops.Exact, ops.Startswith],
        # Needs to be queried with the document ID
        'colors': [ops.Exact]
    }


@api.register(name='sites', url='/sites/')
class SiteView(ResourceView):
    resource = SiteResource
    methods = [methods.Create, methods.Update, methods.Fetch, methods.List, methods.Delete]

@api.register(name='colors', url='/colors/')
class ColorView(ResourceView):
    resource = ColorResource
    methods = [methods.Create, methods.Update, methods.Fetch, methods.List, methods.Delete]

@api.register(name='colorgroups', url='/colorgroups/')
class ColorGroupView(ResourceView):
    resource = ColorGroupResource
    methods = [methods.Create, methods.Update, methods.Fetch, methods.List, methods.Delete]

'''
curl -H "Content-Type: application/json" -X POST -d '{"domain":"aa.test.com","colors":["5dc8436d4d04f2d62c3cd837","5dc8415800b62bc7cad59b7f"], "sitegetter":{"src":"style.css","options":[""]}}' http://127.0.0.1:5000/sites/
'''



def init_data():
    dark = ColorGroup(primary='dark',grayscale=True)
    dark.save()
    print('dark ID {}'.format(str(dark.id)))
    light = ColorGroup(primary='light',grayscale=True)
    light.save()
    print('light ID {}'.format(str(light.id)))
    black = Color(hexval='000000',rgb=['0','0','0'],colorgroup=dark)
    black.save()
    print('black ID {}'.format(str(black.id)))
    white = Color(hexval='FFFFFF',rgb=['255','255','255'],colorgroup=light)
    white.save()
    print('white ID {}'.format(str(white.id)))
    example = Site(domain='www.example.com', sitegetter={'src':'style.css','options':['']}, colors=[white,black])
    example.save()
    print('example site ID {}'.format(str(example.id)))

    return dark, light, black, white, example

def delete_data(documents):

    for item in documents:
        item.delete()

def color_import():

    with open('colors.json') as f:
        colors = json.loads(f.read())
    
    for color_in in colors:
        pass
        # Search for color group
        # If color group DNE, create with name
        # Include logic to assess whether the color is light, dark, greyscale
        # Create color and (optionally) assign to color group
        
        # 
        r = color_in['rgb']['r']
        g = color_in['rgb']['g']
        b = color_in['rgb']['b']
        rgb = [r,g,b]

        # if int(r) > 128 and int(g) > 128 and int(b) > 128:
        #      color_group
        # color_group = ColorGroup()
        color = Color(hexval=color_in['hexstring'[1:7]],
                      rgb=rgb,
                      )
        color.save()

if __name__ == "__main__":

    app.run(debug=IS_DEBUG)
    pass