document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.datepicker');
  M.Datepicker.init(elems,{
    format: 'mm/dd/yyyy'
  });
});
