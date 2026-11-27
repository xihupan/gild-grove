const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..') + path.sep;
const source = fs.readFileSync(root+'script.js','utf8');
const variants = fs.readFileSync(root+'assets/products/graduation-keychain-2027/options.js','utf8');
const inquiryMarkup = fs.readFileSync(root+'index.html','utf8').match(/<select[^>]*id="interest"[^>]*>([\s\S]*?)<\/select>/)[1];
const inquiryValues = Array.from(inquiryMarkup.matchAll(/<option value="([^"]*)"/g), match => match[1].replaceAll('&amp;', '&'));

function element(extra={}) {
  return Object.assign({value:'',textContent:'',hidden:false,disabled:false,dataset:{},listeners:{},
    addEventListener(type,fn){this.listeners[type]=fn;},setAttribute(){},removeAttribute(){},
    append(){},focus(){},scrollIntoView(){},querySelectorAll(){return[];}
  },extra);
}
function setup({query='',analytics='present',fetchImpl=async()=>({ok:true}),valid=true}={}) {
  const calls=[],events=[],history={state:null,replaceState(state){this.state=state;}};
  const interest=element({options:inquiryValues.map(value=>({value}))});
  const picker=element(), context=element(), wrapper=element(), summary=element();
  const fields=['variant_color','variant_design','variant_year','product_details'].map(name=>element({name}));
  const submit=element(),label=element({textContent:'Send wholesale inquiry'}),subject=element(),status=element();
  const form=element({action:'https://formspree.io/f/mrpbgwan',checkValidity:()=>valid,reportValidity(){this.invalid=true;},reset(){interest.value='';picker.value='';},querySelector(selector){return {'[type=submit]':submit,'[data-submit-label]':label,'[name=_subject]':subject}[selector]||null;}});
  const selectors={'#interest':interest,'#product-context':context,'#keychain-variant':picker,'#keychain-inquiry-options':wrapper,'#keychain-inquiry-summary':summary,'[data-inquiry-form]':form,'[data-form-status]':status};
  const document={listeners:{},querySelector:s=>selectors[s]||null,querySelectorAll:s=>s==='[data-keychain-field]'?fields:[],addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);},createElement:()=>element()};
  const window={listeners:{},addEventListener(type,fn){this.listeners[type]=fn;}};
  if(analytics!=='absent')window.gtag=(...args)=>{if(analytics==='throw')throw Error('analytics offline');events.push(args);};
  const url=new URL('https://www.gildngrove.com/'+query);
  const location={search:url.search,href:url.href,origin:url.origin};
  const sandbox={document,window,history,location,URL,URLSearchParams,AbortController,setTimeout,clearTimeout,FormData:class{constructor(input){this.input=input;this.values={interest:interest.value,_subject:subject.value};if(!picker.disabled)this.values.variant=picker.value;for(const field of fields)if(!field.disabled)this.values[field.name]=field.value;}},fetch:async(...args)=>{calls.push(args);return fetchImpl(...args);}};
  vm.createContext(sandbox);vm.runInContext(variants,sandbox);vm.runInContext(source,sandbox);
  document.listeners.DOMContentLoaded[0]();
  return {interest,picker,fields,context,form,status,submit,label,subject,events,calls,document,history,window,submitForm:()=>form.listeners.submit({preventDefault(){}})};
}

(async()=>{
  let cases=0;
  let s=setup({query:'?product=Coffee%20Crow%20Building%20Block%20Set'});
  assert.equal(s.interest.value,'Coffee Crow Building Block Set');await s.submitForm();
  assert.equal(s.status.dataset.state,'success');assert.equal(s.calls.length,1);
  assert.equal(s.events[0][1],'generate_lead');assert.equal(s.events[0][2].product_name,'Coffee Crow Building Block Set');
  assert.deepEqual(Object.keys(s.events[0][2]).sort(),['method','product_name']);assert.equal(s.submit.disabled,false);cases++;

  s=setup({fetchImpl:async()=>({ok:false})});await s.submitForm();assert.equal(s.status.dataset.state,'error');assert.equal(s.events.length,0);cases++;
  s=setup({fetchImpl:async()=>{throw Error('network');}});await s.submitForm();assert.equal(s.status.dataset.state,'error');assert.equal(s.events.length,0);cases++;
  s=setup({valid:false});await s.submitForm();assert.equal(s.calls.length,0);assert.equal(s.events.length,0);assert.equal(s.form.invalid,true);cases++;

  let release;s=setup({fetchImpl:()=>new Promise(resolve=>{release=resolve;})});
  const first=s.submitForm();await s.submitForm();assert.equal(s.calls.length,1);assert.equal(s.submit.disabled,true);release({ok:true});await first;assert.equal(s.events.length,1);cases++;
  for(const analytics of ['absent','throw']){s=setup({analytics});await s.submitForm();assert.equal(s.status.dataset.state,'success');assert.equal(s.submit.disabled,false);cases++;}

  s=setup({query:'?product=2027%20Graduation%20Keychain&variant=rose-gold-d'});
  assert.equal(s.picker.value,'rose-gold-d');assert.equal(s.fields.find(f=>f.name==='variant_year').value,'2027');
  await s.submitForm();assert.equal(s.events[0][2].variant_id,'rose-gold-d');cases++;
  s=setup({query:'?product=2027%20Graduation%20Keychain&variant=not-a-variant'});assert.equal(s.picker.value,'');assert.match(s.context.textContent,/not recognized/);await s.submitForm();assert.equal('variant_id' in s.events[0][2],false);cases++;
  s=setup({query:'?product=2027%20Graduation%20Keychain&variant=gold-b'});s.interest.value='Coffee Crow Building Block Set';s.interest.listeners.change();assert.equal(s.picker.value,'');assert.ok(s.fields.every(f=>f.disabled&&f.value===''));cases++;
  s=setup({query:'?product=unrecognized'});assert.equal(s.interest.value,'');assert.match(s.context.textContent,/not recognized/);cases++;

  s=setup({query:'?product=Highland%20Cow%20Squishy'});
  assert.equal(s.interest.value,'Highland Cow Squishy');assert.match(s.context.textContent,/estimated quantity and destination/);
  await s.submitForm();assert.equal(s.subject.value,'Wholesale inquiry: Highland Cow Squishy');
  assert.equal(s.calls[0][1].body.values.interest,'Highland Cow Squishy');
  assert.equal('variant_year' in s.calls[0][1].body.values,false);
  cases++;

  s=setup({query:'?product=2027%20Graduation%20Keychain&variant=rose-gold-d'});
  s.interest.value='Highland Cow Squishy';s.interest.listeners.change();
  assert.equal(s.picker.value,'');assert.ok(s.fields.every(f=>f.disabled&&f.value===''));
  await s.submitForm();assert.equal(s.calls[0][1].body.values.interest,'Highland Cow Squishy');
  assert.deepEqual(Object.keys(s.calls[0][1].body.values).sort(),['_subject','interest']);cases++;

  s=setup({query:'?product=Rose%20Highland%20Cow%20Building%20Block%20Set'});
  assert.equal(s.interest.value,'Rose Highland Cow Building Block Set');
  s.interest.value='Highland Cow Squishy';s.interest.listeners.change();s.window.listeners.popstate();
  assert.equal(s.interest.value,'Highland Cow Squishy');assert.match(s.context.textContent,/estimated quantity and destination/);cases++;

  s=setup({query:'?product=Highland%20Cow%20Squishy&variant=gold-b'});
  assert.equal(s.picker.value,'');assert.ok(s.fields.every(f=>f.disabled&&f.value===''));
  s.interest.value='Multiple products';s.interest.listeners.change();assert.match(s.context.textContent,/identify the products/);cases++;

  s=setup();const click=s.document.listeners.click[0];
  click({target:{closest:()=>({href:'mailto:sales@gildngrove.com'})}});
  click({target:{closest:()=>({href:'https://www.gildngrove.com/?product=Multiple%20products#contact'})}});
  assert.deepEqual(s.events.map(e=>e[1]),['contact_email_click','wholesale_inquiry_click']);assert.ok(s.events.every(e=>!('email' in e[2])));cases++;
  console.log(JSON.stringify({inquiry_regressions_passed:cases,live_submissions:0}));
})().catch(error=>{console.error(error);process.exitCode=1;});
