from flask import Flask
from flask_mongoengine import MongoEngine
from flask_mongorest import MongoRest
from flask_mongorest.views import ResourceView
from flask_mongorest.resources import Resource
from flask_mongorest import operators as ops
from flask_mongorest import methods
from mongoengine.fields import *
from mongoengine.fields import BooleanField, StringField, ListField, IntField

app = Flask(__name__)

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
    color_group = db.ReferenceField(ColorGroup)
    # pass

class Site(db.Document):
    domain = db.StringField(unique=True, required=True)
    sitegetter = db.EmbeddedDocumentField(SiteGetter)
    colors = db.ListField(db.ReferenceField(Color)) # TODO: Does this need to be db.Ref?

class ColorGroupResource(Resource):
    document = ColorGroup

class SiteResource(Resource):
    document = Site
    related_resources = {
        'sitegetter':SiteGetterResource,
    }
    filters = {
        'name': [ops.Exact, ops.Startswith]
    }

class ColorResource(Resource):
    document = Color
    filters = {
        'hexval': [ops.Exact, ops.Startswith]
    }
    rename_fields = {
        'hexval':'hex'
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

if __name__ == "__main__":
    app.run(debug=True)