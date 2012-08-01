NE.behavior('app-actions', function(config, statics) {
  if (!config) return;
  var id = config.id;
  var $el = $(document.getElementById('app-' + id)); 
  $el.delegate('.del-btn', 'click', del);
  
  function del() {
    $.post('/api/app/del', {
      id: id 
    }, function(data) {
      $el.remove();
    }, 'json');
  }
});
