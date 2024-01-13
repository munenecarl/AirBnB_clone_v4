from flask import Blueprint
app_views = Blueprint('app_views', __name__, url_prefix='/api/v1')

# Import everything from api.v1.views.index
# PEP8 will complain about this wildcard import, but it's okay in this case.
from api.v1.views.index import *