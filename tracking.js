/* Blue Flame Glass GA4. No form answers, contact IDs or chat text enter Analytics. */
(function () {
  'use strict';
  if (window.__bfgAnalytics) return;
  window.__bfgAnalytics = true;
  var measurement = 'G-3GDVTLC0P5';
  var formId = '4NeHVu74fxbDA1SBNoIs';
  var locationId = 'QxV1Fc9KZngnILCto29e';
  var choiceKey = 'bfg_analytics_choice_v1';
  var production = /^(www\.)?blueflameglass\.net$/.test(location.hostname);
  var debug = new URLSearchParams(location.search).get('bfg_debug') === '1';
  var choice = '', loaded = false, leadSeen = false, formStarted = false;
  var seenSections = {}, seenDepths = {};
  try { choice = localStorage.getItem(choiceKey) || ''; } catch (_) {}
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});

  function cleanUrl(raw, attribution) {
    try {
      var u = new URL(raw, location.href), q = new URLSearchParams();
      if (!/^https?:$/.test(u.protocol)) return '';
      if (attribution) ['utm_source','utm_medium','utm_campaign','utm_id','utm_term','utm_content','gclid','gbraid','wbraid'].forEach(function (k) {
        var v = u.searchParams.get(k);
        if (v && v.length <= 150 && /^[a-zA-Z0-9_.~ +\-]+$/.test(v) && !/\d{7,}/.test(v) && !/email|phone|address/i.test(v)) q.set(k,v);
      });
      return u.origin + u.pathname + (q.size ? '?' + q.toString() : '');
    } catch (_) { return ''; }
  }
  function emit(name, params) {
    if (!loaded || choice !== 'granted' || (!production && !debug)) return;
    window.gtag('event', name, Object.assign({site_id:'blue_flame_glass',page_location:cleanUrl(location.href,true),page_referrer:cleanUrl(document.referrer,false),test_traffic:debug?'yes':'no'},debug?{debug_mode:true}:{},params||{}));
  }
  function start() {
    window['ga-disable-' + measurement] = false;
    window.gtag('consent','update',{analytics_storage:'granted'});
    if (!loaded && (production || debug)) {
      loaded = true;
      window.gtag('js',new Date());
      window.gtag('config',measurement,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:cleanUrl(location.href,true),page_referrer:cleanUrl(document.referrer,false)});
      var tag=document.createElement('script'); tag.async=true; tag.src='https://www.googletagmanager.com/gtag/js?id='+measurement; document.head.appendChild(tag);
      emit('page_view');
      measureScroll();
      document.querySelectorAll('#bfg section[id]').forEach(function(s){ if (visible(s)) measureSection(s.id); });
    }
  }
  function revoke() {
    window['ga-disable-' + measurement] = true;
    window.gtag('consent','update',{analytics_storage:'denied'});
    document.cookie.split(';').forEach(function(p){
      var n=p.split('=')[0].trim(); if (!/^_ga($|_)/.test(n)) return;
      ['',location.hostname,'.'+location.hostname,'.blueflameglass.net'].forEach(function(d){document.cookie=n+'=; Max-Age=0; path=/; SameSite=Lax'+(d?'; domain='+d:'');});
    });
  }
  var style=document.createElement('style');
  style.textContent='#bfg-analytics{position:fixed;bottom:18px;left:18px;right:90px;z-index:99999;max-width:600px;padding:18px;background:#06182b;color:#fff;border:1px solid #38c6ff;border-radius:10px;box-shadow:0 6px 28px #0005;font:14px/1.5 Inter,system-ui,sans-serif}#bfg-analytics[hidden]{display:none}#bfg-analytics p{margin:0 0 12px}#bfg-analytics button,#bfg-analytics-choice{min-height:44px;padding:9px 13px;border:1px solid #38c6ff;border-radius:5px;cursor:pointer;font:600 14px Inter,system-ui,sans-serif}#bfg-analytics button{margin:0 8px 8px 0;background:#fff;color:#06182b}#bfg-analytics a{color:#8edfff}#bfg-analytics-choice{display:block;margin:18px auto;background:#06182b;color:#fff}@media(max-width:500px){#bfg-analytics{left:10px;right:10px;bottom:80px;max-height:45vh;overflow:auto}}';
  document.head.appendChild(style);
  var banner=document.createElement('section'); banner.id='bfg-analytics'; banner.setAttribute('aria-label','Analytics choices');
  var text=document.createElement('p'); text.textContent='Allow optional Google Analytics cookies to measure website visits, clicks and completed requests? Your form answers and chat messages are not sent to Analytics.'; banner.appendChild(text);
  function choose(v) { choice=v; try{localStorage.setItem(choiceKey,v);}catch(_){} banner.hidden=true; if(v==='granted')start();else revoke(); }
  function button(label,handler) { var b=document.createElement('button'); b.type='button';b.textContent=label;b.addEventListener('click',handler);return b; }
  banner.appendChild(button('Allow analytics',function(){choose('granted');}));
  banner.appendChild(button('Decline analytics',function(){choose('denied');}));
  var policy=document.createElement('a');policy.href='/privacy-policy/';policy.textContent='Privacy policy';banner.appendChild(policy);
  banner.hidden=!!choice;document.body.appendChild(banner);
  var settings=button('Analytics choices',function(){banner.hidden=false;});settings.id='bfg-analytics-choice';document.body.appendChild(settings);
  if(choice==='granted')start();

  function placement(el) {
    if(el.id==='stab')return 'mobile_sticky';
    var s=el.closest('#nav,section[id],footer');return s?(s.id||'footer'):'page';
  }
  document.addEventListener('click',function(e){
    if(!e.isTrusted)return;
    var el=e.target.closest && e.target.closest('#bfg a,#bfg button,#bfg summary,#bfl a');if(!el)return;
    var p={placement:placement(el)};
    if(el.matches('a')){
      var href=el.getAttribute('href')||'';
      if(/^tel:/i.test(href)){emit('call_click',Object.assign(p,{contact_route:href.indexOf('12297576230')>=0?'owner_line':'main_line'}));return;}
      if(/^mailto:/i.test(href)){emit('email_click',p);return;}
      var u;try{u=new URL(href,location.href);}catch(_){return;}
      if(u.origin===location.origin){
        if(u.hash==='#quote')emit('quote_cta_click',Object.assign(p,{service:el.getAttribute('data-svc')?'service_specific':'general',area:el.getAttribute('data-city')?'area_specific':'general'}));
        else emit('navigation_click',Object.assign(p,{destination:u.hash.replace('#','')||u.pathname}));
      }else if(/^https?:$/.test(u.protocol)){
        var kind=/acornfinance\.com$/.test(u.hostname)?'financing_click':/g\.page$|google\.com$/.test(u.hostname)?'review_click':/facebook\.com$/.test(u.hostname)?'social_click':'outbound_click';
        emit(kind,Object.assign(p,{link_domain:u.hostname,link_path:u.pathname}));
        if(/\.(pdf|zip|docx?|xlsx?|csv|mp4|mp3)$/i.test(u.pathname))emit('file_download',{file_extension:u.pathname.split('.').pop().toLowerCase(),link_domain:u.hostname});
      }
    }else if(el.matches('#svc .tab'))emit('service_select',Object.assign(p,{service:el.id.replace('t-','')}));
    else if(el.matches('#gf button'))emit('gallery_filter',{gallery_category:el.getAttribute('data-f')});
    else if(el.matches('#gal .gi'))emit('gallery_open',{gallery_category:el.getAttribute('data-cat'),image_index:[].indexOf.call(document.querySelectorAll('#gal .gi'),el)+1});
    else if(el.matches('#hpd button'))emit('hero_slide_select',{image_index:[].indexOf.call(el.parentNode.children,el)+1});
    else if(el.matches('.lbp,.lbn'))emit('gallery_navigate',{direction:el.matches('.lbp')?'previous':'next'});
    else if(el.matches('.lbx'))emit('gallery_close',{method:'button'});
    else if(el.matches('summary'))emit('faq_toggle',{faq_index:[].indexOf.call(document.querySelectorAll('#faq summary'),el)+1,action:el.parentNode.open?'close':'open'});
    else emit('ui_click',p);
  },true);
  var slider=document.getElementById('paneR');if(slider)slider.addEventListener('change',function(e){if(e.isTrusted)emit('comparison_slider',{slider_percent:Math.round(Number(slider.value)/10)*10});});
  document.addEventListener('keydown',function(e){
    if(!e.isTrusted)return;
    var lb=document.getElementById('lb');if(lb&&lb.classList.contains('on')){
      if(e.key==='Escape')emit('gallery_close',{method:'keyboard'});
      if(e.key==='ArrowLeft'||e.key==='ArrowRight')emit('gallery_navigate',{direction:e.key==='ArrowLeft'?'previous':'next',method:'keyboard'});
    }
    var tab=e.target.closest&&e.target.closest('#svc .tab');
    if(tab&&/^Arrow(Left|Right|Up|Down)$/.test(e.key))setTimeout(function(){var active=document.querySelector('#svc .tab[aria-selected="true"]');if(active)emit('service_select',{service:active.id.replace('t-',''),method:'keyboard'});},0);
  },true);
  function visible(el){var r=el.getBoundingClientRect();return r.top<innerHeight*.8&&r.bottom>innerHeight*.2;}
  function measureSection(id){if(loaded&&choice==='granted'&&!seenSections[id]){seenSections[id]=true;emit('section_view',{section_id:id});}}
  if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)measureSection(e.target.id);});},{rootMargin:'-15% 0px -15% 0px',threshold:0});document.querySelectorAll('#bfg section[id]').forEach(function(s){io.observe(s);});}
  function measureScroll(){if(!loaded||choice!=='granted')return;var h=document.documentElement.scrollHeight-innerHeight;if(h<=0)return;var pct=Math.min(100,Math.round(scrollY/h*100));[25,50,75,90,100].forEach(function(d){if(pct>=d&&!seenDepths[d]){seenDepths[d]=true;emit('scroll_depth',{percent_scrolled:d});}});}
  var scrollPending=false;window.addEventListener('scroll',function(){if(scrollPending)return;scrollPending=true;requestAnimationFrame(function(){scrollPending=false;measureScroll();});},{passive:true});

  var frame=document.getElementById('inline-'+formId);
  function formStart(){if(!formStarted){formStarted=true;emit('form_start',{form_id:formId,form_name:'inspection_request',method:'embedded_form_focus'});}}
  if(frame){
    window.addEventListener('blur',function(){setTimeout(function(){if(document.activeElement===frame)formStart();},0);});
    frame.addEventListener('focus',formStart);
    window.addEventListener('message',function(e){
      // Native success path in the inspected GHL runtime emits this only after status/id success.
      // Inspect the routing fields only. Never read/copy the contact payload at index 2 or fingerprint at 4.
      if(e.source!==frame.contentWindow||e.origin!=='https://links.homeprobrandbuilder.com'||!Array.isArray(e.data)||e.data[0]!=='set-sticky-contacts'||e.data[3]!==locationId||leadSeen)return;
      if(e.data[1]!=='_ud')return;
      leadSeen=true;
      emit('form_submit',{form_id:formId,form_name:'inspection_request',method:'ghl_confirmed_success'});
      emit('generate_lead',{form_id:formId,form_name:'inspection_request',method:'ghl_confirmed_success'});
    });
  }
  // Only inspect the widget's public open/closed state and control labels; never message contents.
  var chatBound=false,chatSubmitBound=false;
  function bindChatSubmission(){
    var api=window.leadConnector&&window.leadConnector.chatWidget;
    if(chatSubmitBound||!api||typeof api.registerBeforeSubmit!=='function')return;
    api.registerBeforeSubmit(function(){emit('chat_form_attempt',{widget:'blue_flame_live_chat'});return true;});
    chatSubmitBound=true;
  }
  window.addEventListener('LC_chatWidgetLoaded',bindChatSubmission);
  function bindChat(){
    bindChatSubmission();
    if(chatBound)return;
    var host=document.querySelector('chat-widget'),root=host&&host.shadowRoot,active=root&&root.querySelector('[data-active]');
    if(!root||!active)return;
    chatBound=true;var previous=active.getAttribute('data-active');
    new MutationObserver(function(){var next=active.getAttribute('data-active');if(next!==previous){previous=next;emit(next==='true'?'chat_open':'chat_close',{widget:'blue_flame_live_chat'});}}).observe(active,{attributes:true,attributeFilter:['data-active']});
    root.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button');if(!b||!e.isTrusted)return;var label=b.getAttribute('aria-label')||'';if(/send message|send$/i.test(label))emit('chat_message_attempt',{widget:'blue_flame_live_chat'});},true);
  }
  bindChat();var chatObserver=new MutationObserver(bindChat);chatObserver.observe(document.body,{childList:true,subtree:true});
  var chatTimer=setInterval(function(){bindChat();if(chatBound){clearInterval(chatTimer);chatObserver.disconnect();}},1000);setTimeout(function(){clearInterval(chatTimer);chatObserver.disconnect();},30000);
  window.addEventListener('pagehide',function(){if(formStarted&&!leadSeen)emit('form_exit_without_success',{form_id:formId});});
})();
