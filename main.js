//express
const express=require('express');
const app=express();
//操作数据库模块
const dao=require('./model/dao.js')
//处理post请求
const bodyParser=require('body-parser');
let urlencodedParser=bodyParser.urlencoded({extended:false});
//session
const session=require('express-session')
//session持久化
const nedbstore=require('nedb-session-store')(session)
//mongodbID
const ObjectId=require('mongodb').ObjectID;
//ejs
const ejs=require('ejs')
//socket
const http=require('http').Server(app);
const io=require('socket.io')(http);

app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:86400000
    },
    //配置持久化
    store:new nedbstore({
        filename:'test.db'
    })
}));


//呈递静态资源
//主页
app.use('/main',express.static('./views/main'));

app.use('/blogs',express.static('./views/blogs/'))

app.set("view engine", "ejs");

//音乐
app.use('/music',express.static('./views/music/'));
//留言板
app.use('/message',express.static('./views/message/'));
//资源
app.use('/public',express.static('./public/'));


//登录
app.use('/login',express.static('./views/login/'));
//注册
app.use('/register',express.static('./views/register/'))


//后台
app.get('/admin',(req,res)=>{
    if(req.session.username){
        res.render('admin',{username:req.session.username})
    }else{
        res.redirect('http://127.0.0.1:8989/login')
    }
})


//首页跳转到博文
app.post('/blogs',urlencodedParser,(req,res)=>{
    req.session.blog=req.body.id;
    res.send();
});
//获取博文session
app.get('/getblog',(req,res)=>{
    res.send(req.session.blog)
});
//获取博文内容
app.post('/getblog',urlencodedParser,(req,res)=>{
    let myobj={
		_id:new ObjectId(req.body.id)
    }
    dao.find('blog','blogs',data=>{
        res.send(data);
    },myobj,{},0,0)
});

//加载数据信息
app.post('/get',urlencodedParser,(req,res)=>{
    dao.find('blog','blogs',data=>{
        res.send(data);
    },{},{_id:-1},0,0)
})
//加载博客
app.post('/getlimit',urlencodedParser,(req,res)=>{
    console.log('123')
    dao.find('blog','blogs',data=>{
        res.send(data);
    },{},{_id:-1},0,6)
})
//分页上一页
app.get('/prev',(req,res)=>{
    // 2  1  5
    // 3  2  10
    let prev=(req.query.prev-2)*6;
    dao.find('blog','blogs',data=>{
        res.send(data);
    },{},{_id:-1},prev,6)
})
//分页下一页
app.get('/next',(req,res)=>{
    // 1  2  5
    // 2  3  10
    let next=(req.query.next)*6;
    dao.find('blog','blogs',data=>{
        res.send(data);
    },{},{_id:-1},next,6)
})
//后台获取博客
app.get('/adminget',(req,res)=>{
    dao.find('blog','blogs',data=>{
        res.send(data);
    },{},{_id:-1},0,6);
});
//跳转页面
app.get('/jumppage',(req,res)=>{
    let number=(req.query.number-1)*6
    dao.find('blog','blogs',data=>{
        res.send(data);
    },{},{_id:-1},number,6);
});
//加载音乐背景
app.get('/fingbg',(req,res)=>{
    dao.find('blog','bgtype',data=>{
        res.send(data);
    },{},{},0,0)
});
//更换音乐背景
app.post('/changebg',urlencodedParser,(req,res)=>{
    let id={
        _id:new ObjectId('60047b33de225c1200d5bdcc')
    }
    let newdata={
        name:req.body.change,
        src:req.body.src,
        height:req.body.height
    }
    dao.update('blog','bgtype',id,newdata,data=>{
        res.send();
    }); 
});
//查找用户名  判断注册和登录
app.post('/username',urlencodedParser,(req,res)=>{
    let user={
        username:req.body.username
    }
    dao.find('blog','user',data=>{
        res.send(data);
    },user,{},0,0)
});
//添加用户
app.post('/adduser',urlencodedParser,(req,res)=>{
    let user={
        username:req.body.username,
        password:req.body.password
    }
    dao.insert('blog','user',user,data=>{
        res.send(data);
    }); 
});
//登录
app.post('/userlogin',urlencodedParser,(req,res)=>{
    let user={
        username:req.body.username,
        password:req.body.password
    }
    dao.find('blog','user',data=>{
        //登录成功
        if(data.length){
            //写入session
            req.session.username=user.username;
            let session={
                session:req.session.username
            }
            //判断是否存在
            dao.find('blog','session',data=>{
                if(!data.length){//不存在时增加
                    dao.insert('blog','session',session,data=>{})
                }
            },session,{},0,0)
            res.redirect('http://127.0.0.1:8989/admin');
        }else{
            res.send('用户不存在');
        }
    },user,{},0,0)
});
//获取session/免登陆
app.get('/getsess',(req,res)=>{
    let session={
        session:req.query.username
    }
    dao.find('blog','session',data=>{
        res.send(data);
    },session,{},0,0)
})
//退出登录
app.get('/logout',(req,res)=>{
    let session={
        session:req.query.username
    }
    dao.delete('blog','session',session,result=>{
        res.send(result)
    })
});
//注销帐号
app.get('/destroy',(req,res)=>{
    let session={
        session:req.query.username
    }
    let user={
        username:req.query.username
    }
    dao.delete('blog','user',user,result=>{
        dao.delete('blog','session',session,data=>{
            res.send();
        })
    })
})

//查询
app.get('/find',(req,res)=>{
    let str=req.query.title;
    let findstr={
        title:{ $regex: str}
    }
    dao.find('blog','blogs',data=>{
        res.send(data);
    },findstr,{_id:-1},0,0)
})
//加载要修改博客的数据
app.post('/thisblog',urlencodedParser,(req,res)=>{
    let id={
        _id:new ObjectId(`${req.body.id}`)
    }
    dao.find('blog','blogs',data=>{
        res.send(data)
    },id,{},0,0)
})
//修改数据
app.post('/update',urlencodedParser,(req,res)=>{
    let obj=req.body;
    let id={
        _id:new ObjectId(`${req.body.id}`)
    }
    dao.update('blog','blogs',id,obj,data=>{
        res.send(data);
    })
});
//增加博客
app.post('/add',urlencodedParser,(req,res)=>{
    let blog=req.body;
    dao.insert('blog','blogs',blog,data=>{
        res.send(data);
    });
})
//删除博客
app.post('/delete',urlencodedParser,(req,res)=>{
    let id={
        _id:new ObjectId(`${req.body.id}`)
    }
    dao.delete('blog','blogs',id,data=>{
        res.send();
    })
})

// 配置长连接
io.on('connection',socket=>{
	socket.on('chat',msg=>io.emit('send',msg))
})

http.listen('8989',"127.0.0.1");


