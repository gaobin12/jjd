

export default ()=>{
	//日期格式化 
    Date.prototype.Format = function (fmt) { 
        let o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "h+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    //日期计算  
    Date.prototype.DateAdd = function(strInterval, num) {   
        var dtTmp = this;  
        switch (strInterval) {   
            case 's' :return new Date(Number(dtTmp) + (1000 * num));  
            case 'n' :return new Date(Number(dtTmp) + (60000 * num));  
            case 'h' :return new Date(Number(dtTmp) + (3600000 * num));  
            case 'd' :return new Date(Number(dtTmp) + (86400000 * num));  
            case 'w' :return new Date(Number(dtTmp) + ((86400000 * 7) * num));  
            case 'q' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + num*3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
            case 'm' :return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + num, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
            case 'y' :return new Date((dtTmp.getFullYear() + num), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());  
        }  
    }
}