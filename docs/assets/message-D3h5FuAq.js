const n=t=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(t.trim());function r(t,e){return Object.entries(t).filter(([,s])=>s).map(([s,i])=>`${e[s]??s}: ${i}`).join(`
`)}export{r as b,n as i};
