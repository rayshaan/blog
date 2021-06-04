$(document).scroll(function(){
    //导航栏和返回按钮滑过轮播图时显现
    if($(document).scrollTop()>=856){
        $("#back-homepage").fadeIn('slow');
    }else if($(document).scrollTop()<856){
        $("#back-homepage").fadeOut();
    }
});
//回复评论
let replythis="";
function reply(a){
    //文本域获得焦点,清空内容,提示信息改为@用户名
    $('textarea').val('').focus().attr('placeholder',`@${$(a).parent().find('.username').text()}`);
    //滚动到文本域
    $('html,body').animate({scrollTop:$("textarea").offset().top},500);
    replythis=a;
}
//发布评论
$("#fabu a").click(function(){
    let email=false;            
    //判断是否为空，如果为空提醒
    if($("#user-input").val()==""){
        $("#user-input").addClass('shake').css('border-color','red');
    }
    if($("#email-input").val()==""){
        $("#email-input").addClass('shake').css('border-color','red');
    }else{//验证邮箱格式
        var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        reg.test($("#email-input").val())?console.log('正确'):$("#email-input").addClass('shake').css('border-color','red');
        email=true;
    }
    //当有输入且邮箱格式正确
    if($("#user-input").val()!=""&&$("#email-input").val()!=""&&email==true){
        //验证评论内容
        if($("textarea").val()==""){
            $("textarea").focus().css('border-color','red');
        }else{//如果不为空
            console.log($("textarea").val())
            //当前时间
            let date=new Date();
            let year=date.getFullYear();
            let month=date.getMonth()+1>10?date.getMonth()+1:`0${date.getMonth()+1}`;
            let day=date.getDate()>10?date.getDate():`0${getDate()}`;
            let hour=date.getHours()>10?date.getHours():`0${date.getHours()}`;
            let min=date.getMinutes()>10?date.getMinutes():`0${date.getMinutes()}`;
            let time=`${year}-${month}-${day}  ${hour}:${min}`;
            //回复评论    
            if($("textarea").attr('placeholder').startsWith('@')){
                //找到回复位置
                let elm=$(replythis).parent().parent()[0];
                $(elm).after(`
                    <div class="row song-comment">
                        <a href="javascript:;" class="am col-0.5"><img src="../../public/images/comment-touxiang.png" alt=""></a>
                        <div class="right-comment col-11.5">
                            <a href="javascript:;" class="username">${$("#user-input").val()}</a>&nbsp;&nbsp;<b style="color: #00B5AD;font-size: 16px;">${$("textarea").attr('placeholder')}</b>&nbsp;&nbsp;<span style="color: gray;font-size: 11px;">${time}</span><br>
                            <div class="comment-text">${$("textarea").val()}</div>
                            <a href="javascript:;" style="color: gray;" onclick="reply(this)">回复</a>
                        </div>
                    </div>
                `);
                //回复后滚动到回复位置
                $('html,body').animate({scrollTop:$($(elm)).offset().top},500);
                //回复后改回提示
                $("textarea").attr('placeholder','请输入评论')
            }else{
                //添加新评论
                $(".comments").append(`
                    <div class="row">
                        <a href="javascript:;" class="am col-0.5"><img src="../../public/images/comment-touxiang.png" alt=""></a>
                        <div class="right-comment col-11.5">
                            <a href="javascript:;" class="username">${$("#user-input").val()}</a>&nbsp;&nbsp;&nbsp;<span style="color: gray;font-size: 11px;">${time}</span><br>
                            <div class="comment-text">${$("textarea").val()}</div>
                            <a href="javascript:;" style="color: gray;" onclick="reply(this)">回复</a>
                        </div>
                    </div>
                `);
            }   
        }
    }
    //提醒后清除
    setTimeout(() => {
        $("#user-input,#email-input").removeClass('shake').css('border-color','black')
        $("textarea").css('border-color','black')
    }, 1000);
})

