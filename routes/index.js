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
//     data.dbControl(client, "select * from class where teacher_id="+sessionId+"", function(result){
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
        if(req.body.reg){
            res.redirect('/reg');
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
    })
    // .post(function(req,res){
    //     var logout = req.body.logout;
    //     res.clearCookie('token');
    //         req.session.destroy();
    //         res.redirect('/login');
    //     console.log(req)
    // });

    //学生已选课程
    router.route('/manage/stuSelectedLession')
        .get(function(req, res) {
            if(sessionId&&sessionName){
                client=data.connectServer();
                result=null;
                data.dbControl(client, "select * from subject_info,student_subject where subject_info.subject_id=student_subject.subject_id and stu_id='"+sessionId+"'", function (result) {
                    var item = result;
                    res.render('manage/stuSelectedLession', {
                        item : item ,
                        docTitle: sessionName+'同学的管理空间' ,
                        bodyTitle: '必修课' ,
                        subId: '学科代号：' ,
                        subTeacher: '学科老师：' ,
                        subDesc: '学科描述：'
                    })
                })
            };
        })
        .post(function(req, res) {
            var deleteSub = req.body.sub;
            var deleteStu = sessionId;
            client=data.connectServer();
            data.dbControl(client, "delete from student_subject where subject_id='"+deleteSub+"' and stu_id='"+deleteStu+"'", function (err) {
                console.log('删除了');
            })
            res.end();
        });

        //学生所有课程
        router.route('/manage/stuAllLession')
            .get(function(req, res){
                if(sessionId&&sessionName){
                client=data.connectServer();
                result=null;
                data.dbControl(client, "select * from subject_info", function (result) {
                    var item = result;
                    res.render('manage/stuAllLession', {
                        item : item ,
                        docTitle: sessionName+'同学的管理空间' ,
                        bodyTitle: '必修课' ,
                        subId: '学科代号：' ,
                        subTeacher: '学科老师：' ,
                        subDesc: '学科描述：'
                    })
                })
            };
            })
            .post(function(req, res){
                var addSub = req.body.sub;
                var addStu = sessionId;
                client=data.connectServer();
                result=null;
                data.dbControl(client, "select * from student_subject where stu_id='"+addStu+"' and subject_id='"+addSub+"'", function (result) {
                    if(result[0]){
                        res.send('选过了！');
                    }
                    else{
                        client=data.connectServer();
                        result=null;
                        data.dbControl(client, "insert into student_subject (stu_id, subject_id) values ('"+addStu+"', '"+addSub+"')", function (err) {
                            console.log('插入了！');
                        })
                    }
                    res.end();
                });
            });

        //查看任课老师
        router.get('/manage/stuForTeacher',function(req, res){
                if(sessionId&&sessionName){
                    client=data.connectServer();
                    result=null;
                    data.dbControl(client, "select * from teacher_info,subject_info,teacher_subject where teacher_info.teacher_id=teacher_subject.teacher_id and subject_info.subject_id=teacher_subject.subject_id", function(result){
                        var item = result;
                        res.render('manage/stuForTeacher', {
                            docTitle: sessionName+'同学的管理空间' ,
                            id: '工号：' ,
                            age: '年龄：' ,
                            sex: '性别：' ,
                            tel: '电话：' ,
                            lession: '任课：' ,
                            item : item
                        })
                    })
                }
            });

        //学生个人信息
        router.route('/manage/stuInfo')
            .get(function(req, res){
                if(sessionId&&sessionName){
                    client=data.connectServer();
                    result=null;
                    data.dbControl(client, "select * from student_info where stu_id='"+sessionId+"'", function(result){
                        var item = result;
                        res.render('manage/stuInfo', {
                            docTitle: stu_name+'同学的管理空间' ,
                            item:item
                        })
                    })
                }
            })
            .post(function(req, res){
                var new_name      = req.body.stu_name,
                    new_age       = req.body.stu_age,
                    new_sex       = req.body.stu_sex,
                    new_subject   = req.body.stu_subject,
                    new_telephone = req.body.stu_telephone,
                    new_describe  = req.body.stu_describe;
                client=data.connectServer();
                result=null;
                data.updataStu(client, "update student_info set stu_name='"+new_name+"', stu_age='"+new_age+"', stu_sex='"+new_sex+"', stu_subject='"+new_subject+"', stu_telephone='"+new_telephone+"', stu_describe='"+new_describe+"' where stu_id='"+sessionId+"'", function(result){
                    res.redirect('/manage/stuInfo');
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
    new_profession       = req.body.profession,
    new_class            = req.body.classs,
    new_class_name       = req.body.class_name,
    new_roomno           = req.body.roomno,
    new_route            = req.body.route,
    new_times            = req.body.times,
    new_time             = req.body.time,
    new_date             = dateToString(new Date()),
    new_intru            = req.body.intruc
    console.log(id,'dd')
    console.log(req.body)
    var client = data.connectServer();
    data.dbControl(client,"update class set profession='"+new_profession+"', class='"+new_class+"', class_name='"+new_class_name+"', roomno='"+new_roomno+"', route='"+new_route+"', times='"+new_times+"', time='"+new_time+"', date='"+new_date+"', intruc='"+new_intru+"'where id='"+id+"'",function(result){
        console.log(result)
        res.json(result)
    })
})

//删除课程
router.post('/delete',function(req, res, next){
    var id = req.body.id;
    console.log(id,'dd')
    console.log(req.body)
    var client = data.connectServer();
    data.dbControl(client,"delete from class where id='"+id+"'",function(result){
        console.log(result)
        res.json(result)
    })
})


    //查看所有课程
    router.route('/manage/teacherAllLession')
        .get(function(req, res){
            if(sessionId&&sessionName){
                client=data.connectServer();
                result=null;
                data.dbControl(client, "select * from subject_info", function(result){
                    var item = result;
                    res.render('manage/teacherAllLession', {
                        docTitle: sessionName+'老师的管理空间' ,
                        bodyTitle: '必修课' ,
                        subId: '学科代号：' ,
                        subTeacher: '学科老师：' ,
                        subDesc: '学科描述：' ,
                        item : item
                    })
                })
            }
        })
        .post(function(req, res){
            var subId=req.body.sub;
            var teacherId=sessionId;
            client=data.connectServer();
            result=null;
            data.dbControl(client, "select * from teacher_subject where teacher_id='"+teacherId+"' and subject_id='"+subId+"'", function (result) {
                if(result[0]){
                    res.send('已经任课了！');
                }
                else{
                    client=data.connectServer();
                    result=null;
                    data.dbControl(client, "insert into teacher_subject (teacher_id, subject_id) values ('"+teacherId+"', '"+subId+"')", function (err) {
                        console.log('插入了！');
                    })
                }
                res.end();
            });
        });

        //老师已带课程
    router.route('/manage/teacherSelectedLession')
        .get(function(req, res){
            if(sessionId&&sessionName){
                client=data.connectServer();
                result=null;
                data.dbControl(client, "select * from subject_info,teacher_subject where subject_info.subject_id=teacher_subject.subject_id and teacher_id='"+sessionId+"'", function(result){
                    var item = result;
                    res.render('manage/teacherSelectedLession', {
                        docTitle: sessionName+'老师的管理空间' ,
                        bodyTitle: '必修课' ,
                        subId: '学科代号：' ,
                        subTeacher: '学科老师：' ,
                        subDesc: '学科描述：' ,
                        item : item
                    })
                })
            }
        })
        .post(function(req, res){
            var deleteSub = req.body.sub;
            var deleteTeacher = sessionId;
            client=data.connectServer();
            result=null;
            data.dbControl(client, "delete from teacher_subject where subject_id='"+deleteSub+"' and teacher_id='"+deleteTeacher+"'", function (err) {
                console.log('删除了');
            })
            res.end();
        });

//添加课程
router.route('/manage/addClass')
    .get(function(req, res){
        if(sessionId&&sessionName){
        client=data.connectServer();
        result=null;
        // "select * from subject_info where subject_info.teacher='"+sessionId+"'"
        // select * from subject_info
        data.dbControl(client,  "select * from class where  teacher='"+sessionId+"'", function (result) {
            var item = result;
            console.log(item)
            res.render('manage/addClass', {
                item : item ,
                docTitle: sessionName+'同学的管理空间' ,
                bodyTitle: '必修课' ,
                subId: '学科代号：' ,
                subTeacher: '学科老师：' ,
                subDesc: '学科描述：'
            })
            res.end()
        })

    }})
    .post(function(req, res){
            new_profession       = req.body.profession,
            new_class            = req.body.class,
            new_class_name       = req.body.class_name,
            new_roomno           = req.body.roomno,
            new_route            = req.body.route,
            new_times            = req.body.times,
            new_time             = req.body.time,
            new_teacherId        = sessionId,
            new_teacherName      = sessionName;
            new_date             = dateToString(new Date())
            new_intru            = req.body.intru
        client=data.connectServer();
        result=null;
        data.dbControl(client,  "select * from class", function (id) {
            var item = result;
            var id = id[id.length-1].id;
            id++
            console.log(id)
            var cle = data.connectServer();
            data.dbControl(cle, "insert into class (id, profession, class, class_name, roomno, route, times, time, intruc ,teacher, status,teacher_id,date) values ('"+id+"', '"+new_profession+"', '"+new_class+"', '"+new_class_name+"', '"+new_roomno+"', '"+new_route+"', '"+new_times+"', '"+new_intru+"', '"+new_time+"', '"+new_teacherId+"', '"+1+"','"+new_teacherName+"','"+new_date+"')", function(result){
                // console.log(result)
                // res.send(result)
                console.log(result)
                res.send('提交成功')
                res.end();
            })
        })
        
    });

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







//注册页
// router.route('/reg')
//     .get(function(req, res){
//         var item = result;
//         res.render('reg', {
//             docTitle: '注册吧骚年' 
//         })
//     })
//     .post(function(req, res){
//         var new_id        = req.body.stu_id,
//             new_pwd       = req.body.stu_pwd,
//             new_name      = req.body.stu_name,
//             new_age       = req.body.stu_age,
//             new_sex       = req.body.stu_sex,
//             new_grade     = req.body.stu_grade,
//             new_subject   = req.body.stu_subject,
//             new_telephone = req.body.stu_telephone,
//             new_describe  = req.body.stu_describe;
//         client=data.connectServer();
//         result=null;
//         data.dbControl(client, "insert into student_info (stu_id, stu_pwd, stu_name, stu_age, stu_sex, stu_grade, stu_subject, stu_telephone, stu_describe) values ('"+new_id+"', '"+new_pwd+"', '"+new_name+"', '"+new_age+"', '"+new_sex+"', '"+new_grade+"', '"+new_subject+"', '"+new_telephone+"', '"+new_describe+"')", function(result){
//             sessionId = new_id;
//             sessionName = new_name;
//             res.redirect('/stu_index');
//         })
//     });


module.exports = router;


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

// router.route('/manage/watchClass')
//             .get(function(req, res){
//                 if(sessionId&&sessionName){
//                 client=data.connectServer();
//                 result=null;
//                 // var current_page = 1; //默认为1
//                 // var num = 9; //一页条数
//                 // if (req.query.page) {
//                 //     current_page = parseInt(req.query.page);
//                 // }

//                 // var last_page = current_page - 1;
//                 // if (current_page <= 1) {
//                 //     last_page = 1;
//                 // }
//                 // var next_page = current_page + 1;
//                 // var str = 'SELECT left(paragraph,50) as paragraph,date,id FROM notice limit ' + num + '  offset ' + num * (current_page - 1);
//                 // var conn = mysql.createConnection(settings.db);

//                 // "select * from class"
//                 data.dbControl(client, "select * from class", function (result) {
//                     var item = result;
//                     // res.json(item)
//                     // if (err) {
//                     //     req.flash('error', '数据查询有误');
//                     // }
//                     // if (!err) {
//                     //     if (!item[0]) {
//                     //         req.flash('error', '已到最后一页,请返回');
//                     //     }
//                     let dd = ['不通过','审核中','通过'];
//                     // item.map(ele => {ele.status = dd[ele.status]})
//                     res.render('manage/watchClass', {
//                         item : item ,
//                         // last_page: last_page,
//                         // next_page: next_page,
//                         // current_page: current_page,
//                         docTitle: sessionName+'同学的管理空间' ,
//                     })
//                     // }
//                 })
//             }})