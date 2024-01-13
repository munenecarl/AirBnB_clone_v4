$(document).ready(function() {
  let checkedAmenities = {};

  $('input:checkbox').change(
    function(){
      if (this.checked) {
        checkedAmenities[$(this).data('id')] = $(this).data('name');
      } else {
        delete checkedAmenities[$(this).data('id')];
      }
      $('div.amenities h4').html(Object.values(checkedAmenities).join(', ') || '&nbsp;');
    });

  $.get('http://0.0.0.0:5001/api/v1/status/', function(data, textStatus) {
    if (textStatus === 'success') {
      if (data.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    }
  });

  $('button').click(function() {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({"amenities": Object.keys(checkedAmenities)}),
      success: function(data) {
        for (let i = 0; i < data.length; i++) {
          $('.places').append('<article>' +
            '<div class="title_box">' +
            '<h2>' + data[i].name + '</h2>' +
            '<div class="price_by_night">' + data[i].price_by_night + '</div>' +
            '</div>' +
            '<div class="information">' +
            '<div class="max_guest">' + data[i].max_guest + ' Guest(s)</div>' +
            '<div class="number_rooms">' + data[i].number_rooms + ' Bedroom(s)</div>' +
            '<div class="number_bathrooms">' + data[i].number_bathrooms + ' Bathroom(s)</div>' +
            '</div>' +
          '<div class="description">' + data[i].description + '</div>' +
          '</article>');
      }
    }
  });
});
});