
let config = {
    type:'prod',
    host:'https://h5.jinjiedao.com/',
    apiUrl:'https://h5.jinjiedao.com/jjdApi',
    //今借到
    imgUrl:'https://img1.jinjiedao.com/',
    //信用认证
    creditImgUrl:'https://img2.jinjiedao.com/',
    leaseImgUrl:'https://img3.jinjiedao.com/',
    leaseUrl:'https://h5.jinjiedao.com/lease_wx',
    leaseApi:'https://h5.jinjiedao.com/leaseApi',
    //网易云顿
    captchaId:'5d29fb6810ec456f88c28f9502321330',
    //埋点appkey
    appKey: '4efe8ed2980b495db938e695034b3969'
};

if(process.env.NODE_ENV==='local'){
    config = {
        type:'local',
        apiUrl:'/api/jjdApi',
        host:'https://dev-h5.jinjiedao.com/',
        imgUrl:'https://test-img.renrenxin.com/',
        creditImgUrl:'https://test-img.renrenxin.com/',
        leaseImgUrl:'https://test-img.renrenxin.com/',
        leaseUrl:'https://dev-h5.jinjiedao.com/dev_lease_wx',
        leaseApi:'https://dev-h5.jinjiedao.com/leaseApi',
        //网易云顿
        captchaId:'959cb2c2c55c4e4da4a608758be2688f',
        //埋点appkey
        appKey: '8bf64c3bef3848279a79567b1f9e43e1',
    }
}

if(process.env.NODE_ENV==='development'){
    config = {
        type:'dev',
        host:'https://dev-h5.jinjiedao.com/',
        apiUrl:'https://dev-h5.jinjiedao.com/jjdApi',
        imgUrl:'https://test-img.renrenxin.com/',
        creditImgUrl:'https://test-img.renrenxin.com/',
        leaseImgUrl:'https://test-img.renrenxin.com/',
        leaseUrl:'https://dev-h5.jinjiedao.com/dev_lease_wx',
        leaseApi:'https://dev-h5.jinjiedao.com/leaseApi',
        //网易云顿
        captchaId:'959cb2c2c55c4e4da4a608758be2688f',
        //埋点appkey
        appKey: '8bf64c3bef3848279a79567b1f9e43e1',
    }
}

if(process.env.NODE_ENV==='qa'){
    config = {
        type:'qa',
        host:'https://qa-h5.jinjiedao.com/',
        apiUrl:'https://qa-h5.jinjiedao.com/jjdApi',
        imgUrl:'https://test-img.renrenxin.com/',
        creditImgUrl:'https://test-img.renrenxin.com/',
        leaseImgUrl:'https://test-img.renrenxin.com/',
        leaseUrl:'https://qa-h5.jinjiedao.com/qa_lease_wx',
        leaseApi:'https://qa-h5.jinjiedao.com/leaseApi',
        //网易云顿
        captchaId:'63b85a08935a4512bb8c5a195db24351',
        //埋点appkey
        appKey: 'a042c2e932924a54bf0c0b537552a720',
    }
}

if(process.env.NODE_ENV==='uat'){
    config = {
        type:'uat',
        host:'https://uat-h5.jinjiedao.com/',
        apiUrl:'https://uat-h5.jinjiedao.com/jjdApi',
        imgUrl:'https://test-img.renrenxin.com/',
        creditImgUrl:'https://test-img.renrenxin.com/',
        leaseImgUrl:'https://test-img.renrenxin.com/',
        leaseUrl:'https://uat-h5.jinjiedao.com/uat_lease_wx',
        leaseApi:'https://uat-h5.jinjiedao.com/leaseApi',
        //网易云顿
        captchaId:'e60eee99eb294a73841aadcfb0f95757',
        //埋点appkey
        appKey: '4efe8ed2980b495db938e695034b3969',
    }
}

if(process.env.NODE_ENV==='production'){
    config = {
        type:'prod',
        host:'https://h5.jinjiedao.com/',
        apiUrl:'https://h5.jinjiedao.com/jjdApi',
        //今借到
        imgUrl:'https://img1.jinjiedao.com/',
        //信用认证
        creditImgUrl:'https://img2.jinjiedao.com/',
        leaseImgUrl:'https://img3.jinjiedao.com/',
        leaseUrl:'https://h5.jinjiedao.com/lease_wx',
        leaseApi:'https://h5.jinjiedao.com/leaseApi',
        //网易云顿
        captchaId:'5d29fb6810ec456f88c28f9502321330',
        //埋点appkey
        appKey: '4efe8ed2980b495db938e695034b3969'
    }
}

export default config
