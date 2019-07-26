function changeData(widget,chartConfig,data){
    if(widget!=null && data !=null && data.data!=null){
        var widgetName = widget.widgetName;
        if("人工干预时间-T" == widgetName || "分设备等待时间-T" == widgetName
            || "设备等待时间-T" == widgetName ){
            var name = "";
            if("人工干预时间-T" == widgetName)
                name = "等待时间";
            else if("分设备等待时间-T" == widgetName)
                name = "工作时间";
            else if("设备等待时间-T" == widgetName)
                name = "工作时间";
            data = RGGY(name,chartConfig,data);
        }

        if("人工干预总时间-T"  == widgetName ){
            name = '等待时间';
            data = RGGY(name,chartConfig,data,'accept_time');
        }

        else if("分人员人工干预时间-T"  == widgetName ){
            name = '等待时间';
            data = RGGY(name,chartConfig,data,'accept_time');
        }

        else if("分人员总人工干预时间-T"  == widgetName ){
            name = '等待时间';
            data = RGGY(name,chartConfig,data,'accept_time',true);
        }

        else if("作业线等待时间-T"  == widgetName ){
            name = '剩余时间';
            data = RGGY(name,chartConfig,data,'start_time');
        }
        else if("设备等待时间-T"  == widgetName ){
            name = '剩余时间';
            data = RGGY(name,chartConfig,data,'start_time');
        }
        else if ("设备任务利用率-T" == widgetName ){
            name = '间隔时间';
            data = RGGY(name,chartConfig,data,'command_start_time');
        }
    }
    return data;
}

function RGGY(name,chartConfig,data,queryColumnName,countFlag){
    var dateArr = getStartEndDate(chartConfig,(queryColumnName==null?"StartTime":queryColumnName));
    if(dateArr.length>=2){
        var firstDate = new Date(Date.parse(dateArr[0].replace(/-/g,"/")));
        var secondDate = new Date(Date.parse(dateArr[1].replace(/-/g,"/")));
        var inervalHour = getInervalHour(firstDate,secondDate);
        var arr = data.data;
        var columnListLength = data.columnList.length;
        //  var
        if(chartConfig.chart_type == 'pie'){
            pushFilterTimeDuration(name,inervalHour,columnListLength,arr,countFlag)
        }
        // if(chartConfig.)
    }
    return data;
}

function pushFilterTimeDuration(name,inervalHour,columnListLength,arr,countFlag){
    if(countFlag && arr.length!=0)
        inervalHour = arr.length * inervalHour;
    var surplusArr = [];
    if(columnListLength <= 2) {
        var sum = getSum(arr);

        surplusArr.push([name, (inervalHour - sum)<0?0:(inervalHour - sum)])
    }
    else{
        for(var i = 0 ; i<arr.length ; i++){
            var contain = false;
            var eqIndex = 0;
            for(var j=0 ; j<surplusArr.length ; j++){
                if(arrEquals(arr[i],surplusArr[j],columnListLength-2)) {
                    eqIndex = j;
                    contain = true;
                    continue;
                }
            }
            if(!contain){
                var addArr = arr[i].slice(0,columnListLength-2);
                addArr.push(name);
                addArr.push(inervalHour);
                surplusArr.push(addArr);
            }else{
                var surplus = surplusArr[eqIndex][surplusArr[eqIndex].length-1];
                surplus = surplus - arr[i][arr[i].length-1];
                if(surplus<0)
                    surplus = 0;
                surplusArr[eqIndex][surplusArr[eqIndex].length-1] = surplus;
            }
        }
    }
    for(var j=0 ; j<surplusArr.length ; j++){
        arr.push(surplusArr[j])
    }
}

function arrEquals(arr1,arr2,length){
    if(arr1==undefined || arr1==null || arr2==undefined || arr2==null)
        return false;
    if(arr1.length < length || arr2.length<length)
        return false;
    for(var i=0 ; i<length ; i++){
        if(arr1[i] != arr2[i])
            return false;
    }
    return true;
}

function getSum(dataArr){
    var sum = 0;
    for (var i = 0; i < dataArr.length; i++){
        sum += parseFloat(dataArr[i][dataArr[i].length-1])
    }
    return sum;
}

function getStartEndDate(chartConfig,filterColName){
    if(chartConfig!=null && chartConfig.boardFilters != null){
        for (var i = 0; i < chartConfig.boardFilters.length; i++){
            var filter = chartConfig.boardFilters[i];
            if( filterColName == filter.col)
                return filter.values;
        }
    }
    return [];
}

//delete 20190415 by hqb
function getStartEndDate_OLD(chartConfig,filterColName){
    var dateArr = [];
    if(chartConfig!=null && chartConfig.boardFilters != null){
        for (var i = 0; i < chartConfig.boardFilters.length; i++){
            var filter = chartConfig.boardFilters[i];
            if( filterColName == filter.col)
                dateArr.push(filter.values[0])
        }
    }
    return dateArr;
}

function getInervalSecond(startDate, endDate) {
    var ms = Math.abs(endDate.getTime() - startDate.getTime());
    //if (ms < 0)
    //   return 0;
    return Math.floor(ms/1000);
}

function getInervalHour(startDate, endDate) {
    var second = getInervalSecond(startDate, endDate);
    return Math.floor(second/3600);
}