exports.calculate = function (co){
var eeisus=1;var eetrue="TRUE";var eefalse="FALSE";var eedec=".";var eeth=",";var eedecreg=new RegExp("\\.","g");var eethreg=new RegExp(",","g");var eecurrencyreg=new RegExp("[$]","g");var eepercentreg=new RegExp("%","g"); var fmtdaynamesshort=new Array("Sun","Mon","Tue","Wed","Thu","Fri","Sat"); var fmtdaynameslong=new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"); var fmtmonthnamesshort=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"); var fmtmonthnameslong=new Array("January","February","March","April","May","June","July","August","September","October","November","December"); var fmtstrings=new Array();
var fnCalls= new Array();
var EE= undefined
function calc(data){    
var arr1xB4E4=new Array(1);for(var ii=0;ii<1;ii++){arr1xB4E4[ii]=new Array(4);for(var jj=0;jj<4;jj++){arr1xB4E4[ii][jj]=""}};var arr1xA5A5=new Array(1);for(var ii=0;ii<1;ii++){arr1xA5A5[ii]=new Array(1);for(var jj=0;jj<1;jj++){arr1xA5A5[ii][jj]=""}};var arr1xB5E5=new Array(1);for(var ii=0;ii<1;ii++){arr1xB5E5[ii]=new Array(4);for(var jj=0;jj<4;jj++){arr1xB5E5[ii][jj]=0}};var arr1xA6A6=new Array(1);for(var ii=0;ii<1;ii++){arr1xA6A6[ii]=new Array(1);for(var jj=0;jj<1;jj++){arr1xA6A6[ii][jj]=""}};var arr1xB6E6=new Array(1);for(var ii=0;ii<1;ii++){arr1xB6E6[ii]=new Array(4);for(var jj=0;jj<4;jj++){arr1xB6E6[ii][jj]=0}};var arr1xA7A7=new Array(1);for(var ii=0;ii<1;ii++){arr1xA7A7[ii]=new Array(1);for(var jj=0;jj<1;jj++){arr1xA7A7[ii][jj]=""}};var arr1xB7E7=new Array(1);for(var ii=0;ii<1;ii++){arr1xB7E7[ii]=new Array(4);for(var jj=0;jj<4;jj++){arr1xB7E7[ii][jj]=0}};var arr1xA8A8=new Array(1);for(var ii=0;ii<1;ii++){arr1xA8A8[ii]=new Array(1);for(var jj=0;jj<1;jj++){arr1xA8A8[ii][jj]=""}};var arr1xB8E8=new Array(1);for(var ii=0;ii<1;ii++){arr1xB8E8[ii]=new Array(4);for(var jj=0;jj<4;jj++){arr1xB8E8[ii][jj]=0}};
var c1I9=data['XLEW_1_9_9'];var c1H9=data['XLEW_1_9_8'];arr1xB8E8[0][0]=data['XLEW_1_8_2'];arr1xA8A8[0][0]=data['XLEW_1_8_1'];var c1H7=data['xlew_1_7_8'];arr1xB7E7[0][3]=data['XLEW_1_7_5'];
 arr1xB7E7[0][2]=data['XLEW_1_7_4'];arr1xB7E7[0][1]=data['XLEW_1_7_3'];arr1xB7E7[0][0]=data['XLEW_1_7_2'];arr1xA7A7[0][0]=data['XLEW_1_7_1'];arr1xB6E6[0][0]=data['XLEW_1_6_2'];arr1xA6A6[0][0]=data['XLEW_1_6_1'];arr1xB5E5[0][3]=data['RevenueFourthInputNumber'];arr1xB5E5[0][2]=data['XLEW_1_5_4'];arr1xB5E5[0][1]=data['XLEW_1_5_3'];arr1xB5E5[0][0]=data['XLEW_1_5_2'];arr1xA5A5[0][0]=data['XLEW_1_5_1'];arr1xB4E4[0][3]=data['XLEW_1_4_5'];arr1xB4E4[0][2]=data['XLEW_1_4_4'];arr1xB4E4[0][1]=data['XLEW_1_4_3'];arr1xB4E4[0][0]=data['XLEW_1_4_2'];arr1xB6E6[0][1]=(((arr1xB5E5[0][1])-(arr1xB5E5[0][0])));arr1xB6E6[0][2]=(((arr1xB5E5[0][2])-(arr1xB5E5[0][1])));arr1xB6E6[0][3]=(((arr1xB5E5[0][3])-(arr1xB5E5[0][2])));var c1I7=(c1H7);arr1xB8E8[0][1]=(((arr1xB7E7[0][1])-(arr1xB7E7[0][0])));arr1xB8E8[0][2]=(((arr1xB7E7[0][2])-(arr1xB7E7[0][1])));arr1xB8E8[0][3]=(((arr1xB7E7[0][3])-(arr1xB7E7[0][2])));var c1G9=(c1H9);var c1G10=(((v2n(c1I9))*(4)));var c5C1=(sscgetter(arr1xA5A5,0,0,0,0,("Sheet1!$A$5"),("Sheet1!$A$5")));var c5D1=(sscgetter(arr1xB4E4,0,0,0,3,("Sheet1!$B$4:$E$4"),("Sheet1!$B$4:$E$4")));var c5E1=(sscgetter(arr1xA7A7,0,0,0,0,("Sheet1!$A$7"),("Sheet1!$A$7")));var c5F1=(sscgetter(arr1xA6A6,0,0,0,0,("Sheet1!$A$6"),("Sheet1!$A$6")));var c5G1=(sscgetter(arr1xA8A8,0,0,0,0,("Sheet1!$A$8"),("Sheet1!$A$8")));var c5H1=(sscgetter_numonly(arr1xB5E5,0,0,0,3,("Sheet1!$B$5:$E$5"),("Sheet1!$B$5:$E$5_numonly")));
 var c5I1=(sscgetter_numonly(arr1xB7E7,0,0,0,3,("Sheet1!$B$7:$E$7"),("Sheet1!$B$7:$E$7_numonly")));var c5J1=(sscgetter_numonly(arr1xB6E6,0,0,0,3,("Sheet1!$B$6:$E$6"),("Sheet1!$B$6:$E$6_numonly")));var c5K1=(sscgetter_numonly(arr1xB8E8,0,0,0,3,("Sheet1!$B$8:$E$8"),("Sheet1!$B$8:$E$8_numonly")));data['XLEW_1_10_7']=c1G10;data['XLEW_1_9_7']=c1G9;data['XLEW_1_8_5']=arr1xB8E8[0][3];data['XLEW_1_8_4']=arr1xB8E8[0][2];data['XLEW_1_8_3']=arr1xB8E8[0][1];data['XLEW_1_7_9']=c1I7;data['XLEW_1_6_5']=arr1xB6E6[0][3];data['XLEW_1_6_4']=arr1xB6E6[0][2];data['XLEW_1_6_3']=arr1xB6E6[0][1]; data['fnCalls']= fnCalls; if(typeof EE !== 'undefined') { data['EE'] = EE; } return JSON.stringify(data);};
function ssccf1n(op,id,css,data1) {
                                        var op = JSON.stringify(op);		
                                        var id = JSON.stringify(id);
                                        var css = JSON.stringify(css);
                                        var data1 = JSON.stringify(data1);
	                                    fnCalls.push('ssccf1n('+ op + ',' + id + ',' + css + ',' + data1 + ')');	
                                    }
                                    function ssccf4n(op,id,colors,data1,data2,data3,data4){
										var op = JSON.stringify(op);		
                                        var id = JSON.stringify(id);
										var colors = JSON.stringify(colors);                                
                                        var data1 = JSON.stringify(data1);
										var data2 = JSON.stringify(data2);
										var data3 = JSON.stringify(data3);
										var data4 = JSON.stringify(data4);
	                                    fnCalls.push('ssccf4n('+ op + ',' + id + ',' + colors + ',' + data1 + ',' + data2 + ',' + data3 + ',' + data4 + ')');
									}
function myIsNaN(x){return(isNaN(x)||(typeof x=='number'&&!isFinite(x)));};

function mod(n,d){return n-d*Math.floor(n/d);};

function round(n,nd){if(isFinite(n)&&isFinite(nd)){var sign_n=(n<0)?-1:1;var abs_n=Math.abs(n);var factor=Math.pow(10,nd);return sign_n*Math.round(abs_n*factor)/factor;}else{return NaN;}};

function s2n(str){str=String(str).replace(eedecreg,".");str=str.replace(eethreg,"");str=str.replace(eecurrencyreg,"");var res=parseFloat(str);if(myIsNaN(res))res=0;if(str.search(eepercentreg)>=0)res=res/100;return res;}

function n2s(x){return eedisplayFloat(x);}

function b2s(b){return b?eetrue:eefalse;};

function v2s(v){switch(typeof v){case "number":if(myIsNaN(v)){return "NaN";};return n2s(v);case "string":return v;case "boolean":return b2s(v);case "object":if(v.constructor==Number){if(myIsNaN(v)){return v;};return n2s(v);};if(v.constructor==String){return v;};if(v.constructor==Boolean){return b2s(v);};return "NaN";default:return "NaN";}};

function v2n(v){switch(typeof v){case "number":return v;case "string":return s2n(v);case "boolean":return v?1:0;case "object":if(v.constructor==Number){return v;};if(v.constructor==String){return s2n(v);};if(v.constructor==Boolean){return v?1:0;};return Number.NaN;default:return Number.NaN;}};

function eeparseFloat(str){str=String(str).replace(eedecreg,".");var res=parseFloat(str);if(isNaN(res)){return 0;}else{return res;}};

var near0RegExp=new RegExp("[.](.*0000000|.*9999999)");function eedisplayFloat(x){if(myIsNaN(x)){return Number.NaN;}else{var str=String(x);if(near0RegExp.test(str)){x=round(x,8);str=String(x);}return str.replace(/\./g,eedec);}};

function eedisplayFloatV(x){if(x=="")return x;if(isFinite(x)){return eedisplayFloat(x);}else{return x}};

function eedisplayScientific(x,nd){if(myIsNaN(x)){return Number.NaN;}else{var str=String(x.toExponential(nd));return str.replace(/\./g,eedec);}};

function eedisplayFloatND(x,nd){if(myIsNaN(x)){return Number.NaN;}else{var res=round(x,nd);if(nd>0){var str=String(res);if(str.indexOf('e')!=-1)return str;if(str.indexOf('E')!=-1)return str;var parts=str.split('.');if(parts.length<2){var decimals=('00000000000000').substring(0,nd);return(parts[0]).toString()+eedec+decimals;}else{var decimals=((parts[1]).toString()+'00000000000000').substring(0,nd);return(parts[0]).toString()+eedec+decimals;}}else{return res;}}};

function eedisplayPercent(x){if(myIsNaN(x)){return Number.NaN;}else{return eedisplayFloat(x*100)+'%';}};

function eedisplayPercentND(x,nd){if(myIsNaN(x)){return Number.NaN;}else{return eedisplayFloatND(x*100,nd)+'%';}}

function eedisplayFloatNDTh(x,nd){if(myIsNaN(x)){return Number.NaN;}else{var res=round(x,nd);if(nd>0){var str=String(res);if(str.indexOf('e')!=-1)return str;if(str.indexOf('E')!=-1)return str;var parts=str.split('.');var res2=eeinsertThousand(parts[0].toString());if(parts.length<2){var decimals=('00000000000000').substring(0,nd);return(res2+eedec+decimals);}else{var decimals=((parts[1]).toString()+'00000000000000').substring(0,nd);return(res2+eedec+decimals);}}else{return(eeinsertThousand(res.toString()));}}};

function eedisplayPercentNDTh(x,nd){if(myIsNaN(x)){return Number.NaN;}else{return eedisplayFloatNDTh(x*100,nd)+'%';}}

var eeparseFloatVreg=new RegExp("^ *-?[0-9.]+ *$");function eeparseFloatV(str){if(str=="")return str;str=String(str).replace(eedecreg,".");if(!eeparseFloatVreg.test(str)){return str;};var res=parseFloat(str);if(isNaN(res)){return str;}else{return res;}};

function eeinsertThousand(whole){if(whole==""||whole.indexOf("e")>=0){return whole;}else{var minus_sign="";if(whole.charAt(0)=="-"){minus_sign="-";whole=whole.substring(1);};var res="";var str_length=whole.length-1;for(var ii=0;ii<=str_length;ii++){if(ii>0&&ii%3==0){res=eeth+res;};res=whole.charAt(str_length-ii)+res;};return minus_sign+res;}};

 function eedatefmt(fmt,x){if(!isFinite(x))return Number.NaN;var padding=0;var tmp=0;var res="";var len=fmt.length;for(var ii=0;ii<len;ii++){if(fmt[ii]>31){res+=fmtstrings[fmt[ii]-32];}else{switch(fmt[ii]){case 2:res+=eemonth(x);break;case 3:tmp=eemonth(x);if(tmp<10){res+="0";};res+=tmp;break;case 4:res+=fmtmonthnamesshort[eemonth(x)-1];break;case 5:res+=fmtmonthnameslong[eemonth(x)-1];break;case 6:res+=eeday(x);break;case 7:tmp=eeday(x);if(tmp<10){res+="0";};res+=tmp;break;case 8:res+=fmtdaynamesshort[weekday(x,1)-1];break;case 9:res+=fmtdaynameslong[weekday(x,1)-1];break;case 10:tmp=year(x)%100;if(tmp<10){res+="0";};res+=tmp;break;case 11:res+=year(x);break;case 12:res+=hour(x);break;case 13:tmp=hour(x);if(tmp<10){res+="0";};res+=tmp;break;case 14:tmp=hour(x)%12;if(tmp==0){res+="12";}else{res+=tmp%12;};break;case 15:tmp=hour(x)%12;if(tmp==0){res+="12";}else{if(tmp<10){res+="0";};res+=tmp;};break;case 16:res+=minute(x);break;case 17:tmp=minute(x);if(tmp<10){res+="0";};res+=tmp;break;case 18:res+=second(x);break;case 19:tmp=second(x);
 if(tmp<10){res+="0";};res+=tmp;break;case 21:case 22:if(hour(x)<12){res+="AM";}else{res+="PM";};break;case 23:res+=eedisplayFloat(x);break;case 24:tmp=fmt[++ii];res+=eedisplayFloatND(x,tmp);break;case 25:tmp=fmt[++ii];res+=eedisplayFloatNDTh(x,tmp);break;case 26:res+=eedisplayPercent(x);break;case 27:tmp=fmt[++ii];res+=eedisplayPercentND(x,tmp);break;case 28:tmp=fmt[++ii];res+=eedisplayPercentNDTh(x,tmp);break;case 29:tmp=fmt[++ii];res+=eedisplayScientific(x,tmp);break;case 30:padding=fmt[++ii];tmp=hour(x)+Math.floor(x)*24;tmp=tmp.toString();if(tmp.length<padding){res+=('00000000000000').substring(0,padding-tmp.length);}res+=tmp;break;};};};return res;};

function eedatefmtv(fmt,x){if(x=="")return x;if(isFinite(x)){return eedatefmt(fmt,x)}else{return x}};

 function leap_gregorian(year){return((year%4)==0)&&(!(((year%100)==0)&&((year%400)!=0)));}var GREGORIAN_EPOCH=1721425;function gregorian_to_jd(year,month,day){return(GREGORIAN_EPOCH-0)+(365*(year-1))+Math.floor((year-1)/4)+(-Math.floor((year-1)/100))+Math.floor((year-1)/400)+Math.floor((((367*month)-362)/12)+((month<=2)?0:(leap_gregorian(year)?-1:-2))+day);}function jd_to_gregorian(jd){var wjd,depoch,quadricent,dqc,cent,dcent,quad,dquad,yindex,year,yearday,leapadj;wjd=Math.floor(jd);depoch=wjd-GREGORIAN_EPOCH-1;quadricent=Math.floor(depoch/146097);dqc=mod(depoch,146097);cent=Math.floor(dqc/36524);dcent=mod(dqc,36524);quad=Math.floor(dcent/1461);dquad=mod(dcent,1461);yindex=Math.floor(dquad/365);year=(quadricent*400)+(cent*100)+(quad*4)+yindex;if(!((cent==4)||(yindex==4))){year++;}yearday=wjd-gregorian_to_jd(year,1,1);leapadj=((wjd<gregorian_to_jd(year,3,1))?0:(leap_gregorian(year)?1:2));var month=Math.floor((((yearday+leapadj)*12)+373)/367);var day=(wjd-gregorian_to_jd(year,month,1))+1;
 return new Array(year,month,day);}

function eeday(serial_number){if(!isFinite(serial_number))return Number.NaN;if(serial_number<1){return 0;}if(serial_number>60)serial_number--;var res=jd_to_gregorian(serial_number+2415020);return res[2];};

function hour(serial_number){if(!isFinite(serial_number))return Number.NaN;var res=Math.floor((serial_number-Math.floor(serial_number))*86400+0.5);return Math.floor(res/3600);}

function minute(serial_number){if(!isFinite(serial_number))return Number.NaN;var res=Math.floor((serial_number-Math.floor(serial_number))*86400+0.5);return Math.floor(res/60)%60;};

function eemonth(serial_number){if(!isFinite(serial_number))return Number.NaN;if(serial_number<1){return 1;}if(serial_number>60)serial_number--;var res=jd_to_gregorian(serial_number+2415020);return res[1];};

function second(serial_number){if(!isFinite(serial_number))return Number.NaN;var res=Math.floor((serial_number-Math.floor(serial_number))*86400+0.5);return res%60;};

 function weekday(serial_number,return_type){if(!isFinite(return_type)||!isFinite(serial_number))return Number.NaN;if(return_type<1||return_type>3)return Number.NaN;var res=Math.floor(serial_number+6)%7;switch(Math.floor(return_type)){case 1:return res+1;case 2:return(res+6)%7+1;case 3:return(res+6)%7;};return "hej";};

function year(serial_number){if(!isFinite(serial_number))return Number.NaN;if(serial_number<1){return 1900;}if(serial_number>60)serial_number--;var res=jd_to_gregorian(serial_number+2415020);return res[0];};

function sscgetter(x0_arr,x0_from_x,x0_from_y,x0_to_x,x0_to_y,description,name){var tmp,ii,jj;var jsarr=new Array();for(ii=x0_from_x;ii<=x0_to_x;ii++){jsarr[ii-x0_from_x]=new Array();for(jj=x0_from_y;jj<=x0_to_y;jj++){tmp=x0_arr[ii][jj];jsarr[ii-x0_from_x][jj-x0_from_y]=tmp;};};co[name]=jsarr;return 1;};

function sscgetter_numonly(x0_arr,x0_from_x,x0_from_y,x0_to_x,x0_to_y,description,name){var tmp,ii,jj;var jsarr=new Array();for(ii=x0_from_x;ii<=x0_to_x;ii++){jsarr[ii-x0_from_x]=new Array();for(jj=x0_from_y;jj<=x0_to_y;jj++){tmp=x0_arr[ii][jj];jsarr[ii-x0_from_x][jj-x0_from_y]=tmp;};};co[name]=jsarr;return 1;};
return calc(co);
}
