const PDFDocument=require('pdfkit');const path=require('node:path');
const money=v=>new Intl.NumberFormat('fr-FR').format(v).replace(/\s/g,' ')+' FCFA';
module.exports=function pdf(q,final=false){return new Promise((resolve,reject)=>{
 const doc=new PDFDocument({size:'A4',margin:42,bufferPages:true,info:{Title:q.title,Author:'KF Construction'}});const chunks=[];doc.on('data',c=>chunks.push(c));doc.on('end',()=>resolve(Buffer.concat(chunks)));doc.on('error',reject);
 doc.registerFont('regular',path.join(process.cwd(),'assets/regular.ttf'));doc.registerFont('bold',path.join(process.cwd(),'assets/bold.ttf'));doc.font('regular');
 const green='#00382b',gold='#b38b4a',width=511;
 const put=(s,x,y,w,size=10,bold=false,color=green)=>{doc.font(bold?'bold':'regular').fontSize(size).fillColor(color).text(String(s),x,y,{width:w});};
 function heading(){doc.rect(0,0,596,12).fill(green);doc.image(path.join(process.cwd(),'public/logo-kf.png'),42,30,{fit:[130,95]});put('KF CONSTRUCTION',300,38,250,17,true);put('Kitio Fofié Jerry Divane\nDouala, Cameroun\n+237 691 26 01 15 / +237 654 21 57 81',300,66,250,9);doc.moveTo(42,138).lineTo(553,138).strokeColor(gold).stroke();}
 heading();let y=157;put(final?'DEVIS':'DEVIS · APERÇU NON VALIDÉ',42,y,width,20,true);y+=36;put(q.number||'Numéro attribué à la validation',42,y,310,10,true);put(q.date||new Date().toLocaleDateString('fr-FR',{timeZone:'Africa/Douala'}),415,y,138);y+=30;
 function block(label,value){doc.font('regular').fontSize(10);const h=Math.max(17,doc.heightOfString(value,{width:365}));if(y+h>730){doc.addPage();heading();y=155;}put(label,42,y,140,9,true);put(value,185,y,368);y+=h+9;}
 block('Client',q.client);if(q.phone)block('Téléphone',q.phone);if(q.address)block('Adresse',q.address);block('Nature du devis',q.nature);block('Titre',q.title);block('Lieu des travaux',q.location);y+=14;
 const cols=[42,278,326,385,461], widths=[230,42,53,70,92];
 function tableHead(){doc.rect(42,y,width,28).fill(green);['Désignation','Unité','Qté','P.U. FCFA','Total FCFA'].forEach((s,i)=>put(s,cols[i]+5,y+8,widths[i]-8,8,true,'white'));y+=28;}
 tableHead();
 q.materials.forEach((m,index)=>{doc.font('regular').fontSize(9);const h=Math.max(34,doc.heightOfString(m.name,{width:220})+16);if(y+h>720){doc.addPage();heading();y=158;tableHead();}if(index%2===0)doc.rect(42,y,width,h).fill('#f4f6f2');[m.name,m.unit,String(m.quantity),money(m.price).replace(' FCFA',''),money(m.total).replace(' FCFA','')].forEach((s,i)=>put(s,cols[i]+5,y+9,widths[i]-10,9,i===4));y+=h;});
 if(y+160>735){doc.addPage();heading();y=160;}y+=20;
 [['Sous-total matériaux',q.subtotal],["Main-d’œuvre (forfait)",q.labour],['TOTAL GÉNÉRAL',q.total]].forEach(([label,v],i)=>{if(i===2)doc.rect(260,y,293,39).fill(green);put(label,270,y+10,160,10,true,i===2?'white':green);put(money(v),420,y+10,125,10,true,i===2?'white':green);y+=39;});
 y+=18;if(q.notes){block('Observations',q.notes);}const pages=doc.bufferedPageRange();for(let i=0;i<pages.count;i++){doc.switchToPage(i);doc.moveTo(42,777).lineTo(553,777).strokeColor(gold).stroke();put(`KF Construction · ${final?'Devis validé':'Aperçu non validé'} · ${i+1}/${pages.count}`,42,787,width,8,false);}
 doc.end();
});};
