/* 细盘 tab：专业细盘表格 + 基本信息 */
import {WX_C, GAN_WX, ZHI_WX} from '../lib/constants.js';

function brList(items, render){
  var out=[];
  items.forEach(function(it,i){
    if(i>0)out.push(<br key={'b'+i}/>);
    out.push(<span key={'t'+i}>{render(it)}</span>);
  });
  return out;
}

export default function XiPan({data}){
  const cols=data.xipan.cols;

  function cell(key, content, cls){
    return <td key={key} className={cls||''}>{content}</td>;
  }
  const head=(<tr><td className="lab"></td>{cols.map(function(p,i){return <td key={i} className="lab">{p.lab}</td>;})}</tr>);
  const r1=(<tr><td className="lab">主星</td>{cols.map(function(p,i){return cell(i,<span className="ssn">{p.zhuxing}</span>);})}</tr>);
  const r2=(<tr><td className="lab">天干</td>{cols.map(function(p,i){
    return cell(i,<span className="big" style={{color:WX_C[GAN_WX[p.gan]]}}>{p.gan}</span>);})}</tr>);
  const r3=(<tr><td className="lab">地支</td>{cols.map(function(p,i){
    return cell(i,<span className="big" style={{color:WX_C[ZHI_WX[p.zhi]]}}>{p.zhi}</span>);})}</tr>);
  const r4=(<tr><td className="lab">藏干</td>{cols.map(function(p,i){
    if(!p.hide.length)return cell(i,<span style={{color:'#ccc'}}>—</span>);
    return cell(i, brList(p.hide, function(h){
      return <>{<span style={{color:WX_C[GAN_WX[h.g]]}}>{h.g}</span>}<span className="ssn">{h.ss}</span></>;
    }));
  })}</tr>);
  const r5=(<tr><td className="lab">星运</td>{cols.map(function(p,i){return cell(i,p.xingyun);})}</tr>);
  const r6=(<tr><td className="lab">自坐</td>{cols.map(function(p,i){return cell(i,p.zizuo);})}</tr>);
  const r7=(<tr><td className="lab">空亡</td>{cols.map(function(p,i){return cell(i,p.kong);})}</tr>);
  const r8=(<tr><td className="lab">纳音</td>{cols.map(function(p,i){return cell(i,p.nayin);})}</tr>);
  const r9=(<tr><td className="lab">神煞</td>{cols.map(function(list,i){
    if(!list.shensha.length)return cell(i,<span style={{color:'#ccc'}}>—</span>);
    return cell(i,<span className="sha">{brList(list.shensha, function(s){return s;})}</span>);
  })}</tr>);

  return (
    <div>
      <div className="card"><h2>专业细盘</h2>
        <div className="note" style={{margin:'0 0 10px'}}>大运、流年取当前</div>
        <div className="xw"><table className="xt" id="rXipan">
          <thead>{head}</thead>
          <tbody>{r1}{r2}{r3}{r4}{r5}{r6}{r7}{r8}{r9}</tbody>
        </table></div>
        <div className="note">神煞流派众多，此处取常见规则，仅供参考。</div>
      </div>
      <div className="card"><h2>基本信息</h2><div id="rBasic">
        {data.basic.map(function(r,i){
          return (
            <div className="kv" key={i}>
              <span className="k">{r[0]}</span>
              <span style={{textAlign:'right',maxWidth:'70%'}}>{r[1]}</span>
            </div>
          );
        })}
      </div></div>
    </div>
  );
}
