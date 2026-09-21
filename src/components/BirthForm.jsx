/* 出生信息表单 */
import {useState} from 'react';
import PlacePicker from './PlacePicker.jsx';
import {computeBazi} from '../lib/bazi.js';

export default function BirthForm({onPaipan}){
  const [name,setName]=useState('');
  const [gender,setGender]=useState('男');
  const [date,setDate]=useState('');
  const [time,setTime]=useState('');
  const [place,setPlace]=useState('');
  const [solarTOn,setSolarTOn]=useState(true);
  const [err,setErr]=useState('');
  const [pickerOpen,setPickerOpen]=useState(false);

  function submit(vals){
    const r=computeBazi(vals);
    if(r.error){ setErr(r.error); return; }
    setErr('');
    onPaipan(r);
  }
  function go(){
    submit({name:name,gender:gender,date:date,time:time,place:place,solarTOn:solarTOn});
  }
  function demo(){
    const v={name:'',gender:'男',date:'1990-01-01',time:'00:00',place:place,solarTOn:solarTOn};
    setName(''); setGender('男'); setDate('1990-01-01'); setTime('00:00');
    submit(v);
  }

  return (
    <div className="card" id="formCard">
      <h2>出生信息</h2>
      <div className="row"><label>姓名（可选）</label>
        <input type="text" id="fName" placeholder="选填，可留空" value={name}
          onChange={(e)=>setName(e.target.value)}/></div>
      <div className="row"><label>性别</label>
        <div className="seg" id="fGender">
          <button type="button" data-v="男" className={gender==='男'?'on':''} onClick={()=>setGender('男')}>男生</button>
          <button type="button" data-v="女" className={gender==='女'?'on':''} onClick={()=>setGender('女')}>女生</button>
        </div></div>
      <div className="row"><label>出生日期（阳历）</label>
        <input type="date" id="fDate" value={date}
          onChange={(e)=>{setDate(e.target.value);setErr('');}}/></div>
      <div className="row"><label>出生时间</label>
        <input type="time" id="fTime" value={time}
          onChange={(e)=>{setTime(e.target.value);setErr('');}}/></div>
      <div className="row"><label>出生地（选填）</label>
        <div style={{display:'flex',gap:'8px'}}>
          <input type="text" id="fPlace" placeholder="如：北京，或直接输经度 116.4"
            style={{flex:1,minWidth:0}} value={place}
            onChange={(e)=>{setPlace(e.target.value);setErr('');}}/>
          <button type="button" id="placeBtn" className="btn ghost"
            style={{width:'auto',marginTop:0,padding:'12px 18px',letterSpacing:0,whiteSpace:'nowrap'}}
            onClick={()=>setPickerOpen(true)}>选择</button>
        </div></div>
      <div className="row"><label>真太阳时校正</label>
        <div className="seg" id="fSolarT">
          <button type="button" data-v="1" className={solarTOn?'on':''} onClick={()=>setSolarTOn(true)}>开</button>
          <button type="button" data-v="0" className={!solarTOn?'on':''} onClick={()=>setSolarTOn(false)}>关</button>
        </div></div>
      <button type="button" className="btn" id="goBtn" onClick={go}>开始排盘</button>
      <div id="formErr" className={err?'':'hidden'}>{err}</div>
      <button type="button" className="btn ghost" id="demoBtn" onClick={demo}>✨ 填入示例体验</button>
      <div className="note">阳历 · 按节气划分月柱 · 填写出生地可自动换算真太阳时；在节气交接前后出生建议核对时刻。<br/>结果仅供学习娱乐参考 😌</div>
      <PlacePicker open={pickerOpen} value={place}
        onOk={(v)=>{setPlace(v);setErr('');setPickerOpen(false);}}
        onClose={()=>setPickerOpen(false)}/>
    </div>
  );
}
