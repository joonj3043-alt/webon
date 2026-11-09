(() => {
  'use strict';
  const cfg = window.WEBON_CONFIG || {};
  const year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = year);
  const menuBtn = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');
  if (menuBtn && menu) {
    const close = () => { menuBtn.setAttribute('aria-expanded','false'); menu.classList.remove('open'); menuBtn.setAttribute('aria-label','메뉴 열기'); };
    menuBtn.addEventListener('click', () => { const open = menuBtn.getAttribute('aria-expanded') !== 'true'; menuBtn.setAttribute('aria-expanded', String(open)); menu.classList.toggle('open',open); menuBtn.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기'); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape') close(); });
    menu.querySelectorAll('a').forEach(el => el.addEventListener('click', close));
    document.addEventListener('click', e => { if (!menu.contains(e.target) && !menuBtn.contains(e.target)) close(); });
  }
  const kakaoValid = typeof cfg.kakaoChatUrl === 'string' && /^https:\/\/(pf\.kakao\.com|open\.kakao\.com)\//.test(cfg.kakaoChatUrl);
  document.querySelectorAll('[data-kakao-link]').forEach(link => {
    if(kakaoValid) { link.href = cfg.kakaoChatUrl; link.target='_blank'; link.rel='noopener noreferrer'; link.setAttribute('aria-label','카카오톡 상담 채널 새 창 열기'); }
    else { link.href='./contact.html'; link.addEventListener('click', e => { if(location.pathname.endsWith('/contact.html')) { e.preventDefault(); const n = document.querySelector('[data-kakao-notice]'); if(n){ n.scrollIntoView({behavior:'smooth',block:'center'}); n.classList.add('notice-flash'); setTimeout(()=>n.classList.remove('notice-flash'),1600); } else alert('카카오톡 채널 연결 전입니다.'); } }); }
  });
  const form = document.querySelector('#contact-form');
  if(!form) return;
  const status = document.querySelector('#form-status');
  const email = typeof cfg.contactEmail === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cfg.contactEmail) ? cfg.contactEmail : '';
  const showStatus = msg => { status.textContent = msg; };
  const dataText = () => { const f = new FormData(form); return ['[WEBON 홈페이지 제작 문의]','이름/업체명: '+String(f.get('client')||''),'연락처: '+String(f.get('phone')||''),'업종: '+String(f.get('category')||''),'제작 유형: '+String(f.get('work')||''),'문의 내용: '+String(f.get('message')||'없음')].join('\n'); };
  const valid = () => { if(!form.reportValidity()) return false; if(!document.querySelector('#consent').checked){showStatus('전송 안내 확인 후 동의해 주세요.');return false;} return true; };
  const copy = async value => {
    try { await navigator.clipboard.writeText(value); return true; } catch {
      const t = document.createElement('textarea'); t.value = value; t.style.position='fixed'; t.style.left='-9999px'; document.body.appendChild(t); t.select(); let ok=false; try {ok=document.execCommand('copy');}catch{} t.remove(); return ok;
    }
  };
  document.querySelector('#copy-button').addEventListener('click', async () => { if(!valid()) return; const ok=await copy(dataText()); showStatus(ok?'문의 내용을 복사했어요. 이메일이나 카카오톡으로 직접 전송해 주세요.':'복사가 제한되었습니다. 이메일 앱으로 전달해 주세요.'); });
  form.addEventListener('submit', async e => { e.preventDefault(); if(!valid()) return; const body=dataText(); if(!email) { const ok=await copy(body); showStatus(ok?'운영 이메일이 아직 설정되지 않아 문의 내용을 복사했습니다. 카카오톡 등으로 직접 전달해 주세요.':'운영 이메일이 아직 설정되지 않았습니다. 운영자에게 문의 채널 연결을 요청해 주세요.'); return; } const subject='[WEBON 제작 문의] '+String(new FormData(form).get('client')||'새 문의'); location.href='mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body); showStatus('이메일 앱이 열리면 전송 버튼을 눌러야 문의가 전달됩니다.'); });
})();
