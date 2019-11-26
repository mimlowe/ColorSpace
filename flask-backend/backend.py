import json
from datetime import datetime

from flask import Flask
from flask_mongoengine import MongoEngine
from flask_mongorest import MongoRest
from flask_mongorest.views import ResourceView
from flask_mongorest.resources import Resource
from flask_mongorest import operators as ops
from flask_mongorest import methods
from mongoengine.fields import *
from mongoengine.fields import ReferenceField, BooleanField, StringField, ListField
from mongoengine.fields import IntField, LazyReferenceField
from getpass import getpass

app = Flask(__name__)

# Settings
DB_NAME_REMOTE = 'colorspace'
DB_MODE = 'remote'
# DB_MODE = 'local'

IS_DEBUG=True
# IS_DEBUG=False

if DB_MODE == 'remote':
    try:
        with open('db_pass.txt') as f:
            mongo_pass = f.read()
    except FileNotFoundError:
        mongo_pass = getpass('No password file found, enter mongodb password:\n')


    app.config.update(
        MONGODB_HOST = 'mongodb://cluster0-shard-00-00-aaxvq.mongodb.net:27017,cluster0-shard-00-01-aaxvq.mongodb.net:27017,cluster0-shard-00-02-aaxvq.mongodb.net:27017/%s?ssl=true&authSource=admin&retryWrites=true&w=majority' % DB_NAME_REMOTE,
        MONGODB_USERNAME = 'dbuser',
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
    updated_at = DateTimeField(default=datetime.now())

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.updated_at = datetime.datetime.now()

class SiteGetter(db.EmbeddedDocument):
    src = db.StringField(max_length=128)
    options = db.ListField(db.StringField())

class SiteGetterResource(Resource):
    document = SiteGetter

class Color(db.Document):
    hexval = db.StringField(max_length=8, required=True) #0x000000
    rgb = db.ListField(db.IntField(max_value=255), required=True)
    colorgroup = db.ReferenceField(ColorGroup)
    updated_at = DateTimeField(default=datetime.now())

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.updated_at = datetime.datetime.now()

class Site(db.Document):
    domain = db.StringField(unique=True, required=True)
    sitegetter = db.EmbeddedDocumentField(SiteGetter)
    colors = db.ListField(db.ReferenceField(Color)) # TODO: Does this need to be db.Ref?
    color = db.ReferenceField(Color)
    updated_at = DateTimeField(default=datetime.now())

    @classmethod
    def pre_save(cls, sender, document, **kwargs):
        document.updated_at = datetime.datetime.now()

class ColorGroupResource(Resource):
    document = ColorGroup

    filters = {
        'primary': [ops.Exact, ops.IContains]
    }

class ColorResource(Resource):
    document = Color
    related_resources = {
        'colorgroup':ColorGroupResource
    }
    filters = {
        'hexval': [ops.IExact],
        'rgb':[ops.IContains],
        'colorgroup':[ops.IContains, ops.In]
    }
    # TODO: Look at resources.py for other vars, child resources?
    # save_related_resources = ['colorgroup']
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
        'domain': [ops.IExact, ops.IContains, ops.IStartswith],
        # Needs to be queried with the document ID
        'colors': [ops.IContains, ops.Contains, ops.In]
    }
    save_related_resources = ['colors']

class Poller(db.Document):
    device_id=db.StringField(required=True)
    secretkey=db.StringField(required=True)
    apikey=db.StringField(required=True)

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

if __name__ == "__main__":

    app.run(debug=IS_DEBUG)
    pass
