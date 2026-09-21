/* 出生地选择弹窗：国内先选省再选城市，海外按国家+搜索。
   逻辑与原 pmRender/pmOpen 等价，纯 React 实现。 */
import {useEffect, useState} from 'react';
import {getProvinces, getProvCount, getCities, searchPlaces, lngStr} from '../lib/places.js';

export default function PlacePicker({open, value, onOk, onClose}){
  const [tab,setTab]=useState('cn');
  const [prov,setProv]=useState(null);
  const [sel,setSel]=useState('');
  const [kw,setKw]=useState('');

  useEffect(()=>{ if(open){ setSel(value||''); setKw(''); } },[open,value]);

  if(!open)return null;

  function pick(v){ setSel(v); }
  function ok(){ onOk(sel); }

  function item(v,selected,main,sub,extra){
    return (
      <div key={(extra||'')+v} className={'pm-it'+(selected?' sel':'')}
        data-v={v} onClick={()=>pick(v)}>
        <span>{main}</span><span className="sub">{sub}</span>
      </div>
    );
  }

  var list=[];
  list.push(item('',sel==='', '未知地','北京时间 · 不校正'));
  if(tab==='cn'&&!kw.trim()){
    if(!prov){
      getProvinces().forEach(function(p){
        list.push(
          <div key={'prov:'+p} className="pm-it pm-prov" data-prov={p} onClick={()=>setProv(p)}>
            <span>{p}</span><span className="sub">{getProvCount(p)} 个城市 ›</span>
          </div>
        );
      });
    }else{
      list.push(
        <div key="back" className="pm-it pm-back" onClick={()=>setProv(null)}>
          <span>‹ 返回全部省份</span><span className="sub">{prov}</span>
        </div>
      );
      getCities(prov).forEach(function(c){
        list.push(item(c.name,sel===c.name,c.name,c.prov+' · '+lngStr(c.lng),'cn:'));
      });
    }
  }else{
    searchPlaces(kw.trim(),tab).forEach(function(c){
      list.push(item(c.name,sel===c.name,c.name,c.prov+' · '+lngStr(c.lng),tab+':'));
    });
  }

  return (
    <div id="placeModal">
      <div className="pm-mask" id="pmMask" onClick={onClose}></div>
      <div className="pm-box">
        <div className="pm-head">
          <div className="seg" id="pmTabs" style={{flex:1}}>
            <button type="button" data-v="cn" className={tab==='cn'?'on':''}
              onClick={()=>{setTab('cn');setProv(null);setKw('');}}>国内</button>
            <button type="button" data-v="os" className={tab==='os'?'on':''}
              onClick={()=>{setTab('os');setProv(null);setKw('');}}>海外</button>
          </div>
          <button type="button" id="pmClose" aria-label="关闭" onClick={onClose}>✕</button>
        </div>
        <div className="pm-search">
          <input type="text" id="pmSearch" placeholder="🔍 搜索城市及地区"
            value={kw} onChange={(e)=>setKw(e.target.value)}/>
        </div>
        <div className="pm-list" id="pmList">{list}</div>
        <button type="button" className="btn" id="pmOk" onClick={ok}>确定</button>
      </div>
    </div>
  );
}
