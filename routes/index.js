var express = require('express');
var router = express.Router();
var app = express();
var data=require('../database/dbConnect');
var sessionId;  //存储session值
var sessionName;

//用ajax获取数据
// router.get('/req_ajax', function(req, res, next){
//     var type = req.query.pageSize;
//     // var info = req.query.info;
//     console.log(type)
//     client=data.connectServer();    //建立连接
//     var result=null; 
//     data.dbControl(client, "select * from class limit "+type+",8 ", function(result){
//         res.json(result)
//     })
// });
// router.get('/getdata', function(req, res, next){
//     var type = req.query.pageNum;
//     // var info = req.query.info;
//     console.log(type)
//     var client=data.connectServer();    //建立连接
//     var result=null; 
//     data.dbControl(client, "select * from class where manager_id="+sessionId+"", function(result){
//         // res.json(result)
//         console.log(result.length)
//         var cl = data.connectServer();
//         data.dbControl(cl, "select * from class limit "+type+",8 ", function(ss){
//             // res.json(ss)
//             var dd={
//                 total:result.length
//             }
//             console.log(ss.length)
//         })

//     }); 
// });



//登陆页
router.route('/')
    .get(function(req, res) {
  		res.render('login', { 
            docTitle: '欢迎使用实验课程教学管理系统' ,
            bodyTitle:'岭南师范学院'
        });
	})
    .post(function(req, res) {
        var id = req.body.id_input;
        var pwd = req.body.pwd_input;
        client=data.connectServer();    //建立连接
        result=null;    //清空结果集
        if(req.body.stu_login){
            data.dbControl(client, "select * from student_info where stu_id='"+id+"'", function (result) {
                console.log(result,'result')
            if(!result[0]){
                res.send("<script>alert('用户名不存在或密码错误');</script>");
            }else{
                if(result[0].stu_pwd===pwd){
                    req.session.stu_id=id;   //保存id到session中
                    sessionId = req.session.stu_id; //保存session在全局变量中，方便后面调用
                    req.session.stu_name=result[0].stu_name;
                    sessionName = req.session.stu_name;
                    res.redirect('/stu_index');
                }else
                {
                    res.redirect('/');
                }
               }
            });
        };
        if(req.body.teacher_login){
            data.dbControl(client, "select * from teacher_info where teacher_id='"+id+"'", function (result) {
            if(!result[0]){
                res.send("<script>alert('用户名不存在或密码错误');</script>");
            }else{
                if(result[0].teacher_pwd===pwd){
                    req.session.teacher_id=id;
                    sessionId = req.session.teacher_id;
                    req.session.teacher_name=result[0].teacher_name;
                    sessionName = req.session.teacher_name;
                    res.redirect('/teacher_index');
                }else{
                    res.redirect('/');
                }
               }
            });
        };
        if(req.body.manager){
            data.dbControl(client, "select * from manager_info where manager_id='"+id+"'", function (result) {
            if(!result[0]){
                res.send("<script>alert('用户名不存在或密码错误');</script>");
            }else{
                if(result[0].manager_pwd===pwd){
                    req.session.manager_id=id;
                    sessionId = req.session.manager_id;
                    req.session.name=result[0].manager_name;
                    sessionName = req.session.name;
                    res.redirect('/manager_index');
                }else{
                    res.redirect('/');
                }
               }
            });
        }
        if(req.body.admin){
            data.dbControl(client, "select * from admin where id='"+id+"'", function (result) {
            if(!result[0]){
                res.send("<script>alert('用户名不存在或密码错误');</script>");
            }else{
                if(result[0].pwd===pwd){
                    req.session.id=id;
                    sessionId = req.session.id;
                    req.session.name=result[0].name;
                    sessionName = req.session.name;
                    res.redirect('/admin_index');
                }else{
                    res.redirect('/');
                }
               }
            });
        }
    });

// app.get('/logout', function(req, res) {
	// 	req.logout();
	// 	res.redirect('/');
	// });

//退出页
// router.get('/logout',function(req,res) {
//     req.logout();
//     res.redirect('/')
// })
//学生个人主页
router.get('/stu_index', function(req, res) {
    if(sessionId&&sessionName){
        res.render('stu_index', { 
            docTitle: '实验课程教学管理系统' ,
            name: sessionName + '同学',
            stuSelectedLession: '查看已选课程' ,
            stuAllLession: '查看所有课程' ,
            stuForTeacher: '查看教师信息' ,
            stuInfo: '查看个人信息'
        });
    }
});

router.route('/manage/studentWatchClass')
    .get(function(req, res){
        if(sessionId&&sessionName){
            client=data.connectServer();
            result=null;
            data.dbControl(client, "select * from class where teacher='"+sessionId+"' limit 2,2 ", function (result,total) {
                var item = result;
                res.render('manage/studentWatchClass', {
                    item : item ,
                    docTitle: sessionName+'同学的管理空间' ,
                })
                res.end()
            })
    
        }
    
    })


//获取课程列表
router.get('/getClass', function(req, res, next){
    var type = req.query.pageNum;
    console.log(type)
    var clsss = data.connectServer();
    data.dbControl(clsss,"select * from student_info where stu_id='"+sessionId+"'",function(sty){
        console.log(sty[0].stu_grade,'ss')
        // var ss = JSON.parse(JSON.stringify(sty))
        // console.log(ss,'ss')
        var client=data.connectServer();    //建立连接
        data.dbControl(client, "select * from class where class='"+sty[0].stu_grade+"'and status=2", function(result){
            var cl = data.connectServer();
            data.dbControl(cl, "select * from class where class='"+sty[0].stu_grade+"' and status=2 limit "+type*8+",8 ", function(ss){
                var total = result.length;
                var totalPage = parseInt(total/8);
                var dd = 0;
                if(total%8 > 0){
                    dd =  1
                }
                var dds={
                    total:total,
                    pageSize:8,
                    totalPage:totalPage+dd,
                    data:ss
                }
                res.json(dds)
            })

        }); 
    })
        
});



//教师个人主页
router.get('/teacher_index', function(req, res) {
    if(sessionId&&sessionName){
        res.render('teacher_index', { 
            docTitle: '实验课程教学管理系统' ,
            name: sessionName+'老师',
            teacherAllLession: '查看所有课程' ,
            teacherSelectedLession: '查看已带课程' ,
            teacherInfo: '查看个人信息'
        });
    }
});


//获取课程列表
router.get('/getdata', function(req, res, next){
    var type = req.query.pageNum;
    // var info = req.query.info;
    console.log(type)
    var client=data.connectServer();    //建立连接
    var result=null; 
    console.log(sessionId)
    data.dbControl(client, "select * from class where teacher='"+sessionId+"'", function(result){
        // res.json(result)
        // console.log(result.length)
        var cl = data.connectServer();
        data.dbControl(cl, "select * from class where teacher='"+sessionId+"' limit "+type*8+",8 ", function(ss){
            // res.json(ss)
            var total = result.length;
            var totalPage = parseInt(total/8);
            var dd = 0;
            // console.log(totalPage)
            if(total%8 > 0){
                dd =  1
            }
            var dds={
                total:total,
                pageSize:8,
                totalPage:totalPage+dd,
                data:ss
            }
            res.json(dds)

            // console.log(dd)
        })

    }); 
});
//根据课程id获取实验项目
router.get('/getData/getpro',function(req, res, next){
    var cli = data.connectServer();
    var id = req.query.id
    data.dbControl(cli,"select * from project where id='"+id+"'",function(ressult){
        res.json(ressult)
        console.log(ressult)
    })
})
//搜索课程
router.get('/search', function(req, res, next){
    var type = req.query.pageNum;
    var search = req.query.search;
    var client=data.connectServer();    //建立连接
    var result=null; 
    data.dbControl(client, "select * from class where class_name like '%"+search+"%' and teacher='"+sessionId+"'", function(result){
        var total = result.length;
        var totalPage = parseInt(total/8);
        var dd = 0;
        if(total>8){
            if(total%8 > 0){
                totalPage += 1
            }
        }
        var cl = data.connectServer();
        if(result.length>8){
            data.dbControl(cl, "select * from class where class_name like '%"+search+"%' and teacher='"+sessionId+"' limit "+type*8+",8 ", function(ss){
                console.log(totalPage,'[age')
                var dd={
                    total:total,
                    pageSize:8,
                    totalPage:totalPage,
                    data:ss
                }
                console.log(dd)
                res.json(dd)
            })
        }else {
            var dd={
                total:total,
                pageSize:8,
                totalPage:1,
                data:result
            }
            console.log(dd)
            res.json(dd)
        }
    }); 
});
//修改课程
router.post('/edit',function(req, res, next){
    var id = req.body.id
    new_profession         = req.body.major,
    new_class              = req.body.classs,
    new_class_name         = req.body.class_name,
    new_class_manage       = req.body.cl_manage,
    console.log(id,'dd')
    console.log(req.body)
    var client = data.connectServer();
    var ss = JSON.parse(req.body.data)
    data.dbControl(client,"update class set profession='"+new_profession+"', class='"+new_class+"', class_name='"+new_class_name+"', class_manage='"+new_class_manage+"', status='"+1+"' where id='"+id+"'",function(result){
        // console.log(result)
        // res.json(result)
        if(ss.length){
            var cl = data.connectServer();
            // console.log(ss)
            data.dbControl(cl,"delete from project where id='"+id+"'",function(result){
                var cl_name = req.body.class_name;
                var sql = "insert into project (week, class_times, name, content, device, place,class_name,id) values ";
                for(var i = 0;i<ss.length;i++){
                    var val = '';
                    var week        = ss[i].week;
                    var class_times = ss[i].class_times;
                    var name        = ss[i].name;
                    var content     = ss[i].content;
                    var device      = ss[i].device;
                    var place       = ss[i].place;
                    val = "('"+week+"', '"+class_times+"', '"+name+"', '"+content+"','"+device+"', '"+place+"','"+cl_name+"','"+id+"'),";
                    if(i==ss.length-1){
                        val ="('"+week+"', '"+class_times+"', '"+name+"', '"+content+"','"+device+"', '"+place+"','"+cl_name+"','"+id+"')"
                    }
                    sql += val;
                }
                var cyh = data.connectServer();
                data.dbControl(cyh,sql,function(result){
                    console.log(result) 
                    // res.send('提交成功')
                    res.json(result)
                })
            })
        }else{
            res.json(result)
        }    
    })
})

//删除课程
router.post('/delete',function(req, res, next){
    var id = req.body.id;
    console.log(id,'dd')
    console.log(req.body)
    var client = data.connectServer();
    var clie = data.connectServer();
    data.dbControl(clie,"delete from project where id='"+id+"'",function(result){
        data.dbControl(client,"delete from class where id='"+id+"'",function(result){
            console.log(result)
            res.json(result)
        })
    })
    
})

//添加实验项目
router.post('/addproject', function(req, res, next){
    // 
    var cli=data.connectServer();
    // result=null;
    data.dbControl(cli,  "select * from class", function (id) {
        // var item = result;
        var ss = JSON.parse(req.body.data)
        var id = id[id.length-1].id;
        id++
        var client = data.connectServer();
        var cl_name = req.body.class_name;
        var sql = "insert into project (week, class_times, name, content, device, place,class_name,id) values ";
        for(var i = 0;i<ss.length;i++){
            var val = '';
            var week        = ss[i].week;
            var class_times = ss[i].class_times;
            var name        = ss[i].name;
            var content     = ss[i].content;
            var device      = ss[i].device;
            var place       = ss[i].place;
            val = "('"+week+"', '"+class_times+"', '"+name+"', '"+content+"','"+device+"', '"+place+"','"+cl_name+"','"+id+"'),";
            if(i==ss.length-1){
                val ="('"+week+"', '"+class_times+"', '"+name+"', '"+content+"','"+device+"', '"+place+"','"+cl_name+"','"+id+"')"
            }
            sql += val;
            // console.log(new_week)
            // valueItem[i] = val;
           
        }
       
        new_profession         = req.body.major,
        new_class              = req.body.classs,
        new_class_name         = req.body.class_name,
        new_class_manage       = req.body.cl_manage,
        new_teacherId        = sessionId,
        new_teacherName      = sessionName;
        new_date             = dateToString(new Date())
        console.log(id)
        var cle = data.connectServer();
        data.dbControl(cle, "insert into class (id, profession, class, class_name, class_manage, teacher, status,teacher_id,date) values ('"+id+"', '"+new_profession+"', '"+new_class+"', '"+new_class_name+"', '"+new_class_manage+"', '"+new_teacherId+"', '"+1+"','"+new_teacherName+"','"+new_date+"')", function(result){
            // console.log(result)
            data.dbControl(client,sql,function(result){
                console.log(result) 
                // res.send('提交成功')
                res.json(result)
            })
            // res.end();
        })
    })

})

//添加课程
router.route('/manage/addClass')
    .get(function(req, res){
        if(sessionId&&sessionName){
        client=data.connectServer();
        result=null;
        data.dbControl(client,  "select * from class where  teacher='"+sessionId+"'", function (result) {
            var item = result;
            console.log(item)
            res.render('manage/addClass', {
                item : item ,
                docTitle: sessionName+'同学的管理空间' ,
            })
            res.end()
        })

    }})
    // .post(function(req, res){
        // console.log(req.body)
        //     new_profession         = req.body.major,
        //     new_class              = req.body.class,
        //     new_class_name         = req.body.class_name,
        //     new_class_manage       = req.body.class_manage,
        // //     new_route            = req.body.route,
        // //     new_times            = req.body.times,
        // //     new_time             = req.body.time,
        //     new_teacherId        = sessionId,
        //     new_teacherName      = sessionName;
        //     new_date             = dateToString(new Date())
        // //     new_intru            = req.body.intru
        // client=data.connectServer();
        // // result=null;
        // data.dbControl(client,  "select * from class", function (id) {
        //     var item = result;
        //     var id = id[id.length-1].id;
        //     id++
        //     console.log(id)
        //     var cle = data.connectServer();
        //     data.dbControl(cle, "insert into class (id, profession, class, class_name, class_manage, teacher, status,teacher_id,date) values ('"+id+"', '"+new_profession+"', '"+new_class+"', '"+new_class_name+"', '"+new_class_manage+"', '"+new_teacherId+"', '"+1+"','"+new_teacherName+"','"+new_date+"')", function(result){
        //         // console.log(result)
        //         // res.send(result)
        //         console.log(result)
        //         res.send('提交成功')
        //         res.end();
        //     })
        // })
        // console.log(req.body)
    // });
// router.get()

//查看课程
router.route('/manage/watchClass')
    .get(function(req, res){
        if(sessionId&&sessionName){
            client=data.connectServer();
            result=null;
            data.dbControl(client, "select * from class where teacher='"+sessionId+"' limit 2,2 ", function (result,total) {
                var item = result;
                res.render('manage/watchClass', {
                    item : item ,
                    docTitle: sessionName+'同学的管理空间' ,
                })
                res.end()
            })
    
        }
    
    })



//教务主任个人主页
router.get('/manager_index', function(req, res) {
    if(sessionId&&sessionName){
        res.render('manager_index', { 
            docTitle: '实验课程教学管理系统' ,
            name: sessionName+'主任'
        });
    }
});


//查看课程
router.route('/manage/class_manage')
    .get(function(req, res){
        if(sessionId&&sessionName){
            client=data.connectServer();
            result=null;
            data.dbControl(client, "select * from class where teacher='"+sessionId+"' limit 2,2 ", function (result,total) {
                var item = result;
                res.render('manage/class_manage', {
                    item : item ,
                    docTitle: sessionName+'同学的管理空间' ,
                })
                res.end()
            })
    
        }
    
    })
//获取课程列表
router.get('/getAllclass', function(req, res, next){
    var type = req.query.pageNum;
    // var info = req.query.info;
    console.log(type)
    var client=data.connectServer();    //建立连接
    var result=null; 
    console.log(sessionId)
    data.dbControl(client, "select * from class where status='"+1+"'", function(result){
        // res.json(result)
        // console.log(result.length)
        var cl = data.connectServer();
        data.dbControl(cl, "select * from class where status='"+1+"' limit "+type*8+",8 ", function(ss){
            // res.json(ss)
            var total = result.length;
            var totalPage = parseInt(total/8);
            var dd = 0;
            // console.log(totalPage)
            if(total%8 > 0){
                dd =  1
            }
            var dd={
                total:total,
                pageSize:8,
                totalPage:totalPage+dd,
                data:ss
            }
            // console.log(dd)
            res.json(dd)
        })

    }); 
});

//搜索课程
router.get('/searchAll', function(req, res, next){
    var type = req.query.pageNum;
    var search = req.query.search;
    var client=data.connectServer();    //建立连接
    var result=null; 
    data.dbControl(client, "select * from class where class_name like '%"+search+"%' and status='"+1+"'", function(result){
        var total = result.length;
        var totalPage = parseInt(total/8);
        var dd = 0;
        if(total>8){
            if(total%8 > 0){
                totalPage += 1
            }
        }
        var cl = data.connectServer();
        if(result.length>8){
            data.dbControl(cl, "select * from class where class_name like '%"+search+"%' and status='"+1+"' limit "+type*8+",8 ", function(ss){
                console.log(totalPage,'[age')
                var dd={
                    total:total,
                    pageSize:8,
                    totalPage:totalPage,
                    data:ss
                }
                console.log(dd)
                res.json(dd)
            })
        }else {
            var dd={
                total:total,
                pageSize:8,
                totalPage:1,
                data:result
            }
            console.log(dd)
            res.json(dd)
        }
    }); 
});

//审核课程
router.post('/audit',function(req, res, next){
    var id          = req.body.id,
    new_date        = dateToString(new Date()),
    new_status      = req.body.status
    // console.log(id,'dd')
    console.log(req.body)
    var client = data.connectServer();
    data.dbControl(client,"update class set audit_data='"+new_date+"', status='"+new_status+"'where id='"+id+"'",function(result){
        console.log(result)
        res.json(result)
    })
})

//已通过课程
router.route('/manage/class_audited')
    .get(function(req, res){
        if(sessionId&&sessionName){
            client=data.connectServer();
            result=null;
            data.dbControl(client, "select * from class where teacher='"+sessionId+"' limit 2,2 ", function (result,total) {
                var item = result;
                res.render('manage/class_audited', {
                    item : item ,
                    docTitle: sessionName+'同学的管理空间' ,
                })
                res.end()
            })
    
        }
    
    })

//获取已通过课程列表
router.get('/getAuditedclass', function(req, res, next){
    var type = req.query.pageNum;
    // var info = req.query.info;
    console.log(type)
    var client=data.connectServer();    //建立连接
    var result=null; 
    console.log(sessionId)
    data.dbControl(client, "select * from class where status='"+2+"'", function(result){
        // res.json(result)
        // console.log(result.length)
        var cl = data.connectServer();
        data.dbControl(cl, "select * from class where status="+2+" limit "+type*8+",8 ", function(ss){
            // res.json(ss)
            var total = result.length;
            var totalPage = parseInt(total/8);
            var dd = 0;
            // console.log(totalPage)
            if(total%8 > 0){
                dd =  1
            }
            var dd={
                total:total,
                pageSize:8,
                totalPage:totalPage+dd,
                data:ss
            }
            // console.log(dd)
            res.json(dd)
        })

    }); 
});

//搜索已通过课程
router.get('/searchAudited', function(req, res, next){
    var type = req.query.pageNum;
    var search = req.query.search;
    var client=data.connectServer();    //建立连接
    var result=null; 
    data.dbControl(client, "select * from class where class_name like '%"+search+"%' and status='"+2+"'", function(result){
        var total = result.length;
        var totalPage = parseInt(total/8);
        var dd = 0;
        if(total>8){
            if(total%8 > 0){
                totalPage += 1
            }
        }
        var cl = data.connectServer();
        if(result.length>8){
            data.dbControl(cl, "select * from class where class_name like '%"+search+"%' and status='"+2+"' limit "+type*8+",8 ", function(ss){
                console.log(totalPage,'[age')
                var dd={
                    total:total,
                    pageSize:8,
                    totalPage:totalPage,
                    data:ss
                }
                console.log(dd)
                res.json(dd)
            })
        }else {
            var dd={
                total:total,
                pageSize:8,
                totalPage:1,
                data:result
            }
            console.log(dd)
            res.json(dd)
        }
    }); 
});
//未通过课程
router.route('/manage/class_Noaudited')
    .get(function(req, res){
        if(sessionId&&sessionName){
            client=data.connectServer();
            result=null;
            data.dbControl(client, "select * from class where teacher='"+sessionId+"' limit 2,2 ", function (result,total) {
                var item = result;
                res.render('manage/class_Noaudited', {
                    item : item ,
                    docTitle: sessionName+'同学的管理空间' ,
                })
                res.end()
            })
    
        }
    
    })

//获取已通过课程列表
router.get('/getnoAuditedclass', function(req, res, next){
    var type = req.query.pageNum;
    // var info = req.query.info;
    console.log(type)
    var client=data.connectServer();    //建立连接
    var result=null; 
    console.log(sessionId)
    data.dbControl(client, "select * from class where status='"+0+"'", function(result){
        // res.json(result)
        // console.log(result.length)
        var cl = data.connectServer();
        data.dbControl(cl, "select * from class where status="+0+" limit "+type*8+",8 ", function(ss){
            // res.json(ss)
            var total = result.length;
            var totalPage = parseInt(total/8);
            var dd = 0;
            // console.log(totalPage)
            if(total%8 > 0){
                dd =  1
            }
            var dd={
                total:total,
                pageSize:8,
                totalPage:totalPage+dd,
                data:ss
            }
            // console.log(dd)
            res.json(dd)
        })

    }); 
});

//搜索已通过课程
router.get('/searchnoAudited', function(req, res, next){
    var type = req.query.pageNum;
    var search = req.query.search;
    var client=data.connectServer();    //建立连接
    var result=null; 
    data.dbControl(client, "select * from class where class_name like '%"+search+"%' and status='"+0+"'", function(result){
        var total = result.length;
        var totalPage = parseInt(total/8);
        var dd = 0;
        if(total>8){
            if(total%8 > 0){
                totalPage += 1
            }
        }
        var cl = data.connectServer();
        if(result.length>8){
            data.dbControl(cl, "select * from class where class_name like '%"+search+"%' and status='"+0+"' limit "+type*8+",8 ", function(ss){
                console.log(totalPage,'[age')
                var dd={
                    total:total,
                    pageSize:8,
                    totalPage:totalPage,
                    data:ss
                }
                console.log(dd)
                res.json(dd)
            })
        }else {
            var dd={
                total:total,
                pageSize:8,
                totalPage:1,
                data:result
            }
            console.log(dd)
            res.json(dd)
        }
    }); 
});

router.get('/major',function(req,res,next){
    var client=data.connectServer();    //建立连接
    var result=null; 
    data.dbControl(client, "select * from major ", function(result){
        console.log(result)
        res.json(result)
    });
})





//管理员页面
router.get('/admin_index', function(req, res) {
    if(sessionId&&sessionName){
        res.render('admin_index', { 
            docTitle: '实验课程教学管理系统' ,
            name: sessionName+'管理员'
        });
    }
});

//学生管理
router.route('/manage/admin/student')
    .get(function(req, res){
        if(sessionId&&sessionName){
            client=data.connectServer();
            result=null;
            data.dbControl(client, "select * from class where teacher='"+sessionId+"' limit 2,2 ", function (result,total) {
                var item = result;
                res.render('manage/admin/student', {
                    item : item ,
                    docTitle: sessionName+'同学的管理空间' ,
                })
                res.end()
            })
    
        }
    
    })
//教师管理
router.route('/manage/admin/teacher')
    .get(function(req, res){
        if(sessionId&&sessionName){
            client=data.connectServer();
            result=null;
            data.dbControl(client, "select * from class where teacher='"+sessionId+"' limit 2,2 ", function (result,total) {
                var item = result;
                res.render('manage/admin/teacher', {
                    item : item ,
                    docTitle: sessionName+'同学的管理空间' ,
                })
                res.end()
            })
    
        }
    
    })

router.route('/manage/admin/major')
    .get(function(req, res){
        if(sessionId&&sessionName){
            client=data.connectServer();
            result=null;
            data.dbControl(client, "select * from class where teacher='"+sessionId+"' limit 2,2 ", function (result,total) {
                var item = result;
                res.render('manage/admin/major', {
                    item : item ,
                    docTitle: sessionName+'同学的管理空间' ,
                })
                res.end()
            })
    
        }
    
    })



//获取学生列表
router.get('/admin/student', function(req, res, next){
    var type = req.query.pageNum;
    // var info = req.query.info;
    // console.log(type)
    var client=data.connectServer();    //建立连接
    var result=null; 
    console.log(sessionId)
    data.dbControl(client, "select * from student_info", function(result){
        // res.json(result)
        console.log(result.length)
        var cl = data.connectServer();
        data.dbControl(cl, "select * from student_info limit "+type*8+",8 ", function(ss){
            // res.json(ss)
            var total = result.length;
            var totalPage = parseInt(total/8);
            var dd = 0;
            // console.log(totalPage)
            if(total%8 > 0){
                dd =  1
            }
            var dd={
                total:total,
                pageSize:8,
                totalPage:totalPage+dd,
                data:ss
            }
            console.log(dd)
            res.json(dd)
        })
    }); 
});

router.get('/admin/student/search', function(req, res, next){
    var type = req.query.pageNum;
    var search = req.query.search;
    var client=data.connectServer();    //建立连接
    var result=null; 
    data.dbControl(client, "select * from student_info where stu_id like '%"+search+"%'", function(result){
        var total = result.length;
        var totalPage = parseInt(total/8);
        var dd = 0;
        if(total>8){
            if(total%8 > 0){
                totalPage += 1
            }
        }
        var cl = data.connectServer();
        if(result.length>8){
            data.dbControl(cl, "select * from student_info where stu_id like '%"+search+"%' limit "+type*8+",8 ", function(ss){
                console.log(totalPage,'[age')
                var dd={
                    total:total,
                    pageSize:8,
                    totalPage:totalPage,
                    data:ss
                }
                console.log(dd)
                res.json(dd)
            })
        }else {
            var dd={
                total:total,
                pageSize:8,
                totalPage:1,
                data:result
            }
            console.log(dd)
            res.json(dd)
        }
    }); 
});

router.post('/sss', function(req, res, next){
    var ss = JSON.parse(req.body.data)
    console.log(ss,'sss')
    var client = data.connectServer();
    var sql = "insert into student_info (stu_id, stu_pwd, stu_name, stu_telephone, stu_age,stu_sex, stu_grade,stu_time) values ";
    for(var i = 0;i<ss.length;i++){
        var val = '';
        var stu_id        = ss[i].stu_id;
        var stu_pwd      = ss[i].stu_pwd;
        var stu_name      = ss[i].stu_name;
        var stu_telephone  = ss[i].stu_telephone;
        var stu_age      = ss[i].stu_age;
        var stu_sex       = ss[i].stu_sex;
        var stu_grade    = ss[i].stu_grade;
        var stu_time   = dateToString(new Date())
        val = "('"+stu_id+"', '"+stu_pwd+"', '"+stu_name+"', '"+stu_telephone+"','"+stu_age+"', '"+stu_sex+"','"+stu_grade+"','"+stu_time+"'),";
        if(i==ss.length-1){
            val ="('"+stu_id+"', '"+stu_pwd+"', '"+stu_name+"', '"+stu_telephone+"','"+stu_age+"', '"+stu_sex+"','"+stu_grade+"','"+stu_time+"')";
        }
        sql += val;
       
    }
    console.log(sql,'sql')
    data.dbControl(client,sql,function(result){
        console.log(result) 
        res.json(result)
    })
})
//修改学生
router.post('/admin/student/edit',function(req, res, next){
    console.log(req.body)
    var id = req.body.stu_id
    new_stu_pwd       = req.body.stu_pwd,
    new_stu_name      = req.body.stu_name,
    new_stu_age       = req.body.stu_age,
    new_stu_sex           = req.body.stu_sex,
    new_stu_grade            = req.body.stu_grade,
    new_stu_telephone            = req.body.stu_telephone
    console.log(id,'dd')
    console.log(req.body)
    var client = data.connectServer();
    data.dbControl(client,"update student_info set stu_pwd='"+new_stu_pwd+"', stu_name='"+new_stu_name+"', stu_age='"+new_stu_age+"', stu_sex='"+new_stu_sex+"', stu_grade='"+new_stu_grade+"', stu_telephone='"+new_stu_telephone+"' where stu_id='"+id+"'",function(result){
        console.log(result)
        res.json(result)
    })
})
//删除学生
router.post('/admin/student/delete',function(req, res, next){
    var id = req.body.id;
    console.log(id,'dd')
    console.log(req.body)
    var client = data.connectServer();
    data.dbControl(client,"delete from student_info where stu_id='"+id+"'",function(result){
        console.log(result)
        res.json(result)
    })
})




//获取老师列表
router.get('/admin/teacher', function(req, res, next){
    var type = req.query.pageNum;
    // var info = req.query.info;
    // console.log(type)
    var client=data.connectServer();    //建立连接
    var result=null; 
    console.log(sessionId)
    data.dbControl(client, "select * from teacher_info", function(result){
        // res.json(result)
        console.log(result.length)
        var cl = data.connectServer();
        data.dbControl(cl, "select * from teacher_info limit "+type*8+",8 ", function(ss){
            // res.json(ss)
            var total = result.length;
            var totalPage = parseInt(total/8);
            var dd = 0;
            // console.log(totalPage)
            if(total%8 > 0){
                dd =  1
            }
            var dd={
                total:total,
                pageSize:8,
                totalPage:totalPage+dd,
                data:ss
            }
            console.log(dd)
            res.json(dd)
        })
    }); 
});

router.get('/admin/teacher/search', function(req, res, next){
    var type = req.query.pageNum;
    var search = req.query.search;
    var client=data.connectServer();    //建立连接
    var result=null; 
    data.dbControl(client, "select * from teacher_info where teacher_id like '%"+search+"%'", function(result){
        var total = result.length;
        var totalPage = parseInt(total/8);
        var dd = 0;
        if(total>8){
            if(total%8 > 0){
                totalPage += 1
            }
        }
        var cl = data.connectServer();
        if(result.length>8){
            data.dbControl(cl, "select * from teacher_info where teacher_id like '%"+search+"%' limit "+type*8+",8 ", function(ss){
                console.log(totalPage,'[age')
                var dd={
                    total:total,
                    pageSize:8,
                    totalPage:totalPage,
                    data:ss
                }
                console.log(dd)
                res.json(dd)
            })
        }else {
            var dd={
                total:total,
                pageSize:8,
                totalPage:1,
                data:result
            }
            console.log(dd)
            res.json(dd)
        }
    }); 
});

router.post('/sssss', function(req, res, next){
    var ss = JSON.parse(req.body.data)
    console.log(ss,'sss')
    var client = data.connectServer();
    var sql = "insert into teacher_info (teacher_id, teacher_pwd, teacher_name, teacher_telephone, teacher_age,teacher_sex,teacher_time) values ";
    for(var i = 0;i<ss.length;i++){
        var val = '';
        var teacher_id        = ss[i].teacher_id;
        var teacher_pwd      = ss[i].teacher_pwd;
        var teacher_name      = ss[i].teacher_name;
        var teacher_telephone  = ss[i].teacher_telephone;
        var teacher_age      = ss[i].teacher_age;
        var teacher_sex       = ss[i].teacher_sex;
        var teacher_time   = dateToString(new Date())
        val = "('"+teacher_id+"', '"+teacher_pwd+"', '"+teacher_name+"', '"+teacher_telephone+"','"+teacher_age+"', '"+teacher_sex+"','"+teacher_time+"'),";
        if(i==ss.length-1){
            val ="('"+teacher_id+"', '"+teacher_pwd+"', '"+teacher_name+"', '"+teacher_telephone+"','"+teacher_age+"', '"+teacher_sex+"','"+teacher_time+"')";
        }
        sql += val;
       
    }
    console.log(sql,'sql')
    data.dbControl(client,sql,function(result){
        console.log(result) 
        res.json(result)
    })
})
//修改学生
router.post('/admin/teacher/edit',function(req, res, next){
    console.log(req.body)
    var id = req.body.teacher_id
    new_teacher_pwd       = req.body.teacher_pwd,
    new_teacher_name      = req.body.teacher_name,
    new_teacher_age       = req.body.teacher_age,
    new_teacher_sex           = req.body.teacher_sex,
    new_teacher_telephone            = req.body.teacher_telephone
    console.log(id,'dd')
    console.log(req.body)
    var client = data.connectServer();
    data.dbControl(client,"update teacher_info set teacher_pwd='"+new_teacher_pwd+"', teacher_name='"+new_teacher_name+"', teacher_age='"+new_teacher_age+"', teacher_sex='"+new_teacher_sex+"', teacher_telephone='"+new_teacher_telephone+"' where teacher_id='"+id+"'",function(result){
        console.log(result)
        res.json(result)
    })
})
//删除学生
router.post('/admin/teacher/delete',function(req, res, next){
    var id = req.body.id;
    console.log(id,'dd')
    console.log(req.body)
    var client = data.connectServer();
    data.dbControl(client,"delete from teacher_info where teacher_id='"+id+"'",function(result){
        console.log(result)
        res.json(result)
    })
})



//获取老师列表
router.get('/admin/manager', function(req, res, next){
    var type = req.query.pageNum;
    // var info = req.query.info;
    // console.log(type)
    var client=data.connectServer();    //建立连接
    var result=null; 
    console.log(sessionId)
    data.dbControl(client, "select * from manager_info", function(result){
        // res.json(result)
        console.log(result.length)
        var cl = data.connectServer();
        data.dbControl(cl, "select * from manager_info limit "+type*8+",8 ", function(ss){
            // res.json(ss)
            var total = result.length;
            var totalPage = parseInt(total/8);
            var dd = 0;
            // console.log(totalPage)
            if(total%8 > 0){
                dd =  1
            }
            var dd={
                total:total,
                pageSize:8,
                totalPage:totalPage+dd,
                data:ss
            }
            console.log(dd)
            res.json(dd)
        })
    }); 
});

router.get('/admin/manager/search', function(req, res, next){
    var type = req.query.pageNum;
    var search = req.query.search;
    var client=data.connectServer();    //建立连接
    var result=null; 
    data.dbControl(client, "select * from manager_info where manager_id like '%"+search+"%'", function(result){
        var total = result.length;
        var totalPage = parseInt(total/8);
        var dd = 0;
        if(total>8){
            if(total%8 > 0){
                totalPage += 1
            }
        }
        var cl = data.connectServer();
        if(result.length>8){
            data.dbControl(cl, "select * from manager_info where manager_id like '%"+search+"%' limit "+type*8+",8 ", function(ss){
                console.log(totalPage,'[age')
                var dd={
                    total:total,
                    pageSize:8,
                    totalPage:totalPage,
                    data:ss
                }
                console.log(dd)
                res.json(dd)
            })
        }else {
            var dd={
                total:total,
                pageSize:8,
                totalPage:1,
                data:result
            }
            console.log(dd)
            res.json(dd)
        }
    }); 
});

router.post('/managerss', function(req, res, next){
    var ss = JSON.parse(req.body.data)
    console.log(ss,'sss')
    var client = data.connectServer();
    var sql = "insert into manager_info (manager_id, manager_pwd, manager_name, manager_telephone, manager_age,manager_sex,manager_time) values ";
    for(var i = 0;i<ss.length;i++){
        var val = '';
        var manager_id        = ss[i].manager_id;
        var manager_pwd      = ss[i].manager_pwd;
        var manager_name      = ss[i].manager_name;
        var manager_telephone  = ss[i].manager_telephone;
        var manager_age      = ss[i].manager_age;
        var manager_sex       = ss[i].manager_sex;
        var manager_time   = dateToString(new Date())
        val = "('"+manager_id+"', '"+manager_pwd+"', '"+manager_name+"', '"+manager_telephone+"','"+manager_age+"', '"+manager_sex+"','"+manager_time+"'),";
        if(i==ss.length-1){
            val ="('"+manager_id+"', '"+manager_pwd+"', '"+manager_name+"', '"+manager_telephone+"','"+manager_age+"', '"+manager_sex+"','"+manager_time+"')";
        }
        sql += val;
       
    }
    console.log(sql,'sql')
    data.dbControl(client,sql,function(result){
        console.log(result) 
        res.json(result)
    })
})
//修改学生
router.post('/admin/manager/edit',function(req, res, next){
    console.log(req.body)
    var id = req.body.manager_id
    new_manager_pwd       = req.body.manager_pwd,
    new_manager_name      = req.body.manager_name,
    new_manager_age       = req.body.manager_age,
    new_manager_sex           = req.body.manager_sex,
    new_manager_telephone            = req.body.manager_telephone
    console.log(id,'dd')
    console.log(req.body)
    var client = data.connectServer();
    data.dbControl(client,"update manager_info set manager_pwd='"+new_manager_pwd+"', manager_name='"+new_manager_name+"', manager_age='"+new_manager_age+"', manager_sex='"+new_manager_sex+"', manager_telephone='"+new_manager_telephone+"' where manager_id='"+id+"'",function(result){
        console.log(result)
        res.json(result)
    })
})
//删除学生
router.post('/admin/manager/delete',function(req, res, next){
    var id = req.body.id;
    console.log(id,'dd')
    console.log(req.body)
    var client = data.connectServer();
    data.dbControl(client,"delete from manager_info where manager_id='"+id+"'",function(result){
        console.log(result)
        res.json(result)
    })
})

module.exports = router;

//日期转换
function dateToString(d) {
    var j = {};
    j.m = d.getMonth() + 1;
    j.d = d.getDate();
    j.h = d.getHours();
    j.mi = d.getMinutes();
    j.s = d.getSeconds();
    for (items in j) {
        if (j[items] < 10)
            j[items] = "0" + j[items];
    }
    return d.getFullYear() + "-" + j.m + "-" + j.d + " " + j.h + ":" + j.mi + ":" + j.s;
}

