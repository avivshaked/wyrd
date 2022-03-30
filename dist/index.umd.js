!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e=e||self).wyrd={})}(this,(function(e){"use strict";const t=!0,s="Wyrd",a="undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{},r=1e3,i=2e3,n=100,l=!1;function createPerformanceMark({name:e,detail:t,duration:s,entryType:a,startTime:r,toJSON:i}){const n={name:e||"mark-mock",detail:t||{},duration:null!=s?s:0,entryType:a||"mark",startTime:null!=r?r:0,toJSON:i||(()=>n)};return n}function createPerformanceMeasure({duration:e,entryType:t,startTime:s,detail:a,toJSON:r,name:i}){const n={name:i||"mark-measure",detail:a||{},duration:null!=e?e:0,entryType:t||"measure",startTime:null!=s?s:0,toJSON:r||(()=>n)};return n}const u={mark:(e,t)=>createPerformanceMark({name:e,detail:null==t?void 0:t.detail,startTime:null==t?void 0:t.startTime}),measure:(e,t,s)=>{if(s&&t)return createPerformanceMeasure({name:e});if(t){const{duration:s,detail:a,start:r}=t;return createPerformanceMeasure({name:e,duration:s,startTime:r||0,detail:a})}return createPerformanceMeasure({name:e})},getEntriesByName:(e,t)=>"mark"===t?[createPerformanceMark({name:e})]:[createPerformanceMeasure({name:e})],clearMarks:()=>{},clearMeasures:()=>{},now:()=>0};var o,m,c,h,_;const d=(null===(o=null==a?void 0:a.performance)||void 0===o?void 0:o.mark)&&(null===(m=null==a?void 0:a.performance)||void 0===m?void 0:m.measure)&&(null===(c=null==a?void 0:a.performance)||void 0===c?void 0:c.now)&&(null===(h=null==a?void 0:a.performance)||void 0===h?void 0:h.clearMeasures)&&(null===(_=null==a?void 0:a.performance)||void 0===_?void 0:_.clearMarks)?a.performance:u;class Measure{constructor(e){this._interval=null,this._isFinished=!1,this._results=[];const{name:t,timeBucketSize:s,interval:a,maxBuckets:u,isInactive:o}=e;this._name=t,this._markStartName=`${t}Start`,this._markEndName=`${t}End`,this._timeBucketSize=s||r,this._intervalInMilliseconds=a||i,this._maxBuckets=u||n,this._isInactive=null!=o?o:l,this._isActive=!this._isInactive,this._startTime=d.now(),this._setupInterval()}get name(){return this._name}get isInactive(){return this._isInactive}get isFinished(){return this._isFinished}get results(){return this._calcResultsAndReset(),this._results.slice()}finish(){this._calcResultsAndReset(),this._interval&&clearInterval(this._interval),this._isFinished=!0,this._isActive=!1}markStart(e){this._isActive&&d.mark(this._markStartName,e)}markEnd(e,t){this._isActive&&(d.mark(this._markEndName,e),t?d.measure(this._name,t):d.measure(this._name,this._markStartName,this._markEndName))}getSamples(){return this._isActive?d.getEntriesByName(this._name):[]}_prepareResultBuckets(e){const t=Math.floor((e-this._startTime)/this._timeBucketSize);for(let e=0;e<=t;e+=1)this._results[e]||(this._results[e]={startTime:this._startTime+e*this._timeBucketSize,average:0,count:0,measures:[]})}_addMeasureToBucket(e){const t=Math.floor((e.startTime-this._startTime)/this._timeBucketSize),s=this._results[t];s.measures.push(e),s.count+=1}static _calcBucketAverage(e){let t=0;for(const s of e.measures)t+=s.duration;e.average=t/e.count}_calcResultsForTimeBucket(){if(!this._isActive)return;const e=this.getSamples(),t=e.map((e=>e.startTime)),s=Math.max(...t);this._prepareResultBuckets(s);for(const t of e)this._addMeasureToBucket(t);for(const e of this._results)e.count&&Measure._calcBucketAverage(e)}_resetMarksAndMeasures(){d.clearMarks(this._markStartName),d.clearMarks(this._markEndName),d.clearMeasures(this._name)}_sliceResultsArray(){this._results=this._results.slice(-this._maxBuckets),this._startTime=this._results[0].startTime}_calcResultsAndReset(){this._calcResultsForTimeBucket(),this._resetMarksAndMeasures(),this._results.length>this._maxBuckets&&this._sliceResultsArray()}_setupInterval(){this._isActive&&(this._interval=setInterval((()=>{this._calcResultsAndReset()}),this._intervalInMilliseconds))}}class MeasureManager{constructor(e={}){this._measures=new Map;const{globalName:a,shouldBeOnGlobal:r}=e;this._globalName=null!=a?a:s,""===this._globalName&&(this._globalName=s),this._shouldBeOnGlobal=null!=r?r:t,this._shouldBeOnGlobal&&this._mountInstanceOnGlobal()}get globalName(){return this._globalName}_mountInstanceOnGlobal(){let e=!1;for(;!e;)void 0!==a[this._globalName]?this._globalName="_"+this._globalName:(e=!0,a[this._globalName]=this)}removeFromGlobal(){delete a[this._globalName],this._shouldBeOnGlobal=!1}isOnGlobal(){return void 0!==a[this._globalName]}getMeasure(e){return this._measures.get(e)||null}registerMeasure(e){let t,s;return t="string"==typeof e?e:e.name,!this._measures.has(t)&&(s=new Measure("string"==typeof e?{name:e}:e),this._measures.set(t,s),!0)}removeMeasure(e){const t=this.getMeasure(e);return!!t&&(t.isFinished||t.finish(),this._measures.delete(e),!0)}finishMeasure(e){const t=this.getMeasure(e);return!!t&&(t.finish(),!0)}markMeasureStart(e,t){const s=this.getMeasure(e);return!!s&&(s.markStart(t),!0)}markMeasureEnd(e,t,s){const a=this.getMeasure(e);return!!a&&(a.markEnd(t,s),!0)}getSamples(e){const t=this.getMeasure(e);return t?t.getSamples():null}getResults(e){const t=this.getMeasure(e);return t?t.results:null}getMeasuresMap(){return this._measures}getMeasures(){return Array.from(this._measures.values())}}const M=new MeasureManager,f=M;e.Measure=Measure,e.MeasureManager=MeasureManager,e.Wyrd=f,e.createCustomMeasureManager=function createCustomMeasureManager(e){return M.isOnGlobal()&&M.removeFromGlobal(),new MeasureManager(e)},e.measureManager=M,Object.defineProperty(e,"__esModule",{value:!0})}));
