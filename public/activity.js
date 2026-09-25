import { language, locale, t, translateTree } from './i18n.js';
import { enhanceMotion } from './interactions.js';

const $ = selector => document.querySelector(selector);
let currentData;
const number = value => Number.isFinite(value) ? new Intl.NumberFormat(locale()).format(value) : '—';
const dateLabel = (value, options = {day:'numeric',month:'short',year:'numeric'}) => new Intl.DateTimeFormat(locale(), {...options,timeZone:'UTC'}).format(new Date(value));
function node(tag, className, text) {
  const item=document.createElement(tag); if(className)item.className=className;
  if(text !== undefined)item.textContent=text; return item;
}
function dayLabel(day) { return `${dateLabel(day.date)} · ${number(day.count)} ${language() === 'en' ? (day.count === 1 ? 'contribution' : 'contributions') : 'kontribusi'}`; }

function renderCalendar(days) {
  const grid=$('#contribution-grid'), months=$('#calendar-months');
  grid.replaceChildren(); months.replaceChildren();
  if(!Array.isArray(days)||!days.length){grid.append(node('p','activity-placeholder',t('Kalender kontribusi belum tersedia.')));return;}
  const offset=new Date(days[0].date).getUTCDay();
  const weeks=Math.ceil((days.length+offset)/7);
  grid.style.gridTemplateColumns=`repeat(${weeks},minmax(9px,1fr))`;
  months.style.gridTemplateColumns=`repeat(${weeks},minmax(9px,1fr))`;
  for(let index=0;index<offset;index++)grid.append(node('span','calendar-gap'));
  const buttons=[];
  let lastMonth='';
  let selected=days.length-1;
  const select=(index, focus=false)=>{
    buttons[selected]?.setAttribute('tabindex','-1'); buttons[selected]?.classList.remove('is-selected');
    selected=index; buttons[index].tabIndex=0; buttons[index].classList.add('is-selected');
    $('#contribution-detail').textContent=dayLabel(days[index]);
    if(focus){buttons[index].focus({preventScroll:true});buttons[index].scrollIntoView({block:'nearest',inline:'nearest'});}
  };
  days.forEach((day,index)=>{
    const month=day.date.slice(0,7);
    if(month!==lastMonth && (index>0 || Number(day.date.slice(8))<=14)){
      const label=node('span','',dateLabel(day.date,{month:'short'}));
      label.style.gridColumn=String(Math.floor((offset+index)/7)+1); months.append(label);
    }
    lastMonth=month;
    const button=node('button','contribution-day'); button.type='button';button.dataset.level=String(day.level);
    button.title=dayLabel(day);button.setAttribute('aria-label',dayLabel(day));button.tabIndex=-1;
    button.addEventListener('pointerenter',()=>{$('#contribution-detail').textContent=dayLabel(day);});
    button.addEventListener('pointerleave',()=>{$('#contribution-detail').textContent=dayLabel(days[selected]);});
    button.addEventListener('focus',()=>select(index)); button.addEventListener('click',()=>select(index));
    button.addEventListener('keydown',event=>{
      const step={ArrowLeft:-7,ArrowRight:7,ArrowUp:-1,ArrowDown:1}[event.key];
      if(step!==undefined){event.preventDefault();select(Math.min(days.length-1,Math.max(0,index+step)),true);}
      else if(event.key==='Home'||event.key==='End'){event.preventDefault();select(event.key==='Home'?0:days.length-1,true);}
    });
    buttons.push(button);grid.append(button);
  });
  select(selected);
  $('#calendar-range').textContent=`${dateLabel(days[0].date)} — ${dateLabel(days.at(-1).date)}`;
  requestAnimationFrame(()=>{const scroller=$('.calendar-scroll');scroller.scrollLeft=scroller.scrollWidth;});
}

function renderActivity(data) {
  if(!data?.calendar||!data?.repositories||!data?.commits)return;
  currentData=data;
  $('#github-commits').textContent=number(data.commits.count);
  $('#github-repos').textContent=number(data.repositories.repoCount);
  $('#stat-stars').textContent=number(data.repositories.stars);
  const bars=$('#language-bars');bars.replaceChildren();
  for(const item of data.repositories.languages.slice(0,8)){
    const row=node('div','language-row');const labels=node('div','language-label');
    const percent=item.percent===0&&item.bytes>0?'<0.1':String(item.percent);
    labels.append(node('span','',item.name),node('span','',percent.replace('.',language()==='id'?',':'.')+'%'));
    const track=node('div','language-track');const fill=node('span');
    fill.style.setProperty('--language-width',Math.min(100,Math.max(0,item.percent))+'%');track.append(fill);row.append(labels,track);bars.append(row);
  }
  if(!bars.childElementCount)bars.append(node('p','activity-placeholder',t('Data bahasa belum tersedia.')));
  renderCalendar(data.calendar.days);
  $('#contribution-total').textContent=number(data.calendar.total);
  $('#streak-current').textContent=number(data.calendar.currentStreak);
  $('#streak-longest').textContent=number(data.calendar.longestStreak);
  const dates=[data.calendar.updatedAt,data.repositories.updatedAt,data.commits.updatedAt].filter(Boolean).sort();
  const date=dates[0];
  const label=language()==='en'?'GitHub activity':'Aktivitas GitHub';
  $('#activity-status').textContent=label+(date?' · '+dateLabel(date):'')+(data.stale?' · '+t('salinan tersimpan'):'');
  translateTree($('#github'));enhanceMotion($('#github'));
}
async function loadActivity(){
  try{const response=await fetch('/activity.json');if(response.ok)renderActivity({...await response.json(),stale:true});}catch{/* Try the server next. */}
  try{const response=await fetch('/api/activity',{signal:AbortSignal.timeout(20000)});if(!response.ok)throw new Error();renderActivity(await response.json());}catch{
    if(!currentData)$('#activity-status').textContent=language()==='en'?'Activity is temporarily unavailable. View it on GitHub.':'Aktivitas sementara belum tersedia. Lihat langsung di GitHub.';
  }
}
document.addEventListener('languagechange',()=>{if(currentData)renderActivity(currentData);});
loadActivity();
