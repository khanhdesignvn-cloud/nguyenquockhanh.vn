/* NQK · gói thiết kế trên trang chủ. Dữ liệu từ /api.php (quản lý tại /admin). */
(function(){
const root=document.getElementById('nqk');
if(!root)return;
const CFG=window.NQK_CFG||{api:'/api.php',default:'/nqk-default.json'};
const $=s=>root.querySelector('['+s+']');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const vnd=n=>Math.round(n).toLocaleString('vi-VN')+'đ';
/* mô tả hạng mục: tách theo dấu phẩy/chấm phẩy thành từng dòng; gộp lại các mã ngắn viết hoa (PDF, PNG…) */
const draw=t=>{const out=[],str=String(t||''),re=/\s*[;\n]\s*/;for(const p of str.split(re).filter(Boolean)){if(out.length&&/^[A-Z0-9]{1,5}$/.test(p))out[out.length-1]+=', '+p;else out.push(p)}return out};
/* mỗi dòng chi tiết có thể kèm giá riêng: "Hồ sơ năng lực | 3000000" */
const dtxt=x=>{const t=String(x).split('|')[0].trim();return t.charAt(0).toUpperCase()+t.slice(1)};
const dlines=t=>draw(t).map(dtxt);
const dprices=t=>draw(t).map(x=>{const m=String(x).split('|')[1];return m?(+m.replace(/[^\d]/g,'')||0):0});
const tr=n=>(n/1e6).toLocaleString('vi-VN',{maximumFractionDigits:1})+'tr';
let C=null;
let QOV=null;const tst={};
const st={on:new Set(),q:{},open:new Set(),filter:'all',showAll:false,off:{},pick:{},fb:{},fbOpen:new Set()};

/* lấy màu nền và màu chữ thật của theme cho thanh tổng và bảng gửi */
(function themeColors(){
  let el=root,bg='';
  while(el&&el!==document.documentElement){const c=getComputedStyle(el).backgroundColor;if(c&&c!=='transparent'&&!/rgba\(.*,\s*0\)$/.test(c)){bg=c;break}el=el.parentElement}
  root.style.setProperty('--nqk-bg',bg||getComputedStyle(document.body).backgroundColor||'#fff');
  root.style.setProperty('--nqk-fg',getComputedStyle(root).color);
})();

/* nền sáng / tối: mặc định do /admin đặt, khách đổi bằng nút tròn góc phải trên */
(function theme(){
  const H=document.documentElement,KEY='nqk-theme';
  const skins=[...document.querySelectorAll('#qodef-page-header [class*="qodef-skin--"],#qodef-page-mobile-header [class*="qodef-skin--"]')];
  skins.forEach(e=>{e.dataset.nqkSkin=e.classList.contains('qodef-skin--dark')?'dark':'light'});
  const sun='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>';
  const moon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  const btn=document.createElement('button');btn.type='button';btn.className='nqk-theme-btn';document.body.appendChild(btn);
  const apply=t=>{const l=t==='light';H.classList.toggle('nqk-light',l);
    skins.forEach(e=>{const want=l?'dark':e.dataset.nqkSkin;e.classList.remove('qodef-skin--light','qodef-skin--dark');e.classList.add('qodef-skin--'+want)});
    btn.innerHTML=l?moon:sun;btn.setAttribute('aria-label',l?'Chuyển sang nền tối':'Chuyển sang nền sáng');btn.title=btn.getAttribute('aria-label')};
  let t=CFG.theme||'light';try{t=localStorage.getItem(KEY)||t}catch(e){}
  apply(t);
  btn.onclick=()=>{t=H.classList.contains('nqk-light')?'dark':'light';try{localStorage.setItem(KEY,t)}catch(e){}apply(t)};
})();

/* logo xoay "brand storyteller": đưa vào banner bên phải, ngôi sao tô dải chuyển sắc thương hiệu */
(function heroMark(){
  const STOPS=['#EF9393','#E17DC2','#998EE0','#43ADD0','#8BDEDA'];
  const paint=(svg,id)=>{const lg=svg.querySelector('linearGradient');if(!lg)return;if(id)lg.id=id;
    lg.querySelectorAll('stop').forEach(x=>x.remove());
    STOPS.forEach((c,i)=>{const st=document.createElementNS('http://www.w3.org/2000/svg','stop');st.setAttribute('offset',String(i/(STOPS.length-1)));st.setAttribute('stop-color',c);lg.appendChild(st)});
    const poly=svg.querySelector('.cls-1');if(poly&&id)poly.style.fill=`url(#${id})`};
  const src=[...document.querySelectorAll('#qodef-page-footer svg')].find(s=>s.querySelector('.horus-rotate-ring'));
  if(!src)return;
  paint(src,null);
  const slot=root.querySelector('[data-mark]');if(!slot)return;
  const c=src.cloneNode(true);c.querySelectorAll('style').forEach(x=>x.remove());c.removeAttribute('id');c.removeAttribute('width');c.removeAttribute('height');
  paint(c,'nqk-mark-grad');slot.appendChild(c);slot.classList.add('on');
})();

const has=s=>!!$(s);
const BAR=root.querySelector('[data-bar]');
const key=(p,it)=>p.id+'/'+it.id;
/* chi tiết được tick: mục thường tick sẵn hết (st.off = bỏ tick); mục tính giá theo chi tiết (perLine) mặc định trống (st.pick = đã tick) */
const isPicked=(k,it,j)=>it.perLine?(st.pick[k]||new Set()).has(j):!(st.off[k]||new Set()).has(j);
const pickAll=(p,it,on)=>{if(!it.perLine)return;const k=key(p,it);if(on)st.pick[k]=new Set(dlines(it.desc).map((x,j)=>j));else delete st.pick[k]};
const pickCount=(p,it)=>{const k=key(p,it);return dlines(it.desc).filter((x,j)=>isPicked(k,it,j)).length};
const linePrice=(it,j)=>dprices(it.desc)[j]||(+it.perLine||0);
const amt=(p,it)=>it.perLine?dlines(it.desc).reduce((t,x,j)=>t+(isPicked(key(p,it),it,j)?linePrice(it,j):0),0):it.price*(it.unit?st.q[key(p,it)]:1);
const pkgSum=p=>p.items.filter(it=>st.on.has(key(p,it))).reduce((t,it)=>t+amt(p,it),0);
const pkgBase=p=>p.items.filter(it=>it.def).reduce((t,it)=>t+(it.perLine?dlines(it.desc).reduce((t,x,j)=>t+linePrice(it,j),0):it.price*(it.unit?(it.qty||1):1)),0);
/* số ngày: gói có daysStep cộng thêm 1 ngày cho mỗi daysStep vật phẩm vượt nhóm đầu */
function pkgPicks(p){return p.items.filter(it=>st.on.has(key(p,it))).reduce((t,it)=>t+(it.perLine?pickCount(p,it):1),0)}
function pkgDays(p){const d=+p.days||0,s=+p.daysStep||0;if(!s)return d;const n=pkgPicks(p);return d+Math.max(0,Math.ceil(n/s)-1)}
function calc(){
  if(QOV)return QOV;
  const lines=[];C.packages.forEach(p=>p.items.forEach(it=>{if(st.on.has(key(p,it))){const k0=key(p,it),all0=dlines(it.desc),off0=new Set(all0.map((x,j)=>j).filter(j=>!it.fixed&&!isPicked(k0,it,j)));if(it.perLine&&off0.size===all0.length)return;lines.push({pkg:p.name,pid:p.id,no:p.no||'',days:pkgDays(p),name:it.name,desc:all0.filter((x,j)=>!off0.has(j)).join('; '),skip:it.perLine?[]:all0.filter((x,j)=>off0.has(j)),note:it.nofb?'':(st.fb[k0]||'').trim(),qty:it.perLine?(all0.length-off0.size)+' sản phẩm':it.unit?st.q[key(p,it)]+' '+it.unit:'',amount:amt(p,it)})}}));
  const sub=lines.reduce((t,l)=>t+l.amount,0);
  const tier=(C.tiers||[]).slice().sort((a,b)=>b.min-a.min).find(t=>sub>=t.min);
  const tierOff=tier?Math.round(sub*tier.pct/100/100000)*100000:0;
  const cb=C.combo,selPk=C.packages.filter(p=>p.items.some(it=>st.on.has(key(p,it))));
  const combo=cb&&cb.pct&&selPk.some(p=>p.no===cb.pkg)&&selPk.filter(p=>p.needs).length>=(+cb.min||2)?cb:null;
  const comboOff=combo?Math.round(sub*combo.pct/100/100000)*100000:0;
  const off=tierOff+comboOff;
  return {lines,sub,tier,tierOff,combo,comboOff,off,total:sub-off};
}
function get(path){return path.split('.').reduce((o,k)=>o?.[k],C)}

function init(){
  st.on=new Set();st.q={};st.open=new Set();
  const anyOn=C.packages.some(p=>p.on);
  C.packages.forEach((p,i)=>p.items.forEach(it=>{if(it.unit)st.q[key(p,it)]=it.qty||1;if(it.def&&p.on)st.on.add(key(p,it))}));
  root.querySelectorAll('[data-c]').forEach(el=>el.textContent=get(el.dataset.c)||'');
  if(has('data-title'))$('data-title').innerHTML=esc(C.site.title).replace(/\*(.+?)\*/,'<span class="nqk-grad">$1</span>');
  if(has('data-stats')){$('data-stats').innerHTML=(C.site.stats||[]).map(s=>`<div><b>${esc(s.v)}</b><small>${esc(s.l)}</small></div>`).join('');$('data-stats').hidden=!(C.site.stats||[]).length}
  if(has('data-steps'))$('data-steps').innerHTML=(C.steps||[]).map(s=>`<li><b>${esc(s.t)}</b><span>${esc(s.d)}</span></li>`).join('');
  if(has('data-recent')){$('data-recent').innerHTML=(C.recent||[]).map(r=>`<li>${esc(r)}</li>`).join('');$('data-recent-wrap').hidden=!(C.recent||[]).length}
  if(has('data-zalo'))$('data-zalo').href='https://zalo.me/'+String(C.site.phone||'').replace(/\D/g,'');
  if(has('data-plans'))renderPlans();
  if(has('data-pkgs')){renderPkgs();renderBar()}
  if(has('data-grid')){renderFilters();renderGrid()}
}

/* gói */
function renderPkgs(){
  $('data-pkgs').innerHTML=C.packages.map((p,i)=>{
    const sel=p.items.filter(it=>st.on.has(key(p,it))),open=st.open.has(p.id);
    const defs=p.items.filter(it=>it.def),adds=p.items.filter(it=>!it.def);
    const allDef=defs.length&&defs.every(it=>st.on.has(key(p,it)));
    const row=it=>{const k=key(p,it),on=st.on.has(k);
      if(p.whole)return `<div class="nqk-it nqk-wi${on?' on':''}"><span class="nqk-wdot" aria-hidden="true"></span><span><span class="n">${esc(it.name)}</span>${it.desc?`<span class="wd">${dlines(it.desc).map(esc).join(' ')}</span>`:''}</span><span class="p"></span></div>`;
      return `<div class="nqk-it${on?' on':''}" data-k="${esc(k)}" role="checkbox" aria-checked="${on}" tabindex="0"><span class="nqk-tick" aria-hidden="true"></span><span><span class="n">${esc(it.name)}</span>${it.desc?(on&&!it.fixed?`<span class="d dcl">${dlines(it.desc).map((l,j)=>`<label class="nqk-dc${isPicked(k,it,j)?'':' x'}${it.perLine?' pl':''}"><input type="checkbox" data-dc="${j}"${isPicked(k,it,j)?' checked':''}><i></i><span>${esc(l)}</span></label>`).join('')}</span>`:`<span class="d">${dlines(it.desc).map(l=>`<span>${esc(l)}</span>`).join('')}</span>`):''}${on&&!it.nofb?`<span class="nqk-fb">${st.fbOpen.has(k)||st.fb[k]?`<textarea data-fbt rows="2" maxlength="500" placeholder="Góp ý, yêu cầu riêng cho mục này (số lượng, chất liệu, tham khảo…)">${esc(st.fb[k]||'')}</textarea>`:`<button type="button" class="nqk-fbb" data-fbb>+ Góp ý cho mục này</button>`}</span>`:''}${it.unit&&on?`<span class="nqk-qty"><span role="button" tabindex="0" data-d="-1" aria-label="Giảm">−</span><output>${st.q[k]}</output><span role="button" tabindex="0" data-d="1" aria-label="Tăng">+</span><small>${esc(it.unit)}</small></span>`:''}</span><span class="p">${it.perLine?'':it.unit?tr(on?amt(p,it):it.price*(it.qty||1)):tr(it.price)}${it.unit?`<small>${on?st.q[k]:it.qty||1} ${esc(it.unit)}</small>`:''}</span></div>`};
    return `<div class="nqk-pkg${p.whole?' whole':''}${i===0?' core':''}${sel.length?' has':''}${open?' open':''}" data-p="${esc(p.id)}">
      <div class="nqk-pkg-h" aria-expanded="${open}" tabindex="0">
        <span class="nqk-tick ${sel.length?(allDef?'on':'part'):''}" data-all role="checkbox" aria-checked="${sel.length?(allDef?'true':'mixed'):'false'}" aria-label="Chọn cả gói ${esc(p.name)}" tabindex="0"></span>
        <span class="t"><h3><span class="nqk-no">${esc(p.no||String(i+1).padStart(2,'0'))}</span>${esc(p.name)}${p.badge?`<span class="nqk-badge">${esc(p.badge)}</span>`:''}</h3><span class="sub">${p.days?`<span class="nqk-days">${p.daysStep&&!sel.length?'từ ':''}${sel.length?pkgDays(p):p.days} ngày</span>`:''}${sel.length?(p.whole?'Đã chọn trọn gói':sel.length+'/'+p.items.length+' hạng mục đã chọn'):esc(p.desc)}</span></span>
        <span class="amt${sel.length?'':' none'}">${sel.length?tr(pkgSum(p)):'—'}${sel.length?'<small>đã chọn</small>':''}</span>
        <span class="nqk-chev" aria-hidden="true"></span>
      </div>
      <div class="nqk-pkg-b"><div><div class="nqk-pkg-in">
        ${defs.length?`<p class="nqk-grp">Trong gói</p>${defs.map(row).join('')}`:''}
        ${adds.length?`<p class="nqk-grp">Bổ sung thêm</p>${adds.map(row).join('')}`:''}
      </div></div></div></div>`}).join('');
  $('data-pkgs').querySelectorAll('.nqk-pkg').forEach(el=>{
    const p=C.packages.find(x=>x.id===el.dataset.p),h=el.querySelector('.nqk-pkg-h'),all=el.querySelector('[data-all]');
    const toggleOpen=()=>{st.open.has(p.id)?st.open.delete(p.id):st.open.add(p.id);renderPkgs()};
    const toggleAll=()=>{const any=p.items.some(it=>st.on.has(key(p,it)));p.items.forEach(it=>{st.on.delete(key(p,it));pickAll(p,it,false)});
      if(!any){p.items.filter(it=>it.def).forEach(it=>{st.on.add(key(p,it));pickAll(p,it,true)});st.open.add(p.id)}renderPkgs();renderBar()};
    h.onclick=e=>{e.target.closest('[data-all]')?toggleAll():toggleOpen()};
    h.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&e.target===h){e.preventDefault();toggleOpen()}};
    all.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();toggleAll()}};
    el.querySelectorAll('.nqk-it:not(.nqk-wi)').forEach(r=>{
      const k=r.dataset.k,it=p.items.find(x=>key(p,x)===k);
      const t=()=>{const now=!st.on.has(k);now?st.on.add(k):st.on.delete(k);pickAll(p,it,now);renderPkgs();renderBar()};
      r.onclick=e=>{if(!e.target.closest('.nqk-qty,.nqk-dc,.nqk-fb'))t()};
      r.querySelectorAll('[data-dc]').forEach(c=>c.onchange=()=>{const j=+c.dataset.dc;if(it.perLine){const s2=st.pick[k]||(st.pick[k]=new Set());c.checked?s2.add(j):s2.delete(j);if(!s2.size){st.on.delete(k);delete st.pick[k]}renderPkgs();renderBar();return}const s2=st.off[k]||(st.off[k]=new Set());c.checked?s2.delete(j):s2.add(j);c.closest('.nqk-dc').classList.toggle('x',!c.checked)});
      const fbb=r.querySelector('[data-fbb]');if(fbb)fbb.onclick=e=>{e.stopPropagation();st.fbOpen.add(k);renderPkgs();const ta=root.querySelector(`.nqk-it[data-k="${CSS.escape(k)}"] [data-fbt]`);if(ta)ta.focus()};
      const fbt=r.querySelector('[data-fbt]');if(fbt){fbt.oninput=()=>{st.fb[k]=fbt.value};fbt.onkeydown=e=>e.stopPropagation()}
      r.onkeydown=e=>{if((e.key===' '||e.key==='Enter')&&e.target===r){e.preventDefault();t()}};
      r.querySelectorAll('.nqk-qty [role=button]').forEach(b=>{const go=e=>{e.stopPropagation();e.preventDefault();
        st.q[k]=Math.min(it.max||99,Math.max(it.min||1,st.q[k]+(+b.dataset.d)*(it.step||1)));renderPkgs();renderBar()};
        b.onclick=go;b.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')go(e)}});
    });
  });
}
function renderBar(){
  const {lines,tier,total}=calc();
  const names=C.packages.filter(p=>p.items.some(it=>st.on.has(key(p,it)))).map(p=>p.name);
  const {combo}=calc();const pct=(tier?tier.pct:0)+(combo?+combo.pct:0);
  BAR.querySelector('[data-bar-sub]').innerHTML=lines.length?esc(names.join(' + '))+(pct?` · <span class="disc">giảm ${pct}%${combo?' (có ưu đãi combo)':''}</span>`:''):'Chưa chọn mục nào';
  /* 2. gói ứng dụng cần logo: nhắc khi chưa chọn gói nền tảng */
  const need=root.querySelector('[data-need]');if(need){const selP=C.packages.filter(p=>p.items.some(it=>st.on.has(key(p,it))));const miss=selP.filter(p=>p.needs&&!selP.some(q=>q.no===p.needs));
    if(miss.length){const base=C.packages.find(q=>q.no===miss[0].needs);need.innerHTML=`<b>Lưu ý:</b> các gói ứng dụng cần có logo. Hãy chọn kèm <b>${esc((base&&base.no)||'')}. ${esc((base&&base.name)||'')}</b> hoặc ghi chú "đã có logo" khi gửi báo giá.`;need.hidden=false}else need.hidden=true}
  BAR.querySelector('[data-bar-total]').textContent=lines.length?vnd(total):'Tư vấn miễn phí';
}

/* 3 gói nhanh: Khởi nghiệp / Chuyên nghiệp / Tuỳ chọn. Bấm "Chọn gói" mở thẳng popup báo giá */
const PLANS_DEF=[
 {id:'start',no:'01',name:'Khởi nghiệp',for:'Cho shop nhỏ, quán mới mở, cần hình ảnh gọn gàng để bắt đầu bán.',dayLabel:'7–10 ngày',days:10,from:5000000,
  groups:[{name:'Đã bao gồm',items:[{n:'Thiết kế logo',d:'2 phương án, chỉnh sửa 2 lần',inc:1},{n:'Bảng màu & font chữ',d:'Quy định cơ bản để dùng thống nhất',inc:1},{n:'File bàn giao',d:'AI, PDF, PNG nền trong, JPG',inc:1}]},
   {name:'Thêm nếu cần',items:[{n:'Danh thiếp',d:'Mặt trước & sau',p:500000},{n:'Avatar & ảnh bìa fanpage',d:'Kích thước Facebook, Zalo OA',p:800000},{n:'Tem nhãn đơn giản',d:'1 mẫu, 1 kích thước',p:1000000},{n:'Bộ quy chuẩn rút gọn',d:'Brand guideline 8 trang',p:1500000}]}]},
 {id:'pro',no:'02',name:'Chuyên nghiệp',feat:1,badge:'Được chọn nhiều nhất',for:'Cho doanh nghiệp muốn xây thương hiệu bài bản, dùng lâu dài và mở rộng.',dayLabel:'25–30 ngày',days:30,from:25000000,
  groups:[{name:'Đã bao gồm',items:[{n:'Chiến lược & định vị',d:'Khảo sát, đối thủ, tính cách thương hiệu',inc:1},{n:'Thiết kế logo',d:'3 phương án, chỉnh sửa đến khi chốt',inc:1},{n:'Hệ thống nhận diện',d:'Màu, font, hoạ tiết, hình ảnh chủ đạo',inc:1},{n:'Brand guideline',d:'20–30 trang, hướng dẫn chi tiết',inc:1},{n:'Bộ văn phòng 5 món',d:'Danh thiếp, giấy tiêu đề, phong bì, thẻ tên, chữ ký email',inc:1},{n:'Bộ mạng xã hội',d:'Avatar, ảnh bìa, 5 mẫu bài đăng',inc:1}]},
   {name:'Thêm nếu cần',items:[{n:'Bao bì sản phẩm',d:'1 SKU, file in sẵn sàng',p:3000000},{n:'Hồ sơ năng lực',d:'Tối đa 12 trang',p:5000000},{n:'Biển hiệu & điểm bán',d:'Biển chính, decal kính, menu',p:4000000},{n:'Logo động',d:'Animation 3–5 giây, MP4 & GIF',p:3000000}]}]},
 {id:'custom',no:'03',name:'Tuỳ chọn',for:'Bạn đã có một phần, chỉ cần làm thêm vài hạng mục. Tự ghép, trả đúng phần cần.',dayLabel:'Theo hạng mục',days:0,from:0,min:3000000,
  groups:[{name:'Nhận diện',items:[{n:'Thiết kế logo',d:'2 phương án',p:4500000},{n:'Bộ quy chuẩn thương hiệu',d:'12–20 trang',p:3000000},{n:'Hoạ tiết thương hiệu',d:'Pattern ứng dụng',p:1500000}]},
   {name:'Ấn phẩm',items:[{n:'Bộ văn phòng',d:'5 món',p:2500000},{n:'Hồ sơ năng lực',d:'Tối đa 12 trang',p:5000000},{n:'Brochure / tờ gấp',d:'2–3 mặt gấp',p:1500000}]},
   {name:'Sản phẩm & online',items:[{n:'Bao bì sản phẩm',d:'Mỗi SKU',p:3000000},{n:'Bộ mạng xã hội',d:'Avatar, ảnh bìa, 5 mẫu',p:2000000},{n:'Landing page',d:'Thiết kế 1 trang',p:6000000}]}]}];
const plans=()=>(Array.isArray(C.plans)&&C.plans.length?C.plans:PLANS_DEF);
const psel=p=>tst[p.id]||(tst[p.id]=new Set());
const ptotal=p=>{let t=+p.from||0;p.groups.forEach((g,gi)=>g.items.forEach((it,ii)=>{if(!it.inc&&psel(p).has(gi+'.'+ii))t+=+it.p||0}));return t};
const pshort=n=>(n/1e6).toLocaleString('vi-VN',{maximumFractionDigits:1})+'tr';
const ARROW='<svg class="qodef-svg--btn-arrow qodef-btn-arrow" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10.75 10.76" xml:space="preserve"><path d="M1.09,10.76L0,9.67l8.14-8.15H0L0.01,0h10.74v10.76H9.22l0.01-8.15L1.09,10.76z"/></svg>';
function planQuote(p){
  const pid='plan-'+p.id,pkg='Gói '+p.name,lines=[];
  const inc=p.groups.flatMap(g=>g.items.filter(it=>it.inc));
  if(+p.from)lines.push({pkg,pid,no:p.no||'',days:+p.days||0,name:'Trọn gói phần cốt lõi',desc:inc.map(it=>it.n+(it.d?' ('+it.d+')':'')).join('; '),skip:[],note:'',qty:'',amount:+p.from});
  p.groups.forEach((g,gi)=>g.items.forEach((it,ii)=>{if(!it.inc&&psel(p).has(gi+'.'+ii))lines.push({pkg,pid,no:p.no||'',days:+p.days||0,name:it.n,desc:it.d||'',skip:[],note:'',qty:'',amount:+it.p||0})}));
  const sub=lines.reduce((t,l)=>t+l.amount,0);
  return {lines,sub,tier:null,tierOff:0,combo:null,comboOff:0,off:0,total:sub};
}
function renderPlans(){
  const el=$('data-plans');const sec=root.querySelector('[data-plans-sec]');if(sec)sec.hidden=false;
  el.innerHTML=plans().map(p=>{const t=ptotal(p),cus=!+p.from,n=psel(p).size;
    return `<article class="nqk-plan${p.feat?' feat':''}${n?' on':''}" data-plan="${esc(p.id)}">
      ${p.feat&&p.badge?`<span class="nqk-plan-badge">${esc(p.badge)}</span>`:''}
      <div class="nqk-plan-top"><div><span class="nqk-plan-no">${esc(p.no||'')}</span><h3>Gói ${esc(p.name)}</h3></div>${p.dayLabel?`<span class="nqk-plan-days">${esc(p.dayLabel)}</span>`:''}</div>
      <p class="nqk-plan-for">${esc(p.for||'')}</p>
      <div class="nqk-plan-price"><small>${cus?(t?'Tạm tính':'Chọn hạng mục bên dưới'):(n?'Tạm tính':'Giá từ')}</small><b data-pt>${cus&&!t?'—':vnd(t)}</b><span>${cus?(n?n+' hạng mục':'Tối thiểu '+vnd(+p.min||0)):(n?'Đã thêm '+n+' hạng mục':'Trọn gói phần đã bao gồm')}</span></div>
      ${p.groups.map((g,gi)=>`<p class="nqk-plan-grp">${esc(g.name)}</p><ul class="nqk-plan-list">${g.items.map((it,ii)=>{const k=gi+'.'+ii,on=it.inc||psel(p).has(k);
        return `<li><label class="nqk-plan-it${it.inc?' lock':''}"><input type="checkbox" data-k="${k}"${on?' checked':''}${it.inc?' disabled':''}><span class="bx"></span><span class="t">${esc(it.n)}${it.d?`<small>${esc(it.d)}</small>`:''}</span><span class="pr${it.inc?' inc':''}">${it.inc?'Có':'+'+pshort(+it.p||0)}</span></label></li>`}).join('')}</ul>`).join('')}
      <p class="nqk-plan-min" data-min></p>
      <button type="button" style="--qode-button-color:#FFFFFF;--qode-button-hover-color:#FFFFFF;--qode-button-border-color:#FFFFFF;" class="qodef-shortcode qodef-m qodef-button qodef-layout--outlined qodef-html--link nqk-btn nqk-plan-go" data-plan-go><span class="qodef-m-text-holder qodef-btn-style"><span class="qodef-m-text">Chọn gói ${esc(p.name)}</span></span><span class="qodef-m-icon-holder qodef-btn-style">${ARROW}</span></button>
    </article>`}).join('');
  el.querySelectorAll('[data-plan]').forEach(card=>{const p=plans().find(x=>x.id===card.dataset.plan);
    card.querySelectorAll('input[data-k]:not([disabled])').forEach(i=>i.onchange=()=>{i.checked?psel(p).add(i.dataset.k):psel(p).delete(i.dataset.k);renderPlans();const b=el.querySelector(`[data-plan="${p.id}"] [data-pt]`);if(b)b.classList.add('bump')});
    card.querySelector('[data-plan-go]').onclick=()=>{const t=ptotal(p);
      if(!+p.from&&t<(+p.min||1)){card.querySelector('[data-min]').textContent=t?'Gói tuỳ chọn tối thiểu '+vnd(+p.min)+', thêm hạng mục nhé.':'Tick ít nhất một hạng mục bên trên nhé.';return}
      if(window.__nqkQuote)window.__nqkQuote(planQuote(p))}});
}
/* báo giá: xem tổng quan, tải PDF, nhắn Zalo, gửi yêu cầu */
const sheet=$('data-sheet');
if(sheet){
  document.body.appendChild(sheet);sheet.classList.add('nqk');
  const q=s=>sheet.querySelector('['+s+']'),qa=s=>sheet.querySelectorAll('['+s+']');
  const v=id=>(sheet.querySelector('#'+id)?.value||'').trim();
  let code='',when=null;
  const newCode=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');when=d;code=p(d.getDate())+p(d.getMonth()+1)+String(d.getFullYear()).slice(2)+'-'+Math.random().toString(36).slice(2,6).toUpperCase()+'/BRANDING'};
  const dmy=d=>d.toLocaleDateString('vi-VN',{day:'2-digit',month:'2-digit',year:'numeric'});
  const phone=()=>String(C.site.phone||'').replace(/\D/g,'');
  const docHTML=()=>{const {lines,sub,tier,tierOff,combo,comboOff,off,total}=calc();const site=C.site||{};
    const groups=[];lines.forEach(l=>{let g=groups.find(x=>x.pid===l.pid);if(!g){g={pid:l.pid,no:l.no,pkg:l.pkg,days:l.days,items:[],sum:0};groups.push(g)}g.items.push(l);g.sum+=l.amount});
    groups.forEach((g,k)=>{if(!g.no)g.no=String(k+1).padStart(2,'0')});
    const days=groups.reduce((t,g)=>t+(g.days||0),0);
    const rows=groups.length?groups.map(g=>`<tr><td class="mc"><b>${esc(g.no)}.</b><span>${esc(g.pkg)}</span></td>
      <td class="hm">${g.items.map(l=>`<div class="li"><b class="n">${esc(l.name)}</b>${l.qty?` <span class="m">× ${esc(l.qty)}</span>`:''}${l.desc?`<span class="sub">${dlines(l.desc).map(x=>`<span>${esc(x)}</span>`).join('')}</span>`:''}${l.skip&&l.skip.length?`<span class="skip">Không cần: ${l.skip.map(esc).join(', ')}</span>`:''}${l.note?`<span class="fbq"><b>Góp ý:</b> ${esc(l.note)}</span>`:''}</div>`).join('')}</td>
      <td class="tl">${g.days?g.days+' ngày':'—'}</td><td class="r">${g.sum.toLocaleString('vi-VN')}</td></tr>`).join('')
      :'<tr><td colspan="4" class="m">Chưa chọn hạng mục. Khánh sẽ tư vấn phạm vi phù hợp với bạn.</td></tr>';
    const exp=new Date(when);exp.setDate(exp.getDate()+30);
    const nm=v('nqk-name'),zl=v('nqk-zalo'),em=v('nqk-email'),br=v('nqk-brand');
    const notes=(Array.isArray(C.quoteNotes)?C.quoteNotes:String(C.quoteNotes||'').split('\n')).map(x=>String(x).trim()).filter(Boolean);
    return `<div class="dh"><div><span class="bar"></span><b>Báo giá dịch vụ</b><small>Tư vấn &amp; thiết kế thương hiệu</small></div>
      <dl><dt>Số</dt><dd>${code}</dd><dt>Ngày lập</dt><dd>${dmy(when)}</dd><dt>Hiệu lực</dt><dd>đến ${dmy(exp)}</dd></dl></div>
      <p class="dsub">Tư vấn, thiết kế thương hiệu <b>${br?esc(br).toUpperCase():'<i>Tên thương hiệu của bạn</i>'}</b></p>
      <div class="dp"><div><small>Đơn vị tư vấn</small><b>Nguyễn Quốc Khánh</b><span>Zalo ${esc(site.phone||'')}</span><span>${esc(site.email||'')}</span><span>nguyenquockhanh.vn</span></div>
      <div><small>Khách hàng</small><b data-doc-name>${esc(nm)||'<i>Tên của bạn</i>'}</b><span>${br?esc(br):''}</span><span>${zl?'Zalo '+esc(zl):''}</span><span>${esc(em)}</span></div></div>
      <table><thead><tr><th class="mc">Mục</th><th>Hạng mục</th><th class="tl">Timeline</th><th class="r">Chi phí (VND)</th></tr></thead><tbody>${rows}</tbody></table>
      <div class="dt"><div><span>Tổng thời gian dự kiến</span><span>${days?days+' ngày':'—'}</span></div><div><span>Tạm tính</span><span>${vnd(sub)}</span></div>${tier?`<div class="ok"><span>Ưu đãi giá trị đơn −${tier.pct}%</span><span>−${vnd(tierOff)}</span></div>`:''}${combo?`<div class="ok"><span>${esc(combo.label||'Ưu đãi combo')} −${combo.pct}%</span><span>−${vnd(comboOff)}</span></div>`:''}<div class="big"><span>Tổng chi phí <small>(chưa VAT)</small></span><span>${vnd(total)}</span></div></div>
      ${notes.length?`<div class="dn"><small>Điều khoản & ghi chú</small><ol>${notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ol></div>`:`<p class="df">${esc(site.terms||'')}</p>`}
      <div class="dsign"><div><small>Khách hàng xác nhận</small><span class="ln"></span></div><div><small>Người thực hiện báo giá</small><b>Nguyễn Quốc Khánh</b><span>Người kể chuyện thương hiệu</span></div></div>`};
  const paint=()=>{q('data-doc').innerHTML=docHTML()};
  const openSheet=()=>{newCode();paint();
    q('data-form').hidden=false;q('data-done').hidden=true;q('data-fallback').hidden=true;q('data-err').hidden=true;q('data-qhint').textContent='';
    sheet.hidden=false;document.documentElement.style.overflow='hidden';sheet.querySelector('.nqk-sheet-in').scrollTop=0};
  const closeSheet=()=>{sheet.hidden=true;document.documentElement.style.overflow='';QOV=null};
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=()=>{QOV=null;openSheet()});
  window.__nqkQuote=ov=>{QOV=ov;openSheet()};
  qa('data-close').forEach(b=>b.onclick=closeSheet);
  sheet.addEventListener('click',e=>{if(e.target===sheet)closeSheet()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!sheet.hidden)closeSheet()});
  ['nqk-name','nqk-zalo','nqk-email','nqk-brand'].forEach(id=>sheet.querySelector('#'+id).addEventListener('input',paint));
  const msg=()=>{const {lines,total}=calc();const nm=v('nqk-name'),zl=v('nqk-zalo'),nt=v('nqk-note');
    return `Chào anh Khánh, tôi gửi báo giá ${code} từ nguyenquockhanh.vn.\n`+(nm?`Tên: ${nm}\n`:'')+(v('nqk-brand')?`Thương hiệu: ${v('nqk-brand')}\n`:'')+(zl?`Zalo: ${zl}\n`:'')+(lines.length?`Hạng mục:\n${lines.map(l=>'- '+l.name+(l.qty?' ×'+l.qty:'')+(l.skip&&l.skip.length?' (không cần: '+l.skip.join(', ')+')':'')+(l.note?'\n  Góp ý: '+l.note:'')).join('\n')}\nTổng tạm tính: ${vnd(total)}\n`:'Tôi cần tư vấn gói nhận diện phù hợp.\n')+(nt?`Ghi chú: ${nt}`:'')};
  const copy=t=>{try{return navigator.clipboard.writeText(t).then(()=>true,()=>false)}catch(_){return Promise.resolve(false)}};
  const check=()=>{const nm=v('nqk-name'),d=v('nqk-zalo').replace(/\D/g,''),em=v('nqk-email');
    const err=(m,id)=>{q('data-err').textContent=m;q('data-err').hidden=false;sheet.querySelector('#'+id).focus();return false};
    if(!nm)return err('Nhập tên liên hệ để Khánh biết gọi bạn là gì.','nqk-name');
    if(d.length<9||d.length>12)return err('Số Zalo chưa đúng. Nhập 10 số, ví dụ 0905 123 456.','nqk-zalo');
    if(em&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))return err('Email chưa đúng.','nqk-email');
    q('data-err').hidden=true;return true};
  const post=source=>{const {lines,sub,off,total}=calc();
    return fetch(CFG.api+'?a=lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:v('nqk-name'),brand:v('nqk-brand'),zalo:v('nqk-zalo'),email:v('nqk-email'),note:v('nqk-note'),website:v('nqk-web'),quote:code,source,items:lines,subtotal:sub,discount:off,total})})
      .then(async r=>{const j=await r.json().catch(()=>({}));if(!r.ok||!j.ok)throw new Error(j.error||'fail');return j})};
  q('data-form').addEventListener('submit',async e=>{
    e.preventDefault();if(!check())return;
    const btn=q('data-send'),label=btn.querySelector('.qodef-m-text');btn.disabled=true;label.textContent='Đang gửi…';
    try{await post('form');
      q('data-done-msg').textContent=v('nqk-email')?'Bản báo giá đã được gửi tới email của bạn. Khánh sẽ nhắn Zalo trong vòng 24 giờ.':'Khánh sẽ nhắn Zalo cho bạn trong vòng 24 giờ.';
      q('data-form').hidden=true;q('data-done').hidden=false;
    }catch(_){q('data-fb-msg').textContent=msg();q('data-zalo').href='https://zalo.me/'+phone();q('data-form').hidden=true;q('data-fallback').hidden=false}
    finally{btn.disabled=false;label.textContent='Gửi yêu cầu báo giá'}
  });
  /* nhắn Zalo: sao chép nội dung báo giá rồi mở Zalo của Khánh; có tên + số thì lưu luôn yêu cầu */
  q('data-zalo-go').onclick=async()=>{const w=window.open('https://zalo.me/'+phone(),'_blank');if(w)try{w.opener=null}catch(_){}
    const ok=await copy(msg());
    q('data-qhint').textContent=ok?'Đã sao chép nội dung báo giá. Dán vào khung chat Zalo để gửi cho Khánh.':'Mở Zalo và gửi mã báo giá '+code+' cho Khánh nhé.';
    const nm=v('nqk-name'),d=v('nqk-zalo').replace(/\D/g,'');if(nm&&d.length>=9&&d.length<=12)post('zalo').catch(()=>{});
    if(!w)location.href='https://zalo.me/'+phone()};
  /* tải PDF: dựng từ chính bản báo giá đang xem */
  let pdfLib=null;
  const loadPdf=()=>pdfLib||(pdfLib=new Promise((ok,no)=>{if(window.html2pdf)return ok();const sc=document.createElement('script');sc.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';sc.onload=ok;sc.onerror=()=>{pdfLib=null;no()};document.head.appendChild(sc)}));
  qa('data-pdf').forEach(b=>b.onclick=async()=>{const label=b.querySelector('.qodef-m-text'),t=label.textContent;label.textContent='Đang tạo PDF…';b.disabled=true;
    try{await loadPdf();paint();const el=q('data-doc');el.classList.add('pdf');
      await html2pdf().set({margin:[10,10,12,10],filename:`Bao-gia-${code.replace('/','-')}.pdf`,image:{type:'jpeg',quality:.96},html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff',scrollX:0,scrollY:0},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy'],avoid:'tr'}}).from(el).save();
      el.classList.remove('pdf');
    }catch(_){window.print()}
    finally{label.textContent=t;b.disabled=false}});
  q('data-copy').onclick=()=>{const b=q('data-copy').querySelector('.qodef-m-text');copy(q('data-fb-msg').textContent).then(ok=>b.textContent=ok?'Đã sao chép':'Hãy chọn và sao chép')};
}

/* dự án */
const FIL=[['all','Tất cả'],['branding','Branding'],['logo','Logo'],['packaging','Bao bì']];
function renderFilters(){
  const cats=new Set((C.projects||[]).map(p=>p.cat));
  $('data-filters').innerHTML=FIL.filter(([k])=>k==='all'||cats.has(k)).map(([k,t])=>`<button type="button" role="tab" class="nqk-chip${k===st.filter?' on':''}" aria-selected="${k===st.filter}" data-k="${k}"><span>${t}</span></button>`).join('');
  $('data-filters').querySelectorAll('.nqk-chip').forEach(b=>b.onclick=()=>{st.filter=b.dataset.k;st.showAll=false;renderFilters();renderGrid()});
}
const ini=n=>String(n).replace(/[^\p{L}\p{N} ]/gu,'').split(' ').filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase();
function renderGrid(){
  const list=(C.projects||[]).filter(p=>st.filter==='all'||p.cat===st.filter),shown=st.showAll?list:list.slice(0,9);
  $('data-grid').innerHTML=shown.map(p=>`<a class="nqk-card" href="${esc(p.link||'#')}" target="_blank" rel="noopener"><div class="nqk-thumb"><div class="nqk-ph" aria-hidden="true">${esc(ini(p.name))}</div>${p.img?`<img loading="lazy" alt="Dự án ${esc(p.name)}" src="${esc(p.img)}" onerror="this.remove()">`:''}</div><h3>${esc(p.name)}</h3><div class="nqk-meta"><span>${esc(p.label)}</span><span>Xem dự án →</span></div></a>`).join('');
  $('data-more').hidden=st.showAll||list.length<=9;
}
if(has('data-more'))$('data-more').onclick=()=>{st.showAll=true;renderGrid()};

/* tải dữ liệu */
const take=j=>{if(j&&j.packages){C=j;init();return true}return false};
fetch(CFG.api+'?a=content',{cache:'no-store'}).then(r=>r.json()).then(j=>{if(!take(j.content))throw 0})
  .catch(()=>fetch(CFG.default,{cache:'no-store'}).then(r=>r.json()).then(take)).catch(()=>{});
})();
