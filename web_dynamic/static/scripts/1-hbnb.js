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
});