function initCharts(){
  if(S.view==='dashboard'&&S.role==='teacher'){const el=document.getElementById('ch-cls');if(el&&!S.charts.cls){const data=CLS.map(c=>clsAvg(c.id));S.charts.cls=new Chart(el,{type:'bar',data:{labels:CLS.map(c=>c.n),datasets:[{data,backgroundColor:['#1A3C6E22','#1A5C3522','#7A4A1022'],borderColor:['#1A3C6E','#1A5C35','#7A4A10'],borderWidth:2,borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:12,grid:{color:'rgba(0,0,0,.04)'},ticks:{font:{size:10},color:'#9A9390'}},x:{grid:{display:false},ticks:{font:{size:12},color:'#4A4540'}}}}});}}
  if(S.view==='class'&&S.ttab==='analytics'){const c=getCls(S.tcid);const pe=document.getElementById('ch-perf');if(pe&&!S.charts.perf){const avgs=c.students.map(s=>{const vs=SUBS.map(sub=>+(GRADES[`${c.id}_${s}_${sub.id}`]||0)).filter(Boolean);return vs.length?+(vs.reduce((a,b)=>a+b,0)/vs.length).toFixed(1):0;});S.charts.perf=new Chart(pe,{type:'bar',data:{labels:c.students.map(s=>s.split(' ')[0]),datasets:[{data:avgs,backgroundColor:'#1A3C6E18',borderColor:'#1A3C6E',borderWidth:2,borderRadius:4}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:12,grid:{color:'rgba(0,0,0,.04)'},ticks:{font:{size:10},color:'#9A9390'}},x:{grid:{display:false},ticks:{font:{size:10},color:'#9A9390',maxRotation:35}}}}});}const se=document.getElementById('ch-subavg');if(se&&!S.charts.subavg){const avgs=SUBS.map(sub=>{const vs=c.students.map(s=>+(GRADES[`${c.id}_${s}_${sub.id}`]||0)).filter(Boolean);return vs.length?+(vs.reduce((a,b)=>a+b,0)/vs.length).toFixed(1):0;});S.charts.subavg=new Chart(se,{type:'radar',data:{labels:SUBS.map(s=>s.n.split(' ')[0]),datasets:[{data:avgs,borderColor:'#1A3C6E',backgroundColor:'#1A3C6E12',pointBackgroundColor:'#1A3C6E',pointRadius:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{r:{min:0,max:12,grid:{color:'rgba(0,0,0,.06)'},ticks:{backdropColor:'transparent',font:{size:9},color:'#9A9390'},pointLabels:{font:{size:10},color:'#4A4540'}}}}});}}
    if(S.view==='analytics-s'){
    const selSub=S.analyticsSub||'all';
    if(selSub==='all'){
      const sc=document.getElementById('ch-s-subj');
      if(sc&&!S.charts.ssubj){
        const subAvgs=SUBS.map(s=>{
          const entries=(GRADE_LOG[`11a_${s.id}`]||[]).filter(e=>e.student===ME());
          const vals=entries.map(e=>+e.grade).filter(Boolean);
          return vals.length?+(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(1):0;
        });
        S.charts.ssubj=new Chart(sc,{
          type:'bar',
          data:{labels:SUBS.map(s=>s.n.split(' ')[0]),datasets:[{data:subAvgs,backgroundColor:SUBS.map(s=>s.c+'22'),borderColor:SUBS.map(s=>s.c),borderWidth:2,borderRadius:6}]},
          options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:12,grid:{color:'rgba(0,0,0,.04)'},ticks:{font:{size:11},color:'#9A9390'}},x:{grid:{display:false},ticks:{font:{size:11},color:'#4A4540'}}}}
        });
      }
    }
  }
}
