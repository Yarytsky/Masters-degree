function login(){
  const v=(document.getElementById('lu')||{}).value?.trim();
  const err=document.getElementById('lerr');
  if(v==='student'){S.screen='app';S.role='student';S.user={name:'Юрій Ярицький',ini:'ЮЯ'};S.view='home-s';err.style.display='none';render();}
  else if(v==='Teacher'){S.screen='app';S.role='teacher';S.user={name:'Іваненко М.В.',ini:'ІМ'};S.view='dashboard';err.style.display='none';render();}
  else{err.style.display='block';err.textContent='Невірний логін. "student" або "Teacher".';}
}
