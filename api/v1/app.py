#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))
print(sys.path)
from flask import Flask, jsonify, request, abort, Blueprint
from flask_cors import CORS
from models import storage
from api.v1.views import app_views
from models.state import State
from models.city import City
from models.place import Place

app = Flask(__name__)
CORS(app, resources={r"/api/v1/*": {"origins": "*"}})

@app.teardown_appcontext
def close_storage(exception):
    storage.close()

@app.route('/api/v1/status', methods=['GET'])
def get_status():
    return jsonify({"status": "OK"})

@app_views.route('/places_search/', methods=['POST'])
def places_search():
    """
    Handle POST requests for /api/v1/places_search.

    This endpoint retrieves all Place objects depending on the JSON in the body of the request.
    The JSON can contain 3 optional keys: states, cities, and amenities.

    If the HTTP request body is not valid JSON, raise a 400 error with the message Not a JSON.
    If the JSON body is empty or each list of all keys are empty: retrieve all Place objects.
    If states list is not empty, results should include all Place objects for each State id listed.
    If cities list is not empty, results should include all Place objects for each City id listed.
    If amenities list is not empty, limit search results to only Place objects having all Amenity ids listed.

    :return: JSONified list of places
    """

    data = request.get_json()
    if not data:
        abort(400, 'Not a JSON')
    states = data.get('states', [])
    cities = data.get('cities', [])
    amenities = data.get('amenities', [])
    places = []

    if states:
        for state_id in states:
            state = storage.get(State, state_id)
            if state:
                for city in state.cities:
                    for place in city.places:
                        if place not in places:
                            places.append(place)
    if cities:
        for city_id in cities:
            city = storage.get(City, city_id)
            if city:
                for place in city.places:
                    if place not in places:
                        places.append(place)
    if not states and not cities:
        places = storage.all(Place).values()

    if amenities:
        places = [place for place in places if all(amenity in place.amenities for amenity in amenities)]

    return jsonify([place.to_dict() for place in places]), 200

app.register_blueprint(app_views, url_prefix='/api/v1')

if __name__ == "__main__":
    host = os.getenv('HBNB_API_HOST', '0.0.0.0')
    port = os.getenv('HBNB_API_PORT', '5000')
    app.run(host=host, port=port, threaded=True)
