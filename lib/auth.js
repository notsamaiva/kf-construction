const crypto=require('node:crypto');const {sign,verify}=require('./quotes');
function key(){if(!process.env.KF_SESSION_SECRET||!process.env.KF_JERRY_HASH)throw Error('Accès Jerry non configuré.');return process.env.KF_SESSION_SECRET;}
function authorized(req){try{const token=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('__Host-kf='))?.slice(10);const s=verify(token,key());return s.role==='jerry'&&s.exp>Date.now();}catch{return false;}}
function password(value){const [salt,hash]=process.env.KF_JERRY_HASH.split(':');const actual=crypto.scryptSync(value,salt,64);return crypto.timingSafeEqual(actual,Buffer.from(hash,'hex'));}
function cookie(res,logout=false){const token=logout?'':sign({role:'jerry',exp:Date.now()+8*3600000,nonce:crypto.randomUUID()},key());res.setHeader('Set-Cookie',`__Host-kf=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${logout?0:28800}`);}
function origin(req){return req.headers.origin===`https://${req.headers.host}`;}
module.exports={key,authorized,password,cookie,origin};
