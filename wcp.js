// Weird Canada Player (c) 2013 Mike Verdone
// Unscrunched code at: http://github.com/sixohsix/weird-player/
(function() {
'use strict';window.weirdPlayer=window.weirdPlayer||{};
window.weirdPlayer.util=function(c){function f(b){return void 0!==b}var a={},s=c.console.log.bind(c.console);a.debug=!1;a.log=function(b){a.debug&&s(b)};a.defined=f;a.coerce=function(b,a){return f(b)?b:a};a.maybe=function(b,a,c){return f(b)?a(b):c};a.attr=function(b,a,c){return f(b)&&f(b[a])?b[a]:c};a.query=function(b,a){for(var c=b.querySelectorAll(a),h=[],e=0;e<c.length;e++)h.push(c[e]);return h};a.empty=function(b){return 0===b.length};a.append=function(b,a){a.forEach(function(a){b.push(a)})};
a.choose=function(a){return a[Math.random()*a.length|0]};a.keys=function(a){var c=[],f;for(f in a)c.push(f);return c};a.zip=function(a,c){for(var f=[],h=Math.min(a.length,c.length),e=0;e<h;e++)f.push([a[e],c[e]]);return f};return a}(window);
window.weirdPlayer.parse=function(c){function f(g,d){y("parseFail: "+g);return d}function a(g){return g.posts[0]}function s(g){g=g.content;var d=document.implementation.createHTMLDocument("jail").createElement("div");d.innerHTML=g;return d}function b(g){var d=v(g,"audio").map(function(d){return v(d,"source")}).filter(function(d){return 0<d.length});w(d)&&(d=q(g));return d}function p(g){if(!k(g.title))return f("missing post title");var d=z.exec(g.title);return null===d?f("title match failed: "+g.title):
{artist:d[1],release:d[2]}}function q(g){return v(g,"a").filter(function(d){return A.exec(d.href)}).map(function(d){var g=x.exec(d.innerHTML);return k(g)?[d.href,g[1]]:void 0}).filter(k).map(function(d){var g=document.createElement("source");g.src=d[0];g.type='audio/mpeg; codecs="mp3"';return{sources:[g],title:d[1]}})}function h(g){var d=b(g),a=e(g);if(!w(d)&&d.length===a.length)return u(d,a).map(function(d){return{sources:d[0],title:d[1]}});g=q(g);return w(g)?f("no audio source nodes or mp3 links found",
[]):g}function e(g){return v(g,"p.audioTrack a").map(function(d){d=x.exec(d.innerHTML);return null===d?void 0:d[1]}).filter(k)}function t(g){g=g.querySelector("img");var d=document.createElement("img");null!==g&&(d.src=g.src);return d}function B(g){v(document,"#badResponses").forEach(function(d){(d.baddies=C(d,"baddies",[])).push(g)})}var m={},n=c.RegExp,l=c.weirdPlayer.util,k=l.defined,v=l.query,w=l.empty,y=l.log,C=l.attr,u=l.zip;m.singlePost=a;m.htmlContent=s;m.parseAudioNodes=b;var A=new n("^http://weirdcanada.com/wp-content/uploads/.+.mp3$"),
x=new n("^.*\u2013 (.+)$"),z=new n("^(?:New Canadiana|Review) :: (.+) &#8211; (.+)$");m.parseArtistData=p;m.parseMp3Links=q;m.parseSongTitleLinks=e;m.parseImage=t;m.parsePostUrl=function(g){return g.url};m.parse=function(g){var d=a(g);if(!k(d))return[];var c=s(d),m=p(d),e=h(c),n=t(c),b=d.url;return k(m)&&!w(e)&&k(n)?e.map(function(d){return{artist:m.artist,release:m.release,image:n,sources:d.sources,title:d.title,postUrl:b}}):(l.debug&&B(g),[])};return m}(window);
window.weirdPlayer.loader=function(c){function f(a){var c="?json=get_recent_posts",e;for(e in a)c+="&"+e+"="+a[e];return c}function a(a,e,b,l){e=f(e);var k=new c.XMLHttpRequest;l=l||q;k.onload=b.bind(void 0,k);k.onerror=l.bind(void 0,k);k.open("GET",a+e);k.send()}function s(a,e,b){var l="pureEvil"+t,k=document.createElement("script"),h=document.querySelector("head");t++;c[l]=function(a){h.removeChild(k);delete c[l];b(a)};e.callback=l;k.src=a+f(e);h.appendChild(k)}var b={},p=c.weirdPlayer.util,q=p.doNothing,
h=p.attr,e=c.weirdPlayer.parse.parse,t=0;b.createLoader=function(b){function m(e,b){a(l,e,function(a){a="json"===a.responseType?a.response:c.JSON.parse(a.responseText);b(a)},function(a){b({})})}var n={},l=h(b,"apiUrl","/category/content/newcanadiana/"),k=h(b,"pages",905),f=h(b,"jsonp",!1);n.loadSongs=function(a){function c(b){k=h(b,"pages",k);a(e(b))}var b={count:"1",page:""+(Math.random()*k|0)};f?s(l,b,c):m(b,c)};return n};b.createTestLoader=function(a){var b={},h=0;b.loadSongs=function(b){var k=
e(a[h]);h=(h+1)%a.length;c.setTimeout(b.bind(void 0,k),0)};return b};return b}(window);
window.weirdPlayer.actions=function(c){var f={},a=c.weirdPlayer.util,s=a.coerce,b=a.append,p=a.empty,q=a.log;f.createActionChain=function(){function a(){if(!p(e)){var b=e.pop();q("action: "+b.name);c.setTimeout(b,0)}}var e=[],f={doActions:function(c){b(e,c.reverse());a()}};f.doneAction=a;f.asAction=function(b){return function(){b.apply(void 0,arguments);a()}};return f};f.doNothing=function(){};f.createEventCoordinator=function(){var a={},b={};a.observe=function(c,f){b[c]=s(a[c],[]);b[c].push(f)};
a.notify=function(a){s(b[a],[]).forEach(function(a){a()})};return a};return f}(window);
window.weirdPlayer.translate=function(c){function f(a,c,e){var f=p(a,e,{});b(c,".tr").forEach(function(a){var b=a.tr_origHTML=p(a,"tr_origHTML",a.innerHTML);h(f[b])||q("missing "+e+" translation for '"+b+"'");a.innerHTML=p(f,b,b)});b(c,".trt").forEach(function(a){var b=a.tr_origTitle=p(a,"tr_origTitle",a.title);h(f[b])||q("missing "+e+" translation for '"+b+"'");a.title=p(f,b,b)})}var a={},s=c.weirdPlayer.util,b=s.query,p=s.attr,q=s.log,h=s.defined;a.translations={en:{},fr:{"Now playing:":"Joue maintenant:",
"Play/Pause":"Commence/Pause","Next song":"Prochaine chanson","Visit Weird Canada":"Visitez Weird-Canada",from:"de"},de:{"Now playing:":"Jetzt spielt:","Play/Pause":"Spiel/Halt","Next song":"N\u00e4chste Lied","Visit Weird Canada":"Checken Sie Weird-Canada aus",from:"von"}};a.translate=f;a.createTranslator=function(a,b){var c={},e="en";c.setLang=function(c){c!==e&&(e=c,f(a,b,c))};return c};var e=new c.RegExp("(..)-..");a.getBrowserLanguage=function(){var a=c.navigator.userLanguage||c.navigator.language,
b=e.exec(a);null!==b&&(a=b[1]);return a};return a}(window);
window.weirdPlayer.main=function(c){function f(a){function d(){a.loadSongs(function(a){t(a)||(a=m?a:[l(a)],B(n,a));f.doneAction()})}function b(){function a(){n.length===c?f.doActions([d,a]):(h.notify("gotNewSongs"),f.doneAction())}var c=n.length;f.doActions([a])}function c(){t(n)?f.doActions([b,c]):(k=n.shift(),h.notify("songChanged"),t(n)?f.doActions([b]):f.doneAction())}var e={},f=w.createActionChain(),h=w.createEventCoordinator(),k=void 0,m=!0,n=[];e.skip=function(){f.doActions([c])};e.getCurrentSong=
function(){return k};e.observe=h.observe;return e}function a(a,d){function b(d,c){e(a,d).forEach(function(a){a.innerHTML=c})}b(".wcp-artist",d.artist);b(".wcp-title",d.title);b(".wcp-release",d.release);e(a,".wcp-postUrl").forEach(function(a){a.href=d.postUrl});e(a,".wcp-img").forEach(function(a){a.innerHTML="";a.appendChild(d.image)})}function s(a){var b=document.createElement("audio");a.forEach(function(a){b.appendChild(a)});b.load();return b}function b(a){var b=a%60|0;10>b&&(b="0"+b);return""+
(a/60|0)+":"+b}function p(g,d,f){function h(a){e(d,a).forEach(function(a){a.wcp_origDisplay=a.style.display;a.style.display="none"})}function l(a){e(d,a).forEach(function(a){a.style.display=n(a,"wcp_origDisplay",a.style.display)})}function p(){var a=n(r,"duration",0)|0,d=n(r,"currentTime",0)|0,c=n(r,"ended",!1),e=n(r,"paused",!1);v.forEach(function(b){b.max=a;b.value=d});w.forEach(function(a){a.innerHTML=b(d)});x.forEach(function(d){d.innerHTML=b(a)});e&&!u?(u=!0,h(".wcp-iconPlaying"),l(".wcp-iconPaused")):
!e&&u&&(u=!1,h(".wcp-iconPaused"),l(".wcp-iconPlaying"));c&&!t&&(q=t=!0,g.skip())}var r,q=m(f)?f:!1,t=!1,v=e(d,".wcp-progress"),w=e(d,".wcp-curTime"),x=e(d,".wcp-totTime");g.observe("songChanged",function(){k("song changed, yo");var b=g.getCurrentSong(),c=b.sources;m(r)&&(r.pause(),d.removeChild(r));r=s(c);d.appendChild(r);q&&(q=!1,r.play());t=!1;a(d,b);p()});e(d,".wcp-play").forEach(function(a){a.onclick=function(){m(r)&&r.paused&&r.play();p();return!1}});e(d,".wcp-pause").forEach(function(a){a.onclick=
function(){m(r)&&!r.paused&&r.pause();p();return!1}});e(d,".wcp-skip").forEach(function(a){a.onclick=function(){m(r)&&r.pause();q=!0;g.skip();p();return!1}});e(d,".wcp-playPause").forEach(function(a){a.onclick=function(){m(r)&&(r.paused?r.play():r.pause());p();return!1}});var u=!1;h(".wcp-iconPaused");g.skip();c.setInterval(p,1E3)}var q={},h=c.weirdPlayer.util,e=h.query,t=h.empty,B=h.append,m=h.defined,n=h.attr,l=h.choose,k=h.log,v=h.keys,w=c.weirdPlayer.actions,y=c.weirdPlayer.loader.createLoader,
C=c.weirdPlayer.loader.createTestLoader,u=c.weirdPlayer.translate,A=u.createTranslator,x=u.translations,z=u.getBrowserLanguage;q.setup=function(a,b){var k=n(b,"debug",!1),m=n(b,"useTestLoader",!1),l=n(b,"autoplay",!1);h.debug=k;var k=m?C(c.tests.fixture.responses):y({apiUrl:b.apiUrl,jsonp:b.jsonp}),k=f(k),l=p(k,a,l),q=A(x,document);q.setLang(z());v(x).forEach(function(a){e(document,".setLang-"+a).forEach(function(b){b.onclick=function(){q.setLang(a);return!1}})});a.wcpModel=k;a.wcpView=l;a.wcpTranslator=
q;return l};return q}(window);

})();
