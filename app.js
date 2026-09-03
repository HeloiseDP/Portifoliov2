function lang(){return document.documentElement.dataset.lang||'pt'}
function setLang(l){
  document.documentElement.dataset.lang=l;
  try{localStorage.setItem('hd-lang',l)}catch(e){}
  var pt=document.getElementById('b-pt'),en=document.getElementById('b-en');
  if(pt)pt.classList.toggle('active',l==='pt');
  if(en)en.classList.toggle('active',l==='en');
  document.querySelectorAll('[data-pt]').forEach(function(el){el.textContent=el.dataset[l]||el.dataset.pt});
  observe();
}
window.setLang=setLang;
var io;
function observe(){
  io=io||new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');
    e.target.querySelectorAll('.bar i').forEach(function(b){b.style.width=b.dataset.p+'%'});
    io.unobserve(e.target);}})},{threshold:.12});
  document.querySelectorAll('.rv:not(.in)').forEach(function(el){io.observe(el)});
}
function copyEmail(){
  var email='heloise.prudencio@gmail.com';
  var fb=function(){var ta=document.createElement('textarea');ta.value=email;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}document.body.removeChild(ta)};
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(email).catch(fb)}else{fb()}
  var t=document.getElementById('toast');
  if(t){t.classList.add('show');clearTimeout(window._tt);window._tt=setTimeout(function(){t.classList.remove('show')},2200)}
}
window.copyEmail=copyEmail;
var _saved='pt';try{_saved=localStorage.getItem('hd-lang')||'pt'}catch(e){}
setLang(_saved);
