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
});
