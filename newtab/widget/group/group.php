<div id="group" class="dialog">
	<div id="group_container">
		<div id="group_top" class="top">
			<input id="group-title" class="title" value="" />
		</div>
		<div id="group_body" class="body">
			<div id="group_list" class="group-list"></div>
		</div>
	</div>
</div>
<!-- 删除文件夹弹框 -->
<div id="del_dialog" class="dialog">
    <div id="del_container">
      <div class="title">
          <h3>删除文件夹</h3>
          <a href="javascript:void(0);" class="close-btn"></a>
      </div>
      <div class="content">
        <div class="ui-icon">
            <svg viewBox="0 0 44 44" version="1.1" width="44" height="72">
                <defs>
                    <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
                        <stop stop-color="#FFD23A" offset="0%"></stop>
                        <stop stop-color="#FF901B" offset="100%"></stop>
                    </linearGradient>
                </defs>
                <g id="定稿方案" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="文件夹_删除弹框" transform="translate(-791.000000, -536.000000)">
                        <g id="Group-36" transform="translate(719.000000, 467.000000)">
                            <g id="Group-55" transform="translate(72.000000, 68.000000)">
                                <g id="Group-51" transform="translate(0.000000, 1.000000)">
                                    <g id="Group-50">
                                        <circle id="Oval-6" fill="url(#linearGradient-1)" cx="22" cy="22" r="22"></circle>
                                        <path d="M20.5243773,23.3630273 L20.0951053,16.9373613 C20.0146164,15.6853116 19.9743725,14.7865322 19.9743725,14.2409963 C19.9743725,13.4987096 20.1688845,12.9196453 20.5579142,12.5037859 C20.946944,12.0879266 21.4589352,11.88 22.0939033,11.88 C22.8630195,11.88 23.3772465,12.1460566 23.6365997,12.6781777 C23.8959528,13.2102989 24.0256275,13.9771678 24.0256275,14.9788076 C24.0256275,15.5690596 23.9943267,16.1682459 23.9317242,16.7763843 L23.3548899,23.3898568 C23.2922874,24.1768595 23.1581412,24.7805173 22.9524474,25.2008482 C22.7467535,25.6211792 22.4069165,25.8313416 21.9329262,25.8313416 C21.4499928,25.8313416 21.1146273,25.6278865 20.9268199,25.2209704 C20.7390124,24.8140542 20.6048662,24.194746 20.5243773,23.3630273 L20.5243773,23.3630273 Z M22.0134148,32.1899338 C21.4678788,32.1899338 20.9916599,32.013308 20.5847437,31.6600511 C20.1778276,31.3067942 19.9743725,30.8126891 19.9743725,30.177721 C19.9743725,29.6232419 20.1688845,29.1514945 20.5579142,28.7624648 C20.946944,28.373435 21.4231629,28.1789231 21.9865852,28.1789231 C22.5500076,28.1789231 23.0306981,28.373435 23.428671,28.7624648 C23.826644,29.1514945 24.0256275,29.6232419 24.0256275,30.177721 C24.0256275,30.8037459 23.8244082,31.2956152 23.4219637,31.6533437 C23.0195191,32.0110722 22.5500075,32.1899338 22.0134148,32.1899338 L22.0134148,32.1899338 Z" id="!" fill="#FFFFFF"></path>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
        <div class="msg">
            <h4>确定删除文件夹？</h4>
            <p>文件夹“{name}”以及其中的{count}个网址数据将被删除，删除后数据将无法恢复。</p>
        </div>
      </div>
      <div class="button-group">
          <button id="ok_btn" class="button primary">确定</button>
          <button id="cancel_btn" class="button">取消</button>
      </div>
    </div>
</div>