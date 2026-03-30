import { useState, useCallback, useEffect, useMemo, useRef } from "react";

var C={navy:"#0C1929",navyM:"#162236",navyL:"#1E3050",blue:"#2563EB",blueL:"#EFF4FF",blueD:"#1A47B8",blueM:"#3B72F6",green:"#16A34A",greenL:"#F0FDF4",greenD:"#166534",amber:"#D97706",amberL:"#FFFBEB",amberD:"#92400E",red:"#DC2626",redL:"#FEF2F2",redD:"#991B1B",purple:"#7C3AED",purpleL:"#F5F3FF",purpleD:"#5B21B6",gray:"#64748B",grayL:"#F8FAFC",grayM:"#E2E8F0",grayD:"#334155"};

var EXT_SECTIONS=[
  {id:"contact_info",title:"Contact Information",icon:"👤",type:"external",questions:[
    {id:"e_first_name",label:"First Name",type:"text",required:true,placeholder:"First name..."},
    {id:"e_last_name",label:"Last Name",type:"text",required:true,placeholder:"Last name..."},
    {id:"e_job_title",label:"Job Title",type:"text",required:true,placeholder:"Job title..."},
    {id:"e_email",label:"Email Address",type:"text",required:true,placeholder:"Email address..."},
  ]},
  {id:"financial_ownership",title:"Financial & Ownership Status",icon:"🏢",type:"external",questions:[
    {id:"e_platform_name",label:"Please provide your Platform name.",type:"text",required:true,placeholder:"Platform name..."},
    {id:"e_financial_accounts",label:"Please provide a copy of your most recently audited financial accounts.",type:"textarea",required:false,placeholder:"Reference or describe your most recently audited financial accounts..."},
    {id:"e_ownership_structure",label:"Please provide an overview of your ownership structure, including ultimate beneficial owners (UBOs), and confirm whether any changes have occurred within the last 12 months.",type:"textarea",required:true,placeholder:"Describe ownership structure, UBOs, and any changes in the last 12 months..."},
    {id:"e_fca_ref",label:"FCA reference number.",type:"text",required:true,placeholder:"e.g. 123456"},
    {id:"e_companies_house",label:"Companies House Registration Number.",type:"text",required:false,placeholder:"e.g. 12345678"},
  ]},
  {id:"regulatory_compliance",title:"Regulatory & Compliance",icon:"📋",type:"external",questions:[
    {id:"e_aml_kyc",label:"Please describe your Anti-Money Laundering (AML) and Know Your Customer (KYC) framework, including onboarding procedures, ongoing monitoring, sanctions screening, and the systems used to support these processes.",type:"textarea",required:true,placeholder:"Describe AML/KYC framework, onboarding, monitoring, sanctions screening, and systems..."},
    {id:"e_transaction_monitoring",label:"Please confirm your transaction monitoring process.",type:"textarea",required:true,placeholder:"Describe your transaction monitoring process..."},
    {id:"e_aml_procedures",label:"Please provide a copy of your AML procedures.",type:"textarea",required:false,placeholder:"Reference or describe your AML procedures..."},
    {id:"e_mlro",label:"Who is the Money Laundering Reporting Officer (MLRO)?",type:"text",required:true,placeholder:"Name and contact details of MLRO..."},
    {id:"e_gdpr",label:"How does your organisation ensure compliance with GDPR and Data Protection?",type:"textarea",required:true,placeholder:"Describe GDPR and Data Protection compliance approach..."},
    {id:"e_dpo",label:"Who is your Data Protection Officer (DPO)?",type:"text",required:true,placeholder:"Name and contact details of DPO..."},
    {id:"e_reg_breaches",label:"Have there been any material regulatory breaches, reportable incidents, or notifications made to the FCA within the last 12 months?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_fca_visit_date",label:"What was the date of your last formal FCA Supervisory Visit or Portfolio Letter review?",type:"date",required:true},
    {id:"e_planned_changes",label:"Is there anything planned over the next 12 months that could impact the service that you offer to Timeline or retail clients?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_pad_policy",label:"Do you have a Personal Account Dealing and Insider Trading policy?",type:"radio",required:true,options:["Yes","No"]},
  ]},
  {id:"consumer_duty",title:"Consumer Duty & Vulnerable Customers",icon:"🛡️",type:"external",questions:[
    {id:"e_consumer_duty_report",label:"Have you completed a Consumer Duty assessment report annually, with sign-off by the Board?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_fair_value",label:"Do you perform regular fair value and target market assessments, at least annually?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_vulnerable_customers",label:"Does your firm have processes in place for identifying, monitoring, and supporting customers in vulnerable circumstances?",type:"radio",required:true,options:["Yes","No","Other"]},
  ]},
  {id:"custody_assets",title:"Custody & Assets",icon:"🔐",type:"external",questions:[
    {id:"e_custodian",label:"Please provide the name of your custodian.",type:"text",required:true,placeholder:"Custodian name..."},
    {id:"e_cass_policy",label:"Please provide a copy of your CASS policy.",type:"textarea",required:false,placeholder:"Reference or describe your CASS policy..."},
    {id:"e_cass_audit",label:"Please summarise any material findings from your most recent CASS audit, including remediation actions taken.",type:"textarea",required:true,placeholder:"Summarise CASS audit findings and remediation actions..."},
    {id:"e_reconciliation_freq",label:"How frequently are client money and asset reconciliations performed?",type:"radio",required:true,options:["Daily","Weekly","Monthly","Quarterly","Annually","Other"]},
    {id:"e_pii",label:"Provide details of your professional indemnity insurance, including coverage limits and any material claims in the last three years.",type:"textarea",required:true,placeholder:"Describe PI insurance coverage, limits, and any material claims..."},
    {id:"e_best_execution",label:"Please provide a copy of your Best Execution Policy.",type:"textarea",required:false,placeholder:"Reference or describe your Best Execution Policy..."},
  ]},
  {id:"technology_security",title:"Technology & Security",icon:"🔒",type:"external",questions:[
    {id:"e_cyber_framework",label:"What cybersecurity framework do you follow (e.g. ISO 27001, SOC Type 2)?",type:"text",required:true,placeholder:"e.g. ISO 27001, SOC Type 2..."},
    {id:"e_bcp_dr",label:"Provide an overview of your Business Continuity Plan (BCP) and Disaster Recovery (DR) procedures. When was the last full BCP/DR test conducted, and what were the outcomes?",type:"textarea",required:true,placeholder:"Describe BCP/DR procedures, last test date, and outcomes..."},
    {id:"e_data_encryption",label:"How is client data encrypted, stored, and segregated?",type:"textarea",required:true,placeholder:"Describe data encryption, storage, and segregation approach..."},
    {id:"e_data_breaches",label:"Have there been any data breaches, operational or cybersecurity incidents, or material IT service disruptions in the last 12 months?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_pen_test",label:"When was your last penetration test? Please confirm any material findings.",type:"textarea",required:true,placeholder:"State date of last penetration test and summarise material findings..."},
  ]},
  {id:"outsourcing_tprm",title:"Outsourcing & Third Party Risk",icon:"⚙️",type:"external",questions:[
    {id:"e_outsourcing_policy",label:"Please provide a copy of your Outsourcing policy.",type:"textarea",required:false,placeholder:"Reference or describe your Outsourcing policy..."},
    {id:"e_outsourcing_arrangements",label:"Please identify any material or critical outsourcing arrangements supporting platform services.",type:"textarea",required:true,placeholder:"List all material and critical outsourcing arrangements..."},
    {id:"e_tprm_monitoring",label:"How are third-party providers monitored and reviewed?",type:"textarea",required:true,placeholder:"Describe third-party monitoring and review processes..."},
    {id:"e_outsourcing_failures",label:"Have there been any material failures or disruptions involving outsourced providers in the past 12 months?",type:"radio",required:true,options:["Yes","No"]},
  ]},
  {id:"risk_management",title:"Risk Management & Operational Controls",icon:"⚠️",type:"external",questions:[
    {id:"e_complaints",label:"Please describe your complaints handling process and provide a summary of complaint volumes, key complaint themes, and average resolution times over the past 12 months.",type:"textarea",required:true,placeholder:"Describe complaints handling process and provide 12-month summary..."},
  ]},
  {id:"investment_operations",title:"Investment Operations",icon:"📈",type:"external",questions:[
    {id:"e_risk_framework",label:"Please provide a copy of your Risk Framework, showing how you identify, quantify, manage and mitigate risks.",type:"textarea",required:true,placeholder:"Reference or describe your Risk Framework..."},
    {id:"e_dedicated_contact",label:"Does Timeline have a dedicated platform contact?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_dfm_rebalance_level",label:"Can DFMs rebalance at individual model and individual range level?",type:"radio",required:true,options:["Model (e.g. Timeline Tracker)","Range (e.g. Timeline Tracker 50)","No, adviser only"]},
    {id:"e_post_trade_reports",label:"Can DFMs access post-trade reports for reconciliation?",type:"radio",required:true,options:["Platform download","Ad-hoc only","No, adviser only"]},
    {id:"e_sla_email",label:"What is the SLA for an email query, including ad-hoc report requests?",type:"radio",required:true,options:["1–3 days","1 week","2 weeks – escalation point when SLA not met"]},
    {id:"e_adhoc_reporting",label:"Can DFMs access other ad-hoc reporting? (Fees, transactions, account details)",type:"radio",required:true,options:["Platform download","Ad-hoc only","No, adviser only"]},
    {id:"e_exclude_wrappers",label:"Can DFMs exclude wrappers from template rebalances?",type:"radio",required:true,options:["Yes","No, adviser only","No"]},
    {id:"e_delink_process",label:"If no, does delinking a wrapper sell institutional share classes? Explain the process.",type:"textarea",required:false,placeholder:"Explain delinking process and impact on institutional share classes...",showWhen:function(fd){return fd.e_exclude_wrappers==="No, adviser only"||fd.e_exclude_wrappers==="No";}},
    {id:"e_wrapper_rebalance",label:"Can DFMs rebalance at individual wrapper level?",type:"radio",required:true,options:["Yes","No, adviser only","No, neither DFM or adviser"]},
    {id:"e_spreadsheet_upload",label:"Does your UI support spreadsheet uploads for model building and editing?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_second_user_auth",label:"Do model edits and rebalance require authorisation by a second user?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_divestment_settings",label:"Can DFMs set the divestment settings?",type:"radio",required:true,options:["Yes","No, adviser only","No, neither DFM or adviser"]},
    {id:"e_share_class_conversion",label:"Does the platform support DFM Share Class Conversion submissions?",type:"radio",required:true,options:["Yes","No, adviser only","No, neither DFM or adviser"]},
    {id:"e_fund_switch",label:"Does the platform support DFM Fund Switch submissions?",type:"radio",required:true,options:["Yes","No, adviser only","No, neither DFM or adviser"]},
    {id:"e_sell_individual_holdings",label:"Can DFMs sell individual portfolio holdings not common to the model template without triggering a rebalance?",type:"radio",required:true,options:["Yes","No, adviser only","No, neither DFM or adviser"]},
    {id:"e_zero_cash_models",label:"Does the platform support models with 0% cash?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_login_entitlements",label:"Can DFMs access different login entitlement for users?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_login_entitlements_detail",label:"If yes, briefly describe the different entitlements.",type:"textarea",required:false,placeholder:"Describe the different login entitlements available...",showWhen:function(fd){return fd.e_login_entitlements==="Yes";}},
    {id:"e_remove_users",label:"Can DFMs remove users?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_remove_users_detail",label:"If yes, briefly describe how.",type:"textarea",required:false,placeholder:"Describe the user removal process...",showWhen:function(fd){return fd.e_remove_users==="Yes";}},
    {id:"e_bespoke_models",label:"Does the platform support bespoke DFM models?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_api_integrations",label:"Does the platform support API integrations?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_api_firms",label:"If yes, how many firms use the integration?",type:"textarea",required:false,placeholder:"State number of firms currently using the API integration...",showWhen:function(fd){return fd.e_api_integrations==="Yes";}},
    {id:"e_dfm_fees_per_firm",label:"Does the platform support different DFM fees for different advice firms?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_model_access_required",label:"Are DFMs required to provide firms model access?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_model_access_detail",label:"If yes, please state how DFMs link adviser firms to models.",type:"textarea",required:false,placeholder:"Describe how DFMs link adviser firms to models...",showWhen:function(fd){return fd.e_model_access_required==="Yes";}},
    {id:"e_smart_switching",label:"Does the platform support smart portfolio switching?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_sell_fund_holdings",label:"Does the platform support selling individual fund holdings rather than a full rebalance?",type:"radio",required:true,options:["Yes","No, adviser only","No"]},
    {id:"e_cash_contributions",label:"Are ad-hoc cash contributions invested at template allocation?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_sales_proportional",label:"Are sales sold down proportional to the template allocation?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_ringfencing",label:"Does the platform support cash or asset ringfencing?",type:"radio",required:true,options:["Yes","No"]},
  ]},
  {id:"trading_operations",title:"Trading Operations",icon:"💹",type:"external",questions:[
    {id:"e_bulk_trade",label:"Does the platform bulk trade?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_dilution_levies",label:"Are there dilution levies on fund trades?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_dilution_detail",label:"If yes, please state at what level.",type:"textarea",required:false,placeholder:"Describe dilution levy levels...",showWhen:function(fd){return fd.e_dilution_levies==="Yes";}},
    {id:"e_trading_charges",label:"Does the platform have platform charges for trading?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_trading_charges_detail",label:"If yes, please state.",type:"textarea",required:false,placeholder:"Describe trading charges...",showWhen:function(fd){return fd.e_trading_charges==="Yes";}},
    {id:"e_dealing_point",label:"Does the platform have a dealing point time?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_dealing_point_detail",label:"If yes, please state.",type:"textarea",required:false,placeholder:"State dealing point time...",showWhen:function(fd){return fd.e_dealing_point==="Yes";}},
    {id:"e_daily_cutoff",label:"Does the platform have a daily cut off time for trading?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_daily_cutoff_detail",label:"If yes, please state.",type:"textarea",required:false,placeholder:"State daily cut off time for trading...",showWhen:function(fd){return fd.e_daily_cutoff==="Yes";}},
    {id:"e_trading_reconciliation",label:"Does the platform have a trading reconciliation policy?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_trading_reconciliation_detail",label:"If yes, please state.",type:"textarea",required:false,placeholder:"Describe trading reconciliation policy...",showWhen:function(fd){return fd.e_trading_reconciliation==="Yes";}},
    {id:"e_vat",label:"Is VAT applicable?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_initial_charge",label:"Does the platform have an initial charge?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_initial_charge_detail",label:"If yes, please state.",type:"textarea",required:false,placeholder:"Describe initial charge...",showWhen:function(fd){return fd.e_initial_charge==="Yes";}},
    {id:"e_custody_charge",label:"Does the platform have a custody charge?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_custody_charge_detail",label:"If yes, please state.",type:"textarea",required:false,placeholder:"Describe custody charge...",showWhen:function(fd){return fd.e_custody_charge==="Yes";}},
    {id:"e_admin_charges",label:"Does the platform have other admin charges?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_admin_charges_detail",label:"If yes, please state.",type:"textarea",required:false,placeholder:"Describe other admin charges...",showWhen:function(fd){return fd.e_admin_charges==="Yes";}},
    {id:"e_distribution_fee",label:"Does the platform have a distribution fee?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_distribution_fee_detail",label:"If yes, please state.",type:"textarea",required:false,placeholder:"Describe distribution fee...",showWhen:function(fd){return fd.e_distribution_fee==="Yes";}},
    {id:"e_inspecie_fee",label:"Does the platform have a fee for in-specie transfers?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_inspecie_fee_detail",label:"If yes, please state.",type:"textarea",required:false,placeholder:"Describe in-specie transfer fee...",showWhen:function(fd){return fd.e_inspecie_fee==="Yes";}},
    {id:"e_money_transfer_fees",label:"Does the platform have money transfer fees?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_money_transfer_detail",label:"If yes, please state.",type:"textarea",required:false,placeholder:"Describe money transfer fees...",showWhen:function(fd){return fd.e_money_transfer_fees==="Yes";}},
    {id:"e_family_aggregation",label:"Does the platform aggregate family portfolios for charging purposes?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_family_aggregation_detail",label:"If yes, please state.",type:"textarea",required:false,placeholder:"Describe family portfolio aggregation for charging...",showWhen:function(fd){return fd.e_family_aggregation==="Yes";}},
    {id:"e_other_charges",label:"Does the platform have any other charges on a client's portfolio?",type:"radio",required:true,options:["Yes","No"]},
    {id:"e_other_charges_detail",label:"If yes, please state.",type:"textarea",required:false,placeholder:"Describe any other charges on client portfolios...",showWhen:function(fd){return fd.e_other_charges==="Yes";}},
  ]},
  {id:"extended_comments",title:"Investment Operations – Extended Comments",icon:"📝",type:"external",questions:[
    {id:"e_failed_trades",label:"Please state the platform process for failed trades.",type:"textarea",required:true,placeholder:"Describe the platform process for handling failed trades..."},
    {id:"e_fee_schedule",label:"Please state the platform's fee schedule and methodology.",type:"textarea",required:true,placeholder:"Describe the full fee schedule and charging methodology..."},
    {id:"e_adviser_link",label:"Please state how advisers link clients to DFM models on the platform.",type:"textarea",required:true,placeholder:"Describe the process for linking clients to DFM models..."},
    {id:"e_wrapper_types",label:"Please state which wrapper types the platform supports for DFM.",type:"textarea",required:true,placeholder:"e.g. Pension, ISA, General Investment Account, Onshore Bond..."},
    {id:"e_fund_onboarding",label:"Please detail the required process for onboarding a new fund. Information such as email address, SLA for completion, required forms, and applicable wrapper types would all be useful.",type:"textarea",required:true,placeholder:"Describe the full fund onboarding process in detail..."},
    {id:"e_trading_methodology",label:"Please outline in detail the trading methodology of the platform (pre-funding, pre-dependency, contract notes etc).",type:"textarea",required:true,placeholder:"Describe the trading methodology in detail..."},
  ]},
];

var INT_SECTIONS=[
  {id:"int_provider",title:"Provider Overview (Internal)",icon:"🔍",type:"internal",questions:[
    {id:"i_tools_used",label:"What specific tools, reports, or services does Timeline currently use from this provider?",type:"textarea",required:true,placeholder:"List all tools, reports, and services actively used by Timeline..."},
  ]},
  {id:"int_suitability",title:"Suitability Assessment",icon:"✅",type:"internal",questions:[
    {id:"i_fair_value",label:"Does the tool help Timeline demonstrate fair value, suitability, and client understanding in line with Consumer Duty obligations?",type:"radio",required:true,options:["Yes","No","Partially"]},
    {id:"i_fair_value_detail",label:"Please provide supporting detail.",type:"textarea",required:false,placeholder:"Describe how the tool supports Consumer Duty compliance..."},
    {id:"i_client_base",label:"Is the tool suitable for Timeline's client base (e.g. passive MPS users, accumulation portfolios)?",type:"radio",required:true,options:["Yes","No","Partially"]},
    {id:"i_client_base_detail",label:"Please provide detail on suitability for Timeline's client base.",type:"textarea",required:false,placeholder:"Explain suitability or any limitations for specific client segments..."},
  ]},
  {id:"int_use",title:"Internal Use & Oversight",icon:"📌",type:"internal",questions:[
    {id:"i_integration",label:"How is this provider's output integrated into Timeline's due diligence processes?",type:"textarea",required:true,placeholder:"Describe how outputs are used in advice, reporting, or decision-making..."},
    {id:"i_limitations",label:"Are there any known limitations or gaps in the provider's outputs that Timeline must compensate for?",type:"textarea",required:false,placeholder:"Describe any gaps and how Timeline addresses them..."},
  ]},
  {id:"int_risk",title:"Summary & Risk Evaluation",icon:"⚠️",type:"internal",questions:[
    {id:"i_risk_rating",label:"Internal risk assessment rating",type:"select",required:true,options:["Low","Medium","High"]},
    {id:"i_rationale",label:"Summary of rationale for continued use or concerns",type:"textarea",required:true,placeholder:"Provide a clear rationale for the risk rating and any concerns identified..."},
    {id:"i_kpis",label:"What KPIs does Timeline have in place for monitoring this provider's SLAs?",type:"textarea",required:true,placeholder:"List specific KPIs, measurement frequency, and thresholds..."},
    {id:"i_actions",label:"Recommended actions or mitigations",type:"textarea",required:false,placeholder:"List specific recommended actions with owners and target dates..."},
  ]},
];

var ALL_SECTIONS=EXT_SECTIONS.concat(INT_SECTIONS);

var TRADING_REQUIRED=["e_platform_name","e_fca_ref","e_ownership_structure","e_aml_kyc","e_mlro","e_gdpr","e_custodian","e_bcp_dr","e_cyber_framework","e_complaints","e_risk_framework","i_risk_rating","i_rationale"];
var QUARTERLY_DAYS=90;
var TODAY=new Date("2026-03-23");
var ADMIN_USER="admin";
var ADMIN_PASS="dd2026";
var SK="ddh_v13";

function daysAgo(n){var d=new Date(TODAY);d.setDate(d.getDate()-n);return d.toISOString().slice(0,10);}
function daysUntil(l){if(!l)return 0;var d=new Date(l);d.setDate(d.getDate()+QUARTERLY_DAYS);return Math.ceil((d-TODAY)/86400000);}
function qDue(l){return !l||daysUntil(l)<=0;}
function daysSince(ds){return Math.floor((TODAY-new Date(ds))/86400000);}
function lsGet(k,fb){try{var v=localStorage.getItem(k);return v?JSON.parse(v):fb;}catch(e){return fb;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function isFilled(v){if(v===null||v===undefined||v==="")return false;if(typeof v==="string")return v.trim()!=="";return true;}
function isVis(q,fd){return typeof q.showWhen==="function"?q.showWhen(fd):true;}
function getVis(s,fd){return s.questions.filter(function(q){return isVis(q,fd);});}
function getReq(s,fd){return getVis(s,fd).filter(function(q){return q.required;});}

function calcStatus(fd){
  var secs=ALL_SECTIONS.map(function(s){var req=getReq(s,fd);var ans=req.filter(function(q){return isFilled(fd[q.id]);});return{id:s.id,type:s.type,required:req.length,answered:ans.length,complete:req.length>0&&ans.length===req.length};});
  var tR=secs.reduce(function(a,s){return a+s.required;},0);
  var tA=secs.reduce(function(a,s){return a+s.answered;},0);
  var extR=secs.filter(function(s){return s.type==="external";}).reduce(function(a,s){return a+s.required;},0);
  var extA=secs.filter(function(s){return s.type==="external";}).reduce(function(a,s){return a+s.answered;},0);
  var intR=secs.filter(function(s){return s.type==="internal";}).reduce(function(a,s){return a+s.required;},0);
  var intA=secs.filter(function(s){return s.type==="internal";}).reduce(function(a,s){return a+s.answered;},0);
  return{sections:secs,pct:tR>0?Math.round(tA/tR*100):0,extPct:extR>0?Math.round(extA/extR*100):0,intPct:intR>0?Math.round(intA/intR*100):0,allComplete:tR>0&&tA===tR};
}
function isReady(fd){return TRADING_REQUIRED.every(function(f){return isFilled(fd[f]);});}
function getPipelineStage(fd){if(isReady(fd))return 3;var st=calcStatus(fd);if(st.allComplete)return 2;if(st.pct>0)return 1;return 0;}
function genCode(name){var prefix=name.replace(/[^A-Z]/g,"").slice(0,3)||name.slice(0,3).toUpperCase();var num=Math.floor(1000+Math.abs(name.charCodeAt(0)*317+(name.charCodeAt(1)||0)*53)%9000);return prefix+"-DD-"+num;}

function buildCtx(companies,allData){
  var allQs=ALL_SECTIONS.reduce(function(a,s){return a.concat(s.questions);},[]);
  var out="=== TIMELINE DD HUB DATA (23 March 2026) ===\n\n";
  companies.forEach(function(c){
    var fd=allData[c.id]||{};var st=calcStatus(fd);
    out+="--- "+c.name+" ("+c.type+") ---\n";
    out+="Overall: "+st.pct+"% | External: "+st.extPct+"% | Internal: "+st.intPct+"% | Assessment: "+(isReady(fd)?"COMPLETE":"PENDING")+"\n";
    if(fd.i_risk_rating)out+="Risk rating: "+fd.i_risk_rating+"\n";
    st.sections.forEach(function(s,i){out+="  ["+ALL_SECTIONS[i].type.toUpperCase()+"] "+ALL_SECTIONS[i].title+": "+s.answered+"/"+s.required+" "+(s.complete?"[DONE]":"[INCOMPLETE]")+"\n";});
    allQs.forEach(function(q){if(isFilled(fd[q.id]))out+="  Q: "+q.label+"\n  A: "+String(fd[q.id]).slice(0,120)+"\n";});
    out+="\n";
  });
  return out;
}

function getColors(n){var p=[["#EFF4FF","#1A47B8"],["#F0FDF4","#166534"],["#F5F3FF","#5B21B6"],["#FFFBEB","#92400E"],["#FEF2F2","#991B1B"],["#F0FDF4","#166534"]];return p[n.charCodeAt(0)%p.length];}
function inits(n){return n.split(" ").map(function(w){return w[0];}).join("").slice(0,2).toUpperCase();}

var DEFAULT_COMPANIES=[
  {id:"7im",name:"7IM",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"aegon_arc",name:"Aegon Arc",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"aj_bell",name:"AJ Bell",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"aviva",name:"Aviva",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"fundment",name:"Fundment",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"fundsnetwork",name:"FundsNetwork",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"fusion",name:"Fusion",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"hubwise",name:"Hubwise",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"mg",name:"M&G",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"wealthtime",name:"Wealthtime",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"nucleus",name:"Nucleus",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"quilter",name:"Quilter",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"parmenion",name:"Parmenion",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"aberdeen",name:"Aberdeen",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"timeline",name:"Timeline",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"platform",name:"Platform",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"transact",name:"Transact",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"true_potential",name:"True Potential",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"wealthtime_classic",name:"Wealthtime Classic",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"soderberg",name:"Soderberg",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"scottish_widows",name:"Scottish Widows",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
  {id:"platform_one",name:"Platform One",type:"Platform",contactEmail:"",addedDate:daysAgo(0),sentDate:null},
];
var DEFAULT_STAGES=[
  {id:"s1",name:"Not started",desc:"Provider has not responded",triggerDays:3,minPct:0,maxPct:0,color:C.gray,bg:C.grayL,textColor:C.gray,enabled:true},
  {id:"s2",name:"Early progress",desc:"Less than 25% after 7 days",triggerDays:7,minPct:1,maxPct:24,color:C.amber,bg:C.amberL,textColor:C.amberD,enabled:true},
  {id:"s3",name:"Halfway reminder",desc:"Less than 50% after 14 days",triggerDays:14,minPct:25,maxPct:49,color:C.amber,bg:C.amberL,textColor:C.amberD,enabled:true},
  {id:"s4",name:"Almost there",desc:"Less than 75% after 21 days",triggerDays:21,minPct:50,maxPct:74,color:C.blue,bg:C.blueL,textColor:C.blueD,enabled:false},
  {id:"s5",name:"Final notice",desc:"Still incomplete after 28 days",triggerDays:28,minPct:75,maxPct:99,color:C.red,bg:C.redL,textColor:C.redD,enabled:true},
];
var PIPELINE_STAGES=[
  {id:0,label:"Not started",sub:"awaiting response",dot:C.gray,bg:C.grayL,fg:C.grayD,border:C.grayM},
  {id:1,label:"In progress",sub:"questionnaire open",dot:C.amber,bg:C.amberL,fg:C.amberD,border:C.amber},
  {id:2,label:"Complete",sub:"all sections done",dot:C.green,bg:C.greenL,fg:C.greenD,border:C.green},
  {id:3,label:"Assessment done",sub:"review finalised",dot:C.blue,bg:C.blueL,fg:C.blueD,border:C.blue},
];

function Ava(p){var c=getColors(p.name);var s=p.size||32;return <div style={{width:s,height:s,borderRadius:"50%",background:c[0],color:c[1],display:"flex",alignItems:"center",justifyContent:"center",fontSize:Math.round(s*0.35),fontWeight:700,flexShrink:0}}>{inits(p.name)}</div>;}
function Ring(p){var pct=p.pct;var s=p.size||32;var c=pct===100?C.green:pct>0?C.amber:C.grayM;var r=(s-4)/2;var ci=2*Math.PI*r;var dash=(pct/100)*ci;return <svg width={s} height={s} viewBox={"0 0 "+s+" "+s}><circle cx={s/2} cy={s/2} r={r} fill="none" stroke={C.grayM} strokeWidth="3.5"/><circle cx={s/2} cy={s/2} r={r} fill="none" stroke={c} strokeWidth="3.5" strokeDasharray={dash+" "+ci} strokeLinecap="round" transform={"rotate(-90 "+(s/2)+" "+(s/2)+")"}/>  <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize={Math.round(s*0.26)} fontWeight="700" fill={c}>{pct}</text></svg>;}
function Chip(p){var themes={green:{bg:C.greenL,fg:C.greenD,b:"#BBF7D0"},amber:{bg:C.amberL,fg:C.amberD,b:"#FDE68A"},red:{bg:C.redL,fg:C.redD,b:"#FECACA"},blue:{bg:C.blueL,fg:C.blueD,b:"#BFDBFE"},purple:{bg:C.purpleL,fg:C.purpleD,b:"#DDD6FE"},gray:{bg:C.grayL,fg:C.gray,b:C.grayM}};var t=themes[p.color||"gray"];return <span style={{fontSize:p.size||11,padding:"3px 10px",borderRadius:20,background:t.bg,color:t.fg,fontWeight:600,whiteSpace:"nowrap",border:"1px solid "+t.b}}>{p.children}</span>;}
function Dot(p){return <span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:p.complete?C.green:p.partial?C.amber:C.grayM,flexShrink:0}}/>;}
function Btn(p){var v=p.variant||"ghost";var s={primary:{bg:C.blue,fg:"white",b:"none",fw:600},secondary:{bg:C.navy,fg:"white",b:"none",fw:600},ghost:{bg:"transparent",fg:C.grayD,b:"1px solid "+C.grayM,fw:500},soft:{bg:C.grayL,fg:C.grayD,b:"1px solid "+C.grayM,fw:500},teal:{bg:C.blueL,fg:C.blueD,b:"1px solid #BFDBFE",fw:600},danger:{bg:C.redL,fg:C.redD,b:"1px solid #FECACA",fw:500},amber:{bg:C.amberL,fg:C.amberD,b:"1px solid #FDE68A",fw:500}};var m=s[v]||s.ghost;var sz=p.size||"md";var pad=sz==="sm"?"4px 12px":sz==="lg"?"12px 28px":"8px 16px";return <button type="button" onClick={p.onClick} style={{fontFamily:"inherit",cursor:"pointer",fontWeight:m.fw,borderRadius:8,outline:"none",background:m.bg,color:m.fg,border:m.b,padding:pad,fontSize:sz==="sm"?12:sz==="lg"?15:13,...(p.style||{})}}>{p.children}</button>;}
function Toggle(p){return <div onClick={function(){p.onChange(!p.on);}} style={{width:36,height:20,borderRadius:10,background:p.on?C.blue:C.grayM,cursor:"pointer",position:"relative",flexShrink:0}}><div style={{position:"absolute",top:3,left:p.on?17:3,width:14,height:14,borderRadius:"50%",background:"white",transition:"left 0.15s"}}/></div>;}
function Field(p){
  var q=p.q;var val=p.value;
  var base={width:"100%",fontSize:14,background:"white",color:C.grayD,border:p.error?"1.5px solid "+C.red:"1px solid "+C.grayM,borderRadius:8,padding:"9px 12px",outline:"none",fontFamily:"inherit",boxSizing:"border-box",lineHeight:1.5};
  if(q.type==="select")return <select id={q.id} value={val||""} onChange={function(e){p.onChange(q.id,e.target.value);}} style={{...base,height:40}}><option value="" disabled>{"Choose..."}</option>{q.options.map(function(o){return <option key={o} value={o}>{o}</option>;})}</select>;
  if(q.type==="radio")return <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:4}}>{q.options.map(function(o){var sel=val===o;return <button key={o} type="button" onClick={function(){p.onChange(q.id,o);}} style={{fontSize:13,padding:"7px 18px",borderRadius:8,border:sel?"2px solid "+C.blue:"1px solid "+C.grayM,background:sel?C.blueL:"white",color:sel?C.blueD:C.gray,cursor:"pointer",fontFamily:"inherit",fontWeight:sel?600:400}}>{o}</button>;})}</div>;
  if(q.type==="textarea")return <textarea id={q.id} value={val||""} onChange={function(e){p.onChange(q.id,e.target.value);}} placeholder={q.placeholder} rows={3} style={{...base,resize:"vertical"}}/>;
  return <input id={q.id} type={q.type==="date"?"date":"text"} value={val||""} onChange={function(e){p.onChange(q.id,e.target.value);}} placeholder={q.placeholder} style={{...base,height:40}}/>;
}

function getEmailBody(type,company,code,url){
  if(type==="initial"){return "Hi,\n\nWe're reaching out as part of Timeline's annual platform due diligence review.\n\nAs a valued platform partner, we'd like to ask you to complete a short questionnaire covering areas including regulatory compliance, custody and assets, technology and security, and investment operations. It should take around 30 to 45 minutes.\n\n• Your responses are treated in strict confidence\n• The questionnaire is aligned to FCA Consumer Duty requirements\n• Completing it promptly helps us maintain our partnership without interruption\n\nIf you have any questions, just reply to this email or contact us at compliance@timeline.co\n\nThanks in advance,\n\nThe Compliance Team\nTimeline\ncompliance@timeline.co | www.timeline.co";}
  if(type==="reminder"){return "Hi,\n\nJust a quick nudge — we haven't yet received your completed due diligence questionnaire.\n\nWe appreciate these things can slip down the list, but we do need your responses to complete our annual review. If you're able to set aside 30 minutes in the next few days, that would be really helpful.\n\nIf anything is unclear or you'd like to talk it through, feel free to get in touch at compliance@timeline.co\n\nThanks,\n\nThe Compliance Team\nTimeline\ncompliance@timeline.co | www.timeline.co";}
  if(type==="urgent"){return "Hi,\n\nThis is a final reminder regarding your outstanding due diligence questionnaire for Timeline's annual platform review.\n\nDespite previous messages, we haven't yet received your completed responses. Without them, we're unable to conclude our review — which may affect the ongoing status of our partnership.\n\nPlease complete the questionnaire within the next 3 business days.\n\nIf there's a reason for the delay, please let us know at compliance@timeline.co and we'll do our best to accommodate.\n\nThe Compliance Team\nTimeline\ncompliance@timeline.co | www.timeline.co";}
  if(type==="thankyou"){return "Hi,\n\nThank you for completing Timeline's platform due diligence questionnaire — we really appreciate you taking the time.\n\nHere's what happens next:\n\n• Our compliance team will review your responses against our DD framework\n• We may follow up with a small number of clarifying questions if needed\n• You'll hear back from us within 15 business days\n• This review will be repeated annually, or sooner if there are material changes\n\nIf you have any questions in the meantime, please don't hesitate to get in touch.\n\nThanks again,\n\nThe Compliance Team\nTimeline\ncompliance@timeline.co | www.timeline.co";}
  return "";
}

function getEmailSubject(type,company){
  if(type==="initial")return "Action required: Timeline platform due diligence questionnaire";
  if(type==="reminder")return "Quick reminder: your Timeline DD questionnaire is still outstanding";
  if(type==="urgent")return "Final notice: Timeline due diligence questionnaire — "+company.name;
  if(type==="thankyou")return "Thanks for completing our due diligence questionnaire";
  return "";
}

var EMAIL_TYPES=[
  {key:"initial",label:"Initial invitation"},
  {key:"reminder",label:"Gentle reminder"},
  {key:"urgent",label:"Final notice"},
  {key:"thankyou",label:"Completion acknowledgement"},
];

function EmailPreview(p){
  var[copied,setCopied]=useState(false);
  function copy(){navigator.clipboard.writeText(p.subject+"\n\n"+p.body).catch(function(){});setCopied(true);setTimeout(function(){setCopied(false);},1500);}
  return(
    <div>
      <div style={{background:C.navy,borderRadius:"10px 10px 0 0",padding:"16px 20px",display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:28,height:28,borderRadius:7,background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div style={{fontSize:12,fontWeight:600,color:"white"}}>{"Timeline DD Hub"}</div>
        <div style={{marginLeft:"auto",fontSize:11,color:"rgba(255,255,255,0.4)"}}>{"To: "+p.toEmail}</div>
      </div>
      <div style={{background:C.grayL,padding:"14px 20px",borderLeft:"1px solid "+C.grayM,borderRight:"1px solid "+C.grayM}}>
        <div style={{fontSize:10,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>{"Subject"}</div>
        <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{p.subject}</div>
      </div>
      <div style={{padding:"18px 20px",background:"white",border:"1px solid "+C.grayM,borderTop:"none",borderRadius:"0 0 10px 10px",maxHeight:240,overflowY:"auto"}}>
        <div style={{fontSize:13,whiteSpace:"pre-line",lineHeight:1.8,color:C.grayD}}>{p.body}</div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,marginTop:10,padding:"10px 14px",background:C.grayL,borderRadius:8,border:"1px solid "+C.grayM}}>
        <div style={{fontSize:11,color:C.gray,flex:1}}>{"Ready to copy and send via your email client"}</div>
        <Btn onClick={copy} size="sm" variant={copied?"teal":"soft"}>{copied?"Copied!":"Copy email"}</Btn>
        <Btn onClick={p.onSend} size="sm" variant="primary">{"Mark as sent"}</Btn>
      </div>
    </div>
  );
}

function SendModal(p){
  var company=p.company;
  var code=genCode(company.name);
  var url="https://dd.timeline.co/portal/"+code;
  var[tab,setTab]=useState("templates");
  var[selectedType,setSelectedType]=useState("initial");
  var[aiBody,setAiBody]=useState("");
  var[aiSubject,setAiSubject]=useState("");
  var[aiLoading,setAiLoading]=useState(false);
  var[urlCopied,setUrlCopied]=useState(false);

  function genAI(){
    setAiLoading(true);
    fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,messages:[{role:"user",content:"Write a professional due diligence invitation email from Timeline to "+company.name+" at "+company.contactEmail+". Access code: "+code+". Portal: "+url+". Keep under 180 words. Return ONLY JSON with keys subject and body (plain text, use \\n for line breaks)."}]})})
      .then(function(r){return r.json();}).then(function(d){var t=d.content.map(function(b){return b.text||"";}).join("").replace(/```json|```/g,"").trim();var parsed=JSON.parse(t);setAiSubject(parsed.subject||"");setAiBody(parsed.body||"");})
      .catch(function(){setAiSubject("Due Diligence Questionnaire - "+company.name);setAiBody("Dear "+company.name+",\n\nPlease complete our due diligence questionnaire.\n\nAccess code: "+code+"\nPortal: "+url+"\n\nKind regards,\nTimeline Compliance");})
      .finally(function(){setAiLoading(false);});
  }

  var subject=getEmailSubject(selectedType,company);
  var body=getEmailBody(selectedType,company,code,url);

  return(
    <div style={{position:"absolute",inset:0,background:"rgba(12,25,41,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:60}}>
      <div style={{background:"white",borderRadius:14,width:"min(660px,96%)",maxHeight:"92vh",display:"flex",flexDirection:"column",overflow:"hidden"}} onClick={function(e){e.stopPropagation();}}>
        <div style={{padding:"16px 20px",background:C.navy,display:"flex",alignItems:"center",gap:12}}>
          <Ava name={company.name} size={36}/>
          <div><div style={{fontSize:14,fontWeight:600,color:"white"}}>{company.name}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>{company.contactEmail}</div></div>
          <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
            {company.sentDate&&<Chip color="green">{"Sent "+new Date(company.sentDate).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</Chip>}
            <Btn onClick={p.onClose} size="sm" variant="ghost" style={{color:"white",borderColor:"rgba(255,255,255,0.2)"}}>{"Close"}</Btn>
          </div>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid "+C.grayM,background:C.grayL}}>
          {[["templates","Email templates"],["custom","AI-generated"],["portal","Portal details"]].map(function(x){return <button key={x[0]} type="button" onClick={function(){setTab(x[0]);}} style={{fontSize:13,padding:"10px 16px",border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",color:tab===x[0]?C.navy:C.gray,fontWeight:tab===x[0]?600:400,borderBottom:tab===x[0]?"2.5px solid "+C.blue:"2.5px solid transparent",marginBottom:-1}}>{x[1]}</button>;})}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"18px 20px"}}>
          {tab==="templates"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {EMAIL_TYPES.map(function(t){var active=selectedType===t.key;return(
                  <button key={t.key} type="button" onClick={function(){setSelectedType(t.key);}} style={{padding:"11px 13px",borderRadius:10,border:active?"2px solid "+C.blue:"1px solid "+C.grayM,background:active?C.blueL:"white",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                    <div style={{fontSize:13,fontWeight:600,color:active?C.blueD:C.navy}}>{t.label}</div>
                  </button>
                );})}
              </div>
              <EmailPreview subject={subject} body={body} toEmail={company.contactEmail} code={code} onSend={function(){p.onSend(company.id);}}/>
            </div>
          )}
          {tab==="custom"&&(
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div><div style={{fontSize:13,fontWeight:600,color:C.navy,marginBottom:2}}>{"AI-generated email"}</div><div style={{fontSize:12,color:C.gray}}>{"Generate a bespoke email for "+company.name}</div></div>
                <Btn onClick={genAI} variant="primary" style={{marginLeft:"auto",flexShrink:0}}>{aiLoading?"Generating...":"Generate email"}</Btn>
              </div>
              {aiBody&&<EmailPreview subject={aiSubject} body={aiBody} toEmail={company.contactEmail} code={code} onSend={function(){p.onSend(company.id);}}/>}
              {!aiBody&&<div style={{padding:"2.5rem",textAlign:"center",background:C.grayL,borderRadius:10,border:"1px dashed "+C.grayM,color:C.gray,fontSize:13}}>{"Click Generate to create a bespoke email for "+company.name}</div>}
            </div>
          )}
          {tab==="portal"&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{background:C.navy,borderRadius:12,padding:"18px 20px"}}>
                <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{"Access code"}</div>
                <div style={{fontSize:26,fontWeight:700,letterSpacing:"4px",fontFamily:"var(--font-mono)",color:C.blue,marginBottom:4}}>{code}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>{"Share with "+company.contactEmail}</div>
              </div>
              <div style={{background:C.grayL,borderRadius:10,padding:"14px 16px",border:"1px solid "+C.grayM}}>
                <div style={{fontSize:10,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>{"Portal link"}</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{fontSize:12,color:C.gray,fontFamily:"var(--font-mono)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</div>
                  <Btn onClick={function(){navigator.clipboard.writeText(url).catch(function(){});setUrlCopied(true);setTimeout(function(){setUrlCopied(false);},1500);}} size="sm" variant={urlCopied?"teal":"soft"}>{urlCopied?"Copied!":"Copy"}</Btn>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"flex-end"}}>
                <Btn onClick={p.onPreview} variant="secondary">{"Open portal preview"}</Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CompanyPortal(p){
  var[sec,setSec]=useState(0);var[errors,setErrors]=useState({});var[submitted,setSubmitted]=useState(false);
  var section=EXT_SECTIONS[sec];var visQs=getVis(section,p.formData);
  var secStatuses=EXT_SECTIONS.map(function(s){var req=getReq(s,p.formData);var ans=req.filter(function(q){return isFilled(p.formData[q.id]);});return{answered:ans.length,required:req.length,complete:req.length>0&&ans.length===req.length};});
  var ss=secStatuses[sec];var pctSec=ss.required>0?Math.round(ss.answered/ss.required*100):0;
  var totalR=EXT_SECTIONS.reduce(function(a,s){return a+getReq(s,p.formData).length;},0);
  var totalA=EXT_SECTIONS.reduce(function(a,s){return a+getReq(s,p.formData).filter(function(q){return isFilled(p.formData[q.id]);}).length;},0);
  var overallPct=totalR>0?Math.round(totalA/totalR*100):0;
  function hc(id,val){p.onChange(id,val);setErrors(function(prev){var n=Object.assign({},prev);delete n[id];return n;});}
  function validate(i){var s=EXT_SECTIONS[i===undefined?sec:i];var e={};getReq(s,p.formData).forEach(function(q){if(!isFilled(p.formData[q.id]))e[q.id]="Required";});setErrors(function(prev){return Object.assign({},prev,e);});return !Object.keys(e).length;}
  if(submitted)return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:C.grayL}}>
      <div style={{textAlign:"center",maxWidth:480,padding:"0 24px"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:C.greenL,border:"2px solid #BBF7D0",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 24px"}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{fontSize:24,fontWeight:700,margin:"0 0 10px",color:C.navy}}>{"Questionnaire submitted"}</h2>
        <p style={{fontSize:14,color:C.gray,lineHeight:1.7,margin:"0 0 24px"}}>{"Thank you, "}<strong>{p.company.name}</strong>{". Your responses have been securely submitted to Timeline compliance team."}</p>
        <div style={{padding:"14px 18px",background:C.blueL,borderRadius:10,border:"1px solid #BFDBFE",fontSize:13,color:C.blueD,lineHeight:1.6}}>{"A member of our team will review your submission within 5 business days."}</div>
        {p.isPreview&&<div style={{marginTop:20}}><Btn onClick={p.onExitPreview} variant="ghost">{"Exit preview"}</Btn></div>}
      </div>
    </div>
  );
  return(
    <div style={{minHeight:"100vh",background:C.grayL,display:"flex",flexDirection:"column"}}>
      <div style={{background:C.navy,padding:"0 2rem",height:56,display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
        <div style={{width:24,height:24,borderRadius:6,background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div style={{fontSize:13,fontWeight:600,color:"white"}}>{"Timeline"}</div>
        <div style={{width:"0.5px",height:14,background:"rgba(255,255,255,0.2)",margin:"0 6px"}}/>
        <div style={{fontSize:13,color:"rgba(255,255,255,0.55)"}}>{p.company.name+" - Third-Party Due Diligence Questionnaire"}</div>
        <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:100,height:3,background:"rgba(255,255,255,0.1)",borderRadius:2}}><div style={{height:"100%",width:overallPct+"%",background:C.blue,borderRadius:2}}/></div>
          <span style={{fontSize:12,color:"rgba(255,255,255,0.5)"}}>{overallPct+"%"}</span>
        </div>
        {p.isPreview&&<><Chip color="amber">{"Preview"}</Chip><Btn onClick={p.onExitPreview} size="sm" variant="ghost" style={{color:"white",borderColor:"rgba(255,255,255,0.2)"}}>{"Exit"}</Btn></>}
      </div>
      <div style={{flex:1,display:"flex",minHeight:0}}>
        <div style={{width:230,background:"white",borderRight:"1px solid "+C.grayM,padding:"1.25rem 0.875rem",overflowY:"auto",flexShrink:0}}>
          <div style={{fontSize:10,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12,padding:"0 6px"}}>{"Sections"}</div>
          {EXT_SECTIONS.map(function(s,i){var active=i===sec;var ss2=secStatuses[i];return(
            <button key={s.id} type="button" onClick={function(){setSec(i);}} style={{width:"100%",display:"flex",alignItems:"flex-start",gap:9,padding:"9px 8px",borderRadius:8,border:"none",background:active?C.blueL:"transparent",cursor:"pointer",fontFamily:"inherit",textAlign:"left",marginBottom:2}}>
              <div style={{width:20,height:20,borderRadius:"50%",flexShrink:0,background:ss2.complete?C.green:active?C.blue:C.grayM,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>
                {ss2.complete?<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>:<span style={{fontSize:10,fontWeight:700,color:"white"}}>{i+1}</span>}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:active||ss2.complete?600:400,color:active?C.blueD:ss2.complete?C.greenD:C.grayD,lineHeight:1.3}}>{s.title}</div>
                <div style={{fontSize:10,color:C.gray,marginTop:2}}>{ss2.answered+"/"+ss2.required+" required"}</div>
              </div>
            </button>
          );})}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"2rem 2.5rem"}}>
          <div style={{maxWidth:620,margin:"0 auto"}}>
            <div style={{marginBottom:"1.5rem"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{fontSize:20}}>{section.icon}</span><h2 style={{fontSize:19,fontWeight:700,margin:0,color:C.navy}}>{section.title}</h2><div style={{marginLeft:"auto"}}><Chip color={pctSec===100?"green":"gray"}>{pctSec+"%"}</Chip></div></div>
              <div style={{height:3,background:C.grayM,borderRadius:2}}><div style={{height:"100%",width:pctSec+"%",background:C.blue,borderRadius:2,transition:"width 0.3s"}}/></div>
            </div>
            {visQs.map(function(q){return(
              <div key={q.id} style={{marginBottom:"1.4rem",padding:"15px 17px",background:"white",borderRadius:10,border:"1px solid "+C.grayM}}>
                <label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:8,lineHeight:1.5,color:C.navy}}>{q.label}{q.required&&<span style={{color:C.red,marginLeft:3}}>{"*"}</span>}</label>
                <Field q={q} value={p.formData[q.id]} onChange={hc} error={errors[q.id]}/>
                {errors[q.id]&&<div style={{fontSize:12,color:C.red,marginTop:5}}>{errors[q.id]}</div>}
              </div>
            );})}
            <div style={{display:"flex",gap:10,paddingTop:"1.25rem",borderTop:"1px solid "+C.grayM,alignItems:"center"}}>
              {sec>0&&<Btn onClick={function(){setSec(function(i){return i-1;});}}>{"Previous"}</Btn>}
              <span style={{fontSize:12,color:C.gray,marginLeft:sec>0?6:0}}>{"Section "+(sec+1)+" of "+EXT_SECTIONS.length}</span>
              <div style={{flex:1}}/>
              {sec<EXT_SECTIONS.length-1?<Btn onClick={function(){if(validate(sec))setSec(function(i){return i+1;});}} variant="primary">{"Save and continue"}</Btn>:<Btn onClick={function(){setSubmitted(true);p.onSubmit();}} variant="primary" size="lg">{"Submit questionnaire"}</Btn>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pipeline(p){
  var counts=[0,0,0,0];
  p.companies.forEach(function(c){counts[getPipelineStage(p.allData[c.id]||{})]++;});
  var total=p.companies.length||1;
  return(
    <div style={{background:"white",border:"1px solid "+C.grayM,borderRadius:14,padding:"18px 22px",marginBottom:"1.5rem"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:600,color:C.navy,textTransform:"uppercase",letterSpacing:"0.08em"}}>{"Assessment pipeline"}</div>
        <div style={{fontSize:12,color:C.gray}}>{total+" provider"+(total!==1?"s":"")}</div>
      </div>
      <div style={{display:"flex",gap:2,marginBottom:14,borderRadius:6,overflow:"hidden",height:6}}>
        {PIPELINE_STAGES.map(function(stage,i){var w=Math.round((counts[i]/total)*100);if(!w)return null;return <div key={i} style={{width:w+"%",background:stage.dot}}/>;})}</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
        {PIPELINE_STAGES.map(function(stage,i){var active=p.filter===i;return(
          <button key={i} type="button" onClick={function(){p.onFilter(active?null:i);}} style={{padding:"11px 13px",borderRadius:10,border:active?"2px solid "+stage.border:"1px solid "+C.grayM,background:active?stage.bg:"white",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:7}}><div style={{width:7,height:7,borderRadius:"50%",background:stage.dot}}/><span style={{fontSize:10,fontWeight:600,color:active?stage.fg:C.gray,textTransform:"uppercase",letterSpacing:"0.06em"}}>{stage.label}</span></div>
            <div style={{fontSize:24,fontWeight:700,letterSpacing:"-1.5px",lineHeight:1,color:active?stage.fg:C.navy}}>{counts[i]}</div>
            <div style={{fontSize:11,color:active?stage.fg:C.gray,marginTop:3}}>{stage.sub}</div>
          </button>
        );})}
      </div>
    </div>
  );
}

function Sidebar(p){
  var nav=[{id:"dashboard",label:"Dashboard"},{id:"assistant",label:"Ask Mark"},{id:"report",label:"Board Report"},{id:"reminders",label:"Reminders"},{id:"settings",label:"Settings"}];
  return(
    <div style={{width:216,flexShrink:0,background:C.navy,display:"flex",flexDirection:"column",padding:"1.25rem 0.875rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,padding:"2px 6px 22px"}}>
        <div style={{width:30,height:30,borderRadius:8,background:C.blue,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div><div style={{fontSize:13,fontWeight:700,color:"white"}}>{"DD Hub"}</div><div style={{fontSize:11,color:"rgba(255,255,255,0.35)",marginTop:1}}>{"by Timeline"}</div></div>
      </div>
      {nav.map(function(n){var active=p.page===n.id;return(
        <button key={n.id} type="button" onClick={function(){p.setPage(n.id);}} style={{display:"flex",alignItems:"center",padding:"9px 10px",borderRadius:8,border:"none",background:active?"rgba(37,99,235,0.15)":"transparent",color:active?"white":"rgba(255,255,255,0.45)",cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:active?600:400,textAlign:"left",marginBottom:2}}>
          {n.label}
          {n.id==="reminders"&&p.pendingCount>0&&<span style={{marginLeft:"auto",fontSize:10,background:C.red,color:"white",borderRadius:10,padding:"2px 7px",fontWeight:600}}>{p.pendingCount}</span>}
          {active&&<div style={{marginLeft:n.id==="reminders"&&p.pendingCount>0?8:"auto",width:5,height:5,borderRadius:"50%",background:C.blue}}/>}
        </button>
      );})}
      <div style={{marginTop:"auto",paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.08)"}}>
        <div style={{fontSize:11,color:"rgba(255,255,255,0.3)",padding:"0 4px",marginBottom:8}}>{"Signed in as "}<span style={{color:"rgba(255,255,255,0.6)",fontWeight:500}}>{"admin"}</span></div>
        <button type="button" onClick={p.onLogout} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"rgba(255,255,255,0.4)",cursor:"pointer",fontFamily:"inherit",fontSize:12,textAlign:"left"}}>{"Sign out"}</button>
      </div>
    </div>
  );
}

function LoginScreen(p){
  var[user,setUser]=useState("");var[pass,setPass]=useState("");var[err,setErr]=useState("");var[loading,setLoading]=useState(false);
  function submit(){if(!user.trim()||!pass.trim()){setErr("Please enter your username and password.");return;}setLoading(true);setTimeout(function(){if(user===ADMIN_USER&&pass===ADMIN_PASS){p.onLogin();}else{setErr("Incorrect username or password.");setLoading(false);}},600);}
  function onKey(e){if(e.key==="Enter")submit();}
  var inp={width:"100%",fontSize:14,height:46,background:"rgba(255,255,255,0.06)",color:"white",borderRadius:10,padding:"0 14px",fontFamily:"inherit",boxSizing:"border-box",outline:"none"};
  return(
    <div style={{minHeight:"100vh",display:"flex",background:C.navy}}>
      <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem"}}>
        <div style={{width:"100%",maxWidth:380}}>
          <div style={{marginBottom:36}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:32}}>
              <div style={{width:38,height:38,borderRadius:10,background:C.blue,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <span style={{fontSize:16,fontWeight:700,color:"white"}}>{"Timeline DD Hub"}</span>
            </div>
            <h1 style={{fontSize:30,fontWeight:700,color:"white",margin:"0 0 8px",letterSpacing:"-1px"}}>{"Admin sign in"}</h1>
            <p style={{fontSize:14,color:"rgba(255,255,255,0.45)",margin:0}}>{"Access your third-party due diligence portal"}</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.6)",display:"block",marginBottom:7}}>{"Username"}</label>
              <input value={user} onChange={function(e){setUser(e.target.value);setErr("");}} onKeyDown={onKey} placeholder="admin" style={{...inp,border:err?"1.5px solid "+C.red:"1px solid rgba(255,255,255,0.12)"}}/>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:"rgba(255,255,255,0.6)",display:"block",marginBottom:7}}>{"Password"}</label>
              <input type="password" value={pass} onChange={function(e){setPass(e.target.value);setErr("");}} onKeyDown={onKey} placeholder="password" style={{...inp,border:err?"1.5px solid "+C.red:"1px solid rgba(255,255,255,0.12)"}}/>
            </div>
            {err&&<div style={{fontSize:13,color:"#FCA5A5",padding:"10px 14px",background:"rgba(220,38,38,0.12)",borderRadius:8}}>{err}</div>}
            <button type="button" onClick={submit} style={{height:48,borderRadius:10,border:"none",background:loading?"rgba(255,255,255,0.08)":C.blue,color:loading?"rgba(255,255,255,0.3)":"white",fontFamily:"inherit",fontSize:15,fontWeight:700,cursor:loading?"default":"pointer",marginTop:6}}>
              {loading?"Signing in...":"Sign in to DD Hub"}
            </button>
          </div>
          <div style={{marginTop:24,padding:"14px 16px",background:"rgba(255,255,255,0.04)",borderRadius:10,border:"1px solid rgba(255,255,255,0.08)"}}>
            <div style={{fontSize:10,fontWeight:600,color:"rgba(255,255,255,0.3)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10}}>{"Demo credentials"}</div>
            <div style={{display:"flex",gap:24}}>
              <div><div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{"Username"}</div><div style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.7)",fontFamily:"var(--font-mono)"}}>{"admin"}</div></div>
              <div><div style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{"Password"}</div><div style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,0.7)",fontFamily:"var(--font-mono)"}}>{"dd2026"}</div></div>
            </div>
          </div>
        </div>
      </div>
      <div style={{width:400,background:C.navyM,display:"flex",flexDirection:"column",justifyContent:"center",padding:"3rem",borderLeft:"1px solid rgba(255,255,255,0.05)"}}>
        <div style={{fontSize:11,fontWeight:700,color:C.blue,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:16}}>{"Third-Party Due Diligence"}</div>
        <h2 style={{fontSize:26,fontWeight:700,color:"white",margin:"0 0 14px",letterSpacing:"-0.6px",lineHeight:1.25}}>{"FCA-aligned DD for all your providers"}</h2>
        <p style={{fontSize:13,color:"rgba(255,255,255,0.45)",margin:"0 0 32px",lineHeight:1.8}}>{"Covering Consumer Duty, AML/KYC, custody & assets, technology risk, investment operations, and trading for 23 platforms."}</p>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {[
            ["10 questionnaire sections","Contact info, financial & ownership, regulatory & compliance, consumer duty, custody & assets, technology & security, outsourcing, risk management, investment operations, and trading operations"],
            ["Split internal and external","Separate external questions for providers and internal assessment for Timeline"],
            ["4 ready-to-send email templates","Initial invitation, reminder, final notice, and completion acknowledgement"],
            ["AI-powered compliance assistant","Ask anything about provider answers, risk ratings, and FCA alignment"],
            ["Smart Google Sheets sync","Paste a Sheet ID and AI auto-detects which company answered — or bulk-import multiple sheets at once"],
          ].map(function(item){return(
            <div key={item[0]} style={{display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:"rgba(37,99,235,0.3)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div><div style={{fontSize:13,fontWeight:600,color:"white",marginBottom:2}}>{item[0]}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.35)",lineHeight:1.5}}>{item[1]}</div></div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

function Dashboard(p){
  var[search,setSearch]=useState("");var[pipeFilter,setPipeFilter]=useState(null);var[sort,setSort]=useState("name");var[sendTarget,setSendTarget]=useState(null);
  var filtered=useMemo(function(){return p.companies.filter(function(c){if(search&&c.name.toLowerCase().indexOf(search.toLowerCase())<0)return false;if(pipeFilter!==null&&getPipelineStage(p.allData[c.id]||{})!==pipeFilter)return false;return true;}).sort(function(a,b){if(sort==="name")return a.name.localeCompare(b.name);if(sort==="pct")return calcStatus(p.allData[b.id]||{}).pct-calcStatus(p.allData[a.id]||{}).pct;return 0;});},[p.companies,p.allData,search,pipeFilter,sort]);
  return(
    <div style={{flex:1,overflowY:"auto",padding:"1.75rem 2rem",background:C.grayL,position:"relative"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
        <div><h1 style={{fontSize:22,fontWeight:700,margin:"0 0 3px",letterSpacing:"-0.6px",color:C.navy}}>{"Dashboard"}</h1><p style={{fontSize:13,color:C.gray,margin:0}}>{p.companies.length+" third-party providers under assessment"}</p></div>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={p.onImport} variant="soft">{"Import CSV"}</Btn>
          <Btn onClick={p.onAdd} variant="primary">{"+ Add provider"}</Btn>
        </div>
      </div>
      <Pipeline companies={p.companies} allData={p.allData} filter={pipeFilter} onFilter={setPipeFilter}/>
      <div style={{background:"white",border:"1px solid "+C.grayM,borderRadius:12,overflow:"hidden"}}>
        <div style={{padding:"10px 14px",borderBottom:"1px solid "+C.grayM,display:"flex",gap:8,alignItems:"center",background:C.grayL}}>
          <input value={search} onChange={function(e){setSearch(e.target.value);}} placeholder="Search providers..." style={{fontSize:13,height:32,padding:"0 10px",background:"white",color:C.grayD,border:"1px solid "+C.grayM,borderRadius:7,fontFamily:"inherit",width:190,boxSizing:"border-box",outline:"none"}}/>
          {pipeFilter!==null&&<><Chip color="blue">{PIPELINE_STAGES[pipeFilter].label}</Chip><button type="button" onClick={function(){setPipeFilter(null);}} style={{fontSize:11,color:C.gray,background:"none",border:"none",cursor:"pointer",padding:0}}>{"Clear"}</button></>}
          <div style={{marginLeft:"auto",display:"flex",gap:2}}>{[["name","Name"],["pct","Progress"]].map(function(x){return <button key={x[0]} type="button" onClick={function(){setSort(x[0]);}} style={{fontSize:12,padding:"4px 9px",borderRadius:6,border:"none",background:sort===x[0]?C.grayM:"transparent",color:sort===x[0]?C.navy:C.gray,cursor:"pointer",fontFamily:"inherit",fontWeight:sort===x[0]?600:400}}>{x[1]}</button>;})}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"minmax(0,2.5fr) minmax(0,1fr) 34px 90px 80px 80px 120px",gap:8,padding:"7px 14px",background:"white",borderBottom:"1px solid "+C.grayM}}>
          {["Provider","Type","","Status","Risk","Sent","Actions"].map(function(h,i){return <span key={i} style={{fontSize:10,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.06em",textAlign:i>=6?"right":"left"}}>{h}</span>;})}
        </div>
        {filtered.length===0&&<div style={{padding:"3rem",textAlign:"center",color:C.gray,fontSize:13}}>{"No providers match."}</div>}
        {filtered.map(function(c,ci){
          var fd=p.allData[c.id]||{};var st=calcStatus(fd);var risk=fd.i_risk_rating;
          return(
            <div key={c.id} style={{display:"grid",gridTemplateColumns:"minmax(0,2.5fr) minmax(0,1fr) 34px 90px 80px 80px 120px",gap:8,alignItems:"center",padding:"10px 14px",borderBottom:ci<filtered.length-1?"1px solid "+C.grayM:"none",background:"white"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,minWidth:0}}><Ava name={c.name} size={26}/><div style={{minWidth:0}}><div style={{fontSize:13,fontWeight:600,color:C.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div><div style={{fontSize:11,color:C.gray,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.contactEmail}</div></div></div>
              <span style={{fontSize:11,color:C.gray,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.type}</span>
              <Ring pct={st.pct} size={28}/>
              <div><Chip color={st.pct===100?"green":st.pct>0?"amber":"gray"}>{st.pct===100?"Done":st.pct>0?st.pct+"%":"Pending"}</Chip></div>
              <div><Chip color={!risk?"gray":risk==="Low"?"green":risk==="Medium"?"amber":"red"}>{risk||"N/A"}</Chip></div>
              <div><Chip color={c.sentDate?"green":"gray"}>{c.sentDate?"Sent":"Not sent"}</Chip></div>
              <div style={{display:"flex",gap:6,justifyContent:"flex-end"}}>
                <Btn onClick={function(){p.onSelect(c);}} size="sm" variant="soft">{"Open"}</Btn>
                <Btn onClick={function(){setSendTarget(c);}} size="sm" variant="teal">{"Send"}</Btn>
              </div>
            </div>
          );
        })}
      </div>
      {sendTarget&&<SendModal company={sendTarget} onClose={function(){setSendTarget(null);}} onSend={function(id){p.onMarkSent(id);setSendTarget(null);}} onPreview={function(){p.onPreview(sendTarget);setSendTarget(null);}}/>}
    </div>
  );
}

function AdminQView(p){
  var[tab,setTab]=useState("external");var[sec,setSec]=useState(0);var[errors,setErrors]=useState({});
  var sections=tab==="external"?EXT_SECTIONS:INT_SECTIONS;
  var section=sections[sec];var visQs=getVis(section,p.formData);
  var st=calcStatus(p.formData);
  var secSt=st.sections.find(function(s){return s.id===section.id;})||{answered:0,required:0,complete:false};
  var pctSec=secSt.required>0?Math.round(secSt.answered/secSt.required*100):0;
  function hc(id,val){p.onChange(id,val);setErrors(function(prev){var n=Object.assign({},prev);delete n[id];return n;});}
  function validate(i){var s=sections[i===undefined?sec:i];var e={};getReq(s,p.formData).forEach(function(q){if(!isFilled(p.formData[q.id]))e[q.id]="Required";});setErrors(function(prev){return Object.assign({},prev,e);});return !Object.keys(e).length;}
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0,background:C.grayL}}>
      <div style={{borderBottom:"1px solid "+C.grayM,padding:"10px 1.5rem",display:"flex",alignItems:"center",gap:10,background:"white",flexShrink:0,flexWrap:"wrap"}}>
        <Btn onClick={p.onBack} size="sm" variant="ghost">{"Back"}</Btn>
        <div style={{display:"flex",alignItems:"center",gap:9}}><Ava name={p.company.name} size={26}/><div><div style={{fontSize:13,fontWeight:600,color:C.navy}}>{p.company.name}</div><div style={{fontSize:11,color:C.gray}}>{p.company.type}</div></div></div>
        <div style={{display:"flex",gap:6,marginLeft:8}}>
          <button type="button" onClick={function(){setTab("external");setSec(0);}} style={{fontSize:12,padding:"5px 12px",borderRadius:20,border:tab==="external"?"2px solid "+C.blue:"1px solid "+C.grayM,background:tab==="external"?C.blueL:"white",color:tab==="external"?C.blueD:C.gray,cursor:"pointer",fontFamily:"inherit",fontWeight:tab==="external"?600:400}}>{"External ("+st.extPct+"%)"}</button>
          <button type="button" onClick={function(){setTab("internal");setSec(0);}} style={{fontSize:12,padding:"5px 12px",borderRadius:20,border:tab==="internal"?"2px solid "+C.purple:"1px solid "+C.grayM,background:tab==="internal"?C.purpleL:"white",color:tab==="internal"?C.purpleD:C.gray,cursor:"pointer",fontFamily:"inherit",fontWeight:tab==="internal"?600:400}}>{"Internal ("+st.intPct+"%)"}</button>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:3,flexWrap:"wrap"}}>
          {sections.map(function(s,i){var active=i===sec;var ss2=st.sections.find(function(x){return x.id===s.id;})||{complete:false};return <button key={s.id} type="button" onClick={function(){setSec(i);}} title={s.title} style={{fontSize:12,padding:"4px 8px",borderRadius:6,border:active?"2px solid "+(tab==="external"?C.blue:C.purple):"1px solid "+C.grayM,background:active?(tab==="external"?C.blueL:C.purpleL):"white",color:active?(tab==="external"?C.blueD:C.purpleD):ss2.complete?C.green:C.gray,cursor:"pointer",fontFamily:"inherit",fontWeight:active?600:400}}>{s.icon}{ss2.complete&&<span style={{fontSize:9,marginLeft:2,color:C.green}}>{"v"}</span>}</button>;})}
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"1.75rem 2rem"}}>
        <div style={{maxWidth:620,margin:"0 auto"}}>
          <div style={{marginBottom:"1.5rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><span style={{fontSize:20}}>{section.icon}</span><h2 style={{fontSize:18,fontWeight:700,margin:0,color:C.navy}}>{section.title}</h2><div style={{marginLeft:"auto",display:"flex",gap:6}}><Chip color={tab==="external"?"blue":"purple"} size={11}>{section.type}</Chip><Chip color={pctSec===100?"green":"gray"}>{pctSec+"%"}</Chip></div></div>
            <div style={{height:3,background:C.grayM,borderRadius:2}}><div style={{height:"100%",width:pctSec+"%",background:tab==="external"?C.blue:C.purple,borderRadius:2,transition:"width 0.3s"}}/></div>
          </div>
          {visQs.map(function(q){return(
            <div key={q.id} style={{marginBottom:"1.3rem",padding:"15px 17px",background:"white",borderRadius:10,border:"1px solid "+C.grayM}}>
              <label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:8,lineHeight:1.5,color:C.navy}}>{q.label}{q.required&&<span style={{color:C.red,marginLeft:3}}>{"*"}</span>}</label>
              <Field q={q} value={p.formData[q.id]} onChange={hc} error={errors[q.id]}/>
              {errors[q.id]&&<div style={{fontSize:12,color:C.red,marginTop:5}}>{errors[q.id]}</div>}
            </div>
          );})}
          <div style={{display:"flex",gap:8,paddingTop:"1.25rem",borderTop:"1px solid "+C.grayM,alignItems:"center"}}>
            {sec>0&&<Btn onClick={function(){setSec(function(i){return i-1;});}}>{"Previous"}</Btn>}
            <span style={{fontSize:12,color:C.gray,marginLeft:sec>0?6:0}}>{"Section "+(sec+1)+" of "+sections.length}</span>
            <div style={{flex:1}}/>
            {sec<sections.length-1?<Btn onClick={function(){if(validate(sec))setSec(function(i){return i+1;});}} variant="primary">{"Next section"}</Btn>:<Btn onClick={p.onBack} variant={tab==="external"?"primary":"secondary"}>{"Save and close"}</Btn>}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAssistant(p){
  var WELCOME="Hi, I'm Mark — Timeline's compliance and due diligence assistant.\n\nI have full access to all platform questionnaire data and can help with pretty much anything across your DD programme — from analysing platform responses and flagging risk, to explaining FCA requirements, investment operations questions, and drafting correspondence.\n\nUse the category buttons below to browse suggested questions, or just type whatever's on your mind. I'll always let you know if I'm uncertain about something.";
  var[messages,setMessages]=useState([{role:"assistant",content:WELCOME}]);
  var[input,setInput]=useState("");var[loading,setLoading]=useState(false);var[tick,setTick]=useState(0);
  var msgsRef=useRef(null);
  useEffect(function(){if(msgsRef.current)msgsRef.current.scrollTop=msgsRef.current.scrollHeight;},[messages,loading]);
  useEffect(function(){if(!loading)return;var t=setInterval(function(){setTick(function(n){return n+1;});},500);return function(){clearInterval(t);};},[loading]);
  var assessed=p.companies.filter(function(c){return isReady(p.allData[c.id]||{});}).length;
  function send(){
    var text=input.trim();if(!text||loading)return;
    setMessages(function(prev){return prev.concat([{role:"user",content:text}]);});setInput("");setLoading(true);
    // Only include platforms that have at least one answer to keep the prompt small
    var populatedCompanies=p.companies.filter(function(c){return Object.keys(p.allData[c.id]||{}).length>0;});
    var ctx=populatedCompanies.length>0?buildCtx(populatedCompanies,p.allData):"No platform questionnaire data has been imported yet.";
    var sys="You are Mark, a senior compliance and DD specialist at Timeline (UK FCA-regulated). Be concise and direct. Answer in plain English. If data is missing, say so.\n\nPlatform questionnaire data:\n"+ctx;
    var apiMsgs=messages.filter(function(m){return m.content!==WELCOME;}).concat([{role:"user",content:text}]).slice(-10);
    fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1000,system:sys,messages:apiMsgs})})
      .then(function(r){return r.json();})
      .then(function(d){
        var reply="";
        if(d.content&&d.content.length>0){reply=d.content.map(function(b){return b.text||"";}).join("");}
        else if(d.error){reply="Error: "+d.error.message;}
        else{reply="Sorry, I didn't get a response. Please try again.";}
        setMessages(function(prev){return prev.concat([{role:"assistant",content:reply}]);});
      })
      .catch(function(err){setMessages(function(prev){return prev.concat([{role:"assistant",content:"Network error — please check your connection and try again. ("+err.message+")"}]);});})
      .finally(function(){setLoading(false);setTick(0);});
  }
  function handleKey(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}
  var QUICK_CATS=[
    {id:"platforms",label:"Platform responses",icon:"🏢",prompts:[
      "Which platforms have completed all questionnaire sections?",
      "Which platforms have outstanding sections that still need chasing?",
      "Compare how AJ Bell and Nucleus answered the Consumer Duty questions",
      "Which platforms have disclosed any regulatory breaches in the last 12 months?",
    ]},
    {id:"risk",label:"Risk & compliance",icon:"⚠️",prompts:[
      "Which platforms represent the highest risk based on responses so far?",
      "Who hasn't provided an FCA reference number yet?",
      "Summarise all AML/KYC responses across platforms",
      "Flag any platforms with incomplete custody and assets sections",
    ]},
    {id:"fca",label:"FCA & regulation",icon:"📋",prompts:[
      "What does Consumer Duty require from platforms in 2026?",
      "Walk me through SYSC 8 outsourcing obligations",
      "What should I look for in a platform's CASS audit findings?",
      "What are the FCA's expectations around operational resilience?",
    ]},
    {id:"ops",label:"Investment ops",icon:"📈",prompts:[
      "Which platforms support DFM rebalancing at model and range level?",
      "Which platforms support API integrations?",
      "Do any platforms not support 0% cash models?",
      "Compare trading cut-off times across all platforms",
    ]},
    {id:"help",label:"General help",icon:"✉️",prompts:[
      "Draft a chaser email for platforms that haven't responded",
      "Help me write a board summary of DD findings so far",
      "What are the key red flags to look for in a platform DD response?",
      "Explain what a material CASS audit finding means in practice",
    ]},
  ];
  var[activeQuickCat,setActiveQuickCat]=useState(null);
  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0,background:C.grayL}}>
      <div style={{borderBottom:"1px solid "+C.grayM,padding:"12px 1.75rem",background:"white",flexShrink:0,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:34,height:34,borderRadius:"50%",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:13,fontWeight:700,color:"white",letterSpacing:"-0.5px"}}>{"M"}</div>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:C.navy}}>{"Mark"}</div>
          <div style={{fontSize:11,color:C.gray,marginTop:1}}>{"DD & compliance specialist · full access to all platform data"}</div>
        </div>
        <div style={{marginLeft:"auto",display:"flex",gap:8}}>
          <div style={{padding:"5px 13px",borderRadius:9,background:C.greenL,border:"1px solid #BBF7D0",textAlign:"center"}}><div style={{fontSize:15,fontWeight:700,color:C.greenD,lineHeight:1}}>{assessed}</div><div style={{fontSize:10,color:C.greenD,marginTop:2,fontWeight:600}}>{"Assessed"}</div></div>
          <div style={{padding:"5px 13px",borderRadius:9,background:C.amberL,border:"1px solid #FDE68A",textAlign:"center"}}><div style={{fontSize:15,fontWeight:700,color:C.amberD,lineHeight:1}}>{p.companies.length-assessed}</div><div style={{fontSize:10,color:C.amberD,marginTop:2,fontWeight:600}}>{"Pending"}</div></div>
        </div>
      </div>
      <div ref={msgsRef} style={{flex:1,overflowY:"auto",padding:"1.25rem 1.75rem",display:"flex",flexDirection:"column",gap:12}}>
        {messages.map(function(m,i){var isUser=m.role==="user";return(
          <div key={i} style={{display:"flex",justifyContent:isUser?"flex-end":"flex-start",gap:9,alignItems:"flex-start"}}>
            {!isUser&&<div style={{width:28,height:28,borderRadius:"50%",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,fontSize:11,fontWeight:700,color:"white"}}>{"M"}</div>}
            <div style={{maxWidth:"77%",padding:"11px 15px",borderRadius:isUser?"13px 13px 4px 13px":"13px 13px 13px 4px",background:isUser?C.navy:"white",color:isUser?"white":C.grayD,fontSize:13,lineHeight:1.75,whiteSpace:"pre-wrap",border:isUser?"none":"1px solid "+C.grayM}}>{m.content}</div>
            {isUser&&<div style={{width:28,height:28,borderRadius:"50%",background:C.blueL,border:"1px solid #BFDBFE",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:10,fontWeight:700,color:C.blueD,marginTop:1}}>{"You"}</div>}
          </div>
        );})}
        {loading&&<div style={{display:"flex",gap:9,alignItems:"flex-start"}}><div style={{width:28,height:28,borderRadius:"50%",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:11,fontWeight:700,color:"white"}}>{"M"}</div><div style={{padding:"11px 16px",borderRadius:"13px 13px 13px 4px",background:"white",border:"1px solid "+C.grayM,fontSize:14,color:C.blue,letterSpacing:3}}>{[".","..","..."][tick%3]}</div></div>}
      </div>
      <div style={{borderTop:"1px solid "+C.grayM,background:"white",flexShrink:0}}>
        <div style={{padding:"10px 1.75rem 0",display:"flex",gap:7,flexWrap:"wrap"}}>
          {QUICK_CATS.map(function(cat){
            var active=activeQuickCat===cat.id;
            return(
              <button key={cat.id} type="button"
                onClick={function(){setActiveQuickCat(active?null:cat.id);}}
                style={{display:"flex",alignItems:"center",gap:5,fontSize:12,padding:"6px 13px",borderRadius:20,border:active?"2px solid "+C.blue:"1px solid "+C.grayM,background:active?C.blueL:"white",color:active?C.blueD:C.grayD,cursor:"pointer",fontFamily:"inherit",fontWeight:active?600:400}}>
                <span style={{fontSize:13}}>{cat.icon}</span>
                {cat.label}
                <span style={{fontSize:9,color:active?C.blueD:C.gray,marginLeft:1}}>{active?"▲":"▼"}</span>
              </button>
            );
          })}
        </div>
        {activeQuickCat&&(function(){
          var cat=QUICK_CATS.find(function(c){return c.id===activeQuickCat;});
          if(!cat)return null;
          return(
            <div style={{margin:"8px 1.75rem 0",padding:"10px 14px",background:C.blueL,border:"1px solid #BFDBFE",borderRadius:10,display:"flex",flexDirection:"column",gap:2}}>
              {cat.prompts.map(function(prompt){
                return(
                  <button key={prompt} type="button"
                    onClick={function(){setInput(prompt);setActiveQuickCat(null);}}
                    style={{display:"flex",alignItems:"flex-start",gap:8,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",padding:"6px 4px",borderRadius:6,textAlign:"left",width:"100%"}}>
                    <span style={{color:C.blue,fontSize:13,flexShrink:0,marginTop:1}}>{"→"}</span>
                    <span style={{fontSize:13,color:C.blueD,lineHeight:1.45}}>{prompt}</span>
                  </button>
                );
              })}
            </div>
          );
        })()}
        <div style={{padding:"10px 1.75rem 1rem"}}>
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <textarea value={input} onChange={function(e){setInput(e.target.value);}} onKeyDown={handleKey} placeholder="Ask Mark anything about platforms, compliance, FCA rules, or investment operations..." rows={2} style={{flex:1,fontSize:13,padding:"10px 13px",background:C.grayL,color:C.grayD,border:"1px solid "+C.grayM,borderRadius:9,fontFamily:"inherit",resize:"none",outline:"none",lineHeight:1.5}}/>
            <button type="button" onClick={send} disabled={loading||!input.trim()} style={{height:42,padding:"0 18px",borderRadius:9,border:"none",background:(loading||!input.trim())?C.grayM:C.navy,color:(loading||!input.trim())?C.gray:"white",cursor:(loading||!input.trim())?"default":"pointer",fontFamily:"inherit",fontSize:13,fontWeight:600,flexShrink:0}}>{loading?"...":"Send"}</button>
          </div>
          <div style={{fontSize:11,color:C.gray,marginTop:6}}>{"Enter to send · Shift+Enter for new line"}</div>
        </div>
      </div>
    </div>
  );
}

function RemindersView(p){
  var[preview,setPreview]=useState(null);var[tab,setTab]=useState("pending");
  var[openTemplate,setOpenTemplate]=useState(null);
  var pending=useMemo(function(){if(!p.globalEnabled)return[];return p.companies.reduce(function(acc,c){var fd=p.allData[c.id]||{};var st=calcStatus(fd);if(st.allComplete||!c.contactEmail)return acc;var days=daysSince(c.addedDate);return acc.concat(p.stages.filter(function(s){if(!s.enabled||days<s.triggerDays||st.pct<s.minPct||st.pct>s.maxPct)return false;return !p.log.some(function(l){return l.companyId===c.id&&l.stageId===s.id;});}).map(function(s){return{company:c,stage:s,status:st,days:days};}));},[]);},[p.companies,p.allData,p.stages,p.globalEnabled,p.log]);
  function showPreview(item,type){var code=genCode(item.company.name);var url="https://dd.timeline.co/portal/"+code;setPreview({subject:getEmailSubject(type,item.company),body:getEmailBody(type,item.company,code,url),item:item});}

  // Dummy company for template previews
  var dummyCompany={name:"[Platform Name]",contactEmail:"compliance@platform.com"};
  var dummyCode="PLT-DD-0000";
  var dummyUrl="https://dd.timeline.co/portal/PLT-DD-0000";

  var TEMPLATE_TYPES=[
    {key:"initial",label:"Initial invitation",desc:"Sent when the questionnaire is first issued",color:"blue",icon:"📨"},
    {key:"reminder",label:"Gentle reminder",desc:"Sent when no response after 7–14 days",color:"amber",icon:"🔔"},
    {key:"urgent",label:"Final notice",desc:"Sent when still outstanding after 28 days",color:"red",icon:"⚠️"},
    {key:"thankyou",label:"Completion acknowledgement",desc:"Sent once the questionnaire is submitted",color:"green",icon:"✅"},
  ];

  return(
    <div style={{flex:1,padding:"1.75rem 2rem",overflowY:"auto",background:C.grayL,position:"relative"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"1.5rem"}}>
        <div><h1 style={{fontSize:22,fontWeight:700,margin:"0 0 3px",color:C.navy}}>{"Reminders"}</h1><p style={{fontSize:13,color:C.gray,margin:0}}>{"Automated reminders with pre-built Timeline email templates."}</p></div>
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 14px",background:"white",border:"1px solid "+C.grayM,borderRadius:9}}>
          <span style={{fontSize:13,color:p.globalEnabled?C.green:C.gray,fontWeight:p.globalEnabled?600:400}}>{p.globalEnabled?"On":"Off"}</span>
          <Toggle on={p.globalEnabled} onChange={p.setGlobalEnabled}/>
        </div>
      </div>
      <div style={{marginBottom:"1.5rem"}}>
        <div style={{fontSize:11,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>{"Stages"}</div>
        <div style={{display:"flex",flexDirection:"column",gap:7}}>
          {p.stages.map(function(s,i){return <div key={s.id} style={{display:"grid",gridTemplateColumns:"8px 1fr auto auto auto",gap:14,alignItems:"center",padding:"11px 16px",background:"white",border:"1px solid "+C.grayM,borderRadius:10,opacity:(!p.globalEnabled||!s.enabled)?0.4:1}}><div style={{width:7,height:7,borderRadius:"50%",background:s.color}}/><div><div style={{fontSize:13,fontWeight:600,color:C.navy}}>{s.name}</div><div style={{fontSize:12,color:C.gray,marginTop:1}}>{s.desc}</div></div><Chip color="gray">{s.minPct===0&&s.maxPct===0?"0%":s.minPct+"-"+s.maxPct+"%"}</Chip><span style={{fontSize:12,color:C.gray}}>{"Day "+s.triggerDays+"+"}</span><Toggle on={s.enabled} onChange={function(v){p.setStages(function(prev){return prev.map(function(ss,j){return j===i?Object.assign({},ss,{enabled:v}):ss;});});}}/></div>;})}
        </div>
      </div>
      <div style={{display:"flex",marginBottom:"1.25rem",borderBottom:"1px solid "+C.grayM}}>
        {[["pending","Pending ("+pending.length+")"],["templates","Email templates"],["log","Sent ("+p.log.length+")"]].map(function(x){return <button key={x[0]} type="button" onClick={function(){setTab(x[0]);}} style={{fontSize:13,padding:"8px 14px",border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",color:tab===x[0]?C.navy:C.gray,fontWeight:tab===x[0]?600:400,borderBottom:tab===x[0]?"2.5px solid "+C.blue:"2.5px solid transparent",marginBottom:-1}}>{x[1]}</button>;})}
      </div>

      {tab==="pending"&&(
        <div>
          {!p.globalEnabled&&<div style={{padding:"2.5rem",textAlign:"center",color:C.gray,fontSize:13,background:"white",borderRadius:10,border:"1px solid "+C.grayM}}>{"Enable reminders above."}</div>}
          {p.globalEnabled&&pending.length===0&&<div style={{padding:"2.5rem",textAlign:"center",color:C.gray,fontSize:13,background:"white",borderRadius:10,border:"1px solid "+C.grayM}}>{"No reminders pending."}</div>}
          {p.globalEnabled&&pending.map(function(item){return(
            <div key={item.company.id+item.stage.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"white",border:"1px solid "+C.grayM,borderRadius:10,marginBottom:8}}>
              <Ava name={item.company.name} size={34}/>
              <div style={{flex:1}}><div style={{display:"flex",gap:7,marginBottom:2}}><span style={{fontSize:13,fontWeight:600,color:C.navy}}>{item.company.name}</span><Chip color={item.stage.id==="s5"?"red":"amber"}>{item.stage.name}</Chip></div><div style={{fontSize:12,color:C.gray}}>{item.company.contactEmail+" - "+item.status.pct+"% - Day "+item.days}</div></div>
              <div style={{display:"flex",gap:6}}>
                <Btn size="sm" variant="soft" onClick={function(){showPreview(item,"reminder");}}>{"Reminder"}</Btn>
                <Btn size="sm" variant="danger" onClick={function(){showPreview(item,"urgent");}}>{"Final notice"}</Btn>
                <Btn size="sm" variant="primary" onClick={function(){p.onSendReminder(item);}}>{"Mark sent"}</Btn>
              </div>
            </div>
          );})}
        </div>
      )}

      {tab==="templates"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {TEMPLATE_TYPES.map(function(t){
            var isOpen=openTemplate===t.key;
            var subject=getEmailSubject(t.key,dummyCompany);
            var body=getEmailBody(t.key,dummyCompany,dummyCode,dummyUrl);
            return(
              <div key={t.key} style={{background:"white",border:"1px solid "+(isOpen?C.blue:C.grayM),borderRadius:12,overflow:"hidden",transition:"border-color 0.15s"}}>
                {/* Header row — always visible, click to expand */}
                <button type="button"
                  onClick={function(){setOpenTemplate(isOpen?null:t.key);}}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"14px 18px",background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                  <span style={{fontSize:18,flexShrink:0}}>{t.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{t.label}</div>
                    <div style={{fontSize:12,color:C.gray,marginTop:1}}>{t.desc}</div>
                  </div>
                  <Chip color={t.color}>{t.key==="initial"?"Invitation":t.key==="reminder"?"Reminder":t.key==="urgent"?"Final notice":"Thank you"}</Chip>
                  <span style={{fontSize:11,color:C.gray,marginLeft:4,flexShrink:0}}>{isOpen?"▲":"▼"}</span>
                </button>
                {/* Expanded email preview */}
                {isOpen&&(
                  <div style={{borderTop:"1px solid "+C.grayM,padding:"16px 18px"}}>
                    <div style={{marginBottom:10,padding:"8px 12px",background:C.blueL,borderRadius:7,border:"1px solid #BFDBFE",fontSize:11,color:C.blueD}}>
                      {"Preview shown with placeholder values. When sent, [Platform Name] is replaced with the actual platform name and a unique access code is generated."}
                    </div>
                    {/* Subject line */}
                    <div style={{marginBottom:12,padding:"10px 14px",background:C.grayL,borderRadius:8,border:"1px solid "+C.grayM}}>
                      <div style={{fontSize:10,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:3}}>{"Subject line"}</div>
                      <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{subject}</div>
                    </div>
                    {/* Body */}
                    <div style={{padding:"14px 16px",background:"white",borderRadius:8,border:"1px solid "+C.grayM,maxHeight:320,overflowY:"auto"}}>
                      <div style={{fontSize:13,whiteSpace:"pre-line",lineHeight:1.8,color:C.grayD}}>{body}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab==="log"&&(
        <div>
          {!p.log.length&&<div style={{padding:"2.5rem",textAlign:"center",color:C.gray,fontSize:13,background:"white",borderRadius:10,border:"1px solid "+C.grayM}}>{"No reminders sent yet."}</div>}
          {p.log.slice().reverse().map(function(e){return <div key={e.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",background:"white",border:"1px solid "+C.grayM,borderRadius:9,marginBottom:6}}><div style={{width:7,height:7,borderRadius:"50%",background:C.blue,flexShrink:0}}/><div style={{flex:1}}><span style={{fontSize:13,fontWeight:600,color:C.navy}}>{e.companyName}</span><span style={{fontSize:12,color:C.gray,marginLeft:8}}>{e.stageName}</span></div><span style={{fontSize:12,color:C.gray}}>{e.sentAt}</span><Chip color="green">{"Sent"}</Chip></div>;})}
        </div>
      )}

      {preview&&(
        <div style={{position:"absolute",inset:0,background:"rgba(12,25,41,0.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50}}>
          <div style={{background:"white",borderRadius:12,width:"min(580px,94%)",maxHeight:"88vh",display:"flex",flexDirection:"column",overflow:"hidden"}} onClick={function(e){e.stopPropagation();}}>
            <div style={{padding:"13px 18px",background:C.navy,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:13,fontWeight:600,color:"white"}}>{"Email preview"}</span>
              <Btn onClick={function(){setPreview(null);}} size="sm" variant="ghost" style={{color:"white",borderColor:"rgba(255,255,255,0.2)"}}>{"Close"}</Btn>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"18px 20px"}}>
              <EmailPreview subject={preview.subject} body={preview.body} toEmail={preview.item.company.contactEmail} code={genCode(preview.item.company.name)} onSend={function(){p.onSendReminder(preview.item);setPreview(null);}}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SMART SHEET SYNC ────────────────────────────────────────────────────────
// Fetches spreadsheet metadata + sample data, uses AI to identify the company,
// then maps columns to questionnaire fields automatically.

function SheetSync(p){
  var[apiKey,setApiKey]=useState(function(){return lsGet(SK+"_gapi","");});
  var[connections,setConnections]=useState(function(){return lsGet(SK+"_gconn",[]);});
  var[syncing,setSyncing]=useState(null);
  var[results,setResults]=useState({});
  var[showKey,setShowKey]=useState(false);
  var[tab,setTab]=useState("single"); // "single" | "bulk"

  // Single add state
  var[newSheet,setNewSheet]=useState("");
  var[newComp,setNewComp]=useState("");
  var[detecting,setDetecting]=useState(false);
  var[detectionResult,setDetectionResult]=useState(null); // {company, confidence, sheetTitle, reason}
  var[addErr,setAddErr]=useState("");

  // Bulk state
  var[bulkText,setBulkText]=useState("");
  var[bulkResults,setBulkResults]=useState([]); // [{sheetId, status, company, confidence, sheetTitle, err}]
  var[bulkRunning,setBulkRunning]=useState(false);

  var allQs=useMemo(function(){return ALL_SECTIONS.reduce(function(a,s){return a.concat(s.questions);},[]);},[]);

  useEffect(function(){lsSet(SK+"_gapi",apiKey);},[apiKey]);
  useEffect(function(){lsSet(SK+"_gconn",connections);},[connections]);

  // ── Fetch sheet title + sample data ─────────────────────────────────────
  async function fetchSheetInfo(sheetId){
    var key=apiKey.trim();
    if(!key)throw new Error("No API key set");

    // Fetch sheet metadata (title)
    var metaUrl="https://sheets.googleapis.com/v4/spreadsheets/"+encodeURIComponent(sheetId)+"?key="+encodeURIComponent(key)+"&fields=properties.title,sheets.properties.title";
    var metaRes=await fetch(metaUrl);
    if(!metaRes.ok){
      var status=metaRes.status;
      if(status===403)throw new Error("Access denied — check your API key and ensure the sheet is shared as 'Anyone with the link can view'");
      if(status===404)throw new Error("Sheet not found — check the Sheet ID");
      throw new Error("HTTP "+status);
    }
    var meta=await metaRes.json();
    var sheetTitle=(meta.properties&&meta.properties.title)||"";

    // Fetch first few rows of data
    var dataUrl="https://sheets.googleapis.com/v4/spreadsheets/"+encodeURIComponent(sheetId)+"/values/A1:ZZ5?key="+encodeURIComponent(key);
    var dataRes=await fetch(dataUrl);
    var dataJson=await dataRes.json();
    var values=dataJson.values||[];
    var headers=values[0]||[];
    var firstRow=values[1]||[];

    return{sheetTitle,headers,firstRow,values};
  }

  // ── AI: identify company from sheet ─────────────────────────────────────
  async function aiIdentifyCompany(sheetTitle,headers,firstRow){
    var companyList=p.companies.map(function(c){return c.name;}).join(", ");
    var sample=headers.slice(0,20).map(function(h,i){return h+": "+(firstRow[i]||"(blank)");}).join("\n");
    var prompt="You are helping identify which company from a known list filled in a due diligence Google Form.\n\nKnown companies: "+companyList+"\n\nSpreadsheet title: \""+sheetTitle+"\"\n\nFirst response row (header: answer):\n"+sample+"\n\nReturn ONLY valid JSON with keys: company (exact name from the list, or null if unclear), confidence (high/medium/low), reason (one sentence).";
    var res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:200,messages:[{role:"user",content:prompt}]})});
    var d=await res.json();
    var txt=d.content.map(function(b){return b.text||"";}).join("").replace(/```json|```/g,"").trim();
    return JSON.parse(txt);
  }

  // ── AI: map columns to questionnaire fields ──────────────────────────────
  async function aiMapColumns(headers){
    var qList=allQs.map(function(q){return q.id+": "+q.label.slice(0,80);}).join("\n");
    var res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,messages:[{role:"user",content:"Map these Google Forms headers to field IDs. Return ONLY valid JSON. Keys are headers, values are field IDs, empty string if no match. Skip Timestamp and email columns.\n\nHEADERS:\n"+headers.join("\n")+"\n\nFIELDS:\n"+qList}]})});
    var d=await res.json();
    var txt=d.content.map(function(b){return b.text||"";}).join("").replace(/```json|```/g,"").trim();
    return JSON.parse(txt);
  }

  // ── Auto-detect for single sheet ─────────────────────────────────────────
  async function autoDetect(){
    if(!newSheet.trim()){setAddErr("Enter a Sheet ID first");return;}
    if(!apiKey.trim()){setAddErr("Enter your Google Sheets API key first");return;}
    setDetecting(true);setDetectionResult(null);setAddErr("");setNewComp("");
    try{
      var{sheetTitle,headers,firstRow}=await fetchSheetInfo(newSheet.trim());
      var parsed=await aiIdentifyCompany(sheetTitle,headers,firstRow);
      var matched=parsed.company?p.companies.find(function(c){return c.name.toLowerCase()===parsed.company.toLowerCase();}):null;
      setDetectionResult({sheetTitle,company:matched||null,companyName:parsed.company,confidence:parsed.confidence,reason:parsed.reason});
      if(matched)setNewComp(matched.id);
    }catch(e){setAddErr("Detection failed: "+e.message);}
    setDetecting(false);
  }

  // ── Sync a single connection ─────────────────────────────────────────────
  async function syncSheet(conn){
    if(!apiKey.trim()){setResults(function(prev){var n=Object.assign({},prev);n[conn.companyId]={error:"No API key set."};return n;});return;}
    setSyncing(conn.companyId);
    setResults(function(prev){var n=Object.assign({},prev);n[conn.companyId]={loading:true};return n;});
    try{
      var{values}=await fetchSheetInfo(conn.sheetId);
      if(values.length<2){setResults(function(prev){var n=Object.assign({},prev);n[conn.companyId]={error:"Sheet is empty or has no responses yet."};return n;});setSyncing(null);return;}
      var headers=values[0];var responseRows=values.slice(1);
      var mapping=await aiMapColumns(headers);
      var latestRow=responseRows[responseRows.length-1];
      var imported={};var count=0;
      headers.forEach(function(h,i){var fid=mapping[h];if(fid&&latestRow[i]&&String(latestRow[i]).trim()){imported[fid]=String(latestRow[i]).trim();count++;}});
      p.onImport(conn.companyId,imported);
      setResults(function(prev){var n=Object.assign({},prev);n[conn.companyId]={success:true,count:count,rows:responseRows.length,lastSync:new Date().toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})};return n;});
    }catch(e){setResults(function(prev){var n=Object.assign({},prev);n[conn.companyId]={error:e.message};return n;});}
    setSyncing(null);
  }

  function syncAll(){connections.forEach(function(c){syncSheet(c);});}

  function addConnection(){
    if(!newComp){setAddErr("Select or detect a company first");return;}
    if(!newSheet.trim()){setAddErr("Enter a Sheet ID");return;}
    if(connections.find(function(c){return c.companyId===newComp;})){setAddErr("This company already has a sheet connected");return;}
    var conn={companyId:newComp,sheetId:newSheet.trim(),sheetTitle:detectionResult?detectionResult.sheetTitle:""};
    setConnections(function(prev){return prev.concat([conn]);});
    setNewComp("");setNewSheet("");setDetectionResult(null);setAddErr("");
  }

  function removeConnection(id){setConnections(function(prev){return prev.filter(function(c){return c.companyId!==id;});});}

  // ── Bulk import ──────────────────────────────────────────────────────────
  async function runBulkDetect(){
    var ids=bulkText.split(/[\n,]+/).map(function(s){return s.trim();}).filter(function(s){return s.length>10;});
    if(!ids.length){return;}
    if(!apiKey.trim()){return;}
    setBulkRunning(true);
    var results=ids.map(function(id){return{sheetId:id,status:"pending",company:null,confidence:null,sheetTitle:"",err:null};});
    setBulkResults(results.slice());

    for(var i=0;i<results.length;i++){
      var item=results[i];
      try{
        var{sheetTitle,headers,firstRow}=await fetchSheetInfo(item.sheetId);
        var parsed=await aiIdentifyCompany(sheetTitle,headers,firstRow);
        var matched=parsed.company?p.companies.find(function(c){return c.name.toLowerCase()===parsed.company.toLowerCase();}):null;
        item.sheetTitle=sheetTitle;
        item.company=matched||null;
        item.companyName=parsed.company;
        item.confidence=parsed.confidence;
        item.reason=parsed.reason;
        item.status=matched?"matched":"unmatched";
      }catch(e){item.status="error";item.err=e.message;}
      setBulkResults(results.slice());
    }
    setBulkRunning(false);
  }

  function bulkConfirm(){
    var added=0;
    bulkResults.forEach(function(item){
      if(item.status!=="matched"||!item.company)return;
      if(connections.find(function(c){return c.companyId===item.company.id;}))return;
      added++;
      setConnections(function(prev){return prev.concat([{companyId:item.company.id,sheetId:item.sheetId,sheetTitle:item.sheetTitle}]);});
    });
    setBulkResults([]);setBulkText("");
  }

  var confidenceColor=function(c){return c==="high"?C.green:c==="medium"?C.amber:C.red;};
  var confidenceBg=function(c){return c==="high"?C.greenL:c==="medium"?C.amberL:C.redL;};
  var fldStyle={fontSize:13,height:36,padding:"0 10px",border:"1px solid "+C.grayM,borderRadius:7,fontFamily:"inherit",background:"white",color:C.grayD,outline:"none",boxSizing:"border-box"};

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:20}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:11,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.08em"}}>{"Google Sheets sync"}</div>
          <div style={{fontSize:12,color:C.gray,marginTop:3}}>{"AI auto-detects which company filled in each form"}</div>
        </div>
        {connections.length>0&&<Btn onClick={syncAll} variant="teal" size="sm">{syncing?"Syncing...":"Sync all"}</Btn>}
      </div>

      {/* API Key */}
      <div style={{background:"white",border:"1px solid "+C.grayM,borderRadius:12,padding:"14px 16px"}}>
        <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:8}}>{"Google Sheets API key"}</div>
        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
          <input type={showKey?"text":"password"} value={apiKey} onChange={function(e){setApiKey(e.target.value);}} placeholder="AIzaSy..." style={{...fldStyle,flex:1}}/>
          <Btn onClick={function(){setShowKey(function(v){return !v;});}} size="sm" variant="soft">{showKey?"Hide":"Show"}</Btn>
        </div>
        <div style={{fontSize:11,color:C.gray}}>{"From Google Cloud Console › Credentials. Sheet must be shared as 'Anyone with the link can view'."}</div>
      </div>

      {/* Connected sheets */}
      {connections.length>0&&(
        <div style={{background:"white",border:"1px solid "+C.grayM,borderRadius:12,padding:"14px 16px"}}>
          <div style={{fontSize:12,fontWeight:600,color:C.navy,marginBottom:10}}>{"Connected sheets ("+connections.length+")"}</div>
          {connections.map(function(conn){
            var company=p.companies.find(function(c){return c.id===conn.companyId;});
            var res=results[conn.companyId];var isSyncing=syncing===conn.companyId;
            return(
              <div key={conn.companyId} style={{padding:"11px 13px",border:"1px solid "+C.grayM,borderRadius:9,background:C.grayL,marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:res?8:0}}>
                  {company&&<Ava name={company.name} size={26}/>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{company?company.name:conn.companyId}</div>
                    <div style={{fontSize:11,color:C.gray,fontFamily:"var(--font-mono)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{conn.sheetTitle||conn.sheetId}</div>
                  </div>
                  <div style={{display:"flex",gap:6,flexShrink:0}}>
                    <Btn onClick={function(){syncSheet(conn);}} variant="teal" size="sm" style={{minWidth:80}}>{isSyncing?"Syncing...":"Sync now"}</Btn>
                    <Btn onClick={function(){removeConnection(conn.companyId);}} variant="danger" size="sm">{"Remove"}</Btn>
                  </div>
                </div>
                {res&&res.loading&&<div style={{fontSize:12,color:C.blue,padding:"5px 9px"}}>{"Fetching and mapping sheet data..."}</div>}
                {res&&!res.loading&&res.error&&<div style={{fontSize:12,padding:"7px 10px",borderRadius:7,background:C.redL,color:C.redD,border:"1px solid #FECACA"}}>{"Error: "+res.error}</div>}
                {res&&!res.loading&&res.success&&<div style={{fontSize:12,padding:"7px 10px",borderRadius:7,background:C.greenL,color:C.greenD,border:"1px solid #BBF7D0"}}>{"Synced "+res.count+" fields from "+res.rows+" response"+(res.rows!==1?"s":"")+" · Last sync: "+res.lastSync}</div>}
              </div>
            );
          })}
        </div>
      )}

      {/* Add new — tabs: Single / Bulk */}
      <div style={{background:"white",border:"1px solid "+C.grayM,borderRadius:12,overflow:"hidden"}}>
        <div style={{display:"flex",borderBottom:"1px solid "+C.grayM,background:C.grayL}}>
          {[["single","Add single sheet"],["bulk","Bulk import"]].map(function(x){return(
            <button key={x[0]} type="button" onClick={function(){setTab(x[0]);setAddErr("");setDetectionResult(null);}} style={{fontSize:13,padding:"10px 16px",border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",color:tab===x[0]?C.navy:C.gray,fontWeight:tab===x[0]?600:400,borderBottom:tab===x[0]?"2.5px solid "+C.blue:"2.5px solid transparent",marginBottom:-1}}>{x[1]}</button>
          );})}
        </div>

        <div style={{padding:"16px"}}>
          {/* ── SINGLE TAB ── */}
          {tab==="single"&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{padding:"10px 13px",background:C.blueL,borderRadius:9,border:"1px solid #BFDBFE",fontSize:12,color:C.blueD,lineHeight:1.7}}>
                {"Paste a Sheet ID below and click "}<strong>{"Auto-detect company"}</strong>{" — AI reads the spreadsheet title and response data to identify which firm filled it in."}
              </div>

              {/* Sheet ID input */}
              <div>
                <div style={{fontSize:11,fontWeight:600,color:C.gray,marginBottom:5}}>{"Google Sheet ID"}</div>
                <div style={{display:"flex",gap:8}}>
                  <input value={newSheet} onChange={function(e){setNewSheet(e.target.value);setDetectionResult(null);setNewComp("");setAddErr("");}} placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms" style={{...fldStyle,flex:1}}/>
                  <Btn onClick={autoDetect} variant={detectionResult&&detectionResult.company?"teal":"primary"} style={{flexShrink:0,minWidth:140}}>
                    {detecting?"Detecting...":detectionResult?"Re-detect":"Auto-detect company"}
                  </Btn>
                </div>
                <div style={{fontSize:11,color:C.gray,marginTop:4}}>{"Find the Sheet ID in the URL between /d/ and /edit"}</div>
              </div>

              {/* Detection result */}
              {detectionResult&&(
                <div style={{padding:"12px 14px",borderRadius:10,border:"1px solid "+(detectionResult.company?C.green:C.amber),background:detectionResult.company?C.greenL:C.amberL}}>
                  <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
                    <div style={{fontSize:18,flexShrink:0,marginTop:1}}>{detectionResult.company?"✅":"⚠️"}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:600,color:detectionResult.company?C.greenD:C.amberD,marginBottom:3}}>
                        {detectionResult.company?"Detected: "+detectionResult.company.name:"Company not matched"}
                      </div>
                      {detectionResult.sheetTitle&&<div style={{fontSize:12,color:C.gray,marginBottom:4}}>{"Sheet title: \""}{detectionResult.sheetTitle}{"\" "}<span style={{padding:"1px 7px",borderRadius:10,fontSize:10,fontWeight:600,background:confidenceBg(detectionResult.confidence),color:confidenceColor(detectionResult.confidence)}}>{detectionResult.confidence+" confidence"}</span></div>}
                      <div style={{fontSize:12,color:C.gray}}>{detectionResult.reason}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Manual override */}
              <div>
                <div style={{fontSize:11,fontWeight:600,color:C.gray,marginBottom:5}}>{detectionResult?"Override company (optional)":"Or select company manually"}</div>
                <select value={newComp} onChange={function(e){setNewComp(e.target.value);setAddErr("");}} style={{...fldStyle,width:"100%",cursor:"pointer"}}>
                  <option value="">{"Select company..."}</option>
                  {p.companies.filter(function(c){return !connections.find(function(x){return x.companyId===c.id;});}).map(function(c){return <option key={c.id} value={c.id}>{c.name}</option>;})}
                </select>
              </div>

              {addErr&&<div style={{fontSize:12,color:C.red,padding:"7px 10px",background:C.redL,borderRadius:7}}>{addErr}</div>}

              <div style={{display:"flex",gap:8}}>
                <Btn onClick={addConnection} variant="primary">{"Add connection"}</Btn>
              </div>
            </div>
          )}

          {/* ── BULK TAB ── */}
          {tab==="bulk"&&(
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{padding:"10px 13px",background:C.blueL,borderRadius:9,border:"1px solid #BFDBFE",fontSize:12,color:C.blueD,lineHeight:1.7}}>
                {"Paste all your Sheet IDs (one per line). AI will fetch each sheet and detect which company filled it in automatically."}
              </div>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:C.gray,marginBottom:5}}>{"Sheet IDs (one per line)"}</div>
                <textarea value={bulkText} onChange={function(e){setBulkText(e.target.value);}} placeholder={"1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms\n1AbcDefGhi...\n1XyzMnoPqr..."} rows={5} style={{...fldStyle,height:"auto",width:"100%",padding:"9px 10px",resize:"vertical",lineHeight:1.6}}/>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn onClick={runBulkDetect} variant="primary" style={{minWidth:140}}>{bulkRunning?"Detecting...":"Detect all companies"}</Btn>
                {bulkResults.some(function(r){return r.status==="matched";})&&<Btn onClick={bulkConfirm} variant="teal">{"Connect matched sheets"}</Btn>}
              </div>

              {/* Bulk results list */}
              {bulkResults.length>0&&(
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  <div style={{fontSize:11,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:2}}>{"Detection results"}</div>
                  {bulkResults.map(function(item,i){
                    var isLoading=item.status==="pending"&&bulkRunning;
                    return(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 13px",background:item.status==="matched"?C.greenL:item.status==="error"?C.redL:item.status==="unmatched"?C.amberL:C.grayL,border:"1px solid "+(item.status==="matched"?"#BBF7D0":item.status==="error"?"#FECACA":item.status==="unmatched"?"#FDE68A":C.grayM),borderRadius:9}}>
                        <div style={{fontSize:16,flexShrink:0}}>{isLoading?"⏳":item.status==="matched"?"✅":item.status==="error"?"❌":item.status==="unmatched"?"⚠️":"⏸️"}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontFamily:"var(--font-mono)",color:C.gray,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",marginBottom:2}}>{item.sheetId}</div>
                          {item.sheetTitle&&<div style={{fontSize:11,color:C.gray,marginBottom:2}}>{"Sheet: \""+item.sheetTitle+"\""}</div>}
                          {item.status==="matched"&&<div style={{fontSize:13,fontWeight:600,color:C.greenD}}>{item.company.name}<span style={{fontWeight:400,color:C.greenD,marginLeft:6,fontSize:11,opacity:0.8}}>{"("+item.confidence+" confidence)"}</span></div>}
                          {item.status==="unmatched"&&<div style={{fontSize:12,color:C.amberD}}>{"Detected \""+item.companyName+"\" — not in your provider list"}</div>}
                          {item.status==="error"&&<div style={{fontSize:12,color:C.redD}}>{item.err}</div>}
                          {isLoading&&<div style={{fontSize:12,color:C.gray}}>{"Detecting..."}</div>}
                        </div>
                        {item.status==="matched"&&<Chip color="green">{"Ready to connect"}</Chip>}
                        {item.status==="unmatched"&&<Chip color="amber">{"No match"}</Chip>}
                        {item.status==="error"&&<Chip color="red">{"Error"}</Chip>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsView(p){
  var[editing,setEditing]=useState(null);var[editVal,setEditVal]=useState("");
  var[serpKey,setSerpKey]=useState(function(){return lsGet(SK+"_serp","");});
  var[showSerp,setShowSerp]=useState(false);
  var[testState,setTestState]=useState("idle"); // idle | testing | ok | fail
  var[testMsg,setTestMsg]=useState("");
  useEffect(function(){lsSet(SK+"_serp",serpKey);},[serpKey]);

  async function testConnection(){
    if(!serpKey.trim())return;
    setTestState("testing");setTestMsg("");
    try{
      var workerUrl="https://timeline-dd-proxy.aston-kingsford-bere.workers.dev/";
      var url=workerUrl+"?q="+encodeURIComponent("FCA register UK")+"&key="+encodeURIComponent(serpKey.trim())+"&num=1";
      var res=await fetch(url);
      if(!res.ok)throw new Error("HTTP "+res.status);
      var data=await res.json();
      if(data.error)throw new Error(data.error);
      setTestState("ok");
      setTestMsg("Connection successful — live web search is working and ready for board reports.");
    }catch(e){
      setTestState("fail");
      setTestMsg("Failed: "+e.message+". Check your SerpAPI key is correct.");
    }
  }

  var fldSt={fontSize:13,height:36,padding:"0 10px",border:"1px solid "+C.grayM,borderRadius:7,fontFamily:"inherit",background:"white",color:C.grayD,outline:"none",boxSizing:"border-box"};
  return(
    <div style={{flex:1,padding:"1.75rem 2rem",overflowY:"auto",background:C.grayL}}>
      <div style={{marginBottom:"1.5rem"}}><h1 style={{fontSize:22,fontWeight:700,margin:"0 0 3px",color:C.navy}}>{"Settings"}</h1><p style={{fontSize:13,color:C.gray,margin:0}}>{"Manage provider contacts, Google Sheets sync, and portal data."}</p></div>

      {/* SerpAPI key — powers Board Report web research */}
      <div style={{marginBottom:"1.5rem"}}>
        <div style={{fontSize:11,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>{"Board report — web research"}</div>
        <div style={{background:"white",border:"1px solid "+C.grayM,borderRadius:12,padding:"16px 18px"}}>
          <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:12}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.navy,marginBottom:3}}>{"SerpAPI key"}</div>
              <div style={{fontSize:12,color:C.gray,lineHeight:1.6}}>{"Used by the Board Report agent to search the FCA register, Companies House, and the web for each platform. Free tier: 100 searches/month — no card required."}</div>
            </div>
            <a href="https://serpapi.com" target="_blank" rel="noreferrer" style={{fontSize:12,color:C.blue,whiteSpace:"nowrap",marginTop:2,textDecoration:"none",flexShrink:0}}>{"Get free key →"}</a>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10}}>
            <input
              type={showSerp?"text":"password"}
              value={serpKey}
              onChange={function(e){setSerpKey(e.target.value);setTestState("idle");setTestMsg("");}}
              placeholder={"Paste your SerpAPI key here..."}
              style={{...fldSt,flex:1}}
            />
            <Btn size="sm" variant="soft" onClick={function(){setShowSerp(function(v){return !v;});}}>{showSerp?"Hide":"Show"}</Btn>
            <Btn size="sm" variant={testState==="ok"?"teal":testState==="fail"?"danger":"primary"} onClick={testConnection}>{testState==="testing"?"Testing...":testState==="ok"?"✓ Connected":testState==="fail"?"Failed — retry":"Test connection"}</Btn>
          </div>
          {testMsg&&<div style={{fontSize:12,padding:"8px 12px",borderRadius:7,background:testState==="ok"?C.greenL:C.redL,color:testState==="ok"?C.greenD:C.redD,border:"1px solid "+(testState==="ok"?"#BBF7D0":"#FECACA")}}>{testMsg}</div>}
          {!testMsg&&serpKey&&<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:C.green}}/><span style={{fontSize:11,color:C.greenD,fontWeight:500}}>{"Key saved — click Test connection to verify it works"}</span></div>}
          {!serpKey&&<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:C.amber}}/><span style={{fontSize:11,color:C.amberD}}>{"No key set — Board Report will use questionnaire data only"}</span></div>}
        </div>
      </div>

      <SheetSync companies={p.companies} onImport={p.onImport}/>
      <div style={{marginBottom:"1.25rem"}}>
        <div style={{fontSize:11,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>{"Provider contacts"}</div>
        <div style={{background:"white",border:"1px solid "+C.grayM,borderRadius:12,overflow:"hidden"}}>
          <div style={{display:"grid",gridTemplateColumns:"2fr 2.5fr 1fr 80px",background:C.grayL,padding:"8px 16px",borderBottom:"1px solid "+C.grayM}}>
            {["Provider","Email","Type",""].map(function(h,i){return <span key={i} style={{fontSize:10,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.07em"}}>{h}</span>;})}
          </div>
          {p.companies.map(function(c,ci){var isEd=editing===c.id;return(
            <div key={c.id} style={{display:"grid",gridTemplateColumns:"2fr 2.5fr 1fr 80px",alignItems:"center",padding:"10px 16px",borderBottom:ci<p.companies.length-1?"1px solid "+C.grayM:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><Ava name={c.name} size={24}/><span style={{fontSize:13,fontWeight:600,color:C.navy}}>{c.name}</span></div>
              <div>{isEd?<div style={{display:"flex",gap:7}}><input value={editVal} onChange={function(e){setEditVal(e.target.value);}} style={{fontSize:13,height:30,padding:"0 10px",border:"1px solid "+C.grayM,borderRadius:6,fontFamily:"inherit",flex:1,background:"white",color:C.grayD,outline:"none",minWidth:0}}/><Btn size="sm" variant="primary" onClick={function(){p.onUpdateCompany(c.id,{contactEmail:editVal});setEditing(null);}}>{"Save"}</Btn></div>:<span style={{fontSize:12,color:C.gray,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",display:"block"}}>{c.contactEmail||<span style={{color:C.red}}>{"No email"}</span>}</span>}</div>
              <span style={{fontSize:12,color:C.gray}}>{c.type}</span>
              <div>{!isEd&&<Btn size="sm" onClick={function(){setEditing(c.id);setEditVal(c.contactEmail||"");}}>{"Edit"}</Btn>}</div>
            </div>
          );})}
        </div>
      </div>
      <div style={{padding:"15px 17px",background:C.redL,borderRadius:10,border:"1px solid #FECACA",display:"flex",justifyContent:"space-between",alignItems:"center",gap:14}}>
        <div><div style={{fontSize:13,fontWeight:600,color:C.redD,marginBottom:2}}>{"Reset all data"}</div><div style={{fontSize:12,color:C.red}}>{"Clear all questionnaire responses and assessment data."}</div></div>
        <Btn variant="danger" onClick={p.onClearAll} style={{flexShrink:0}}>{"Reset"}</Btn>
      </div>
    </div>
  );
}

function AddProviderPage(p){
  var[name,setName]=useState("");var[type,setType]=useState("Platform");var[email,setEmail]=useState("");var[err,setErr]=useState({});
  var inp={fontSize:14,width:"100%",height:42,background:"white",color:C.grayD,borderRadius:8,padding:"0 12px",fontFamily:"inherit",boxSizing:"border-box",outline:"none"};
  function handle(){var e={};if(!name.trim())e.name="Required";if(!email.trim())e.email="Required";else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))e.email="Invalid email";var id=name.trim().toLowerCase().replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"");if(p.existingIds.indexOf(id)>=0)e.name="Already exists";setErr(e);if(Object.keys(e).length)return;p.onAdd({id:id,name:name.trim(),type:type,contactEmail:email,addedDate:TODAY.toISOString().slice(0,10),sentDate:null});}
  return(
    <div style={{flex:1,overflowY:"auto",padding:"1.75rem 2rem",background:C.grayL}}>
      <div style={{maxWidth:500,margin:"0 auto"}}>
        <div style={{marginBottom:24}}><Btn onClick={p.onCancel} size="sm" variant="ghost" style={{marginBottom:16}}>{"Back"}</Btn><h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:C.navy}}>{"Add provider"}</h1><p style={{fontSize:13,color:C.gray,margin:0}}>{"Add a new third-party provider to begin the due diligence assessment."}</p></div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"white",border:"1px solid "+C.grayM,borderRadius:12,padding:"18px 20px",display:"flex",flexDirection:"column",gap:16}}>
            <div style={{fontSize:11,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.08em"}}>{"Provider details"}</div>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:8,color:C.navy}}>{"Name "}<span style={{color:C.red}}>{"*"}</span></label><input value={name} onChange={function(e){setName(e.target.value);setErr(function(p){var n=Object.assign({},p);delete n.name;return n;});}} placeholder="e.g. Platform name" style={{...inp,border:err.name?"1.5px solid "+C.red:"1px solid "+C.grayM}}/>{err.name&&<div style={{fontSize:12,color:C.red,marginTop:5}}>{err.name}</div>}</div>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:9,color:C.navy}}>{"Type "}<span style={{color:C.red}}>{"*"}</span></label><div style={{display:"flex",flexWrap:"wrap",gap:7}}>{["Platform","Asset Manager","Investment Bank","Pension Provider","Other"].map(function(t){var sel=type===t;return <button key={t} type="button" onClick={function(){setType(t);}} style={{fontSize:12,padding:"6px 14px",borderRadius:20,border:sel?"2px solid "+C.blue:"1px solid "+C.grayM,background:sel?C.blueL:"white",color:sel?C.blueD:C.gray,cursor:"pointer",fontFamily:"inherit",fontWeight:sel?600:400}}>{t}</button>;})}</div></div>
          </div>
          <div style={{background:"white",border:"1px solid "+C.grayM,borderRadius:12,padding:"18px 20px",display:"flex",flexDirection:"column",gap:16}}>
            <div style={{fontSize:11,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.08em"}}>{"Contact"}</div>
            <div><label style={{fontSize:13,fontWeight:600,display:"block",marginBottom:8,color:C.navy}}>{"Compliance contact email "}<span style={{color:C.red}}>{"*"}</span></label><input type="email" value={email} onChange={function(e){setEmail(e.target.value);setErr(function(p){var n=Object.assign({},p);delete n.email;return n;});}} placeholder="compliance@provider.com" style={{...inp,border:err.email?"1.5px solid "+C.red:"1px solid "+C.grayM}}/>{err.email&&<div style={{fontSize:12,color:C.red,marginTop:5}}>{err.email}</div>}<div style={{fontSize:12,color:C.gray,marginTop:6}}>{"Receives questionnaire invitations and automated reminders."}</div></div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",paddingTop:6}}><Btn onClick={p.onCancel}>{"Cancel"}</Btn><Btn onClick={handle} variant="primary" size="lg">{"Add provider"}</Btn></div>
        </div>
      </div>
    </div>
  );
}

function CsvImporter(p){
  // steps: upload → processing → confirm → done
  var[step,setStep]=useState("upload");
  var[dragOver,setDragOver]=useState(false);
  var[processingMsg,setProcessingMsg]=useState("");
  var[detectedCompany,setDetectedCompany]=useState(null);
  var[detectedName,setDetectedName]=useState("");
  var[manualOverride,setManualOverride]=useState("");
  var[mappedFields,setMappedFields]=useState({});
  var[importResults,setImportResults]=useState([]);
  var[errorMsg,setErrorMsg]=useState("");
  var fileRef=useRef(null);
  var allQs=useMemo(function(){return ALL_SECTIONS.reduce(function(a,s){return a.concat(s.questions);},[]);},[]);

  function parseCSV(text){
    var lines=text.split(/\r?\n/).filter(function(l){return l.trim();});
    if(lines.length<2)return{headers:[],rows:[]};
    function splitLine(line){var res=[];var cur="";var inQ=false;for(var i=0;i<line.length;i++){var ch=line[i];if(ch==='"'){inQ=!inQ;}else if(ch===","&&!inQ){res.push(cur.trim().replace(/^"|"$/g,""));cur="";}else{cur+=ch;}}res.push(cur.trim().replace(/^"|"$/g,""));return res;}
    var hdrs=splitLine(lines[0]);
    var rs=lines.slice(1).map(function(l){var vals=splitLine(l);var obj={};hdrs.forEach(function(h,i){obj[h]=vals[i]||"";});return obj;});
    return{headers:hdrs,rows:rs};
  }

  // Find the platform name value from the most recent row using the known column header
  function extractPlatformName(headers,rows){
    var latestRow=rows[rows.length-1];
    // Try exact or fuzzy match on "platform name" in header
    var col=headers.find(function(h){return h.toLowerCase().indexOf("platform name")>=0;});
    if(col&&latestRow[col]&&latestRow[col].trim())return latestRow[col].trim();
    // Fallback: any column whose value loosely matches a known company name
    return null;
  }

  // Fuzzy company match: exact first, then partial
  function matchCompany(platformName){
    if(!platformName)return null;
    var lower=platformName.toLowerCase().trim();
    var exact=p.companies.find(function(c){return c.name.toLowerCase()===lower;});
    if(exact)return exact;
    var partial=p.companies.find(function(c){
      return lower.indexOf(c.name.toLowerCase())>=0||c.name.toLowerCase().indexOf(lower)>=0;
    });
    return partial||null;
  }

  function handleDrop(e){e.preventDefault();setDragOver(false);var f=e.dataTransfer.files[0];if(f)processFile(f);}

  function processFile(file){
    if(!file)return;
    var reader=new FileReader();
    reader.onload=function(e){
      var parsed=parseCSV(e.target.result);
      if(!parsed.headers.length||!parsed.rows.length){
        setErrorMsg("The CSV appears to be empty. Please export a sheet that has at least one response row.");
        return;
      }
      setStep("processing");
      setProcessingMsg("Reading your CSV...");
      setErrorMsg("");

      // Step 1: extract platform name and match company
      var platformName=extractPlatformName(parsed.headers,parsed.rows);
      var matched=matchCompany(platformName);
      setDetectedName(platformName||"");
      setDetectedCompany(matched);
      setManualOverride(matched?matched.id:"");

      // Step 2: AI column mapping
      setProcessingMsg("AI is mapping your form columns to questionnaire fields...");
      var qList=allQs.map(function(q){return q.id+": "+q.label.slice(0,80);}).join("\n");
      var latestRow=parsed.rows[parsed.rows.length-1];

      fetch("/api/claude",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:2000,
          messages:[{role:"user",content:"Map these Google Forms column headers to questionnaire field IDs. Return ONLY a valid JSON object. Keys are the column headers, values are field IDs (empty string if no match). Skip Timestamp, email address columns, and any column that is not a questionnaire answer.\n\nHEADERS:\n"+parsed.headers.join("\n")+"\n\nQUESTIONNAIRE FIELDS:\n"+qList}]
        })
      })
      .then(function(r){return r.json();})
      .then(function(d){
        var txt=d.content.map(function(b){return b.text||"";}).join("").replace(/```json|```/g,"").trim();
        var columnMap=JSON.parse(txt);
        // Build fieldId → answer from latest row
        var fields={};
        parsed.headers.forEach(function(h){
          var fid=columnMap[h];
          if(fid&&latestRow[h]&&String(latestRow[h]).trim()){
            fields[fid]=String(latestRow[h]).trim();
          }
        });
        setMappedFields(fields);
        setProcessingMsg("");
        setStep("confirm");
      })
      .catch(function(err){
        setProcessingMsg("");
        setErrorMsg("AI mapping failed: "+err.message+". Please try again.");
        setStep("upload");
      });
    };
    reader.readAsText(file);
  }

  function doImport(){
    var companyId=manualOverride;
    if(!companyId){setErrorMsg("Please select a company to import into.");return;}
    var company=p.companies.find(function(c){return c.id===companyId;});
    p.onImport(companyId,mappedFields);
    setImportResults([{name:company?company.name:companyId,count:Object.keys(mappedFields).length}]);
    setStep("done");
  }

  function reset(){
    setStep("upload");setDetectedCompany(null);setDetectedName("");
    setManualOverride("");setMappedFields({});setImportResults([]);setErrorMsg("");setProcessingMsg("");
  }

  var fieldCount=Object.keys(mappedFields).length;
  var activeCompany=p.companies.find(function(c){return c.id===manualOverride;})||detectedCompany;
  var fldSt={fontSize:13,height:36,padding:"0 10px",border:"1px solid "+C.grayM,borderRadius:7,fontFamily:"inherit",background:"white",color:C.grayD,outline:"none",width:"100%",boxSizing:"border-box"};

  return(
    <div style={{flex:1,overflowY:"auto",padding:"1.75rem 2rem",background:C.grayL}}>
      <div style={{maxWidth:560,margin:"0 auto"}}>

        {/* Header */}
        <div style={{marginBottom:24}}>
          <Btn onClick={p.onBack} size="sm" variant="ghost" style={{marginBottom:16}}>{"Back"}</Btn>
          <h1 style={{fontSize:22,fontWeight:700,margin:"0 0 4px",color:C.navy}}>{"Import from Google Forms"}</h1>
          <p style={{fontSize:13,color:C.gray,margin:0}}>{"Drop a CSV export and DD Hub automatically identifies the firm and populates all fields."}</p>
        </div>

        {/* Step indicators */}
        <div style={{display:"flex",gap:0,marginBottom:"1.5rem",borderBottom:"1px solid "+C.grayM}}>
          {[["upload","1. Upload"],["processing","2. Processing"],["confirm","3. Confirm"],["done","4. Done"]].map(function(x,i){
            var order=["upload","processing","confirm","done"];
            var active=step===x[0];
            var done=order.indexOf(step)>i;
            return <div key={x[0]} style={{fontSize:12,padding:"8px 14px",fontWeight:active?600:400,color:active?C.blue:done?C.green:C.gray,borderBottom:active?"2.5px solid "+C.blue:done?"2.5px solid "+C.green:"2.5px solid transparent",marginBottom:-1}}>{done?"✓ ":""}{x[1]}</div>;
          })}
        </div>

        {/* ── UPLOAD ── */}
        {step==="upload"&&(
          <div>
            <div style={{marginBottom:14,padding:"13px 16px",background:C.blueL,borderRadius:10,border:"1px solid #BFDBFE"}}>
              <div style={{fontSize:13,fontWeight:600,color:C.blueD,marginBottom:6}}>{"How to export from Google Forms"}</div>
              <div style={{fontSize:13,color:C.blueD,lineHeight:2}}>
                {"1. Open your Google Form → click Responses\n2. Click the Google Sheets icon to open in Sheets\n3. In Sheets: File → Download → Comma Separated Values (.csv)\n4. Drop the downloaded file below"}
              </div>
            </div>
            {errorMsg&&<div style={{marginBottom:12,padding:"10px 14px",background:C.redL,border:"1px solid #FECACA",borderRadius:8,fontSize:13,color:C.redD}}>{errorMsg}</div>}
            <div
              onDragOver={function(e){e.preventDefault();setDragOver(true);}}
              onDragLeave={function(){setDragOver(false);}}
              onDrop={handleDrop}
              onClick={function(){fileRef.current&&fileRef.current.click();}}
              style={{border:"2px dashed "+(dragOver?C.blue:C.grayM),borderRadius:12,padding:"3rem 2rem",textAlign:"center",background:dragOver?C.blueL:"white",cursor:"pointer"}}
            >
              <div style={{fontSize:36,marginBottom:12}}>{"📄"}</div>
              <div style={{fontSize:14,fontWeight:600,color:C.navy,marginBottom:6}}>{"Drop your CSV file here"}</div>
              <div style={{fontSize:13,color:C.gray,marginBottom:16}}>{"or click to browse"}</div>
              <Btn variant="primary">{"Choose CSV file"}</Btn>
              <input ref={fileRef} type="file" accept=".csv" style={{display:"none"}} onChange={function(e){processFile(e.target.files[0]);}}/>
            </div>
          </div>
        )}

        {/* ── PROCESSING ── */}
        {step==="processing"&&(
          <div style={{padding:"3rem 2rem",textAlign:"center",background:"white",borderRadius:12,border:"1px solid "+C.grayM}}>
            <div style={{width:48,height:48,borderRadius:"50%",background:C.blueL,border:"2px solid #BFDBFE",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
            </div>
            <div style={{fontSize:15,fontWeight:600,color:C.navy,marginBottom:8}}>{"Processing your form..."}</div>
            <div style={{fontSize:13,color:C.gray,lineHeight:1.7}}>{processingMsg}</div>
            <div style={{marginTop:18,display:"flex",gap:4,justifyContent:"center"}}>
              {[0,1,2].map(function(i){return <div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.blue,opacity:0.3+i*0.35}}/>;})}</div>
          </div>
        )}

        {/* ── CONFIRM ── */}
        {step==="confirm"&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>

            {/* Detected company card */}
            <div style={{background:"white",border:"1px solid "+C.grayM,borderRadius:12,padding:"16px 18px"}}>
              <div style={{fontSize:11,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>{"Detected firm"}</div>
              {detectedName&&(
                <div style={{fontSize:12,color:C.gray,marginBottom:8}}>
                  {"Platform name in form: "}<span style={{fontWeight:600,color:C.navy}}>{"\""+detectedName+"\""}</span>
                </div>
              )}
              {detectedCompany?(
                <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:C.greenL,borderRadius:9,border:"1px solid #BBF7D0",marginBottom:10}}>
                  <Ava name={detectedCompany.name} size={30}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.greenD}}>{detectedCompany.name}</div>
                    <div style={{fontSize:11,color:C.greenD,marginTop:1}}>{"Auto-matched from platform name"}</div>
                  </div>
                  <Chip color="green">{"Matched"}</Chip>
                </div>
              ):(
                <div style={{padding:"10px 12px",background:C.amberL,borderRadius:9,border:"1px solid #FDE68A",marginBottom:10,fontSize:13,color:C.amberD}}>
                  {"Could not auto-match \""+(detectedName||"unknown")+"\" to a provider in your dashboard. Please select manually below."}
                </div>
              )}
              <div style={{fontSize:11,fontWeight:600,color:C.gray,marginBottom:6}}>{detectedCompany?"Override firm (optional)":"Select firm"}</div>
              <select value={manualOverride} onChange={function(e){setManualOverride(e.target.value);setErrorMsg("");}} style={{...fldSt}}>
                <option value="">{"-- Select company --"}</option>
                {p.companies.map(function(c){return <option key={c.id} value={c.id}>{c.name}</option>;})}
              </select>
              {errorMsg&&<div style={{fontSize:12,color:C.red,marginTop:6}}>{errorMsg}</div>}
            </div>

            {/* Fields summary */}
            <div style={{background:"white",border:"1px solid "+C.grayM,borderRadius:12,padding:"16px 18px"}}>
              <div style={{fontSize:11,fontWeight:600,color:C.gray,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>{"Fields ready to import"}</div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                <div style={{width:52,height:52,borderRadius:10,background:C.blueL,border:"1px solid #BFDBFE",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:20,fontWeight:700,color:C.blueD}}>{fieldCount}</span>
                </div>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:C.navy}}>{fieldCount+" questionnaire fields mapped"}</div>
                  <div style={{fontSize:12,color:C.gray,marginTop:2}}>{"From the most recent submission in your CSV"}</div>
                </div>
              </div>
              {/* Show a preview of a few mapped fields */}
              <div style={{background:C.grayL,borderRadius:8,padding:"10px 12px",maxHeight:180,overflowY:"auto"}}>
                {Object.entries(mappedFields).slice(0,12).map(function(entry){
                  var fid=entry[0];var val=entry[1];
                  var q=allQs.find(function(q){return q.id===fid;});
                  return(
                    <div key={fid} style={{display:"flex",gap:8,marginBottom:7,alignItems:"flex-start"}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:C.green,flexShrink:0,marginTop:5}}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:11,color:C.gray,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{q?q.label.slice(0,60)+"...":fid}</div>
                        <div style={{fontSize:12,fontWeight:500,color:C.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{String(val).slice(0,80)}</div>
                      </div>
                    </div>
                  );
                })}
                {fieldCount>12&&<div style={{fontSize:11,color:C.gray,marginTop:4}}>{"...and "+(fieldCount-12)+" more fields"}</div>}
              </div>
            </div>

            <div style={{display:"flex",gap:8,justifyContent:"flex-end",paddingTop:4}}>
              <Btn onClick={reset}>{"Start over"}</Btn>
              <Btn onClick={doImport} variant="primary" size="lg">
                {"Import into "+(activeCompany?activeCompany.name:"selected firm")}
              </Btn>
            </div>
          </div>
        )}

        {/* ── DONE ── */}
        {step==="done"&&(
          <div>
            <div style={{textAlign:"center",padding:"2.5rem 2rem",background:"white",borderRadius:12,border:"1px solid "+C.grayM,marginBottom:14}}>
              <div style={{width:56,height:56,borderRadius:"50%",background:C.greenL,border:"2px solid #BBF7D0",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <div style={{fontSize:18,fontWeight:700,color:C.navy,marginBottom:6}}>{"Import complete"}</div>
              <div style={{fontSize:13,color:C.gray}}>{"Questionnaire responses have been imported to the dashboard."}</div>
            </div>
            {importResults.map(function(r){
              return(
                <div key={r.name} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"white",border:"1px solid "+C.grayM,borderRadius:10,marginBottom:8}}>
                  <Ava name={r.name} size={32}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{r.name}</div>
                    <div style={{fontSize:12,color:C.gray,marginTop:1}}>{r.count+" fields populated"}</div>
                  </div>
                  <Chip color="green">{"Done"}</Chip>
                </div>
              );
            })}
            <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:14}}>
              <Btn onClick={reset}>{"Import another"}</Btn>
              <Btn onClick={p.onBack} variant="primary">{"Go to dashboard"}</Btn>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


function BoardReport(p){
  var[selected,setSelected]=useState(function(){return p.companies.map(function(c){return c.id;});});
  var[phase,setPhase]=useState("idle");
  var[progress,setProgress]=useState([]);
  var[report,setReport]=useState("");
  var[copied,setCopied]=useState(false);
  var[reportDate]=useState(new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}));
  var allQs=useMemo(function(){return ALL_SECTIONS.reduce(function(a,s){return a.concat(s.questions);},[]);},[]);

  function toggleAll(){if(selected.length===p.companies.length)setSelected([]);else setSelected(p.companies.map(function(c){return c.id;}));}
  function toggle(id){setSelected(function(prev){return prev.includes(id)?prev.filter(function(x){return x!==id;}):prev.concat([id]);});}

  var serpApiKey=lsGet(SK+"_serp","");

  async function serpSearch(query){
    var workerUrl="https://timeline-dd-proxy.aston-kingsford-bere.workers.dev/";
    var url=workerUrl+"?q="+encodeURIComponent(query)+"&key="+encodeURIComponent(serpApiKey)+"&num=5";
    var res=await fetch(url);
    if(!res.ok)throw new Error("Worker returned HTTP "+res.status);
    var data=await res.json();
    if(data.error)throw new Error(data.error);
    var results=(data.organic_results||[]).slice(0,5);
    if(!results.length)return "No results found.";
    return results.map(function(r){return(r.title||"")+(r.snippet?": "+r.snippet:"")+(r.link?" ("+r.link+")":"");}).join("\n");
  }

  async function researchPlatform(company,fd){
    if(!serpApiKey){
      return "No SerpAPI key set — add one in Settings to enable live web research.";
    }
    var fcaRef=fd.e_fca_ref||"";
    var name=company.name;

    // Run three targeted searches in parallel
    var fcaQuery=fcaRef
      ?"FCA register \""+name+"\" reference "+fcaRef+" site:register.fca.org.uk OR site:fca.org.uk"
      :"FCA register \""+name+"\" financial services authorised site:register.fca.org.uk OR site:fca.org.uk";
    var chQuery="\""+name+"\" Companies House UK registration directors";
    var newsQuery="\""+name+"\" FCA regulatory action OR fine OR sanction OR breach OR enforcement 2024 OR 2025 OR 2026";

    var[fcaResults,chResults,newsResults]=await Promise.all([
      serpSearch(fcaQuery).catch(function(e){return "FCA search failed: "+e.message;}),
      serpSearch(chQuery).catch(function(e){return "Companies House search failed: "+e.message;}),
      serpSearch(newsQuery).catch(function(e){return "News search failed: "+e.message;}),
    ]);

    // Ask Claude to synthesise the raw results into a clean summary
    var prompt="Summarise the following web search results about '"+name+"' for a compliance due diligence report. Be factual and concise (150 words max). Include: FCA authorisation status and reference number if found, Companies House registration status, any regulatory actions or fines. If information is not found in the results, say so clearly.\n\nFCA Register results:\n"+fcaResults+"\n\nCompanies House results:\n"+chResults+"\n\nRegulatory news results:\n"+newsResults;

    var res=await fetch("/api/claude",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        model:"claude-haiku-4-5-20251001",
        max_tokens:400,
        messages:[{role:"user",content:prompt}]
      })
    });
    var d=await res.json();
    if(d.error)return "Synthesis error: "+d.error.message;
    return d.content.filter(function(b){return b.type==="text";}).map(function(b){return b.text;}).join("").trim()||"Research complete.";
  }

  async function generate(){
    if(!selected.length)return;
    setPhase("researching");setReport("");
    var chosen=p.companies.filter(function(c){return selected.includes(c.id);});
    setProgress(chosen.map(function(c){return{id:c.id,name:c.name,status:"pending",findings:""};}));
    // Small delay so the initial "pending" state renders before research starts
    await new Promise(function(r){setTimeout(r,80);});
    var enriched=[];
    for(var i=0;i<chosen.length;i++){
      // Capture id/name/data in local consts to avoid var-closure-in-loop bug
      var cid=chosen[i].id;
      var cname=chosen[i].name;
      var company=chosen[i];
      var fd=p.allData[cid]||{};
      // Mark as searching and flush to screen before the await
      setProgress(function(prev){return prev.map(function(r){return r.id===cid?Object.assign({},r,{status:"searching"}):r;});});
      // Yield to React so the "searching" state actually renders
      await new Promise(function(r){setTimeout(r,50);});
      var findings=await researchPlatform(company,fd).catch(function(e){return "Research failed ("+e.message+") — using questionnaire data only.";});
      // Mark done — cid is correctly captured per iteration
      var f=findings;
      setProgress(function(prev){return prev.map(function(r){return r.id===cid?Object.assign({},r,{status:"done",findings:f}):r;});});
      // Small yield between platforms so progress updates are visible
      await new Promise(function(r){setTimeout(r,50);});
      enriched.push({company:company,fd:fd,findings:findings});
    }
    setPhase("generating");
    await new Promise(function(r){setTimeout(r,80);});
    var ctx=enriched.map(function(e){
      var st=calcStatus(e.fd);var risk=e.fd.i_risk_rating||"Not rated";
      var outstanding=ALL_SECTIONS.filter(function(s){var sec=st.sections.find(function(x){return x.id===s.id;});return sec&&!sec.complete&&sec.required>0;}).map(function(s){return s.title;});
      var qs=allQs.filter(function(q){return e.fd[q.id];}).map(function(q){return q.label+": "+String(e.fd[q.id]).slice(0,180);}).join("\n");
      return"=== "+e.company.name+" ===\nDD: "+st.pct+"% | Risk: "+risk+"\nOutstanding: "+(outstanding.length?outstanding.join(", "):"None")+"\nExternal research:\n"+e.findings+"\nQuestionnaire:\n"+qs;
    }).join("\n\n");
    var res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,messages:[{role:"user",content:"Produce a professional board-level due diligence report for Timeline, a UK FCA-regulated financial planning firm.\n\nDate: "+reportDate+"\nPlatforms: "+chosen.map(function(c){return c.name;}).join(", ")+"\n\nStructure:\n1. EXECUTIVE SUMMARY (3-4 sentences: overall status, key risks, recommended actions)\n2. PORTFOLIO OVERVIEW (all platforms: completion %, risk rating, FCA status)\n3. PLATFORM-BY-PLATFORM FINDINGS (each platform: DD status, risk, outstanding items, questionnaire findings, FCA/CH/web research)\n4. KEY RISKS & RED FLAGS (cross-platform risks needing board attention)\n5. RECOMMENDED ACTIONS (prioritised list with suggested owners and timescales)\n6. REGULATORY CONTEXT (FCA Consumer Duty and SYSC 8 obligations this review addresses)\n\nTone: professional, factual, board-appropriate. Name platforms when flagging risks. Be specific.\n\nData:\n\n"+ctx}]})}).catch(function(){return null;});
    if(!res){setPhase("error");return;}
    var d=await res.json();
    if(d.error){setPhase("error");setReport("Error: "+d.error.message);return;}
    setReport(d.content.filter(function(b){return b.type==="text";}).map(function(b){return b.text;}).join(""));
    setPhase("done");
  }

  var doneCount=progress.filter(function(r){return r.status==="done";}).length;
  var searchingItem=progress.find(function(r){return r.status==="searching";});

  return(
    <div style={{flex:1,display:"flex",flexDirection:"column",minHeight:0,background:C.grayL}}>
      <div style={{borderBottom:"1px solid "+C.grayM,padding:"14px 2rem",background:"white",flexShrink:0,display:"flex",alignItems:"center",gap:12}}>
        <div style={{width:34,height:34,borderRadius:9,background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
        </div>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:C.navy}}>{"Board Report Generator"}</div>
          <div style={{fontSize:11,color:C.gray,marginTop:1}}>{"AI agent researches FCA register, Companies House and company websites — then generates a board-ready report"}</div>
        </div>
        {phase==="idle"&&<Btn onClick={generate} variant="primary" style={{marginLeft:"auto",flexShrink:0}}>{!selected.length?"Select platforms to continue":"Generate report →"}</Btn>}
        {phase==="done"&&<div style={{marginLeft:"auto",display:"flex",gap:8,flexShrink:0}}>
          <Btn onClick={function(){navigator.clipboard.writeText("THIRD-PARTY PLATFORM DUE DILIGENCE REPORT\nTimeline Financial Ltd | "+reportDate+"\nConfidential — Board Document\n\n"+report).catch(function(){});setCopied(true);setTimeout(function(){setCopied(false);},1500);}} variant="soft">{copied?"Copied!":"Copy report"}</Btn>
          <Btn onClick={function(){setPhase("idle");setReport("");setProgress([]);}} variant="ghost">{"New report"}</Btn>
        </div>}
      </div>

      <div style={{flex:1,overflowY:"auto",padding:"1.75rem 2rem"}}>
        {phase==="idle"&&(
          <div style={{maxWidth:800,margin:"0 auto"}}>
            <div style={{background:"white",border:"1px solid "+C.grayM,borderRadius:12,overflow:"hidden",marginBottom:16}}>
              <div style={{padding:"12px 16px",background:C.grayL,borderBottom:"1px solid "+C.grayM,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div><div style={{fontSize:13,fontWeight:600,color:C.navy}}>{"Select platforms to include"}</div><div style={{fontSize:12,color:C.gray,marginTop:2}}>{selected.length+" of "+p.companies.length+" selected"}</div></div>
                <Btn size="sm" variant="ghost" onClick={toggleAll}>{selected.length===p.companies.length?"Deselect all":"Select all"}</Btn>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:0}}>
                {p.companies.map(function(c,i){
                  var fd=p.allData[c.id]||{};var st=calcStatus(fd);var risk=fd.i_risk_rating;var isSelected=selected.includes(c.id);
                  return(
                    <button key={c.id} type="button" onClick={function(){toggle(c.id);}} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",border:"none",borderBottom:i<p.companies.length-3?"1px solid "+C.grayM:"none",borderRight:(i+1)%3!==0?"1px solid "+C.grayM:"none",background:isSelected?"white":C.grayL,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}>
                      <div style={{width:16,height:16,borderRadius:4,border:isSelected?"none":"1.5px solid "+C.grayM,background:isSelected?C.blue:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                        {isSelected&&<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:12,fontWeight:600,color:C.navy,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                        <div style={{display:"flex",gap:5,marginTop:2,alignItems:"center"}}>
                          <span style={{fontSize:10,color:C.gray}}>{st.pct+"%"}</span>
                          {risk&&<span style={{fontSize:10,padding:"1px 6px",borderRadius:10,background:risk==="Low"?C.greenL:risk==="Medium"?C.amberL:C.redL,color:risk==="Low"?C.greenD:risk==="Medium"?C.amberD:C.redD,fontWeight:600}}>{risk}</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{background:C.blueL,border:"1px solid #BFDBFE",borderRadius:12,padding:"16px 20px"}}>
              <div style={{fontSize:13,fontWeight:600,color:C.blueD,marginBottom:10}}>{"What the agent does"}</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[["🔍","FCA Register","Looks up authorisation status, permissions, and enforcement history"],["🏢","Companies House","Checks registration, filing history, directors, and any charges"],["🌐","Company website","Reviews public-facing information and service descriptions"],["📋","Questionnaire data","Combines all of the above with submitted DD questionnaire answers"]].map(function(item){return(
                  <div key={item[0]} style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                    <span style={{fontSize:16,flexShrink:0}}>{item[0]}</span>
                    <div><div style={{fontSize:12,fontWeight:600,color:C.blueD}}>{item[1]}</div><div style={{fontSize:11,color:C.blueD,opacity:0.8,marginTop:2,lineHeight:1.5}}>{item[2]}</div></div>
                  </div>
                );})}
              </div>
              <div style={{marginTop:12,paddingTop:10,borderTop:"1px solid #BFDBFE",fontSize:11,color:C.blueD,opacity:0.7}}>{"Research and generation takes 3–6 minutes for all platforms. Select fewer platforms for faster results."}</div>
            </div>
          </div>
        )}

        {(phase==="researching"||phase==="generating")&&(
          <div style={{maxWidth:680,margin:"0 auto"}}>

            {/* Big progress card */}
            <div style={{background:"white",border:"1px solid "+C.grayM,borderRadius:14,padding:"28px 28px 24px",marginBottom:16}}>

              {/* Icon + label */}
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:C.navy,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <div>
                  <div style={{fontSize:15,fontWeight:700,color:C.navy,marginBottom:2}}>
                    {phase==="generating"?"Writing board report...":"Researching platforms"}
                  </div>
                  <div style={{fontSize:12,color:C.gray}}>
                    {phase==="generating"
                      ?"Compiling all FCA, Companies House and questionnaire findings..."
                      :searchingItem
                        ?"Searching FCA register, Companies House & web for "+searchingItem.name
                        :"Starting research..."}
                  </div>
                </div>
                <div style={{marginLeft:"auto",textAlign:"right",flexShrink:0}}>
                  <div style={{fontSize:28,fontWeight:700,color:C.navy,lineHeight:1}}>
                    {phase==="generating"?selected.length:doneCount}<span style={{fontSize:16,color:C.gray,fontWeight:400}}>{"/"+(phase==="generating"?selected.length:progress.length)}</span>
                  </div>
                  <div style={{fontSize:11,color:C.gray,marginTop:2}}>{"platforms"}</div>
                </div>
              </div>

              {/* Progress bar track */}
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
                  <span style={{fontSize:12,fontWeight:600,color:C.navy}}>
                    {phase==="generating"?"Generating report":"Research progress"}
                  </span>
                  <span style={{fontSize:13,fontWeight:700,color:C.blue}}>
                    {phase==="generating"?100:Math.round(doneCount/Math.max(progress.length,1)*100)}%
                  </span>
                </div>
                <div style={{height:10,background:C.grayM,borderRadius:99,overflow:"hidden"}}>
                  <div style={{
                    height:"100%",
                    width:(phase==="generating"?100:Math.round(doneCount/Math.max(progress.length,1)*100))+"%",
                    background:"linear-gradient(90deg,"+C.blue+","+C.blueM+")",
                    borderRadius:99,
                    transition:"width 0.5s ease"
                  }}/>
                </div>
              </div>

              {/* Stage indicators */}
              <div style={{display:"flex",gap:0,marginTop:14}}>
                {[
                  {label:"FCA Register",done:doneCount>0||phase==="generating",active:phase==="researching"&&doneCount===0},
                  {label:"Companies House",done:doneCount>=Math.ceil(progress.length*0.33)||phase==="generating",active:phase==="researching"},
                  {label:"Web research",done:doneCount>=Math.ceil(progress.length*0.66)||phase==="generating",active:phase==="researching"},
                  {label:"Report",done:phase==="generating",active:phase==="generating"},
                ].map(function(st,i){return(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                    <div style={{width:"100%",display:"flex",alignItems:"center"}}>
                      {i>0&&<div style={{flex:1,height:2,background:st.done?C.blue:C.grayM,transition:"background 0.4s"}}/>}
                      <div style={{width:10,height:10,borderRadius:"50%",background:st.done?C.blue:st.active?C.blueL:C.grayM,border:"2px solid "+(st.done?C.blue:st.active?C.blue:C.grayM),flexShrink:0,transition:"all 0.4s"}}/>
                      {i<3&&<div style={{flex:1,height:2,background:st.done?C.blue:C.grayM,transition:"background 0.4s"}}/>}
                    </div>
                    <span style={{fontSize:10,color:st.done?C.blueD:C.gray,fontWeight:st.done?600:400,textAlign:"center"}}>{st.label}</span>
                  </div>
                );})}
              </div>
            </div>

            {/* Per-platform list */}
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {progress.map(function(item){
                var isDone=item.status==="done";
                var isSearching=item.status==="searching";
                return(
                  <div key={item.id} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:"white",border:"1px solid "+(isSearching?C.blue:isDone?"#BBF7D0":C.grayM),borderRadius:9,transition:"border-color 0.3s"}}>
                    <div style={{width:22,height:22,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:isDone?C.green:isSearching?C.blue:C.grayM,transition:"background 0.3s"}}>
                      {isDone&&<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                      {isSearching&&<div style={{width:6,height:6,borderRadius:"50%",background:"white"}}/>}
                    </div>
                    <span style={{fontSize:13,fontWeight:isSearching?600:500,color:isSearching?C.navy:isDone?C.grayD:C.gray,flex:1}}>{item.name}</span>
                    <span style={{fontSize:11,fontWeight:500,color:isDone?C.green:isSearching?C.blue:C.gray}}>
                      {isDone?"✓ Done":isSearching?"Searching...":"Queued"}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {phase==="error"&&(
          <div style={{maxWidth:600,margin:"0 auto",padding:"2rem",background:C.redL,borderRadius:12,border:"1px solid #FECACA",textAlign:"center"}}>
            <div style={{fontSize:15,fontWeight:600,color:C.redD,marginBottom:8}}>{"Report generation failed"}</div>
            <div style={{fontSize:13,color:C.redD,marginBottom:16}}>{report||"An unexpected error occurred. Please try again."}</div>
            <Btn onClick={function(){setPhase("idle");setProgress([]);setReport("");}} variant="ghost">{"Try again"}</Btn>
          </div>
        )}

        {phase==="done"&&report&&(
          <div style={{maxWidth:820,margin:"0 auto"}}>
            <div style={{background:C.navy,borderRadius:"12px 12px 0 0",padding:"24px 28px",display:"flex",alignItems:"flex-start",justifyContent:"space-between"}}>
              <div>
                <div style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:8}}>{"Confidential — Board Document"}</div>
                <div style={{fontSize:20,fontWeight:700,color:"white",marginBottom:4}}>{"Third-Party Platform Due Diligence"}</div>
                <div style={{fontSize:13,color:"rgba(255,255,255,0.5)"}}>{"Timeline Financial Ltd · "+reportDate}</div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.4)",marginBottom:4}}>{"Platforms covered"}</div>
                <div style={{fontSize:22,fontWeight:700,color:C.blue}}>{selected.length}</div>
              </div>
            </div>
            <div style={{background:"white",border:"1px solid "+C.grayM,borderTop:"none",borderRadius:"0 0 12px 12px",padding:"28px 32px"}}>
              <div style={{fontSize:14,lineHeight:1.9,color:C.grayD,whiteSpace:"pre-wrap"}}>{report}</div>
            </div>
            <div style={{display:"flex",gap:8,marginTop:12,justifyContent:"flex-end"}}>
              <Btn onClick={function(){navigator.clipboard.writeText("THIRD-PARTY PLATFORM DUE DILIGENCE REPORT\nTimeline Financial Ltd | "+reportDate+"\nConfidential — Board Document\n\n"+report).catch(function(){});setCopied(true);setTimeout(function(){setCopied(false);},1500);}} variant="soft">{copied?"Copied!":"Copy full report"}</Btn>
              <Btn onClick={function(){setPhase("idle");setReport("");setProgress([]);}} variant="ghost">{"Generate new report"}</Btn>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App(){
  var[loggedIn,setLoggedIn]=useState(function(){return lsGet(SK+"_auth",false);});
  var[companies,setCompanies]=useState(function(){return lsGet(SK+"_co",DEFAULT_COMPANIES);});
  var[allData,setAllData]=useState(function(){return lsGet(SK+"_fd",{});});
  var[stages,setStages]=useState(function(){return lsGet(SK+"_st",DEFAULT_STAGES);});
  var[log,setLog]=useState(function(){return lsGet(SK+"_log",[]);});
  var[globalEnabled,setGlobalEnabled]=useState(function(){return lsGet(SK+"_ge",true);});
  var[page,setPage]=useState("dashboard");
  var[selected,setSelected]=useState(null);
  var[showAdd,setShowAdd]=useState(false);
  var[showImport,setShowImport]=useState(false);
  var[portalCompany,setPortalCompany]=useState(null);
  var[isPreview,setIsPreview]=useState(false);

  useEffect(function(){lsSet(SK+"_auth",loggedIn);},[loggedIn]);
  useEffect(function(){lsSet(SK+"_co",companies);},[companies]);
  useEffect(function(){lsSet(SK+"_fd",allData);},[allData]);
  useEffect(function(){lsSet(SK+"_st",stages);},[stages]);
  useEffect(function(){lsSet(SK+"_log",log);},[log]);
  useEffect(function(){lsSet(SK+"_ge",globalEnabled);},[globalEnabled]);

  var hc=useCallback(function(id,fid,val){setAllData(function(p){var n=Object.assign({},p);n[id]=Object.assign({},p[id]||{});n[id][fid]=val;return n;});},[]);
  var hImport=useCallback(function(companyId,fieldMap){setAllData(function(prev){var n=Object.assign({},prev);n[companyId]=Object.assign({},prev[companyId]||{},fieldMap);return n;});},[]);

  function handleAdd(c){setCompanies(function(p){return p.concat([c]);});setShowAdd(false);}
  function handleRemove(id){if(!window.confirm("Remove this provider?"))return;setCompanies(function(p){return p.filter(function(c){return c.id!==id;});});setAllData(function(p){var n=Object.assign({},p);delete n[id];return n;});}
  function handleUpdateCompany(id,u){setCompanies(function(p){return p.map(function(c){return c.id===id?Object.assign({},c,u):c;});});}
  function handleMarkSent(id){handleUpdateCompany(id,{sentDate:TODAY.toISOString().slice(0,10)});}
  function handleSendReminder(item){setLog(function(p){return p.concat([{id:Date.now(),companyId:item.company.id,companyName:item.company.name,stageId:item.stage.id,stageName:item.stage.name,email:item.company.contactEmail,sentAt:TODAY.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}]);});}

  var pendingCount=useMemo(function(){if(!globalEnabled)return 0;return companies.filter(function(c){var fd=allData[c.id]||{};var st=calcStatus(fd);if(st.allComplete||!c.contactEmail)return false;var days=daysSince(c.addedDate);return stages.some(function(s){if(!s.enabled||days<s.triggerDays||st.pct<s.minPct||st.pct>s.maxPct)return false;return !log.some(function(l){return l.companyId===c.id&&l.stageId===s.id;});});}).length;},[companies,allData,stages,globalEnabled,log]);

  if(!loggedIn)return <LoginScreen onLogin={function(){setLoggedIn(true);}}/>;
  if(portalCompany)return <CompanyPortal company={portalCompany} formData={allData[portalCompany.id]||{}} onChange={function(fid,val){hc(portalCompany.id,fid,val);}} onSubmit={function(){setPortalCompany(null);setIsPreview(false);}} isPreview={isPreview} onExitPreview={function(){setPortalCompany(null);setIsPreview(false);}}/>;
  if(showImport)return <CsvImporter companies={companies} onImport={hImport} onBack={function(){setShowImport(false);}}/>;

  return(
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"var(--font-sans)",color:C.grayD}}>
      <Sidebar page={page} setPage={function(p){setPage(p);setSelected(null);setShowAdd(false);}} pendingCount={pendingCount} onLogout={function(){setLoggedIn(false);setSelected(null);setPage("dashboard");}}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,background:C.grayL}}>
        {selected?<AdminQView company={selected} formData={allData[selected.id]||{}} onBack={function(){setSelected(null);}} onChange={function(fid,val){hc(selected.id,fid,val);}}/>
        :showAdd?<AddProviderPage onAdd={handleAdd} onCancel={function(){setShowAdd(false);}} existingIds={companies.map(function(c){return c.id;})}/>
        :page==="dashboard"?<Dashboard companies={companies} allData={allData} onSelect={function(c){setSelected(c);}} onAdd={function(){setShowAdd(true);}} onRemove={handleRemove} onMarkSent={handleMarkSent} onPreview={function(c){setPortalCompany(c);setIsPreview(true);}} onImport={function(){setShowImport(true);}}/>
        :page==="assistant"?<AIAssistant companies={companies} allData={allData}/>
        :page==="report"?<BoardReport companies={companies} allData={allData}/>
        :page==="reminders"?<RemindersView companies={companies} allData={allData} stages={stages} setStages={setStages} globalEnabled={globalEnabled} setGlobalEnabled={setGlobalEnabled} log={log} onSendReminder={handleSendReminder}/>
        :<SettingsView companies={companies} allData={allData} onImport={hImport} onUpdateCompany={handleUpdateCompany} onClearAll={function(){if(window.confirm("Reset all data?"))setAllData({});}}/>}
      </div>
    </div>
  );
}
