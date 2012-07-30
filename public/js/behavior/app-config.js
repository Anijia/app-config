NE.behavior('app-config', function(config, statics) {
  var id = config.id;
  var $el = $('#app-' + id); 
  $el.delegate('.del-btn', 'click', del);
  
  function del() {
    $.post('/api/recommend/del', {
      appId: NE.getCfg('appId'),
      recommendAppId: id 
    }, function(data) {
      $el.remove();
    }, 'json');
  }
});
