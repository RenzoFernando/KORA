const KORA_CONFIG = {
  "operationsId": "1B8oXPKOZ7glj5rZYtidjxo0-nN5f0E3LHlgnXBqGjBk",
  "catalogId": "1x1xKeYkDLWZcvYWoQ94XNmttjZCmSHN4SfvIQkAFytw",
  "folderId": "1I6MfW-jznRLDt_Z-uL072h6iYfy2JxHe",
  "ownerEmail": "renzofernando.md@gmail.com",
  "whatsapp": "573112476840",
  "legalVersion": "2026-10-25.2"
};

// KORΛ: backend para una prueba compartida. No publicar la hoja privada.
// Copiar este archivo completo en Apps Script, ejecutar configurarKORlambda y desplegar como Web app.
let koraBooks_ = {};
let koraRows_ = {};
const KORA_PLANS = {free:0,curator:12900,artist:24900,scout:69900,kit:24900};
function configurarKORlambda() {
  const props=PropertiesService.getScriptProperties();
  if(!props.getProperty('MEDIA_FOLDER_ID')) {
    const parent=DriveApp.getFolderById(KORA_CONFIG.folderId);
    props.setProperty('MEDIA_FOLDER_ID',parent.createFolder('KORΛ · Archivos autorizados').getId());
  }
  const book=SpreadsheetApp.openById(KORA_CONFIG.operationsId);
  book.setSpreadsheetTimeZone('America/Bogota');
  return {ok:true,message:'Backend configurado. Despliega como aplicación web ejecutada por tu cuenta.'};
}
function doGet(e) {
  try {return jsonOutput_(handleKora_({action:e&&e.parameter&&e.parameter.action==='public.catalog'?'public.catalog':'health',args:{}}));}
  catch(error){return jsonOutput_(failure_(error));}
}
function doPost(e) {
  try {
    if(!e||!e.postData||e.postData.contents.length>7500000) throw apiError_('BAD_REQUEST','Solicitud inválida.');
    return jsonOutput_(handleKora_(JSON.parse(e.postData.contents)));
  } catch(error){return jsonOutput_(failure_(error));}
}
function jsonOutput_(value){return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);}
function apiError_(code,message){const error=new Error(message);error.code=code;return error;}
function failure_(error){return {ok:false,error:{code:error.code||'SERVER_ERROR',message:error.code?error.message:'No se pudo completar la operación. Inténtalo de nuevo.'}};}
function book_(catalog){const id=catalog?KORA_CONFIG.catalogId:KORA_CONFIG.operationsId;return koraBooks_[id]||(koraBooks_[id]=SpreadsheetApp.openById(id));}
function table_(name){const sheet=book_(name==='Catalogo').getSheetByName(name);if(!sheet)throw apiError_('SCHEMA','Falta la pestaña '+name);return sheet;}
function rows_(name){
  if(koraRows_[name])return koraRows_[name];const s=table_(name);const height=Math.min(Math.max(s.getLastRow(),1),12001);const width=s.getLastColumn();
  const data=s.getRange(1,1,height,width).getValues();const headers=data.shift().map(String);
  return koraRows_[name]=data.map((row,i)=>Object.assign({__row:i+2},Object.fromEntries(headers.map((key,j)=>[key,row[j]])))).filter(row=>headers.some(key=>row[key]!==''));
}
function cell_(value){if(value===undefined||value===null)return '';return typeof value==='string'&&/^[=+@\-\t\r]/.test(value)?"'"+value:value;}
function put_(name,row){const s=table_(name);const headers=s.getRange(1,1,1,s.getLastColumn()).getValues()[0];const values=headers.map(key=>cell_(row[key]));if(row.__row){s.getRange(row.__row,1,1,headers.length).setValues([values]);const arr=rows_(name);const index=arr.findIndex(item=>item.__row===row.__row);if(index>=0)arr[index]=row;}else{const cache=koraRows_[name];s.appendRow(values);row.__row=s.getLastRow();if(cache)cache.push(row);}return row;}
function removeWhere_(name,predicate){const sheet=table_(name);const matching=rows_(name).filter(predicate).sort((a,b)=>b.__row-a.__row);for(const row of matching)sheet.deleteRow(row.__row);delete koraRows_[name];}
function now_(){return new Date().toISOString();}
function id_(){return Utilities.getUuid();}
function text_(value,max){return String(value==null?'':value).trim().slice(0,max||1000);}
function bool_(value){return value===true||String(value).toLowerCase()==='true';}
function hex_(bytes){return bytes.map(v=>((v+256)%256).toString(16).padStart(2,'0')).join('');}
function sha_(text){return hex_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,String(text),Utilities.Charset.UTF_8));}
function hmac_(message,key){return hex_(Utilities.computeHmacSha256Signature(message,key,Utilities.Charset.UTF_8));}
function equal_(a,b){a=String(a);b=String(b);let diff=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)diff|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return diff===0;}
function parse_(value,fallback){try{return JSON.parse(value);}catch(_){return fallback;}}
function config_(key,fallback){const row=rows_('Configuracion').find(row=>row.key===key);return row?String(row.value):fallback;}
function legalVersion_(){return config_('legal_version',KORA_CONFIG.legalVersion);}
function safeUrl_(value){value=text_(value,1800);return /^https:\/\/[^\s@]+$/i.test(value)&&!/[<>"']/.test(value)?value:'';}
function email_(value){const email=text_(value,160).toLowerCase();if(!/^\S+@\S+\.\S+$/.test(email))throw apiError_('VALIDATION','Revisa el correo electrónico.');return email;}
function rate_(key,limit,seconds){const cache=CacheService.getScriptCache();const k='rate:'+sha_(key);const n=Number(cache.get(k)||0);if(n>=limit)throw apiError_('RATE_LIMIT','Demasiados intentos. Espera un momento antes de reintentar.');cache.put(k,String(n+1),seconds);}
function effectivePlan_(user){
  if(!bool_(user.premium))return 'free';if(user.plan_until&&(!Number.isFinite(Date.parse(user.plan_until))||Date.parse(user.plan_until)<=Date.now()))return 'free';
  const allowed=user.role==='explorer'?['curator']:user.role==='artist'?['artist','kit']:['scout'];return allowed.includes(user.plan)?user.plan:allowed[0];
}
function account_(user){return {id:user.id,name:user.name,email:user.email,role:user.role,createdAt:user.created_at,trialStartedAt:user.trial_started_at||undefined,plan:effectivePlan_(user),simulated:false,salt:'',hash:'',termsAt:user.terms_at||'',privacyAt:user.privacy_at||'',termsVersion:user.terms_version||'',needsConsent:user.terms_version!==legalVersion_(),bio:user.bio||'',status:user.status,isAdmin:bool_(user.is_admin),isTest:bool_(user.is_test),entitlementSource:'sheet',planUntil:user.plan_until||''};}
function session_(token,allowUnaccepted){
  if(!token||String(token).length>150)throw apiError_('UNAUTHORIZED','Inicia sesión para continuar.');const session=rows_('Sesiones').find(s=>equal_(s.token_hash,sha_(token))&&s.status==='active'&&Date.parse(s.expires_at)>Date.now());
  if(!session)throw apiError_('UNAUTHORIZED','Tu sesión venció. Inicia sesión de nuevo.');const user=rows_('Usuarios').find(u=>u.id===session.user_id);
  if(!user||user.status!=='active')throw apiError_('ACCOUNT_INACTIVE','La cuenta está inactiva. Contacta al equipo KORΛ.');
  if(!allowUnaccepted&&user.terms_version!==legalVersion_())throw apiError_('CONSENT_REQUIRED','Lee y acepta los términos vigentes para continuar.');return {user,session};
}
function addNotice_(userId,title,body,type,link){put_('Notificaciones',{id:id_(),user_id:userId,title,body,type,link:link||'/cuenta',created_at:now_(),read_at:''});}
function startSession_(user){const token=id_()+id_();put_('Sesiones',{id:id_(),user_id:user.id,token_hash:sha_(token),created_at:now_(),expires_at:new Date(Date.now()+7*86400000).toISOString(),status:'active',last_plan:effectivePlan_(user)});return {token,account:account_(user)};}
function publicRelease_(r){const fields=['id','slug','artistId','artist','title','city','genre','story','kind','color','art','officialUrl','links','playback','embedType','embedId','audioKey','coverKey','ownerId','status','rights','rightsEvidence','sourceUrl','verifiedAt','allowScout','createdAt'];return Object.fromEntries(fields.filter(key=>r[key]!==undefined).map(key=>[key,r[key]]));}
function allReleases_(){
  const base=rows_('Catalogo').filter(r=>bool_(r.publicApproved)).map(r=>{const full=parse_(r.data_json,{});for(const key of ['id','artistId','artist','title','city','genre','story','officialUrl','sourceUrl','verifiedAt','rightsEvidence','embedType','embedId'])if(r[key]!==undefined)full[key]=String(r[key]);return publicRelease_(full);});
  return [...base,...rows_('Lanzamientos').map(row=>({...parse_(row.data_json,{}),ownerId:row.owner_id,status:row.status}))];
}
function publicData_(){const hidden=rows_('Moderacion').filter(r=>bool_(r.hidden)).map(r=>r.release_id);const catalog=allReleases_().filter(r=>r.status==='active'&&!hidden.includes(r.id)&&(!r.ownerId||rows_('Usuarios').some(u=>u.id===r.ownerId&&u.status==='active')));for(const release of catalog){if(!release.ownerId)continue;const profile=rows_('Perfiles').find(p=>p.user_id===release.ownerId);const pub=parse_(profile&&profile.data_json,{}).publicProfile;if(pub&&pub.published){release.artistBio=text_(pub.bio,700);release.artistLinks=(pub.links||[]).filter(l=>safeUrl_(l.url)).slice(0,6);}}const posts=[];for(const profile of rows_('Perfiles')){const user=rows_('Usuarios').find(u=>u.id===profile.user_id&&u.status==='active');if(!user||effectivePlan_(user)!=='curator')continue;const shelf=parse_(profile.data_json,{});for(const post of shelf.recommendations||[])if(catalog.some(r=>r.id===post.releaseId))posts.push({...post,author:user.name,isTest:bool_(user.is_test)});}return {capabilities:{publicArtistProfiles:true},catalog,communityPosts:posts.slice(-200),legalVersion:legalVersion_(),whatsapp:config_('whatsapp_number',KORA_CONFIG.whatsapp)};}
function bootstrap_(token){
  const publicData=publicData_();if(!token)return {...publicData,account:null};const {user,session}=session_(token,true);const account=account_(user);if(session.last_plan!==account.plan){addNotice_(user.id,'Tu acceso cambió','El equipo actualizó tu plan a '+account.plan+'.','plan','/cuenta');session.last_plan=account.plan;put_('Sesiones',session);}
  const own=rows_('Lanzamientos').filter(r=>r.owner_id===user.id).map(r=>({...parse_(r.data_json,{}),ownerId:r.owner_id,status:r.status}));
  const allowedIds=allReleases_().filter(r=>r.ownerId===user.id||(account.role==='scout'&&account.plan==='scout'&&r.allowScout&&r.status==='active')).map(r=>r.id);
  const events=account.needsConsent?[]:rows_('Eventos').filter(e=>allowedIds.includes(e.release_id)).slice(-10000).map(e=>({id:e.id,releaseId:e.release_id,type:e.type,at:e.at,label:e.label||undefined}));
  const notices=rows_('Notificaciones').filter(n=>n.user_id===user.id||n.user_id==='*').slice(-100).map(n=>({id:n.id,title:n.title,body:n.body,type:n.type,link:n.link,createdAt:n.created_at,readAt:n.read_at||''}));
  const requests=rows_('Solicitudes').filter(r=>r.user_id===user.id).map(r=>({id:r.id,accountId:r.user_id,plan:r.plan,at:r.created_at,status:r.status,simulated:false,reference:r.reference,amount:Number(r.amount_cop)||0,method:r.method,isTest:bool_(r.is_test)}));
  const admin=account.isAdmin?{accounts:rows_('Usuarios').length,releases:rows_('Lanzamientos').length,requests:rows_('Solicitudes').length,approvedPayments:rows_('Solicitudes').filter(r=>r.status==='approved'&&!bool_(r.is_test)).length,hiddenIds:rows_('Moderacion').filter(r=>bool_(r.hidden)).map(r=>r.release_id),catalog:allReleases_().map(publicRelease_)}:undefined;
  return {...publicData,account,shelf:account.needsConsent?null:parse_((rows_('Perfiles').find(p=>p.user_id===user.id)||{}).data_json,null),releases:account.needsConsent?[]:own,events,requests,notices,admin};
}
function cleanShelf_(input,old,user){
  input=input||{};old=old||{};const saved=(input.saved||[]).filter(x=>typeof x==='string').slice(0,500);const notes={};for(const key of Object.keys(input.notes||{}).slice(0,500))notes[text_(key,100)]=text_(input.notes[key],700);
  const collections=(input.collections||[]).slice(0,50).map(c=>({id:text_(c.id,100),name:text_(c.name,60),releaseIds:[...new Set((c.releaseIds||[]).filter(x=>typeof x==='string'))].slice(0,300)}));
  const recommendations=(input.recommendations||[]).slice(0,100).map(p=>({id:text_(p.id,100),releaseId:text_(p.releaseId,100),text:text_(p.text,700),createdAt:text_(p.createdAt,40)}));
  if(effectivePlan_(user)!=='curator'&&recommendations.some(p=>!(old.recommendations||[]).some(o=>o.id===p.id&&o.text===p.text&&o.releaseId===p.releaseId)))throw apiError_('PLAN_REQUIRED','Curador Pro es necesario para publicar recomendaciones.');
  const shortlist=(input.shortlist||[]).filter(x=>typeof x==='string').slice(0,300);if(user.role!=='scout'&&shortlist.length)throw apiError_('ROLE_REQUIRED','La selección de talento corresponde a Scout.');
  const pub=input.publicProfile||{};const publicProfile=user.role==='artist'?{bio:text_(pub.bio,700),published:pub.published===true,links:(pub.links||[]).slice(0,6).filter(l=>safeUrl_(l.url)&&text_(l.label,40)).map(l=>({label:text_(l.label,40),url:safeUrl_(l.url)}))}:undefined;return {saved:[...new Set(saved)],notes,collections,recommendations,shortlist,...(publicProfile?{publicProfile}:{})};
}
function cleanRelease_(r,user){
  if(user.role!=='artist')throw apiError_('ROLE_REQUIRED','Esta cuenta no es de artista.');const id=text_(r.id,100);if(!/^[a-zA-Z0-9-]{10,100}$/.test(id))throw apiError_('VALIDATION','Identificador de lanzamiento inválido.');const existing=rows_('Lanzamientos').find(x=>x.id===id);if(existing&&existing.owner_id!==user.id)throw apiError_('FORBIDDEN','No puedes editar otro lanzamiento.');
  const playback=['bandcamp','file','link'].includes(r.playback)?r.playback:'link';const officialUrl=safeUrl_(r.officialUrl);const title=text_(r.title,120),artist=text_(r.artist,100),story=text_(r.story,1200),genre=text_(r.genre,60),evidence=text_(r.rightsEvidence,1000);
  if(!title||!artist||!story||!genre||!evidence)throw apiError_('VALIDATION','Completa título, artista, historia, género y autorización.');if(playback!=='file'&&!officialUrl)throw apiError_('VALIDATION','Añade un enlace oficial HTTPS.');
  if(playback==='bandcamp'&&(!/^\d+$/.test(String(r.embedId))||!['album','track'].includes(r.embedType)))throw apiError_('VALIDATION','Reproductor oficial inválido.');
  const audioKey=mediaKeyAllowed_(r.audioKey,user.id,'audio');const coverKey=mediaKeyAllowed_(r.coverKey,user.id,'image');if(playback==='file'&&!audioKey)throw apiError_('VALIDATION','Carga el audio autorizado en la prueba compartida.');
  const links=(r.links||[]).slice(0,6).filter(l=>safeUrl_(l.url)).map(l=>({label:text_(l.label,40),url:safeUrl_(l.url)}));return {id,slug:existing?parse_(existing.data_json,{}).slug:'r-'+id,artistId:'a-'+user.id,artist,title,city:text_(r.city,70)||'Cali',genre,story,kind:r.kind==='album'?'album':'single',color:/^#[0-9a-f]{6}$/i.test(r.color)?r.color:'#F1871C',art:Math.min(5,Math.max(0,Number(r.art)||0)),officialUrl,links,playback,audioKey,coverKey,embedType:playback==='bandcamp'?r.embedType:undefined,embedId:playback==='bandcamp'?String(r.embedId):undefined,ownerId:user.id,status:['draft','active','archived'].includes(r.status)?r.status:'draft',rights:'artist-declaration',rightsEvidence:evidence,sourceUrl:officialUrl,verifiedAt:now_(),allowScout:r.allowScout===true,createdAt:existing?parse_(existing.data_json,{}).createdAt:now_()};
}
function mediaKeyAllowed_(key,ownerId,type){if(!key)return undefined;const media=rows_('Media').find(m=>'drive:'+m.id===key&&m.owner_id===ownerId&&String(m.mime).startsWith(type+'/'));if(!media)throw apiError_('FORBIDDEN','Archivo no autorizado para esta cuenta.');return key;}
function saveBundle_(token,args){
  const {user}=session_(token,false);rate_('save:'+user.id,60,60);
  const previous=rows_('Perfiles').find(p=>p.user_id===user.id);const shelf=cleanShelf_(args.shelf,parse_(previous&&previous.data_json,{}),user);
  const incoming=(args.releases||[]).slice(0,30).map(r=>cleanRelease_(r,user));const active=incoming.filter(r=>r.status==='active').length;const limit=effectivePlan_(user)==='kit'?1:5;const access=['artist','kit'].includes(effectivePlan_(user))||(user.trial_started_at&&Date.parse(user.trial_started_at)+7*86400000>Date.now());
  const previousActive=rows_('Lanzamientos').filter(r=>r.owner_id===user.id&&r.status==='active').map(r=>r.id);
  if(active>limit)throw apiError_('LIMIT_REACHED','Tu plan permite '+limit+' lanzamientos activos.');if(!access&&incoming.some(r=>r.status==='active'&&!previousActive.includes(r.id)))throw apiError_('PLAN_REQUIRED','La prueba terminó. Guarda un borrador o solicita activación.');
  if(effectivePlan_(user)==='kit'){
    const prior=parse_(previous&&previous.data_json,{});
    const bound=prior.kitReleaseId||previousActive[0]||(incoming.find(r=>r.status==='active')||{}).id;
    if(bound&&incoming.some(r=>r.status==='active'&&r.id!==bound))throw apiError_('KIT_RELEASE_BOUND','Este Launch Kit pertenece a otro lanzamiento. Edita esa página o solicita otro kit.');
    if(bound)shelf.kitReleaseId=bound;
  }else{const prior=parse_(previous&&previous.data_json,{});if(prior.kitReleaseId)shelf.kitReleaseId=prior.kitReleaseId;}
  if(args.profile){user.name=text_(args.profile.name,80)||user.name;user.bio=text_(args.profile.bio,700);put_('Usuarios',user);}
  put_('Perfiles',{...(previous||{}),user_id:user.id,data_json:JSON.stringify(shelf),updated_at:now_()});
  for(const release of incoming){const old=rows_('Lanzamientos').find(r=>r.id===release.id);put_('Lanzamientos',{...(old||{}),id:release.id,owner_id:user.id,data_json:JSON.stringify(release),status:release.status,updated_at:now_()});}
  return {saved:true};
}
function uploadMedia_(token,args){const {user}=session_(token,false);if(user.role!=='artist')throw apiError_('ROLE_REQUIRED','Solo los artistas cargan archivos.');rate_('upload:'+user.id,20,3600);const mime=text_(args.mime,80);if(!/^(audio\/(mpeg|mp3|wav|x-wav|ogg|mp4|flac)|image\/(png|jpeg|webp))$/.test(mime))throw apiError_('VALIDATION','Formato de archivo no admitido.');const bytes=Utilities.base64Decode(String(args.base64||''));if(bytes.length>(mime.startsWith('audio/')?5:2)*1024*1024)throw apiError_('VALIDATION','El archivo supera el límite permitido.');const props=PropertiesService.getScriptProperties();const folderId=props.getProperty('MEDIA_FOLDER_ID');if(!folderId)throw apiError_('SETUP_REQUIRED','Ejecuta configurarKORlambda en Apps Script antes de cargar archivos.');const file=DriveApp.getFolderById(folderId).createFile(Utilities.newBlob(bytes,mime,text_(args.name,100)||'archivo'));put_('Media',{id:file.getId(),owner_id:user.id,mime,name:text_(args.name,100),size:bytes.length,created_at:now_()});return {key:'drive:'+file.getId()};}
function getMedia_(token,args){const key=text_(args.key,150);const record=rows_('Media').find(m=>'drive:'+m.id===key);if(!record)throw apiError_('NOT_FOUND','Archivo no disponible.');let owner=false;if(token){try{owner=session_(token,true).user.id===record.owner_id;}catch(_){}}
  if(!owner&&!publicData_().catalog.some(r=>r.audioKey===key||r.coverKey===key))throw apiError_('FORBIDDEN','Este archivo es privado.');rate_('media:'+record.id,100,60);return {mime:record.mime,base64:Utilities.base64Encode(DriveApp.getFileById(record.id).getBlob().getBytes())};}
function handleKora_(payload){
  koraBooks_={};koraRows_={};const action=text_(payload&&payload.action,50);const args=payload&&payload.args||{};const token=text_(payload&&payload.token,150);const requestId=text_(payload&&payload.requestId,100);const publicActions=['health','public.catalog','media.get'];const lock=LockService.getScriptLock();let held=false;
  try {
    if(!publicActions.includes(action)){lock.waitLock(25000);held=true;}
    const cache=CacheService.getScriptCache();const cacheKey=requestId?'request:'+sha_(action+token+requestId):'';if(cacheKey){const cached=cache.get(cacheKey);if(cached){if(token&&!action.startsWith('auth.'))session_(token,true);return parse_(cached,{});}}
    let result;
    switch(action){
      case 'health':result={version:'2.1.0',environment:'shared-test',storage:'google-sheets',legalVersion:legalVersion_()};break;
      case 'public.catalog':result=publicData_();break;
      case 'auth.challenge':{
        const email=email_(args.email);rate_('challenge:'+email,10,300);const user=rows_('Usuarios').find(u=>u.email===email);const challengeId=id_();const nonce=id_()+id_();cache.put('challenge:'+challengeId,JSON.stringify({email,nonce}),120);result={challengeId,nonce,salt:user?user.password_salt:sha_(id_()).slice(0,32),iterations:210000};break;
      }
      case 'auth.login':{
        const challengeId=text_(args.challengeId,100);const challenge=parse_(cache.get('challenge:'+challengeId),null);cache.remove('challenge:'+challengeId);if(!challenge)throw apiError_('AUTH_FAILED','El acceso no pudo verificarse. Vuelve a intentarlo.');rate_('login:'+challenge.email,6,300);const user=rows_('Usuarios').find(u=>u.email===challenge.email);const expected=user?hmac_(challengeId+'.'+challenge.nonce+'.'+challenge.email,user.password_hash):sha_(id_());if(!user||!equal_(expected,text_(args.proof,100)))throw apiError_('AUTH_FAILED','El correo o la contraseña no coinciden.');if(user.status!=='active')throw apiError_('ACCOUNT_INACTIVE','La cuenta está inactiva. Contacta al equipo KORΛ.');result=startSession_(user);break;
      }
      case 'auth.register':{
        if(config_('registration_open','TRUE')!=='TRUE')throw apiError_('REGISTRATION_CLOSED','El registro está cerrado temporalmente.');rate_('registrations',50,3600);const email=email_(args.email);if(rows_('Usuarios').some(u=>u.email===email))throw apiError_('DUPLICATE_EMAIL','Ya existe una cuenta con ese correo.');if(rows_('Usuarios').length>=500)throw apiError_('LIMIT_REACHED','La prueba alcanzó su cupo de cuentas.');if(!['explorer','artist','scout'].includes(args.role)||!/^[a-f0-9]{32}$/.test(String(args.salt))||!/^[a-f0-9]{64}$/.test(String(args.hash)))throw apiError_('VALIDATION','Datos de acceso inválidos.');const user={id:id_(),name:text_(args.name,80),email,role:args.role,status:'active',premium:false,plan:'free',plan_until:'',is_admin:false,is_test:false,created_at:now_(),trial_started_at:args.role==='artist'?now_():'',terms_version:'',terms_at:'',privacy_at:'',password_salt:args.salt,password_hash:args.hash,bio:''};if(!user.name)throw apiError_('VALIDATION','Escribe tu nombre.');put_('Usuarios',user);addNotice_(user.id,'Ya eres parte de la escena','Tu cuenta está creada. Acepta los términos para comenzar.','welcome');result=startSession_(user);break;
      }
      case 'auth.logout':{const s=rows_('Sesiones').find(s=>equal_(s.token_hash,sha_(token)));if(s){s.status='revoked';put_('Sesiones',s);}result={loggedOut:true};break;}
      case 'bootstrap':result=bootstrap_(token);break;
      case 'consent.accept':{const {user}=session_(token,true);if(args.version!==legalVersion_()||args.terms!==true||args.privacy!==true)throw apiError_('VALIDATION','Confirma términos y privacidad vigentes.');user.terms_version=legalVersion_();user.terms_at=now_();user.privacy_at=now_();put_('Usuarios',user);result={account:account_(user)};break;}
      case 'bundle.save':result=saveBundle_(token,args);break;
      case 'notice.read':{const {user}=session_(token,true);const row=rows_('Notificaciones').find(n=>n.id===args.id&&n.user_id===user.id);if(row){row.read_at=now_();put_('Notificaciones',row);}result={read:true};break;}
      case 'order.create':{const {user}=session_(token,false);const allowed=user.role==='artist'?['artist','kit']:user.role==='scout'?['scout']:['curator'];if(!allowed.includes(args.plan))throw apiError_('PLAN_REQUIRED','Elige un plan de tu perfil.');rate_('orders:'+user.id,6,3600);const order={id:id_(),user_id:user.id,plan:args.plan,amount_cop:KORA_PLANS[args.plan],method:args.method==='cash'?'cash':'transfer',status:'pending',created_at:now_(),reference:'KORΛ-'+id_().slice(0,8).toUpperCase(),is_test:bool_(user.is_test)};put_('Solicitudes',order);addNotice_(user.id,'Solicitud registrada','Tu referencia es '+order.reference+'. El acceso cambia cuando el equipo lo active.','order','/planes');result={id:order.id,accountId:user.id,plan:order.plan,amount:order.amount_cop,method:order.method,status:'pending',at:order.created_at,reference:order.reference,isTest:order.is_test};break;}
      case 'waitlist.join':{const {user}=session_(token,false);if(args.consent!==true)throw apiError_('CONSENT_REQUIRED','Autoriza recibir información del proyecto.');const existing=rows_('Espera').find(r=>r.user_id===user.id);if(!existing)put_('Espera',{id:id_(),user_id:user.id,email:user.email,created_at:now_(),consent_at:now_(),status:'subscribed'});result={subscribed:true};break;}
      case 'metric.record':{const {user}=session_(token,false);if(args.consent!==true)throw apiError_('CONSENT_REQUIRED','Falta autorización de medición.');if(!['page_view','outbound_click','embed_open','audio_play'].includes(args.type))throw apiError_('VALIDATION','Evento inválido.');rate_('events:'+user.id,60,60);const release=publicData_().catalog.find(r=>r.id===args.releaseId);if(!release)throw apiError_('NOT_FOUND','Lanzamiento no disponible.');put_('Eventos',{id:id_(),release_id:release.id,owner_id:release.ownerId||'',type:args.type,at:now_(),label:text_(args.label,80)});result={recorded:true};break;}
      case 'metrics.clear':{const {user}=session_(token,false);removeWhere_('Eventos',row=>row.owner_id===user.id);result={cleared:true};break;}
      case 'media.upload':result=uploadMedia_(token,args);break;
      case 'media.get':result=getMedia_(token,args);break;
      case 'media.delete':{const {user}=session_(token,false);for(const key of (args.keys||[]).slice(0,50)){const row=rows_('Media').find(m=>'drive:'+m.id===key&&m.owner_id===user.id);if(row){DriveApp.getFileById(row.id).setTrashed(true);removeWhere_('Media',m=>m.id===row.id);}}result={deleted:true};break;}
      case 'admin.hide':{const {user}=session_(token,false);if(!bool_(user.is_admin))throw apiError_('FORBIDDEN','Acceso administrativo requerido.');const old=rows_('Moderacion').find(r=>r.release_id===args.id);put_('Moderacion',{...(old||{}),release_id:text_(args.id,100),hidden:args.hidden===true,updated_at:now_()});result={updated:true};break;}
      case 'account.delete':{const {user}=session_(token,false);if(args.confirm!=='ELIMINAR')throw apiError_('VALIDATION','Confirma la eliminación.');for(const media of rows_('Media').filter(m=>m.owner_id===user.id))DriveApp.getFileById(media.id).setTrashed(true);const owned=rows_('Lanzamientos').filter(r=>r.owner_id===user.id).map(r=>r.id);removeWhere_('Eventos',row=>row.owner_id===user.id);removeWhere_('Moderacion',row=>owned.includes(row.release_id));removeWhere_('Solicitudes',row=>row.user_id===user.id);for(const [table,key]of [['Usuarios','id'],['Perfiles','user_id'],['Sesiones','user_id'],['Lanzamientos','owner_id'],['Media','owner_id'],['Notificaciones','user_id'],['Espera','user_id']])removeWhere_(table,row=>row[key]===user.id);result={deleted:true};break;}
      default:throw apiError_('NOT_FOUND','Operación no disponible.');
    }
    const response={ok:true,data:result};if(cacheKey&&JSON.stringify(response).length<80000)cache.put(cacheKey,JSON.stringify(response),120);return response;
  }catch(error){return failure_(error);}finally{if(held)lock.releaseLock();}
}
