/* 简盘 tab */
import {useState} from 'react';
import {WX_C, GAN_WX} from '../lib/constants.js';

export default function JianPan({data}){
  const m=data.meta;
  const [selDy,setSelDy]=useState(data.curDayunIdx);
  const dys=data.dayun.list;
  const cur=dys[selDy];

  function brJoin(arr){ /* 'a·b' 数组 -> 带 <br/> 的 React 节点 */
    var out=[];
    arr.forEach(function(s,i){
      if(i>0)out.push(<br key={'b'+i}/>);
      out.push(<span key={'t'+i}>{s}</span>);
    });
    return out;
  }

  return (
    <div>
      <div className="card"><h2>我的命盘</h2>
        <div className="meta" id="rMeta">
          {m.name? <>{m.name} · </>:null}{m.gender} · 公历 {m.date} {m.time}
          {m.shengxiao? <><br/>属{m.shengxiao}</>:null}
          {m.tsc? <><br/>真太阳时 <b>{m.tsc.timeStr}</b>（{m.tsc.place}，校正 {m.tsc.sign}{m.tsc.minutes} 分钟）</>:null}
          <br/>日主 <b style={{color:WX_C[m.dgWx]}}>{m.dg}{m.dgWx}</b>
        </div>
        <div className="pillars" id="rPillars" style={{marginTop:'10px'}}>
          {data.pillars.map(function(p,i){
            return (
              <div className="pcol" key={i}>
                <div className="lab">{p.lab}</div>
                <div className="ss"><span>{p.ssg}</span></div>
                <div className="gan" style={{color:WX_C[p.gwx]}}>{p.gan}</div>
                <div className="zhi" style={{color:WX_C[p.zwx]}}>{p.zhi}</div>
                <div className="ss"><span>{p.ssz0}</span></div>
                <div className="hide">藏干<br/>{brJoin(p.hide.map(function(h){return h.g+'·'+h.ss;}))}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card"><h2>五行能量条</h2><div id="rWx">
        {data.wx.map(function(x){
          return (
            <div className="wxrow" key={x.w}>
              <span className="n" style={{color:WX_C[x.w]}}>{x.w}</span>
              <div className="wxbar"><i style={{width:x.pct+'%',background:'linear-gradient(90deg,'+WX_C[x.w]+','+WX_C[x.w]+'66)'}}></i></div>
              <span className="c">{x.n} 个</span>
            </div>
          );
        })}
      </div></div>

      <div className="card"><h2>大运 <span style={{fontSize:'11px',color:'#a09aae',fontWeight:'normal'}}>左右滑动 · 点我看流年</span></h2>
        <div className="kv"><span className="k">起运</span><span id="rQiyun">{data.dayun.qiyun}</span></div>
        <div id="rDayun" style={{marginTop:'12px'}}>
          {dys.map(function(dy,i){
            return (
              <div key={i} className={'dy'+(i===selDy?' cur':'')} data-i={i}
                onClick={()=>setSelDy(i)}>
                <span className="gz" style={{color:WX_C[GAN_WX[dy.gan]]}}>{dy.gz}</span>
                <span className="ss10">{dy.ss10}</span>
                <span className="info">{dy.startAge}–{dy.endAge}岁<br/>{dy.startYear}–{dy.endYear}年</span>
                {dy.timeCur? <span className="tag">当前</span>:null}
              </div>
            );
          })}
        </div>
      </div>

      {cur? (
      <div className="card" id="lnCard"><h2 id="lnTitle">流年 · {cur.gz}运（{cur.startYear}–{cur.endYear}）</h2>
        <div className="ln" id="rLiunian">
          {cur.liunian.map(function(ln,i){
            return (
              <div key={i} className={'it'+(ln.cur?' cur':'')}>
                <b style={{color:WX_C[GAN_WX[ln.gz.charAt(0)]]}}>{ln.gz}</b><br/>
                {ln.year}年<br/>{ln.age}岁<br/><span className="lnss">{ln.ss}</span>
              </div>
            );
          })}
        </div>
      </div>):null}

      <div className="card"><h2>其他信息</h2><div id="rMisc">
        <div className="kv"><span className="k">空亡</span><span>{data.misc.kongwang}</span></div>
      </div></div>

      <div className="card"><h2>算法说明</h2><div className="note" style={{lineHeight:2}}>
        · 按公历日期排盘，月柱以节气（立春、惊蛰……）划分，不是农历初一。<br/>
        · 真太阳时 = 输入时间 − 夏令时（如适用）+（出生地经度 − 时区标准经度）× 4分钟/度 + 时差方程；输入时间视为出生地所在时区的标准时间。<br/>
        · 1986–1991 年中国夏令时已自动回拨 1 小时。<br/>
        · 大运顺逆：阳年男命、阴年女命顺排，反之逆排。<br/>
        · 神煞流派众多，此处取常见规则，仅供参考。<br/>
        · 排盘全程在本地完成，生辰数据不上传。<br/>
        · 结果仅供学习娱乐参考 😌
      </div></div>
    </div>
  );
}
