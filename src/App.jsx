import { useState } from "react";
import PasswordGate from "./PasswordGate";

const CARTEIRA = {
  acoes: [
    { ticker:"PETR4",  nome:"Petrobras PN",        qtd:310, preco:48.67,  valor:15087.70, provento:136.90, tipo:"Acao" },
    { ticker:"ITUB4",  nome:"Itau Unibanco PN",    qtd:206, preco:43.48,  valor:8956.88,  provento:50.24,  tipo:"Acao" },
    { ticker:"TAEE11", nome:"Transmissora Alianca", qtd:125, preco:43.01,  valor:5376.25,  provento:0,      tipo:"Acao" },
    { ticker:"ISAE4",  nome:"ISA Energia Brasil",   qtd:125, preco:29.09,  valor:3636.25,  provento:26.62,  tipo:"Acao" },
    { ticker:"BBAS3",  nome:"Banco do Brasil ON",   qtd:50,  preco:23.00,  valor:1150.00,  provento:0,      tipo:"Acao" },
  ],
  fiis: [
    { ticker:"XPML11", nome:"XP Malls",            qtd:120, preco:108.09, valor:12970.80, provento:109.48, tipo:"Tijolo" },
    { ticker:"KNCR11", nome:"Kinea Rendimentos",   qtd:103, preco:106.01, valor:10919.03, provento:102.00, tipo:"Papel"  },
    { ticker:"MXRF11", nome:"Maxi Renda",          qtd:463, preco:9.92,   valor:4592.96,  provento:46.30,  tipo:"Papel"  },
    { ticker:"HGLG11", nome:"Patria Log",          qtd:22,  preco:156.14, valor:3435.08,  provento:24.20,  tipo:"Tijolo" },
    { ticker:"PCIP11", nome:"Patria Cred Imob",    qtd:32,  preco:85.12,  valor:2723.84,  provento:25.60,  tipo:"Papel"  },
    { ticker:"RECR11", nome:"REC Recebiveis",      qtd:26,  preco:80.76,  valor:2099.76,  provento:18.85,  tipo:"Papel"  },
    { ticker:"CPTS11", nome:"Capitania Sec",       qtd:130, preco:7.98,   valor:1037.40,  provento:0,      tipo:"Papel"  },
    { ticker:"BTLG11", nome:"BTG Log",             qtd:14,  preco:103.35, valor:1446.90,  provento:11.20,  tipo:"Tijolo" },
  ],
  tesouro: [
    { nome:"Tesouro IPCA+ 2029", venc:"15/05/2029", aplicado:3677.69, valor:4011.90 },
    { nome:"Tesouro Selic 2028", venc:"01/03/2028",  aplicado:2235.91, valor:2431.55 },
  ],
  proventos_mes: 551.39,
};

const C = {
  bg:"#070e1c", card:"#0d1828", surf:"#0a1220", border:"#142035",
  accent:"#00d4a8", warm:"#f5a623", red:"#f05454", blue:"#4da6ff",
  purple:"#a78bfa", text:"#d0e8f8", muted:"#3d5a78", dim:"#182a3f",
};

const tA  = CARTEIRA.acoes.reduce((s,a)=>s+a.valor,0);
const tF  = CARTEIRA.fiis.reduce((s,f)=>s+f.valor,0);
const tT  = CARTEIRA.tesouro.reduce((s,t)=>s+t.valor,0);
const tot = tA+tF+tT;
const pA  = CARTEIRA.acoes.reduce((s,a)=>s+a.provento,0);
const pF  = CARTEIRA.fiis.reduce((s,f)=>s+f.provento,0);
const fp  = CARTEIRA.fiis.filter(f=>f.tipo==="Papel").reduce((s,f)=>s+f.valor,0);
const ft  = CARTEIRA.fiis.filter(f=>f.tipo==="Tijolo").reduce((s,f)=>s+f.valor,0);

const fmt = v=>"R$ "+v.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
const pc  = (v,t)=>((v/t)*100).toFixed(1)+"%";

const Card = ({children,style})=>(
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",...style}}>{children}</div>
);
const Lbl = ({t})=>(
  <div style={{fontSize:9,letterSpacing:2,color:C.muted,textTransform:"uppercase",fontFamily:"monospace",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
    <div style={{width:12,height:1,background:C.accent}}/>{t}
  </div>
);
const Badge = ({label,color})=>(
  <span style={{background:color+"18",border:`1px solid ${color}40`,color,borderRadius:4,padding:"2px 7px",fontSize:9,fontWeight:700,fontFamily:"monospace"}}>{label}</span>
);
const Bar = ({p,color,h=6})=>(
  <div style={{width:"100%",height:h,background:C.surf,borderRadius:3,overflow:"hidden"}}>
    <div style={{width:`${Math.min(p,100)}%`,height:"100%",background:color,borderRadius:3}}/>
  </div>
);
const Donut = ({segs,size=90})=>{
  const total=segs.reduce((s,x)=>s+x.val,0);
  const r=30,cx=45,cy=45,circ=2*Math.PI*r;
  let cum=0;
  return (
    <svg width={size} height={size} viewBox="0 0 90 90">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.surf} strokeWidth="12"/>
      {segs.map((seg,i)=>{
        const dash=(seg.val/total)*circ;
        const offset=-(cum/total)*circ;
        cum+=seg.val;
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color}
          strokeWidth="12" strokeDasharray={`${dash} ${circ-dash}`} strokeDashoffset={offset}
          style={{transform:"rotate(-90deg)",transformOrigin:"50% 50%"}}/>;
      })}
    </svg>
  );
};

const REINVEST=[
  {ativo:"KNCR11",       pct:55, valor:303.27, cor:C.accent, motivo:"SELIC alta - papel CDI prioritario"},
  {ativo:"Tesouro IPCA+",pct:30, valor:165.42, cor:C.blue,   motivo:"Travar taxa real elevada agora"},
  {ativo:"XPML11",       pct:15, valor:82.71,  cor:C.warm,   motivo:"Posicionamento minimo em Tijolo"},
];

export default function App(){
  const [tab,setTab]=useState(0);
  const tabs=["Visao Geral","Carteira","Proventos","Reinvestir"];

  return (
    <PasswordGate>
    <div style={{minHeight:"100vh",background:C.bg,color:C.text,fontFamily:"system-ui,sans-serif",padding:"20px 16px"}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>

        {/* Header */}
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:C.accent,boxShadow:`0 0 10px ${C.accent}`}}/>
            <span style={{fontSize:9,letterSpacing:2.5,color:C.accent,textTransform:"uppercase",fontFamily:"monospace"}}>Ramon Invest · B3 · Marco/2026</span>
          </div>
          <div style={{fontSize:26,fontWeight:700,letterSpacing:-0.5}}>Painel da Carteira</div>
          <div style={{fontSize:12,color:C.muted,marginTop:3}}>XP Investimentos · Relatorio Consolidado B3</div>
        </div>

        {/* KPIs */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
          {[
            {label:"Patrimonio B3",  val:fmt(tot),                                             color:C.accent},
            {label:"Proventos/mes",  val:fmt(CARTEIRA.proventos_mes),                          color:C.warm},
            {label:"Yield Mensal",   val:((CARTEIRA.proventos_mes/tot)*100).toFixed(2)+"%",    color:C.blue},
            {label:"Yield Anual",    val:((CARTEIRA.proventos_mes*12/tot)*100).toFixed(2)+"%", color:C.purple},
          ].map((k,i)=>(
            <Card key={i} style={{padding:"12px 14px"}}>
              <div style={{fontSize:9,color:C.muted,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"monospace",marginBottom:5}}>{k.label}</div>
              <div style={{fontSize:18,fontWeight:700,color:k.color,fontFamily:"monospace",lineHeight:1}}>{k.val}</div>
            </Card>
          ))}
        </div>

        {/* SELIC bar */}
        <div style={{background:C.red+"12",border:`1px solid ${C.red}33`,borderRadius:9,padding:"10px 16px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{color:C.red,fontSize:14,fontWeight:700,fontFamily:"monospace"}}>SELIC 14,75%</span>
            <Badge label="Regime ALTO" color={C.red}/>
          </div>
          <span style={{fontSize:11,color:C.muted}}>Regra de Ouro: priorizar <b style={{color:C.accent}}>KNCR11</b> e <b style={{color:C.blue}}>Tesouro IPCA+</b></span>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",gap:2,marginBottom:16,borderBottom:`1px solid ${C.border}`}}>
          {tabs.map((t,i)=>(
            <button key={i} onClick={()=>setTab(i)} style={{background:"none",border:"none",color:tab===i?C.accent:C.muted,fontSize:10,fontWeight:tab===i?700:400,cursor:"pointer",padding:"9px 16px",borderBottom:tab===i?`2px solid ${C.accent}`:"2px solid transparent",fontFamily:"monospace",textTransform:"uppercase",letterSpacing:0.5}}>
              {t}
            </button>
          ))}
        </div>

        {/* TAB 0 */}
        {tab===0&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Card>
                <Lbl t="Alocacao por Classe"/>
                <div style={{display:"flex",alignItems:"center",gap:20}}>
                  <Donut segs={[{val:tA,color:C.warm},{val:fp,color:C.accent},{val:ft,color:C.blue},{val:tT,color:C.purple}]}/>
                  <div style={{flex:1,display:"flex",flexDirection:"column",gap:8}}>
                    {[{l:"Acoes",v:tA,c:C.warm},{l:"FII Papel",v:fp,c:C.accent},{l:"FII Tijolo",v:ft,c:C.blue},{l:"Tesouro",v:tT,c:C.purple}].map((s,i)=>(
                      <div key={i}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                          <span style={{fontSize:10,color:s.c,fontWeight:600}}>{s.l}</span>
                          <span style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>{pc(s.v,tot)}</span>
                        </div>
                        <Bar p={(s.v/tot)*100} color={s.c}/>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
              <Card>
                <Lbl t="Aderencia a Estrategia"/>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {[
                    {ok:true, t:"KNCR11 solido (R$ 10.919)",      d:"Papel CDI correto para SELIC alta"},
                    {ok:true, t:"Tesouro IPCA+ +9,1% acumulado",  d:"Nao vender - valoriza na queda da SELIC"},
                    {ok:true, t:"XPML11 ancora em Tijolo",        d:"Aguardar pivo para ampliar posicao"},
                    {ok:false,t:"4 FIIs novos fora do plano",     d:"MXRF11, RECR11, CPTS11, PCIP11 - consolidar"},
                    {ok:false,t:"BBAS3 posicao pequena R$ 1.150", d:"Crescer ou migrar para ITUB4"},
                  ].map((x,i)=>(
                    <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                      <span style={{color:x.ok?C.accent:C.warm,fontSize:12,marginTop:1}}>{x.ok?"✓":"→"}</span>
                      <div>
                        <div style={{fontSize:11,fontWeight:600,color:x.ok?C.text:C.warm}}>{x.t}</div>
                        <div style={{fontSize:10,color:C.muted}}>{x.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
            <Card>
              <Lbl t="FII Papel vs Tijolo · Ciclo SELIC ALTO"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {[
                  {tipo:"Papel", cor:C.accent,val:fp,sub:"Correto para SELIC alta. Manter aportes.", lista:CARTEIRA.fiis.filter(f=>f.tipo==="Papel")},
                  {tipo:"Tijolo",cor:C.blue,  val:ft,sub:"Aguardar pivo da SELIC para ampliar.",     lista:CARTEIRA.fiis.filter(f=>f.tipo==="Tijolo")},
                ].map((g,i)=>(
                  <div key={i} style={{padding:"14px",background:g.cor+"0a",borderRadius:9,border:`1px solid ${g.cor}22`}}>
                    <div style={{fontSize:11,color:g.cor,fontWeight:700,marginBottom:5}}>FII {g.tipo} · {fmt(g.val)} · {pc(g.val,tF)}</div>
                    <div style={{fontSize:10,color:C.muted,marginBottom:10}}>{g.sub}</div>
                    {g.lista.map((f,j)=>(
                      <div key={j} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.border}`}}>
                        <span style={{fontSize:10,fontFamily:"monospace",color:g.cor}}>{f.ticker}</span>
                        <span style={{fontSize:10,color:C.muted,fontFamily:"monospace"}}>{fmt(f.valor)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 1 */}
        {tab===1&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card>
              <Lbl t={`Acoes · ${fmt(tA)} · ${pc(tA,tot)}`}/>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {CARTEIRA.acoes.map((a,i)=>(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"72px 1fr 55px 75px 80px",alignItems:"center",gap:10,padding:"8px 12px",background:C.surf,borderRadius:8}}>
                    <span style={{fontSize:11,fontWeight:700,color:C.warm,fontFamily:"monospace"}}>{a.ticker}</span>
                    <div><div style={{fontSize:10,color:C.text,marginBottom:3}}>{a.nome}</div><Bar p={(a.valor/tA)*100} color={C.warm} h={4}/></div>
                    <span style={{fontSize:10,color:C.muted,textAlign:"right",fontFamily:"monospace"}}>{a.qtd}x</span>
                    <span style={{fontSize:10,color:C.muted,textAlign:"right",fontFamily:"monospace"}}>R${a.preco.toFixed(2)}</span>
                    <span style={{fontSize:11,fontWeight:700,textAlign:"right",fontFamily:"monospace"}}>{fmt(a.valor)}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <Lbl t={`FIIs · ${fmt(tF)} · ${pc(tF,tot)}`}/>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {CARTEIRA.fiis.map((f,i)=>{
                  const cor=f.tipo==="Papel"?C.accent:C.blue;
                  return (
                    <div key={i} style={{display:"grid",gridTemplateColumns:"72px 1fr 55px 75px 80px",alignItems:"center",gap:10,padding:"8px 12px",background:C.surf,borderRadius:8}}>
                      <span style={{fontSize:11,fontWeight:700,color:cor,fontFamily:"monospace"}}>{f.ticker}</span>
                      <div>
                        <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                          <span style={{fontSize:10,color:C.text}}>{f.nome}</span>
                          <Badge label={f.tipo} color={cor}/>
                        </div>
                        <Bar p={(f.valor/tF)*100} color={cor} h={4}/>
                      </div>
                      <span style={{fontSize:10,color:C.muted,textAlign:"right",fontFamily:"monospace"}}>{f.qtd}x</span>
                      <span style={{fontSize:10,color:C.muted,textAlign:"right",fontFamily:"monospace"}}>R${f.preco.toFixed(2)}</span>
                      <span style={{fontSize:11,fontWeight:700,textAlign:"right",fontFamily:"monospace"}}>{fmt(f.valor)}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
            <Card>
              <Lbl t={`Tesouro Direto · ${fmt(tT)} · ${pc(tT,tot)}`}/>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {CARTEIRA.tesouro.map((t,i)=>{
                  const g=((t.valor-t.aplicado)/t.aplicado*100).toFixed(1);
                  return (
                    <div key={i} style={{display:"grid",gridTemplateColumns:"1fr auto auto auto",gap:16,alignItems:"center",padding:"12px 14px",background:C.surf,borderRadius:9}}>
                      <div>
                        <div style={{fontSize:11,fontWeight:700,color:C.purple}}>{t.nome}</div>
                        <div style={{fontSize:9,color:C.muted,fontFamily:"monospace",marginTop:2}}>Venc: {t.venc}</div>
                      </div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:9,color:C.muted}}>Aplicado</div><div style={{fontSize:11,fontFamily:"monospace"}}>{fmt(t.aplicado)}</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:9,color:C.muted}}>Atual</div><div style={{fontSize:11,fontWeight:700,fontFamily:"monospace"}}>{fmt(t.valor)}</div></div>
                      <div style={{textAlign:"right"}}><div style={{fontSize:9,color:C.muted}}>Ganho</div><div style={{fontSize:13,fontWeight:700,color:C.accent,fontFamily:"monospace"}}>+{g}%</div></div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 2 */}
        {tab===2&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {[
                {label:"Total Marco",val:fmt(CARTEIRA.proventos_mes),color:C.accent},
                {label:"De Acoes",   val:fmt(pA),                    color:C.warm},
                {label:"De FIIs",    val:fmt(pF),                    color:C.blue},
              ].map((k,i)=>(
                <Card key={i} style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:C.muted,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"monospace",marginBottom:5}}>{k.label}</div>
                  <div style={{fontSize:22,fontWeight:700,color:k.color,fontFamily:"monospace"}}>{k.val}</div>
                </Card>
              ))}
            </div>
            <Card>
              <Lbl t="Proventos por Ativo · Marco/2026"/>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[...CARTEIRA.acoes,...CARTEIRA.fiis]
                  .filter(a=>a.provento>0)
                  .sort((a,b)=>b.provento-a.provento)
                  .map((a,i)=>{
                    const cor=a.tipo==="Acao"?C.warm:a.tipo==="Papel"?C.accent:C.blue;
                    const p=(a.provento/CARTEIRA.proventos_mes)*100;
                    return (
                      <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 12px",background:C.surf,borderRadius:8}}>
                        <span style={{fontSize:11,fontWeight:700,color:cor,width:60,fontFamily:"monospace"}}>{a.ticker}</span>
                        <div style={{flex:1}}><Bar p={p} color={cor} h={9}/></div>
                        <span style={{fontSize:10,color:C.muted,width:32,textAlign:"right",fontFamily:"monospace"}}>{p.toFixed(0)}%</span>
                        <span style={{fontSize:12,fontWeight:700,color:cor,width:76,textAlign:"right",fontFamily:"monospace"}}>{fmt(a.provento)}</span>
                      </div>
                    );
                  })}
              </div>
            </Card>
            <Card>
              <Lbl t="Projecao Anual de Proventos"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                {[
                  {label:"Conservador 10x",val:CARTEIRA.proventos_mes*10,color:C.muted},
                  {label:"Base 12x",        val:CARTEIRA.proventos_mes*12,color:C.accent},
                  {label:"Otimista 14x",    val:CARTEIRA.proventos_mes*14,color:C.warm},
                ].map((c,i)=>(
                  <div key={i} style={{padding:"14px",background:C.surf,borderRadius:9,textAlign:"center"}}>
                    <div style={{fontSize:9,color:C.muted,fontFamily:"monospace",marginBottom:5}}>{c.label}</div>
                    <div style={{fontSize:18,fontWeight:700,color:c.color,fontFamily:"monospace"}}>{fmt(c.val)}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* TAB 3 */}
        {tab===3&&(
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Card>
              <Lbl t="Destino dos R$ 551,39 · Abril/2026"/>
              <div style={{padding:"10px 14px",background:C.red+"0a",border:`1px solid ${C.red}22`,borderRadius:9,marginBottom:14}}>
                <div style={{fontSize:10,color:C.red,fontWeight:700,marginBottom:3}}>Regime SELIC ALTO (14,75%) · Regra de Ouro ativa</div>
                <div style={{fontSize:10,color:C.muted}}>Prioridade em Papel CDI e IPCA+. FII Tijolo apenas posicionamento minimo.</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {REINVEST.map((r,i)=>(
                  <div key={i} style={{padding:"14px 16px",background:r.cor+"08",border:`1px solid ${r.cor}22`,borderRadius:9}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <span style={{fontSize:15,fontWeight:700,color:r.cor,fontFamily:"monospace"}}>{r.ativo}</span>
                        <Badge label={`${r.pct}%`} color={r.cor}/>
                      </div>
                      <span style={{fontSize:17,fontWeight:700,color:r.cor,fontFamily:"monospace"}}>{fmt(r.valor)}</span>
                    </div>
                    <Bar p={r.pct} color={r.cor} h={7}/>
                    <div style={{fontSize:10,color:C.muted,marginTop:8}}>{r.motivo}</div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <Lbl t="Alertas Estrategicos"/>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  {icon:"→",cor:C.warm,  t:"4 FIIs novos fora do plano",        d:"MXRF11, RECR11, CPTS11, PCIP11 - consolidar aportes em KNCR11"},
                  {icon:"→",cor:C.warm,  t:"BBAS3 posicao sub-otima",            d:"R$ 1.150 - crescer ou migrar dividendos para ITUB4"},
                  {icon:"✓",cor:C.accent,t:"PETR4 gerando R$ 136,90/mes",        d:"Maior fonte de proventos. Manter posicao."},
                  {icon:"✓",cor:C.accent,t:"Tesouro IPCA+ com +9,1% acumulado",  d:"Nao vender. Vai acelerar na queda da SELIC."},
                  {icon:"⚡",cor:C.blue, t:"COPOM 28-29/Abr - monitorar ata",    d:"'Espaco para flexibilizacao' = rotar para XPML11 e BTLG11"},
                ].map((a,i)=>(
                  <div key={i} style={{display:"flex",gap:12,padding:"10px 12px",background:a.cor+"08",borderRadius:9,border:`1px solid ${a.cor}18`}}>
                    <span style={{color:a.cor,fontSize:13,marginTop:1}}>{a.icon}</span>
                    <div>
                      <div style={{fontSize:11,fontWeight:700,color:a.cor,marginBottom:3}}>{a.t}</div>
                      <div style={{fontSize:10,color:C.muted}}>{a.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        <div style={{textAlign:"center",marginTop:20,paddingTop:14,borderTop:`1px solid ${C.border}`,fontSize:9,color:C.dim,fontFamily:"monospace",letterSpacing:1}}>
          RAMON INVEST · XP INVESTIMENTOS · B3 · MARCO/2026 · NAO E RECOMENDACAO DE INVESTIMENTO
        </div>
      </div>
    </div>
    </PasswordGate>
  );
}
