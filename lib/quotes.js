const crypto=require('node:crypto');
function text(v,label,max=160,required=true){if(typeof v!=='string'||v.length>max||(required&&!v.trim()))throw Error(label+' : valeur manquante ou trop longue.');return v.trim();}
function amount(v,label,max=1000000000){if(typeof v!=='number'||!Number.isFinite(v)||v<0||v>max)throw Error(label+' : nombre invalide.');return v;}
function normalize(d){
 if(!d||!Array.isArray(d.materials)||!d.materials.length||d.materials.length>100)throw Error('Ajoutez entre 1 et 100 matériaux.');
 const materials=d.materials.map(m=>{const quantity=amount(m.quantity,'Quantité',1000000);if(quantity===0)throw Error('La quantité doit être positive.');const price=amount(m.price,'Prix unitaire');if(!Number.isInteger(price))throw Error('Le prix unitaire doit être entier en FCFA.');const total=Math.round(quantity*price);if(total>1e12)throw Error('Montant trop élevé.');return {name:text(m.name,'Désignation',300),unit:text(m.unit,'Unité',30),quantity,price,total};});
 const labour=amount(d.labour,"Main-d’œuvre");if(!Number.isInteger(labour))throw Error('Le forfait doit être entier en FCFA.');
 const subtotal=materials.reduce((a,m)=>a+m.total,0);
 return {client:text(d.client,'Nom du client'),phone:text(d.phone,'Téléphone',80,false),address:text(d.address,'Adresse',300,false),nature:text(d.nature,'Nature'),title:text(d.title,'Titre',200),location:text(d.location,'Lieu',200),notes:text(d.notes||'','Observations',1500,false),materials,labour,subtotal,total:subtotal+labour};
}
function sign(data,key){const body=Buffer.from(JSON.stringify(data)).toString('base64url');return body+'.'+crypto.createHmac('sha256',key).update(body).digest('base64url');}
function verify(token,key){if(typeof token!=='string'||token.length>100000)throw Error('Document invalide.');const [body,mac,extra]=token.split('.');const expected=crypto.createHmac('sha256',key).update(body||'').digest('base64url');if(extra||!mac||mac.length!==expected.length||!crypto.timingSafeEqual(Buffer.from(mac),Buffer.from(expected)))throw Error('Document invalide.');return JSON.parse(Buffer.from(body,'base64url'));}
module.exports={normalize,sign,verify};
