/* groove guru — progressive enhancement. page reads fine without this file. */
(function(){'use strict';
var d=document,root=d.documentElement;root.classList.add('js');
var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var $=function(s,c){return(c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
var BEAT=60000/124,IO='IntersectionObserver'in window;
function seen(el,cb,opt){if(!el)return;if(!IO)return cb(true);new IntersectionObserver(function(es){es.forEach(function(e){cb(e.isIntersecting)})},opt).observe(el)}

/* reveal */
var rv=$$('[data-reveal]');
if(IO){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});rv.forEach(function(el){io.observe(el)})}
else rv.forEach(function(el){el.classList.add('is-in')});

/* hero glow parallax (max ~10%) */
var glows=$$('.hero__glow');
if(!RM&&glows.length){var q=0;addEventListener('scroll',function(){if(q)return;q=requestAnimationFrame(function(){q=0;var y=Math.min(scrollY,innerHeight);glows.forEach(function(g,i){g.style.transform='translate3d(0,'+(y*[.1,.05,.08][i%3]).toFixed(1)+'px,0)'})})},{passive:true})}

/* copy */
$$('.copy').forEach(function(b){var lbl=b.textContent;b.addEventListener('click',function(){var t=b.getAttribute('data-copy-text')||'';var ok=function(){b.classList.add('is-copied');b.textContent='copied';setTimeout(function(){b.classList.remove('is-copied');b.textContent=lbl},1600)};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(ok,function(){});
  else{var ta=d.createElement('textarea');ta.value=t;ta.style.position='fixed';ta.style.opacity='0';d.body.appendChild(ta);ta.select();try{d.execCommand('copy');ok()}catch(e){}ta.remove()}})});

/* 01 control mirror — 8s class cycler */
var mir=$('.mirror');
if(mir){var cap=$('[data-cap]',mir),line=cap.textContent.trim(),K=['cue','play','sync','air','xf'];
  var set=function(k,v){$$('[data-m~="'+k+'"]',mir).forEach(function(e){e.classList.toggle('is-on',v)})};
  if(!RM){var tm=[],iv=0,loop=0,on=false;
    var T=[[500,'cue',1],[950,'cue',0],[1500,'play',1],[2500,'sync',1],[3600,'air',1],[4300,'xf',1]];
    var clear=function(){tm.forEach(clearTimeout);tm=[];clearInterval(iv)};
    var type=function(){var i=0;cap.textContent='';cap.classList.add('caret');iv=setInterval(function(){cap.textContent=line.slice(0,++i);if(i>=line.length){clearInterval(iv);setTimeout(function(){cap.classList.remove('caret')},900)}},24)};
    var run=function(){clear();K.forEach(function(k){set(k,false)});cap.textContent='';cap.classList.add('caret');T.forEach(function(t){tm.push(setTimeout(function(){set(t[1],!!t[2])},t[0]))});tm.push(setTimeout(type,5000))};
    seen(mir,function(v){if(v&&!on){on=true;run();loop=setInterval(run,8600)}else if(!v&&on){on=false;clearInterval(loop);clear()}},{threshold:.25});
  }
}

/* shared beat clock (visual only — no audio) */
var clock={fns:[],on:false,t0:0,off:0,raf:0,
  start:function(){if(this.on)return;var c=this;c.on=true;c.t0=performance.now()-c.off;var f=function(n){if(!c.on)return;c.off=n-c.t0;var b=c.off/BEAT;for(var i=0;i<c.fns.length;i++)c.fns[i](b);c.raf=requestAnimationFrame(f)};c.raf=requestAnimationFrame(f)},
  stop:function(){this.on=false;cancelAnimationFrame(this.raf)},
  beat:function(){return(this.on?performance.now()-this.t0:this.off)/BEAT}};
var pos=function(b){var x=Math.floor(b)%16;return((x>>2)+1)+'.'+(x%4+1)};
var onTheOne=function(b){var p=b%16;return p<.55||p>15.7};

/* camelot wheel (shared by §04 and step 4) */
var compat=function(k){var n=parseInt(k,10),l=k.slice(-1),o=l==='A'?'B':'A';return[((n+10)%12+1)+l,(n%12+1)+l,n+o]};
function wheelKit(svg){
  var nodes={};$$('.wheel__node',svg).forEach(function(n){nodes[n.getAttribute('data-key')]=n});
  var links=$('.wheel__links',svg),ctr=$('.wheel__center',svg),sub=$('.wheel__sub',svg),NS='http://www.w3.org/2000/svg';
  var P=function(k){var n=nodes[k];return[+n.getAttribute('data-x'),+n.getAttribute('data-y')]};
  var clear=function(){links.textContent='';Object.keys(nodes).forEach(function(k){nodes[k].classList.remove('is-sel','is-compat','is-clash','is-in')})};
  var line=function(a,b,cls){var p=P(a),r=P(b),el=d.createElementNS(NS,'path');
    el.setAttribute('d',cls==='wheel__clash'?'M'+p[0]+' '+p[1]+'Q'+((p[0]+r[0])*.18)+' '+((p[1]+r[1])*.18)+' '+r[0]+' '+r[1]:'M'+p[0]+' '+p[1]+'L'+r[0]+' '+r[1]);
    el.setAttribute('class',cls);links.appendChild(el)};
  var label=function(k,s){ctr.textContent=k;sub.textContent=s||nodes[k].getAttribute('data-name')};
  var show=function(k){clear();nodes[k].classList.add('is-sel');compat(k).forEach(function(c){nodes[c].classList.add('is-compat');line(k,c,'wheel__chord')});label(k)};
  var kick=function(c){svg.classList.remove(c);void svg.getBoundingClientRect();svg.classList.add(c)};
  return{nodes:nodes,show:show,clear:clear,label:label,name:function(k){return nodes[k].getAttribute('data-name')},
    clash:function(a,b){show(a);nodes[b].classList.add('is-clash');line(a,b,'wheel__clash');label(a+' ✕ '+b,'clash');kick('is-shake')},
    blend:function(a,b){clear();nodes[a].classList.add('is-sel');nodes[b].classList.add('is-in');line(a,b,'wheel__chord');label(a+' → '+b,'clean blend')},
    bind:function(fn){Object.keys(nodes).forEach(function(k){var n=nodes[k];n.addEventListener('click',function(){fn(k)});n.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fn(k)}})})}};
}
var shared=null;

/* §04 wheel */
var kw=$('#wheel-keys'),kr=$('#keys-readout');
if(kw){var W4=wheelKit(kw),lock='8A';
  var rd=function(k){if(!kr)return;$('[data-k]',kr).textContent=k;$('[data-kn]',kr).textContent=W4.name(k);
    $('.keys__list',kr).innerHTML=compat(k).map(function(c){return'<span class="chip chip--lime">'+c+' · '+W4.name(c)+'</span>'}).join('')};
  var sh=function(k){W4.show(k);rd(k)};sh(lock);
  Object.keys(W4.nodes).forEach(function(k){var n=W4.nodes[k];n.addEventListener('mouseenter',function(){sh(k)});n.addEventListener('focus',function(){sh(k)})});
  kw.addEventListener('mouseleave',function(){sh(lock)});
  kw.addEventListener('focusout',function(e){if(!kw.contains(e.relatedTarget))sh(lock)});
  W4.bind(function(k){lock=k;shared=k;sh(k)});
}

/* 02 zero path */
var Z=$('#zero');
if(Z){
  var nodes=$$('.path__node',Z),steps=$$('.lesson__step',Z),live=$('#path-live'),count=$('[data-count]',Z),deck=$('.minideck',Z),spine=$('.spine-done',Z);
  var KEY='gg.path.v1',st={};try{st=JSON.parse(localStorage.getItem(KEY))||{}}catch(e){}
  if(!Array.isArray(st.done))st.done=[];
  var save=function(){try{localStorage.setItem(KEY,JSON.stringify(st))}catch(e){}};
  var cur=-1,vis=false,paused=RM,demos=[];
  var status=function(i,msg,state){var s=$('[data-status]',steps[i]);s.textContent=msg;s.setAttribute('data-state',state||'')};
  var paint=function(){var mx=st.done.length?Math.max.apply(null,st.done):-1;
    nodes.forEach(function(n,k){var a=k===cur,dn=st.done.indexOf(k)>-1;n.classList.toggle('is-active',a);n.classList.toggle('is-done',dn);n.classList.toggle('is-locked',!a&&!dn&&k>mx+1);
      if(a)n.setAttribute('aria-current','step');else n.removeAttribute('aria-current');$('.path__state',n).textContent=dn?' (done)':''});
    if(spine)spine.setAttribute('x2',String(Math.max(0,Math.min(5,mx))*200))};
  var done=function(i){if(st.done.indexOf(i)<0){st.done.push(i);save()}paint()};
  var go=function(i,o){o=o||{};i=Math.max(0,Math.min(steps.length-1,i));if(i===cur)return;
    var pd=demos[cur];if(pd&&pd.leave)pd.leave();cur=i;
    steps.forEach(function(s,k){s.hidden=k!==i;s.classList.toggle('is-active',k===i)});paint();
    if(count)count.textContent=(i+1)+' / '+steps.length;
    if(o.announce!==false)live.textContent='step '+(i+1)+' of 6: '+steps[i].getAttribute('data-title');
    st.step=i;save();if(o.hash!==false&&history.replaceState)history.replaceState(null,'','#step-'+(i+1));
    if(o.focus)nodes[i].focus();var nd=demos[i];if(nd&&nd.enter)nd.enter();if(i===5)done(5)};
  var toZ=function(){var y=Z.getBoundingClientRect().top+scrollY-72;scrollTo({top:y,behavior:RM?'auto':'smooth'})};

  /* mini-deck readout */
  var pv=$('[data-clock="pos"]',Z),pb=$('[data-clock="bar"]',Z),dots=$$('.metro i',Z),tog=$('[data-clock="toggle"]',Z),lb=-1;
  clock.fns.push(function(b){var fb=Math.floor(b);if(fb!==lb){lb=fb;pv.textContent=pos(b);pb.textContent=(((fb>>2)%4)+1)+' / 4';dots.forEach(function(x,k){x.classList.toggle('is-on',k===fb%4)})}var dm=demos[cur];if(dm&&dm.on)dm.on(b)});
  var sync=function(){if(vis&&!paused)clock.start();else clock.stop();deck.classList.toggle('is-running',clock.on);tog.setAttribute('aria-pressed',String(!paused));tog.textContent=paused?'run the clock':'pause the clock'};
  tog.addEventListener('click',function(){paused=!paused;sync()});
  seen(Z,function(v){vis=v;sync()},{threshold:.1});
  var needClock=function(i){status(i,'the clock is paused. hit “run the clock”, then try again.','warn')};

  /* 1 · count the bar */
  (function(){var s=steps[0],pads=$$('.pad',s),h=-1;
    var chk=function(){var on=pads.map(function(p){return p.getAttribute('aria-pressed')==='true'}),n=on.filter(Boolean).length;
      if(on.every(function(v,k){return v===(k%4===0)})){status(0,'four on the floor. one kick per beat, 124 beats a minute. that’s the grid everything else sits on.','good');done(0);return}
      var off=[];on.forEach(function(v,k){if(v&&k%4)off.push(k+1)});
      if(!n)status(0,'light steps 1, 5, 9 and 13 — one kick on every beat.');
      else if(off.length)status(0,'step '+off[0]+' sits between beats. kicks land on 1, 5, 9 and 13.','warn');
      else status(0,(4-n)+' beat'+(4-n>1?'s':'')+' still empty. keep going.')};
    pads.forEach(function(p){p.setAttribute('aria-pressed','false');p.addEventListener('click',function(){p.setAttribute('aria-pressed',p.getAttribute('aria-pressed')==='true'?'false':'true');chk()})});
    demos[0]={on:function(b){var x=Math.floor(b*4)%16;if(x!==h){if(pads[h])pads[h].classList.remove('is-head');h=x;pads[x].classList.add('is-head')}},leave:function(){if(pads[h])pads[h].classList.remove('is-head');h=-1}};
  })();

  /* 2 · cue & drop */
  (function(){var s=steps[1],c=$('[data-counter]',s),n=0;
    demos[1]={on:function(b){c.textContent=pos(b);c.classList.toggle('is-one',Math.floor(b)%16===0)}};
    $('[data-act="cue"]',s).addEventListener('click',function(){if(!clock.on)return needClock(1);var b=clock.beat();
      if(onTheOne(b)){n++;status(1,n>1?'on the one again. that’s muscle memory starting.':'on the one. a cue there drops clean — the room hears a new phrase, not a stumble.','good');done(1)}
      else status(1,'that landed on '+pos(b)+'. wait for 1.1 — the top of the phrase — then press.','warn')});
  })();

  /* 3 · ride the phrase */
  (function(){var s=steps[2],cells=$$('.cell',s),hEl=$('[data-hits]',s),L=8,h=-1,hits=0;
    var draw=function(){cells.forEach(function(c,k){c.classList.toggle('is-down',k%L===0)})};
    $$('input[name="phrase"]',s).forEach(function(r){r.addEventListener('change',function(){L=+r.value;draw()})});
    demos[2]={on:function(b){var x=Math.floor(b)%32;if(x!==h){h=x;cells.forEach(function(c,k){c.classList.toggle('is-past',k<x);c.classList.toggle('is-head',k===x)})}},
      leave:function(){cells.forEach(function(c){c.classList.remove('is-past','is-head')});h=-1}};
    $('[data-act="mark"]',s).addEventListener('click',function(){if(!clock.on)return needClock(2);var b=clock.beat(),x=Math.floor(b)%32,fr=b%1,off=x%L;
      if(off===0||(off===L-1&&fr>.55)){hits++;hEl.textContent=Math.min(hits,3)+' / 3 on time';
        if(hits>=3){status(2,'three turns, on time. you’re hearing phrases now, not counting them.','good');done(2)}else status(2,'on the turn. '+hits+' of 3.','good')}
      else status(2,'late by '+off+' bar'+(off>1?'s':'')+'. the phrase turned at bar '+(x-off+1)+'.','warn')});
  })();

  /* 4 · blend on camelot */
  (function(){var s=steps[3],svg=$('.wheel',s),W=wheelKit(svg),o=$('[data-out]',s),inn=$('[data-in]',s),out=null;
    var reset=function(){out=null;W.clear();W.label('pick','outgoing key');o.textContent='—';inn.textContent='—'};reset();
    var pickOut=function(k){out=k;W.show(k);o.textContent=k;inn.textContent='—';status(3,k+' is playing. now pick the incoming key — outlined ones blend clean.')};
    W.bind(function(k){
      if(!out)return pickOut(k);
      if(k===out){inn.textContent=k;status(3,'same key, same energy. safe, but try a neighbour.','good');return}
      inn.textContent=k;
      if(compat(out).indexOf(k)>-1){W.blend(out,k);status(3,out+' → '+k+': '+(parseInt(out,10)===parseInt(k,10)?'straight across, relative major/minor.':'one step round the wheel.')+' blend it.','good');done(3);out=null}
      else{W.clash(out,k);status(3,out+' into '+k+' clashes. try '+compat(out).join(', ')+'.','warn')}});
    demos[3]={enter:function(){if(shared&&!out)pickOut(shared)}};
  })();

  /* 5 · the first mix */
  (function(){var s=steps[4],c=$('[data-counter]',s),start=$('[data-act="start"]',s),xf=$('[data-act="xf"]',s),d2=$('[data-deck2]',s),ok=null;
    var reset=function(){ok=null;xf.value=0;start.setAttribute('aria-pressed','false');d2.classList.remove('is-on');d2.querySelector('b').textContent='deck 2 · cued';status(4,'start deck 2 on 1.1, then ride the crossfader across.')};
    demos[4]={on:function(b){c.textContent=pos(b);c.classList.toggle('is-one',Math.floor(b)%16===0)}};
    start.addEventListener('click',function(){if(!clock.on)return needClock(4);var b=clock.beat();ok=onTheOne(b);start.setAttribute('aria-pressed','true');d2.classList.add('is-on');d2.querySelector('b').textContent='deck 2 · playing';
      status(4,ok?'deck 2 is in on the one. now ride the crossfader across.':'deck 2 came in on '+pos(b)+'. the phrases are fighting — reset and wait for 1.1.',ok?'':'warn')});
    xf.addEventListener('input',function(){var v=+xf.value;
      if(ok===null){if(v>8)status(4,'deck 2 isn’t playing yet — you’d be fading into silence.','warn');return}
      if(v>=90)status(4,ok?'phrase-aligned, faded across. good enough to post.':'the fade is fine; the entry was off. reset and hit 1.1.',ok?'good':'warn');
      if(ok&&v>=90)done(4)});
    $('[data-act="reset"]',s).addEventListener('click',reset);reset();
  })();

  /* nav: path links, prev/next, arrows, hash */
  d.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href^="#step-"]');if(!a)return;var n=parseInt(a.getAttribute('href').slice(6),10);if(!(n>=1&&n<=6))return;
    e.preventDefault();var inPath=!!a.closest('.path');go(n-1,{focus:inPath});if(!a.closest('#zero'))toZ()});
  $$('[data-go]',Z).forEach(function(b){b.addEventListener('click',function(){go(cur+(b.getAttribute('data-go')==='next'?1:-1))})});
  Z.addEventListener('keydown',function(e){if(e.target.matches('input,textarea,select'))return;var inPath=!!e.target.closest('.path'),k=e.key;
    if(k==='ArrowRight'){e.preventDefault();go(cur+1,{focus:inPath})}else if(k==='ArrowLeft'){e.preventDefault();go(cur-1,{focus:inPath})}
    else if(inPath&&k==='Home'){e.preventDefault();go(0,{focus:true})}else if(inPath&&k==='End'){e.preventDefault();go(5,{focus:true})}});
  var fromHash=function(){var m=location.hash.match(/^#step-([1-6])$/);return m?+m[1]-1:-1};
  addEventListener('hashchange',function(){var h=fromHash();if(h>-1)go(h)});
  var h0=fromHash();go(h0>-1?h0:(+st.step||0),{hash:false,announce:false});
  if(h0>-1)requestAnimationFrame(toZ);
}
})();
