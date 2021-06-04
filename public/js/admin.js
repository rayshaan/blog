 $("#head span").on('mouseover',function(){
    $(this).next().show();
})
$("#head div").on({
    mouseover:function(){$(this).show()},
    mouseout:function(){$(this).hide()}
}); 
//日期
let date=new Date();
let year=date.getFullYear();
let month=date.getMonth()+1>10?date.getMonth()+1:`0${date.getMonth()+1}`;
let day=date.getDate()>10?date.getDate():`0${date.getDate()}`;
let time=`${year}-${month}-${day}`;

let hour=date.getHours()>10?date.getHours():`0${date.getHours()}`;
let min=date.getMinutes()>10?date.getMinutes():`0${date.getMinutes()}`;
let second=date.getSeconds()>10?date.getSeconds():`0${date.getSeconds()}`;
let nowtime=`${year}/${month}/${day}  ${hour}:${min}:${second}`;
//博客
$.ajax({
    url:'http://127.0.0.1:8989/adminget',
    method:'get',
    success(data){
        //博客
        let str='';
        for(let i in data){
            let title=data[i].title;
            title=title.length>15?title.substring(0,14)+'......':title;
            str+=`
                <tr>
                    <td class='long'>${data[i]._id}</td>
                    <td class="short"><img src='../../public/images/blog-img/blog2-img.jpg'></td>
                    <td class='long'>${title}</td>
                    <td class='long'>${data[i].author}</td>
                    <td class='long'>${data[i].date}</td>
                    <td class='long'>
                        <a title="修改博客信息" class="changedata" onclick='update(this)'><i class="fa fa-pencil-square-o"></i></a>
                        <a title="删除此博客" class="delete" onclick='deleteblog(this)'><i class="fa fa-trash-o"></i></a>
                    </td>
                </tr>`;
            $("tbody").html(`${str}`);
        }
    }
}); 
//分页
$.ajax({
    url:'http://127.0.0.1:8989/get',
    method:'post',
    success(data){
        $("#all").text(`${data.length}`);
        //有余数多一页
        let limitnum=Math.floor(data.length%6==0?data.length/6:(data.length/6)+1);
        let str="";
        for(let i=0;i<limitnum;i++){
            if(i==0){
                str+=`<a  id="${i+1}" onclick='jump(this)' class='active'>${i+1}</a>`;
            }else{
                str+=`<a  id="${i+1}" onclick='jump(this)'>${i+1}</a>`;
            }
        }
        str=`
            <a  id="prev" onclick='prev(this)'><</a>
            ${str}
            <a  id="next" onclick='next(this)'>></a>`;
        $("#right-limit").html(str);
    }
});
//跳转页数
function jump(a){
    $.ajax({
        url:'http://127.0.0.1:8989/jumppage',
        data:{
            number:$(a).text()
        },
        success(data){
            $(".active").removeClass('active');
            $(a).addClass('active');
            let str='';
            for(let i in data){
                let title=data[i].title;
                title=title.length>15?title.substring(0,14)+'......':title;
                str+=`
                    <tr>
                        <td class='long'>${data[i]._id}</td>
                        <td class="short"><img src='../../public/images/blog-img/blog2-img.jpg'></td>
                        <td class='long'>${title}</td>
                        <td class='long'>${data[i].author}</td>
                        <td class='long'>${data[i].date}</td>
                        <td class='long'>
                            <a title="修改博客信息" class="changedata" onclick='update(this)'><i class="fa fa-pencil-square-o"></i></a>
                            <a title="删除此博客" class="delete" onclick='deleteblog(this)'><i class="fa fa-trash-o"></i></a>
                        </td>
                    </tr>`;
                $("tbody").html(`${str}`);
            }
        }
    });
}
//上一页
function prev(a){
    let prev=$(".active").text();
    if(prev!=1){
        $.ajax({
            url:'http://127.0.0.1:8989/prev',
            data:{
                prev:prev
            },
            success(data){
                let str='';
                for(let i in data){
                    let title=data[i].title;
                    title=title.length>15?title.substring(0,14)+'......':title;
                    str+=`
                        <tr>
                            <td class='long'>${data[i]._id}</td>
                            <td class="short"><img src='${data[i].src}'></td>
                            <td class='long'>${title}</td>
                            <td class='long'>${data[i].author}</td>
                            <td class='long'>${data[i].date}</td>
                            <td class='long'>
                                <a title="修改博客信息" class="changedata" onclick='update(this)'><i class="fa fa-pencil-square-o"></i></a>
                                <a title="删除此博客" class="delete" onclick='deleteblog(this)'><i class="fa fa-trash-o"></i></a>
                            </td>
                        </tr>`;
                    $("tbody").html(`${str}`);
                }   
                let now=$(".active").prev()[0];
                $(".active").removeClass('active');
                $(now).addClass('active') 
            }
        });
    }
}
//下一页
function next(a){
    let next=$(".active").text();
    let max=$("#all").text();
    max=Math.floor(max%6==0?max/6:(max/6)+1);
    if(next!=max){
        $.ajax({
            url:'http://127.0.0.1:8989/next',
            data:{
                next:next
            },
            success(data){
                let str='';
                for(let i in data){
                    let title=data[i].title;
                    title=title.length>15?title.substring(0,14)+'......':title;
                    str+=`
                        <tr>
                            <td class='long'>${data[i]._id}</td>
                            <td class="short"><img src='${data[i].src}'></td>
                            <td class='long'>${title}</td>
                            <td class='long'>${data[i].author}</td>
                            <td class='long'>${data[i].date}</td>
                            <td class='long'>
                                <a title="修改博客信息" class="changedata" onclick='update(this)'><i class="fa fa-pencil-square-o"></i></a>
                                <a title="删除此博客" class="delete" onclick='deleteblog(this)'><i class="fa fa-trash-o"></i></a>
                            </td>
                        </tr>`;
                    $("tbody").html(`${str}`);
                }   
                let now=$(".active").next()[0];
                $(".active").removeClass('active');
                $(now).addClass('active') 
            }
        });
    }
}
//退出登录
$("#logout").click(function(){
    $.ajax({
        url:'http://127.0.0.1:8989/logout',
        data:{
            username:$("#head span").text()
        },
        success(data){
            location.href='/login'
        }
    });
})
//注销帐号
$("#destroy").click(function(){
    let a=confirm(`确定要注销帐号吗`);
    if(a==true){
        $.ajax({
            url:'http://127.0.0.1:8989/destroy',
            data:{
                username:$("#head span").text()
            },
            success(data){
                alert('帐号注销成功')
                location.href='/login'
            }
        })
    }
})
//删除博客
function deleteblog(a){
    let x=confirm('确定要删除此博客吗?');
    if(x==true){
        $.ajax({
            url:'http://127.0.0.1:8989/delete',
            method:'post',
            data:{
                id:$($(a).parent().parent().children("td").get(0)).text()
            },
            success(data){
                confirm('删除成功');
                location.reload()
            }
        })
    }
} 
//修改信息
$(".off").click(()=>$(".cover1").hide())
$("#cancel").click(()=>$(".cover1").hide())
$("#upload").click(function(){
    $("#fileimg").click();
})
$("#fileimg").on('change',function(){
    $("#blogimg").attr('placeholder',`${$("#fileimg").val()}`);
})
function update(a){
    $(".cover1").show()
    $.ajax({
        url:'http://127.0.0.1:8989/thisblog',
        method:'post',
        data:{
            id:$(a).parent().parent().children('td').get(0).innerHTML
        },
        success(data){//加载要修改的信息
            $("#blogtitle").attr('placeholder',`${data[0].title}`);
            $("#blogcontent").attr('placeholder',`${data[0].content}`);
            $("#blogauthor").attr('placeholder',`${$('#head span').text()}`);
            //点击确定修改
            $("#confirm").click(function(){
                let obj={};
                //不等于空才传值
                if($("#blogtitle").val()!=""){obj.title=$("#blogtitle").val()};
                if($("#blogimg").val()!=""){obj.src=$("#blogimg").val()};
                if($("#blogcontent").val()!=""){obj.content=$("#blogcontent").val()};
                obj.author=$("#blogauthor").attr('placeholder');
                obj.id=data[0]._id;
                
                obj.date=time;
                $.ajax({
                    url:"http://127.0.0.1:8989/update",
                    method:'post',
                    data:obj,
                    success(data){
                        confirm('修改成功');
                        location.reload()
                    }
                })
            })
        }
    })
}
//模糊查询
$("#searchinput").on('keydown',function(e){
    if(e.keyCode==13){
        $.ajax({
            url:'http://127.0.0.1:8989/find',
            data:{
                title:$(this).val()
            },
            success(data){
                //有查询到博客
                if(data.length){
                    let str='';
                    for(let i in data){
                        let title=data[i].title;
                        title=title.length>15?title.substring(0,14)+'......':title;
                        str+=`
                            <tr>
                                <td class='long'>${data[i]._id}</td>
                                <td class="short"><img src='../../public/images/blog-img/blog2-img.jpg'></td>
                                <td class='long'>${title}</td>
                                <td class='long'>${data[i].author}</td>
                                <td class='long'>${data[i].date}</td>
                                <td class='long'>
                                    <a title="修改博客信息" class="changedata" onclick='update(this)'><i class="fa fa-pencil-square-o"></i></a>
                                    <a title="删除此博客" class="delete" onclick='deleteblog(this)'><i class="fa fa-trash-o"></i></a>
                                </td>
                            </tr>`;
                        $("tbody").html(`${str}`);
                        //分页
                        $("#all").text(`${data.length}`);
                        //有余数多一页
                        let limitnum=Math.floor(data.length%6==0?data.length/6:(data.length/6)+1);
                        let str1="";
                        for(let i=0;i<limitnum;i++){
                            if(i==0){
                                str1+=`<a  id="${i+1}" onclick='jump(this)' class='active'>${i+1}</a>`;
                            }else{
                                str1+=`<a  id="${i+1}" onclick='jump(this)'>${i+1}</a>`;
                            }
                        }
                        str1=`
                            <a  id="prev" onclick='prev(this)'><</a>
                            ${str1}
                            <a  id="next" onclick='next(this)'>></a>`;
                        $("#right-limit").html(str1);
                    }
                }
            }
        })
    }
})
//增加博客
$(".upoff").click(()=>$(".cover2").hide())
$("#upcancel").click(()=>$(".cover2").hide())
$("#publish").click(function(){
    $(".cover2").show();
    $("#upblogauthor").attr('placeholder',`${$('#head span').text()}`);
    $("#upconfirm").click(function(){
        //填写信息不能为空
        if($("#upblogtitle").val()==""||$("#upblogp").val()==""||$("#upblogcontent").val()==""){
            alert('请输入博客信息再发布')
        }else{
            //数据
            let obj={
                title:$("#upblogtitle").val(),
                date:time,
                p:$("#upblogp").val(),
                content:$("#upblogcontent").val(),
                commentCount:0,
                author:$("#upblogauthor").attr('placeholder')
            }
            $.ajax({
                url:'http://127.0.0.1:8989/add',
                method:'post',
                data:obj,
                success(data){
                    confirm('发布成功');
                    location.reload()
                }
            })
        }
    })
})
//对话
let socket=io();
$("#submit").on('keydown',function(e){
    if(e.keyCode==13){
        if($("#submit").val()==""){
            $(this).attr('placeholder','请输入信息再发送')
        }else{
            socket.emit('chat',{
                msg:`<li><span>${$("#head span").text()}</span>  <span>${nowtime}</span><br>${$("#submit").val()}</li>`
            })
            $("#submit").val("");
            $("#submit").focus();
        }
    }
})
socket.on('send',msg=>{
    let done=msg.msg.indexOf(' ');
    let username=msg.msg.substring(4,done);

    let arr=msg.msg.split('');
    //我发的
    if(username==`<span>${$("#head span").text()}</span>`){
        arr.splice(3,0," ","c","l","a","s","s","=","'","r","i","g","h","t","'");
        let mystr=arr.join('');
        $("#session ul").append(`${mystr}`)
    }else{//别人发的
        arr.splice(3,0," ","c","l","a","s","s","=","'","l","e","f","t","'");
        let othersstr=arr.join('');
        $("#session ul").append(`${othersstr}`)
        //提醒有新消息
        if($("#web").css('display')=='none'){
            $("#newweb").css('animation',"twink 2s infinite linear")
        }
    } 
})
//控制对话框
$("#newweb").click(()=>$("#web").toggle())
$("#newweb").click(function(){$(this).css('animation','none')})