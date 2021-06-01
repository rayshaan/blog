//点击回到顶部
$("#back-homepage").click(()=>document.body.scrollTop = document.documentElement.scrollTop = 0);
//更换背景
let bg=1;
setInterval(() => {
    bg++;
    bg!=9?$("#video").attr('src',`../../public/video/bg${bg}.mp4`):bg=0
},1000*60*1);

//计算时间
setInterval(() => {
    let now=new Date();//开始时间
    //2021 1 11 3 56 5 888
    let completed=new Date();//结束时间
    completed.setMonth(00);
    completed.setDate(11);
    completed.setHours(03);
    completed.setMinutes(56);
    completed.setSeconds(05);
    completed.setMilliseconds(888);
    //时间差的毫秒数
    let diffdate=now.getTime()-completed.getTime();
    //计算出相差天数
    let days=Math.floor(diffdate/(24*3600*1000));    
    //计算出小时数
    let leave1=diffdate%(24*3600*1000);   
    //计算天数后剩余的毫秒数
    let hours=Math.floor(leave1/(3600*1000));
    //计算相差分钟数
    let leave2=leave1%(3600*1000);       
    //计算小时数后剩余的毫秒数
    let minutes=Math.floor(leave2/(60*1000));
    //计算相差秒数
    let leave3=leave2%(60*1000);      
    //计算分钟数后剩余的毫秒数
    let seconds=Math.round(leave3/1000);

    $("#time span").html(days+"天"+hours+"小时"+minutes+"分钟"+seconds+"秒");
},1000);
//加载数据
$.ajax({
    url:'http://127.0.0.1:8989/get',
    method:'post',
    success(data){
        let comments=0;
        for(let i=0;i<data.length;i++){
            //评论总数
            comments+=parseInt(data[i].commentCount);
        }
        //分页信息               //当前页           //6篇博客分一页
        $(".limitnumber").html(`<span id="now">1</span> / <span id="all">${Math.ceil(data.length/6)}</span>`);
        //博客总数
        $("#one").text(`${data.length}`);
        //评论总数
        $("#two").text(`${comments}`);
        $("#three").text(`0`);
    }
});
//跳转首页
function homepage(a){
    location.href='/main';
}
//导航栏跳转音乐盒
function music(a){
    location.href='/music';
}
//导航栏跳转留言板
function message(a){
    location.href='/message';
}