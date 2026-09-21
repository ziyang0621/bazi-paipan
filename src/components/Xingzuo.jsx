/* 星座 tab：星座详解 + 十二星座切换 */
import {useState} from 'react';
import {XZ, xzComboBody} from '../lib/xingzuo.js';

export default function Xingzuo({data}){
  const dg=data.xingzuo.dg;
  const [idx,setIdx]=useState(data.xingzuo.myIndex);
  const z=XZ[idx];

  return (
    <div>
      <div className="card"><h2>星座详解</h2><div id="rXingzuo">
        <div className="xz-hero">
          <div className="xz-emoji">{z.e}</div>
          <div><div className="xz-name">{z.n} {z.s}</div><div className="xz-dates">{z.d}</div></div>
        </div>
        <div className="xz-chips"><span>{z.el}</span><span>{z.q}星座</span><span>守护星 · {z.r}</span></div>
        <div className="xz-line">“{z.line}”</div>
        <div className="xz-keys">{z.k.map(function(k,i){return <span key={i}>#{k}</span>;})}</div>
        <div className="xz-sec"><h4>🌟 性格</h4><p>{z.x}</p></div>
        <div className="xz-sec"><h4>💘 爱情</h4><p>{z.l}</p></div>
        <div className="xz-sec"><h4>💼 事业</h4><p>{z.w}</p></div>
        <div className="xz-sec"><h4>💰 财运</h4><p>{z.m}</p></div>
        <div className="xz-sec"><h4>🍀 幸运物</h4><p>幸运色 <b>{z.lu[0]}</b>　幸运数字 <b>{z.lu[1]}</b>　幸运日 <b>{z.lu[2]}</b></p></div>
        <div className="xz-sec"><h4>💞 绝配星座</h4><p>{z.mt.join('、')}</p></div>
        <div className="xz-combo"><b>✨ 星座 × 八字：</b>{xzComboBody(z,dg)}</div>
        <div className="xz-grid">
          {XZ.map(function(s2,j){
            return (
              <button key={j} type="button" data-i={j} className={j===idx?'on':''}
                onClick={()=>setIdx(j)}>
                <span className="e">{s2.e}</span>{s2.n}
              </button>
            );
          })}
        </div>
        {idx!==data.xingzuo.myIndex?
          <button type="button" className="xz-back" onClick={()=>setIdx(data.xingzuo.myIndex)}>← 回到我的星座</button>:null}
      </div></div>
    </div>
  );
}
