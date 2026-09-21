/* 排盘主流程：输入 -> 纯数据对象（不碰 DOM）。
   由原 doPaipan / showLiunian / renderXipan / renderBasic / renderXingzuo
   逐行移植，算法与文案保持一致。 */
import {Solar} from 'lunar-javascript';
import {GAN_WX, ZHI_WX, WX_C, BENQI, NAYIN, shiShen, diShi, shenSha} from './constants.js';
import {trueSolar} from './solarTime.js';
import {xingzuoIndexByName} from './xingzuo.js';

function pad2(n){return (n<10?'0':'')+n;}

export function computeBazi(input){
  var name=(input.name||'').trim();
  var gender=input.gender||'男';
  var d=input.date, t=input.time;
  if(!d)return {error:'请先选择出生日期 📅'};
  if(!t)return {error:'请先选择出生时间 ⏰'};
  var dp=d.split('-'), tp=t.split(':');
  var birth0=new Date(+dp[0],+dp[1]-1,+dp[2],+tp[0],+tp[1]);
  var place=(input.place||'').trim();
  var solarTOn=input.solarTOn!==false;
  var tsc=trueSolar(birth0,place,solarTOn);
  if(solarTOn&&place&&!tsc.applied){
    return {error:'找不到出生地"'+place+'"😅 请点"选择"从列表里挑，或直接输入经度（如 116.4）'};
  }
  var c=tsc.date;
  var solar=Solar.fromYmdHms(c.getFullYear(),c.getMonth()+1,c.getDate(),c.getHours(),c.getMinutes(),0);
  var lunar=solar.getLunar();
  var ec=lunar.getEightChar();
  var dg=ec.getDayGan();
  var cTimeStr=pad2(c.getHours())+':'+pad2(c.getMinutes());

  /* ===== meta ===== */
  var shengxiao='';
  try{shengxiao=lunar.getYearShengXiao();}catch(e){}
  var meta={
    name:name, gender:gender, date:d, time:t, shengxiao:shengxiao,
    dg:dg, dgWx:GAN_WX[dg],
    tsc: tsc.applied ? {
      timeStr:cTimeStr, place:tsc.place,
      sign:tsc.minutes>=0?'+':'−',
      minutes:Math.abs(Math.round(tsc.minutes)),
      notes:tsc.notes
    } : null
  };

  /* ===== 简盘四柱 ===== */
  var cols=[
    {lab:'年柱',gan:ec.getYearGan(),zhi:ec.getYearZhi(),ssg:ec.getYearShiShenGan(),hide:ec.getYearHideGan(),ssz:ec.getYearShiShenZhi()},
    {lab:'月柱',gan:ec.getMonthGan(),zhi:ec.getMonthZhi(),ssg:ec.getMonthShiShenGan(),hide:ec.getMonthHideGan(),ssz:ec.getMonthShiShenZhi()},
    {lab:'日柱',gan:ec.getDayGan(),zhi:ec.getDayZhi(),ssg:ec.getDayShiShenGan(),hide:ec.getDayHideGan(),ssz:ec.getDayShiShenZhi()},
    {lab:'时柱',gan:ec.getTimeGan(),zhi:ec.getTimeZhi(),ssg:ec.getTimeShiShenGan(),hide:ec.getTimeHideGan(),ssz:ec.getTimeShiShenZhi()}
  ];
  var wxCount={木:0,火:0,土:0,金:0,水:0};
  var pillars=cols.map(function(cc){
    var gwx=GAN_WX[cc.gan], zwx=ZHI_WX[cc.zhi];
    wxCount[gwx]++; wxCount[zwx]++;
    var hide=(cc.hide||[]).map(function(h,i){
      return {g:h, ss:(cc.ssz&&cc.ssz[i])?cc.ssz[i]:''};
    });
    return {lab:cc.lab,gan:cc.gan,zhi:cc.zhi,ssg:cc.ssg,ssz0:(cc.ssz&&cc.ssz[0])?cc.ssz[0]:'',hide:hide,gwx:gwx,zwx:zwx};
  });
  var wx=['木','火','土','金','水'].map(function(w){
    var n=wxCount[w];
    return {w:w,n:n,pct:Math.round(n/8*100)};
  });

  /* ===== 大运 / 流年 ===== */
  var yun=ec.getYun(gender==='男'?1:0);
  var qiyun='出生后 '+yun.getStartYear()+' 年 '+yun.getStartMonth()+' 个月 '+yun.getStartDay()+' 天起运（'+(yun.isForward()?'顺排':'逆排')+'）';
  var dys=yun.getDaYun();
  var nowY=new Date().getFullYear();
  var dayunList=[];
  dys.forEach(function(dy){
    var gz=dy.getGanZhi();
    if(!gz)return;
    var liunian=dy.getLiuNian().map(function(ln){
      var lgz=ln.getGanZhi();
      return {gz:lgz,year:ln.getYear(),age:ln.getAge(),ss:shiShen(dg,lgz.charAt(0)),cur:ln.getYear()===nowY};
    });
    dayunList.push({
      gz:gz, gan:gz.charAt(0), zhi:gz.charAt(1),
      ss10:shiShen(dg,gz.charAt(0))+'·'+shiShen(dg,BENQI[gz.charAt(1)]),
      startAge:dy.getStartAge(), endAge:dy.getEndAge(),
      startYear:dy.getStartYear(), endYear:dy.getEndYear(),
      timeCur:nowY>=dy.getStartYear()&&nowY<=dy.getEndYear(),
      liunian:liunian
    });
  });
  var curDayunIdx=-1;
  dayunList.forEach(function(dy,i){if(curDayunIdx<0&&dy.timeCur)curDayunIdx=i;});
  if(curDayunIdx<0&&dayunList.length)curDayunIdx=0;
  var curDy=dayunList[curDayunIdx];
  var rawDys=dys.filter(function(x){return x.getGanZhi();});
  var curDyObj=rawDys[curDayunIdx]||null;
  var curLnObj=null, curLnGz='';
  if(curDyObj){
    var lns=curDyObj.getLiuNian();
    curLnObj=lns.filter(function(l){return l.getYear()===nowY;})[0]||lns[0];
    curLnGz=curLnObj.getGanZhi();
  }

  var misc={kongwang:ec.getDayXunKong()};

  /* ===== 细盘 ===== */
  var xp=[
    {lab:'年柱',gan:ec.getYearGan(),zhi:ec.getYearZhi(),hide:ec.getYearHideGan(),ssz:ec.getYearShiShenZhi(),xingyun:ec.getYearDiShi(),kong:ec.getYearXunKong()},
    {lab:'月柱',gan:ec.getMonthGan(),zhi:ec.getMonthZhi(),hide:ec.getMonthHideGan(),ssz:ec.getMonthShiShenZhi(),xingyun:ec.getMonthDiShi(),kong:ec.getMonthXunKong()},
    {lab:'日柱',gan:ec.getDayGan(),zhi:ec.getDayZhi(),hide:ec.getDayHideGan(),ssz:ec.getDayShiShenZhi(),xingyun:ec.getDayDiShi(),kong:ec.getDayXunKong()},
    {lab:'时柱',gan:ec.getTimeGan(),zhi:ec.getTimeZhi(),hide:ec.getTimeHideGan(),ssz:ec.getTimeShiShenZhi(),xingyun:ec.getTimeDiShi(),kong:ec.getTimeXunKong()}
  ];
  /* 大运 / 流年列：取当前（与原 renderXipan 一致） */
  var dyGz=curDy?curDy.gz:'';
  var extra=[
    {lab:'大运',gan:dyGz.charAt(0),zhi:dyGz.charAt(1),hide:[],ssz:[],xingyun:diShi(dg,dyGz.charAt(1)),kong:curDyObj?curDyObj.getXunKong():''},
    {lab:'流年',gan:curLnGz.charAt(0),zhi:curLnGz.charAt(1),hide:[],ssz:[],xingyun:diShi(dg,curLnGz.charAt(1)),kong:curLnObj?curLnObj.getXunKong():''}
  ];
  var all=xp.concat(extra);
  var sha=shenSha(ec.getYearGan(),ec.getMonthZhi(),dg,ec.getDayZhi(),all.map(function(p){return {gan:p.gan,zhi:p.zhi};}));
  var xipanCols=all.map(function(p,i){
    return {
      lab:p.lab, gan:p.gan, zhi:p.zhi,
      zhuxing:i===2?'日主':shiShen(dg,p.gan),
      hide:(p.hide||[]).map(function(hd,idx){return {g:hd,ss:(p.ssz&&p.ssz[idx])?p.ssz[idx]:''};}),
      xingyun:p.xingyun, zizuo:diShi(p.gan,p.zhi),
      kong:p.kong, nayin:NAYIN[p.gan+p.zhi]||'—',
      shensha:sha[i]||[]
    };
  });

  /* ===== 基本信息 ===== */
  function parseYmdHms(s){var a=s.split(/[- :]/);return new Date(+a[0],+a[1]-1,+a[2],+a[3],+a[4],+a[5]||0);}
  function fmtDur(ms){var h=Math.max(0,Math.round(ms/3600000));var d=Math.floor(h/24);h=h%24;return d+'天'+h+'小时';}
  var birth=new Date(c.getFullYear(),c.getMonth(),c.getDate(),c.getHours(),c.getMinutes());
  var pj=lunar.getPrevJie(), nj=lunar.getNextJie();
  var jieqi='出生于'+pj.getName()+'后'+fmtDur(birth-parseYmdHms(pj.getSolar().toYmdHms()))+'，'+nj.getName()+'前'+fmtDur(parseYmdHms(nj.getSolar().toYmdHms())-birth);
  var xingzuo='';try{xingzuo=solar.getXingZuo()+'座';}catch(e){}
  var xiu='';try{xiu=lunar.getXiu()+'宿';}catch(e){}
  var basic=[
    ['农历',lunar.getYearInChinese()+'年'+lunar.getMonthInChinese()+'月'+lunar.getDayInChinese()],
    ['星座',xingzuo],
    ['星宿',xiu],
    ['出生节气',jieqi],
    ['真太阳时',tsc.applied?pad2(birth.getHours())+':'+pad2(birth.getMinutes())+'（'+tsc.place+'：'+tsc.notes+'）':'未校正（可填写出生地开启）'],
    ['胎元',ec.getTaiYuan()+'（'+ec.getTaiYuanNaYin()+'）'],
    ['胎息',ec.getTaiXi()+'（'+ec.getTaiXiNaYin()+'）'],
    ['命宫',ec.getMingGong()+'（'+ec.getMingGongNaYin()+'）'],
    ['身宫',ec.getShenGong()+'（'+ec.getShenGongNaYin()+'）']
  ];

  /* ===== 星座 ===== */
  var nm='';try{nm=solar.getXingZuo();}catch(e){}
  var xingzuoData={myIndex:xingzuoIndexByName(nm),dg:dg};

  return {
    meta:meta, pillars:pillars, wx:wx,
    dayun:{qiyun:qiyun,list:dayunList}, curDayunIdx:curDayunIdx,
    misc:misc, xipan:{cols:xipanCols}, basic:basic, xingzuo:xingzuoData,
    wxc:WX_C
  };
}
