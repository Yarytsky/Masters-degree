function tQ(type,checked){
  if(checked&&!S.B.qtypes.includes(type))S.B.qtypes=[...S.B.qtypes,type];
  else if(!checked)S.B.qtypes=S.B.qtypes.filter(t=>t!==type);
  render();
}

function saveA(){
  const b=S.B;
  if(!b.title||!b.title.trim()){toast('Вкажіть назву завдання','warn');return;}
  if(!b.due){toast('Вкажіть дедлайн','warn');return;}
  let qs=[];
  if(b.mode==='ai'||b.mode==='manual'){
    if(!b.gen.length){toast('Додайте хоча б одне питання','warn');return;}
    qs=b.gen.map((q,i)=>({
      id:i+1,
      txt:q.text||q.txt||'',
      type:q.type||'choice',
      opts:q.options||q.opts||[],
      ok:q.correct!==undefined?q.correct:(q.ok!==undefined?q.ok:0),
      explanation:q.explanation||''
    }));
  }
  ASGN.push({
    id:'a'+Date.now(),
    sid:b.sid,
    cid:b.cid,
    type:b.type,
    title:b.title.trim(),
    due:b.due,
    tmin:b.tmin,
    src:b.mode==='ai'?'ai':b.mode==='manual'?'manual':'upload',
    qs,
    file:b.file
  });
  S.B.open=false;
  S.ttab='assignments';
  go('class',{tcid:b.cid});
  toast('Завдання збережено','ok');
}
