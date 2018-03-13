<script id="mapList" type="text/json">
    <?php echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/static/v1.1/data' . '/resource/zh/map_list.json'); ?>
</script>
<script id="page_data" type="text/javascript">
  var staticServer = 'https://pc-newtab.maxthonimg.com/static', 
      cdnServer = staticServer + '/v1.1',
      map_list = document.getElementById('mapList').innerHTML.replace(/\s+/, '');
  try {
    map_list = JSON.parse(map_list); 
  } catch (error) {
    map_list = {}; 
  }
</script>

<script id="pageTpl" type="text/template">
    <div id="main">
        <!-- <div class="nav-header clearfix">
            <ul class="nav-header-menu">
                <li class="active">
                    <a href="javascript:void(0);" title="<%= this.getLang('MyFavorites') %>"><%= this.getLang('MyFavorites') %></a>
                </li>
                <li>
                    <a href="javascript:void(0);" title="<%= this.getLang('LastSession') %>"><%= this.getLang('LastSession') %></a>
                </li>
            </ul>
        </div> -->
        <div class="nav-body">
            <div id="quickaccess" class="quickaccess">
                <div class="fav-list-warp">
                    <span class="drop-down fav-collapse down" data-step="3" data-intro="<%= this.getLang('user-guide-step3')%>"></span>
                    <div class="fav-list-container collapse" data-step="2" data-intro="<%= this.getLang('user-guide-step2')%>">
                        <div class="before"></div>
                        <ul id="fav_list" class="fav-list clearfix"></ul>
                        <div class="after"></div>
                    </div>
                </div>
                <div class="grid-list-container">
                    <ul id="grid_list" class="grid-list clearfix" data-step="1" data-intro="<%= this.getLang('user-guide-step1')%>"></ul>
                </div>
            </div>
            <div id="lastsession" class="lastsession hide">
                <div class="ls-nav">
                    <input id="input" type="checkbox" /><label id="label" for="input"><%= this.getLang('AllSelecte') %></label>
                </div>
                <ul class="ls-list"></ul>
                <div class="ls-menu">
                    <button id="open_all"><%= this.getLang('BatchOpening') %></button>
                    <button id="delete_all"><%= this.getLang('BatchDelete') %></button>
                    <button id="clear_all"><%= this.getLang('ClearList') %></button>
                    <button id="open_history"><%= this.getLang('OpenTheHistory') %></button>
                </div>
            </div>
        </div>
    </div>
</script>