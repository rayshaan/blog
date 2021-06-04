//二维码
$("#qq-icon").on({
    mouseover:()=>{
        $("#qq").css('visibility','visible');
    },
    mouseout:()=>{
        $("#qq").css('visibility','hidden');
    }
});
$("#wechat-icon").on({
    mouseover:()=>{
        $("#wechat").css('visibility','visible');
    },
    mouseout:()=>{
        $("#wechat").css('visibility','hidden');
    }
});
//导航栏
$(document).scroll(function(){
    //导航栏和返回按钮滑过轮播图时显现
    if($(document).scrollTop()>=856){
        $("#nav").fadeIn("slow");
        $("#back-homepage").fadeIn('slow');
    }else if($(document).scrollTop()<856){
        $("#nav").fadeOut();
        $("#back-homepage").fadeOut();
    }
});
//跳转博文
function href(a){
    $.ajax({
        url:'http://127.0.0.1:8989/blogs',
        method:'post',
        data:{id:$(a).next()[0].innerHTML},
        success(data){
            location.href='/blogs';
        }
    }); 
}
//加载已发布的博客
$.ajax({
    url:'http://127.0.0.1:8989/getlimit',
    method:'post',
    success(data){
        for(let i=0;i<data.length;i++){
            //最新推荐
            if(i<data.length-2){
                //标题过长省略
                let title=data[i].title;
                title=title.length>12?title.substring(0,11)+'......':title;
                $("#recommend").append(`
                    <div class="col-sm-12 col-md-3">
                        <a href="javascript:;">
                            <img src="../../public/images/blog-img/blog1-img.jpg" alt="" onclick="href(this)">
                            <p style="display:none">${data[i]._id}</p>
                            <span>${title}</span>
                        </a>
                    </div>
                `);
            }
            //最新文章
            $(".limit").before(`
                <div class="row blogs">          
                    <div class="article-content col-sm-12 col-md-6">                    
                        <h3 onclick="href(this)">${data[i].title}</h3>
                        <p style="display:none">${data[i]._id}</p>
                        <p>${data[i].p}</p>
                        <div>
                            <i><img src="../../public/images/touxiang.jpg" alt=""></i>&nbsp;
                            <a href="javascript:;">${data[i].author}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <i class="fa fa-calendar"></i>
                            <span>${data[i].date}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                            <i class="fa fa-comment-o"></i>
                            <span>${data[i].commentCount}</span>
                        </div>
                    </div>
                    <div class="article-img col-sm-12 col-md-6">
                        <img src='../../public/images/blog-img/blog2-img.jpg' alt="">
                    </div>  
                </div>
            `);
        }
    }
})
//分页  上一页
function prev(){
    let page=parseInt($("#now").text());
    let all=parseInt($("#all").text());
    //当前页是最后一页就不跳
    if(page>1){
        $.ajax({
            url:'http://127.0.0.1:8989/prev',
            data:{prev:$("#now").text()},
            success(data){
                let str='';
                for(let i in data){
                    str+=`
                        <div class="row blogs">          
                            <div class="article-content col-sm-12 col-md-6">                    
                                <h3 onclick="href(this)">${data[i].title}</h3>
                                <p style="display:none">${data[i]._id}</p>
                                <p>${data[i].p}</p>
                                <div>
                                    <i><img src="../../public/images/touxiang.jpg" alt=""></i>&nbsp;
                                    <a href="javascript:;">${data[i].author}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <i class="fa fa-calendar"></i>
                                    <span>${data[i].date}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <i class="fa fa-comment-o"></i>
                                    <span>${data[i].commentCount}</span>
                                </div>
                            </div>
                            <div class="article-img col-sm-12 col-md-6">
                                <img src='${data[i].src}' alt="">
                            </div>  
                        </div>
                    `;
                }
                $("#articles").html(`
                    <div class="row">
                        <div>
                            <i class="fa fa-bookmark" aria-hidden="true"></i> 
                            最新文章
                        </div>
                    </div>
                    ${str}
                    <div class="row limit">
                        <div class="prev" onclick="prev()">上一页</div>
                        <div class="limitnumber"><span id="now">${page}</span> / <span id="all">${all}</span></div>
                        <div class="next" onclick="next()">下一页</div>
                    </div>
                `);
                $("#now").text(`${page-1}`)
            }  
        })
    }
}
//分页  下一页
function next(){
    let page=parseInt($("#now").text());
    let all=parseInt($("#all").text());
    //当前页是最后一页就不跳
    if(page!=all){
        $.ajax({
            url:'http://127.0.0.1:8989/next',
            data:{next:$("#now").text()},
            success(data){
                let str='';
                for(let i in data){
                    str+=`
                        <div class="row blogs">          
                            <div class="article-content col-sm-12 col-md-6">                    
                                <h3 onclick="href(this)">${data[i].title}</h3>
                                <p style="display:none">${data[i]._id}</p>
                                <p>${data[i].p}</p>
                                <div>
                                    <i><img src="../../public/images/touxiang.jpg" alt=""></i>&nbsp;
                                    <a href="javascript:;">${data[i].author}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <i class="fa fa-calendar"></i>
                                    <span>${data[i].date}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <i class="fa fa-comment-o"></i>
                                    <span>${data[i].commentCount}</span>
                                </div>
                            </div>
                            <div class="article-img col-sm-12 col-md-6">
                                <img src='${data[i].src}' alt="">
                            </div>  
                        </div>
                    `;
                }
                $("#articles").html(`
                    <div class="row">
                        <div>
                            <i class="fa fa-bookmark" aria-hidden="true"></i> 
                            最新文章
                        </div>
                    </div>
                    ${str}
                    <div class="row limit">
                        <div class="prev" onclick="prev()">上一页</div>
                        <div class="limitnumber"><span id="now">${page}</span> / <span id="all">${all}</span></div>
                        <div class="next" onclick="next()">下一页</div>
                    </div>
                `); 
                $("#now").text(`${page+1}`)
            }  
        })
    }
}
//查询
$("#searchinput").on('keydown',function(e){
    if(e.keyCode==13){
        $.ajax({
            url:'http://127.0.0.1:8989/find',
            data:{
                title:$(this).val()
            },
            success(data){
                $(".blogs").remove();
                for(let i=0;i<data.length;i++){
                    $(".limit").before(`
                        <div class="row blogs">          
                            <div class="article-content col-sm-12 col-md-6">                    
                                <h3 onclick="href(this)">${data[i].title}</h3>
                                <p style="display:none">${data[i]._id}</p>
                                <p>${data[i].p}</p>
                                <div>
                                    <i><img src="../../public/images/touxiang.jpg" alt=""></i>&nbsp;
                                    <a href="javascript:;">${data[i].author}</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <i class="fa fa-calendar"></i>
                                    <span>${data[i].date}</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <i class="fa fa-comment-o"></i>
                                    <span>${data[i].commentCount}</span>
                                </div>
                            </div>
                            <div class="article-img col-sm-12 col-md-6">
                                <img src='${data[i].src}' alt="">
                            </div>  
                        </div>
                    `);
                    $(".limitnumber").html(`<span id="now">1</span> / <span id="all">${Math.ceil(data.length/6)}</span>`);
                }
            }
        })
    }
})
