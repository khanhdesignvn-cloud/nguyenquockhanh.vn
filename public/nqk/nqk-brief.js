/* Form lấy brief thiết kế: mở từ nút dọc "Cùng nhau kể chuyện nhé!", tạo PDF brief, gửi về /api.php?a=brief */
(function(){
  if(window.__nqkBrief)return;window.__nqkBrief=1;
  const API='/api.php',ZALO='https://zalo.me/0988886901';
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const chip=(v,label,sub)=>`<button type="button" class="nb-chip" data-v="${esc(v)}">${label||esc(v)}${sub?`<small>${sub}</small>`:''}</button>`;
  const field=(id,label,ph,o={})=>`<div class="nb-f"${o.req?` data-req="${id}"`:''}><label class="nb-lb" for="nb-${id}">${label}</label>${o.rows?`<textarea id="nb-${id}" rows="${o.rows}" placeholder="${esc(ph)}" maxlength="1500"></textarea>`:`<input id="nb-${id}" type="${o.type||'text'}" placeholder="${esc(ph)}" maxlength="${o.max||120}"${o.ac?` autocomplete="${o.ac}"`:''}${o.type==='tel'?' inputmode="tel"':''}>`}${o.msg?`<p class="nb-msg">${o.msg}</p>`:''}</div>`;
  const group=(k,label,chips,o={})=>`<div class="nb-f"${o.req?` data-req="${k}"`:''}><span class="nb-lb">${label}</span><div class="nb-chips${o.col?' col':''}" data-group="${k}"${o.multi?' data-multi':''}${o.max?` data-max="${o.max}"`:''}>${chips.join('')}</div>${o.cnt?`<p class="nb-cnt" data-cnt="${k}">Đã chọn 0/${o.max}</p>`:''}${o.msg?`<p class="nb-msg">${o.msg}</p>`:''}</div>`;

  const SLIDES=[
    ['Thương hiệu của bạn',`<p class="nb-intro">Khoảng 3 phút. Bạn trả lời càng rõ, buổi trao đổi đầu tiên càng đi thẳng vào việc.</p>
      ${field('name','Tên của bạn','Nguyễn Văn A',{req:1,ac:'name',max:80,msg:'Bạn cho Khánh xin tên nhé'})}
      ${field('brand','Tên thương hiệu','Chưa có tên thì ghi “Chưa có”',{req:1,max:100,msg:'Điền tên thương hiệu hoặc “Chưa có”'})}
      ${group('field','Lĩnh vực',[chip('F&B · Cà phê','F&amp;B · Cà phê'),chip('Nông sản · Thực phẩm'),chip('Mỹ phẩm · Làm đẹp'),chip('Giáo dục'),chip('BĐS · Nội thất'),chip('Khác')])}`],
    ['Giai đoạn',group('stage','Thương hiệu đang ở đâu',[chip('Mới bắt đầu','','Chưa có tên, logo hay hình ảnh nào'),chip('Đã có logo, cần hệ thống','','Giữ logo, phát triển bộ nhận diện'),chip('Làm mới thương hiệu','','Hình ảnh hiện tại không còn phù hợp'),chip('Ra sản phẩm hoặc dòng mới','','Thương hiệu sẵn có, cần bao bì, ấn phẩm')],{req:1,col:1,msg:'Chọn giai đoạn gần nhất với bạn'})],
    ['Hạng mục cần làm',group('scope','Chọn một hoặc nhiều',[chip('Nhận diện cốt lõi','','Chiến lược, logo, màu, font, họa tiết'),chip('Bộ nhận diện văn phòng','','Danh thiếp, giấy tiêu đề, đồng phục…'),chip('Nhận diện tại điểm bán','','Biển hiệu, quầy, menu, decal…'),chip('Nhận diện marketing','','Hồ sơ năng lực, social, quảng cáo…'),chip('Bao bì sản phẩm','','Nhãn, hộp, túi, tem…'),chip('Website'),chip('Đặt tên · slogan · câu chuyện')],{req:1,col:1,multi:1,msg:'Chọn ít nhất một hạng mục'})],
    ['Câu chuyện',`${field('what','Bạn bán gì, cho ai?','Ví dụ: Cà phê rang xay Khe Sanh cho dân văn phòng 25–40 tuổi ở thành phố lớn',{req:1,rows:3,msg:'Một hai câu thôi cũng được'})}
      ${field('diff','Điều làm bạn khác đối thủ','Nguồn gốc, công thức, con người, câu chuyện…',{rows:2})}
      ${field('rival','Đối thủ hoặc thương hiệu cùng ngành bạn biết','Tên hoặc link',{max:300})}`],
    ['Tính cách & phong cách',`${group('mood','3 từ mô tả thương hiệu',['Sang trọng','Tối giản','Mộc mạc','Hiện đại','Truyền thống','Trẻ trung','Tinh tế','Mạnh mẽ','Thân thiện','Vui tươi'].map(x=>chip(x)),{multi:1,max:3,cnt:1})}
      ${field('color','Màu muốn có / muốn tránh','Ví dụ: thích xanh rêu, tránh đỏ',{max:200})}
      ${field('ref','Thương hiệu bạn thích (link Pinterest, Behance…)','Dán link hoặc mô tả',{rows:2})}`],
    ['Ngân sách & thời gian',`${group('budget','Ngân sách dự kiến',[chip('Dưới 20 triệu','Dưới 20tr'),chip('20 – 50 triệu','20 – 50tr'),chip('50 – 100 triệu','50 – 100tr'),chip('Trên 100 triệu','Trên 100tr'),chip('Cần tư vấn')])}
      ${group('time','Khi nào cần hoàn thành',[chip('Gấp, dưới 2 tuần','Gấp · &lt; 2 tuần'),chip('Trong 1 tháng','1 tháng'),chip('2 – 3 tháng'),chip('Linh hoạt')])}
      ${field('note','Điều gì khác Khánh nên biết','Ngày khai trương, sự kiện, người duyệt…',{rows:2})}`],
    ['Liên hệ',`${field('phone','Số điện thoại / Zalo','09xx xxx xxx',{req:1,type:'tel',ac:'tel',max:20,msg:'Số điện thoại chưa đúng'})}
      ${field('email','Email (nhận bản PDF brief)','ban@email.com',{req:1,type:'email',ac:'email',msg:'Email chưa đúng định dạng'})}
      ${group('meet','Hình thức trao đổi',[chip('Gọi điện'),chip('Nhắn Zalo'),chip('Google Meet'),chip('Gặp trực tiếp tại Đà Nẵng','Gặp tại Đà Nẵng')])}
      <input class="nb-hp" id="nb-web" tabindex="-1" autocomplete="off" aria-hidden="true">`],
    ['Xem lại brief','<div class="nb-sum" data-sum></div><button type="button" class="nb-link" data-go="0">Sửa từ đầu</button>']
  ];
  const N=SLIDES.length;

  const root=document.createElement('div');root.id='nqk-brief';root.setAttribute('aria-hidden','true');
  root.innerHTML=`<div class="nb-pop" role="dialog" aria-modal="true" aria-labelledby="nb-title">
    <div class="nb-ph"><h2 id="nb-title">Kể Khánh nghe về thương hiệu</h2><button type="button" class="nb-x" data-close aria-label="Đóng">×</button></div>
    <div class="nb-flow" data-flow>
      <div class="nb-steps">${SLIDES.map((s,i)=>`<button type="button" class="nb-dot" data-i="${i}" aria-label="Bước ${i+1}: ${s[0]}">${String(i+1).padStart(2,'0')}</button>${i<N-1?'<span class="nb-bar"><i></i></span>':''}`).join('')}</div>
      <p class="nb-cap" data-cap></p>
      <div class="nb-vp" data-vp><div class="nb-track" data-track>${SLIDES.map(s=>`<section class="nb-sl" data-t="${s[0]}">${s[1]}</section>`).join('')}</div></div>
      <p class="nb-err" data-err hidden></p>
      <div class="nb-pf"><button type="button" class="nb-back" data-back>← Quay lại</button><button type="button" class="nb-next" data-next><span class="t">Tiếp tục</span><span class="c">→</span></button></div>
    </div>
    <div class="nb-done" data-done hidden>
      <div class="nb-ok">✓</div>
      <h3>Cảm ơn <span data-dn></span>!</h3>
      <p>Khánh đã nhận brief của <b data-db></b> (mã <b data-dc></b>) và sẽ liên hệ trong vòng 24 giờ. <span data-dm>Bản PDF brief đã được gửi về email của bạn.</span></p>
      <button type="button" class="nb-cta grad" data-dl hidden>Tải PDF brief</button>
      <a class="nb-cta" href="${ZALO}" target="_blank" rel="noopener">Trao đổi Zalo</a>
    </div>
  </div>`;
  document.body.appendChild(root);

  const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
  const track=$('[data-track]'),slides=$$('.nb-sl'),next=$('[data-next]');
  const v=id=>($('#nb-'+id)||{}).value?.trim()||'';
  const sel={};let cur=0,busy=false,pdfBlob=null,pdfName='';

  $$('[data-group]').forEach(g=>{const k=g.dataset.group,multi=g.hasAttribute('data-multi'),mx=+g.dataset.max||99;sel[k]=multi?[]:'';
    g.addEventListener('click',e=>{const b=e.target.closest('.nb-chip');if(!b)return;
      if(multi){if(!b.classList.contains('on')&&sel[k].length>=mx)return;b.classList.toggle('on');sel[k]=[...g.querySelectorAll('.on')].map(x=>x.dataset.v)}
      else{const was=b.classList.contains('on');g.querySelectorAll('.nb-chip').forEach(x=>x.classList.toggle('on',x===b&&!was));sel[k]=was?'':b.dataset.v;if(!was&&g.closest('[data-req]'))setTimeout(()=>next.click(),260)}
      const c=root.querySelector(`[data-cnt="${k}"]`);if(c)c.textContent=`Đã chọn ${sel[k].length}/${mx}`;
      g.closest('.nb-f').classList.remove('err')})});
  $$('input,textarea').forEach(i=>i.addEventListener('input',()=>i.closest('.nb-f')?.classList.remove('err')));

  function valid(i){let ok=true;const bad=(id,c)=>{const f=root.querySelector(`[data-req="${id}"]`);if(!f)return;f.classList.toggle('err',c);if(c)ok=false};
    if(i===0){bad('name',!v('name'));bad('brand',!v('brand'))}
    if(i===1)bad('stage',!sel.stage);
    if(i===2)bad('scope',!sel.scope.length);
    if(i===3)bad('what',!v('what'));
    if(i===6){bad('phone',!/^(\+?84|0)\d{8,10}$/.test(v('phone').replace(/[\s.\-()]/g,'')));bad('email',!!v('email')&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email')))}
    return ok}

  /* nhóm nội dung dùng chung cho màn xem lại, PDF và email */
  const groups=()=>[
    ['Thương hiệu',[['Người liên hệ',v('name')],['Thương hiệu',v('brand')],['Lĩnh vực',sel.field],['Giai đoạn',sel.stage]]],
    ['Hạng mục cần làm',[['Hạng mục',sel.scope.join('\n')]]],
    ['Câu chuyện',[['Bán gì, cho ai',v('what')],['Điểm khác biệt',v('diff')],['Đối thủ',v('rival')]]],
    ['Tính cách & phong cách',[['Tính cách',sel.mood.join(', ')],['Màu sắc',v('color')],['Tham khảo',v('ref')]]],
    ['Ngân sách & thời gian',[['Ngân sách',sel.budget],['Thời hạn',sel.time],['Ghi chú',v('note')]]],
    ['Liên hệ',[['Điện thoại / Zalo',v('phone')],['Email',v('email')],['Trao đổi qua',sel.meet]]]
  ].map(([g,r])=>[g,r.filter(x=>x[1]&&String(x[1]).trim())]).filter(g=>g[1].length);
  const summary=()=>{$('[data-sum]').innerHTML=groups().flatMap(g=>g[1]).map(([a,b])=>`<div><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join('')};

  function go(i){if(i<0||i>=N)return;
    if(i>cur){for(let k=cur;k<i;k++)if(!valid(k)){i=k;break}}
    cur=i;if(cur===N-1)summary();
    track.style.transform=`translateX(-${cur*100}%)`;slides[cur].scrollTop=0;
    $$('.nb-dot').forEach((d,k)=>{d.classList.toggle('on',k===cur);d.classList.toggle('past',k<cur)});
    $$('.nb-bar i').forEach((b,k)=>b.style.width=k<cur?'100%':'0');
    $('[data-cap]').textContent=`Bước ${cur+1}/${N} · ${slides[cur].dataset.t}`;
    $('[data-back]').classList.toggle('show',cur>0);$('[data-err]').hidden=true;
    const last=cur===N-1;next.classList.toggle('send',last);next.querySelector('.t').textContent=last?'Gửi brief':'Tiếp tục';
    slides.forEach((s,k)=>{s.inert=k!==cur})}

  /* PDF brief */
  let lib=null;
  const loadLib=()=>lib||(lib=new Promise((ok,no)=>{if(window.html2pdf)return ok();const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';s.onload=ok;s.onerror=()=>{lib=null;no()};document.head.appendChild(s)}));
  function pdfHTML(code){
    const d=new Date(),date=`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
    const font=getComputedStyle(document.body).fontFamily;
    return `<div style="width:690px;box-sizing:border-box;padding:4px 2px;font-family:${font.replace(/"/g,"'")};color:#1f1e1d;background:#fff">
      <div style="height:6px;width:80px;border-radius:6px;background:linear-gradient(90deg,#EF9393,#E17DC2,#998EE0,#43ADD0,#8BDEDA);margin-bottom:22px"></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:20px;border-bottom:2px solid #1f1e1d;padding-bottom:16px">
        <div><div style="font-size:11px;letter-spacing:.16em;color:#8a877e;text-transform:uppercase">Brief thiết kế thương hiệu</div>
        <div style="font-size:30px;font-weight:700;margin-top:6px;line-height:1.2">${esc(v('brand'))}</div></div>
        <div style="text-align:right;font-size:12px;color:#5c5a52;line-height:1.7">Mã: <b>${esc(code)}</b><br>Ngày: ${date}</div>
      </div>
      ${groups().map(([g,rows],i)=>`<div style="margin-top:22px;page-break-inside:avoid">
        <div style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#998EE0;font-weight:700;margin-bottom:8px">${String(i+1).padStart(2,'0')} · ${esc(g)}</div>
        <table style="width:100%;border-collapse:collapse;font-size:13.5px">${rows.map(([k,x])=>`<tr><td style="width:30%;padding:8px 14px 8px 0;border-bottom:1px solid #eeece6;color:#8a877e;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;border-bottom:1px solid #eeece6;white-space:pre-wrap;line-height:1.55">${esc(x)}</td></tr>`).join('')}</table></div>`).join('')}
      <div style="margin-top:30px;padding:14px 16px;background:#f5f4ef;border-radius:10px;font-size:12px;color:#5c5a52;line-height:1.7">Bước tiếp theo: Khánh sẽ liên hệ trong 24 giờ để trao đổi sâu hơn, sau đó gửi đề xuất hướng sáng tạo và báo giá chính thức.</div>
      <div style="margin-top:22px;display:flex;justify-content:space-between;font-size:12px;color:#8a877e;border-top:1px solid #e8e6dc;padding-top:12px"><span><b style="color:#1f1e1d">Nguyễn Quốc Khánh</b> · Người kể chuyện thương hiệu</span><span>Zalo 0988 886 901 · khanhdesignvn@gmail.com</span></div>
    </div>`}
  async function makePdf(code){
    await loadLib();
    const w=html2pdf().set({margin:[12,12,14,12],filename:pdfName,image:{type:'jpeg',quality:.92},html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff',scrollX:0,scrollY:0},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy']}}).from(pdfHTML(code),'string');
    const uri=await w.outputPdf('datauristring');
    pdfBlob=await (await fetch(uri)).blob();
    return uri}

  async function submit(){if(busy)return;busy=true;next.disabled=true;const t=next.querySelector('.t');t.textContent='Đang gửi…';
    const d=new Date(),code=`BR-${String(d.getFullYear()).slice(2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${Math.random().toString(36).slice(2,5).toUpperCase()}`;
    pdfName=`Brief-${v('brand').normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/gi,'d').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-|-$/g,'')||'thuong-hieu'}.pdf`;
    let pdf='';try{pdf=await makePdf(code)}catch(_){pdf=''}
    try{
      const r=await fetch(API+'?a=brief',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code,name:v('name'),brand:v('brand'),phone:v('phone'),email:v('email'),website:v('web'),rows:groups().flatMap(g=>g[1]),pdf})});
      const j=await r.json().catch(()=>({}));if(!r.ok||!j.ok)throw new Error(j.error||'Chưa gửi được, bạn thử lại hoặc nhắn Zalo giúp Khánh nhé.');
      $('[data-dn]').textContent=v('name');$('[data-db]').textContent=v('brand');$('[data-dc]').textContent=j.code||code;
      $('[data-dm]').hidden=!v('email');$('[data-dl]').hidden=!pdfBlob;$('[data-flow]').hidden=true;$('[data-done]').hidden=false;
    }catch(x){const e=$('[data-err]');e.textContent=x.message;e.hidden=false}
    busy=false;next.disabled=false;t.textContent='Gửi brief'}

  $('[data-dl]').onclick=()=>{if(!pdfBlob)return;const a=document.createElement('a');a.href=URL.createObjectURL(pdfBlob);a.download=pdfName;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)};
  next.onclick=()=>{if(cur<N-1){if(valid(cur))go(cur+1)}else if(valid(6))submit();else go(6)};
  $('[data-back]').onclick=()=>go(cur-1);
  root.querySelector('.nb-steps').onclick=e=>{const d=e.target.closest('.nb-dot');if(d)go(+d.dataset.i)};
  $$('[data-go]').forEach(b=>b.onclick=()=>go(+b.dataset.go));

  let last=null;
  const open=()=>{last=document.activeElement;root.classList.add('on');root.setAttribute('aria-hidden','false');document.documentElement.style.overflow='hidden';setTimeout(()=>{const f=slides[cur].querySelector('input,textarea,button');f&&f.focus({preventScroll:true})},320)};
  const close=()=>{root.classList.remove('on');root.setAttribute('aria-hidden','true');document.documentElement.style.overflow='';last&&last.focus&&last.focus({preventScroll:true})};
  root.querySelector('[data-close]').onclick=close;
  root.addEventListener('click',e=>{if(e.target===root)close()});
  document.addEventListener('keydown',e=>{if(!root.classList.contains('on'))return;if(e.key==='Escape')close();
    const tag=document.activeElement&&document.activeElement.tagName;
    if(e.key==='Enter'&&tag==='INPUT'){e.preventDefault();next.click();return}
    if(tag==='INPUT'||tag==='TEXTAREA')return;
    if(e.key==='ArrowRight')next.click();if(e.key==='ArrowLeft')go(cur-1)});
  let sx=null,sy=0;const vp=$('[data-vp]');
  vp.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
  vp.addEventListener('touchend',e=>{if(sx===null)return;const dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;sx=null;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.3){dx<0?next.click():go(cur-1)}});

  /* nút dọc của theme mở form brief thay cho popup cũ */
  document.addEventListener('click',e=>{const b=e.target.closest('#khanh-vertical-chat-btn,[data-nqk-brief],a[href="#brief"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();open()},true);
  window.nqkBrief={open,close};
  if(location.hash==='#brief')open();
  go(0);
})();
