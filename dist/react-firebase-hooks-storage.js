!function(r,e){"use strict";var t=function(){return(t=Object.assign||function(r){for(var e,t=1,n=arguments.length;t<n;t++)for(var u in e=arguments[t])Object.prototype.hasOwnProperty.call(e,u)&&(r[u]=e[u]);return r}).apply(this,arguments)},n=function(r){return{loading:void 0===r||null===r,value:r}},u=function(r){var u=r?r():void 0,o=e.useReducer(function(r,e){switch(e.type){case"error":return t(t({},r),{error:e.error,loading:!1,value:void 0});case"reset":return n(e.defaultValue);case"value":return t(t({},r),{error:void 0,loading:!1,value:e.value});default:return r}},n(u)),a=o[0],c=o[1];return{error:a.error,loading:a.loading,reset:function(){var e=r?r():void 0;c({type:"reset",defaultValue:e})},setError:function(r){c({type:"error",error:r})},setValue:function(r){c({type:"value",value:r})},value:a.value}},o=function(r,e){var t=!r&&!e,n=!!r&&!!e&&r.fullPath===e.fullPath;return t||n};r.useDownloadURL=function(r){var t=u(),n=t.error,a=t.loading,c=t.reset,i=t.setError,l=t.setValue,s=t.value,f=function(r,t,n){var u=e.useRef(r);return e.useEffect(function(){t(r,u.current)||(u.current=r,n&&n())}),u}(r,o,c);return e.useEffect(function(){f.current?f.current.getDownloadURL().then(l).catch(i):l(void 0)},[f.current]),[s,a,n]}}(this["react-firebase-hooks"]=this["react-firebase-hooks"]||{},react);
//# sourceMappingURL=react-firebase-hooks-storage.js.map
