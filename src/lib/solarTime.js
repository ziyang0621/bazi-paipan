import {CITY_LNG, resolvePlace} from './places.js';

export var CN_DST=[['1986-05-04','1986-09-14'],['1987-04-12','1987-09-13'],['1988-04-17','1988-09-11'],
['1989-04-16','1989-09-17'],['1990-04-15','1990-09-16'],['1991-04-14','1991-09-15']];
export function inCnDst(dt){
  var t=dt.getTime();
  for(var i=0;i<CN_DST.length;i++){
    var a=CN_DST[i][0].split('-'),b=CN_DST[i][1].split('-');
    var s=new Date(+a[0],+a[1]-1,+a[2],2,0,0).getTime();
    var e=new Date(+b[0],+b[1]-1,+b[2],2,0,0).getTime();
    if(t>=s&&t<e)return true;
  }
  return false;
}export function eotMinutes(dt){ /* 时差方程(分)：视太阳时 − 平太阳时，近似公式 */
  var n=Math.floor((dt-new Date(dt.getFullYear(),0,1))/86400000)+1;
  var B=2*Math.PI*(n-81)/364;
  return 9.87*Math.sin(2*B)-7.53*Math.cos(B)-1.5*Math.sin(B);
}export function trueSolar(birth,place,solarTOn){
  if(!solarTOn||!place)return {date:birth,applied:false};
  var r=resolvePlace(place);
  if(!r)return {date:birth,applied:false};
  var lng=r.lng,std=r.std,pn=r.label;
  var corr=0,notes=[];
  if(std===120&&inCnDst(birth)){corr-=60;notes.push('夏令时−60分钟');}
  var lonCorr=(lng-std)*4, eot=eotMinutes(birth);
  corr+=lonCorr+eot;
  if(lonCorr)notes.push('经度'+(lonCorr>=0?'+':'')+lonCorr.toFixed(1)+'分钟');
  notes.push('时差方程'+(eot>=0?'+':'')+eot.toFixed(1)+'分钟');
  return {date:new Date(birth.getTime()+corr*60000),applied:true,minutes:corr,place:pn,notes:notes.join('，')};
}
