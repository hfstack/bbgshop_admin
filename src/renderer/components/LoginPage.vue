<template>
<div class="login">
  <div class="logobox">
    <img src="static/images/indexlogo.png" />
    <div class="logoboxborder">

    </div>
  </div>
  <div class="login-bigbox">
    <div class="login-picbox">
      <div class="login-message">
        <!-- 公告栏 -->
      </div>
      <div class="cloud cloud-b">
        <div class="line-a"></div>
        <div class="line-b"></div>
        <div class="line-c"></div>
        <div class="line-d"></div>
        <div class="line-e"></div>
      </div>
      <div class="boat">
        <div class="wrap">

          <div class="main">
            <div class="boat-top-layer">
              <div class="top">
                <div class="pole"></div>
                <div class="help"><span></span></div>
              </div>
              <div class="bottom"></div>
            </div>
            <div class="boat-mid-layer">
              <div class="top"></div>
              <div class="bottom"></div>
            </div>
            <div class="boat-bot-layer">
              <div class="top"></div>
              <div class="bottom"></div>
            </div>
          </div>
        </div>
        <div class="water">
          <div class="drops clearfix drops-1">
            <span class="drop drop-a"></span>
            <span class="drop drop-b"></span>
            <span class="drop drop-c"></span>
            <span class="drop drop-d"></span>
            <span class="drop drop-e"></span>
            <span class="drop drop-f"></span>
            <span class="drop drop-g"></span>
            <span class="drop drop-h"></span>
          </div>
          <div class="drops clearfix drops-2">
            <span class="drop drop-a"></span>
            <span class="drop drop-b"></span>
            <span class="drop drop-c"></span>
            <span class="drop drop-d"></span>
            <span class="drop drop-e"></span>
            <span class="drop drop-f"></span>
            <span class="drop drop-g"></span>
            <span class="drop drop-h"></span>
          </div>
        </div>

      </div>

    </div>
    <div class="login-box">
      <div class="logo">

      </div>
      <div class="body">
        <p class="tips">欢迎使用<span style="color:#ff4444">贝堡商城</span>后台管理</p>
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item label="" prop="username">
            <el-input v-model="form.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input type="password" v-model="form.password" @keyup.13.native="show()" placeholder="密码"></el-input>
          </el-form-item>

          <el-form-item label="" prop="">
            <!-- 点击式按钮建议宽度不低于200px,高度介于36px与46px  -->
            <!-- 嵌入式仅需设置宽度，高度根据宽度自适应，最小宽度为200px -->
            <div id="vaptcha_container" style="width:320px;height:36px;">
              <!--vaptcha_container是用来引入Vaptcha的容器，下面代码为预加载动画，仅供参考-->
              <div class="vaptcha-init-main">
                <div class="vaptcha-init-loading">
                  <img src="https://cdn.vaptcha.com/vaptcha-loading.gif" />
                  <span class="vaptcha-text">Vaptcha启动中...</span>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="startLogin" :loading="loading" style="width: 100%;">
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
  <!-- <div class="footer"> -->
    <div class="footertop">
      <ul >
        <li><a href="http://www.bbgshop.com/" target="_Blank">贝堡科技</a></li>
        <li><a href="http://www.bbgshop.com/Goods" target="_Blank">产品介绍</a></li>
        <li><a href="http://www.bbgshop.com/Parnter" target="_Blank">合作伙伴</a></li>
        <li><a href="http://www.bbgshop.com/About" target="_Blank">关于我们</a></li>
        <li><a href="http://www.bbgshop.com/Contact" target="_Blank">联系我们</a></li>
      </ul>
      <!-- <el-row :gutter="4">
        <el-col :span="5">
          <a href="#">贝堡科技</a>
        </el-col>
        <el-col :span="5">
          <a href="#">商品介绍</a>
        </el-col>
        <el-col :span="5">
          <a href="#">合作伙伴</a>
        </el-col>
        <el-col :span="5">
          <a href="#">关于我们</a>
        </el-col>
        <el-col :span="4">
          <a href="#">联系我们</a>
        </el-col>
      </el-row> -->
    </div>
    <div class="footerbottom">
      Copyright © 2018 bbgshop.com All rights reserved.   贝堡网络科技提供技术支持
    </div>
  <!-- </div> -->
</div>
<!-- <link href="../../static.loadingStyle/loading.css" rel="stylesheet"> -->
</template>
<!-- <script src="https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script> -->
<!-- <script type="text/javascript" src="https://cdn.vaptcha.com/v.js"></script> -->
<script>
import api from '@/config/api';
export default {
  data() {
    return {
      // vaptcha:false,
      form: {
        challenge: '',
        username: '',
        password: '',
        token: '',
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        }, ],
        password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '密码不得低于6个字符',
            trigger: 'blur'
          },
        ],
      },
      loading: false,

    }
  },
  components: {},
  mounted() {
    var that = this
    // console.log(that.vaptcha);
    this.axios.get('auth/getVaptcha').then((res) => {
      // console.log(res);
      // console.log(that.vaptcha);
      let resjson = JSON.parse(res.data.data)
      console.log(resjson);
      if (resjson) {
        var options = {
          vid: resjson.vid, //站点id ,string,必选,
          challenge: resjson.challenge, //验证流水号 ,string,必选,
          container: "#vaptcha_container", //验证码容器,element,必选,
          type: "float", //验证码类型,string,默认float,可选择float,popup,embed,
          https: false, //是否是https , boolean,默认true,(false:http),
          color: "#57ABFF", //点击式按钮的背景颜色,string
          outage: '/',
          success: function(token, challenge) { //当验证成功时执行回调,function,参数token为string,必选,
            //提交表单时将token，challenge一并提交，作为验证通过的凭证，服务端进行二次验证  宕机模式无challenge
            if (token) {
              that.form.token = token
            }
          },
          fail: function() { //验证失败时执行回调
            //todo:执行人机验证失败后的事情
            this.$message.error('人机验证失败！');
          }
        }
        //vaptcha对象
        var vaptcha_obj;
        window.vaptcha(options, function(obj) {
          vaptcha_obj = obj;
          //执行初始化
          vaptcha_obj.init();
          // });
        }, 'json')
      }

    })
  },
  methods: {
    show() {
      this.startLogin()
    },
    startLogin() {

      // $('.login-btn').click(function(e){
      //       e.preventDefault();
      // console.log(this.vaptcha);
      if (!this.form.token) {
        this.$message.error('请进行人机验证！');
        // alert('请进行人机验证');
        return false;
      }


      this.$refs['form'].validate((valid) => {
        if (!valid) {
          return false;
        }

        this.loading = true;

        this.axios.post(api.api.LoginPath, {
          username: this.form.username,
          password: this.form.password
        }).then((res) => {
          console.log(res.data)
          this.loading = false;
          if (res.data.errno === 0) {
            localStorage.setItem('token', res.data.data.token);
            localStorage.setItem('userInfo', JSON.stringify(res.data.data.userInfo));
            this.$router.push({
              name: 'dashboard'
            });

          } else {
            this.$message.error('用户名或密码错误！');
          }

        }).catch((err) => {
          console.log(err)
          this.loading = false;
        })

      });
    }
  }
}
</script>
<style>
.vaptcha-init-main {
  display: table;
  border-radius: 2px;
  width: 320px;
  height: 100%;
  background-color: #EEEEEE;
}

.vaptcha-init-loading {
  display: table-cell;
  vertical-align: middle;
  text-align: center
}

.vaptcha-init-loading>a {
  display: inline-block;
  width: 18px;
  height: 18px;
  border: none;
}

.vaptcha-init-loading>a img {
  vertical-align: middle
}

.vaptcha-init-loading .vaptcha-text {
  font-family: sans-serif;
  font-size: 12px;
  color: #CCCCCC;
  vertical-align: middle
}

@import "../../../static/ship";
/* @import "../../../static/plane"; */
.footertop ul {
  width: 300px;
  /* border: 1px solid black; */
  height: 1.75rem;
  line-height: 1.75rem;
  text-align: center;
}
.footertop ul li {
  float: left;
  margin: 0 5px;
  text-align: center;
  width: 50px;
  list-style: none;
}
.footertop ul li a{
  color: #656565;
}
.footerbottom {
  /* border: 1px solid black; */
  position: fixed;
  font-size: 11px;
  bottom: 1.5vh;
  left: auto;
}
.footertop {
  /* border: 1px solid black; */
  position: fixed;
  font-size: 12px;
  bottom: 3.25vh;
  width: 300px;
  left: auto;
}
/* .footer {
  border: 1px solid black;
  position: fixed;
  top: 80vh;
  height: 15vh;
  left: auto;
} */
.logobox .logoboxborder {
  /* position: ; */
  margin-top: -25px;
  height: 2px;
  background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%);
}
.logobox img {
  padding-left: 15vw;
  margin-top: 15px;
}
.logobox {
  /* background-image: linear-gradient(-225deg, #FFE6FA 0%, #E3FDF5 100%); */
  /* border: 1px solid; */
  /* border-bottom-color: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%); */
  /* background-image: linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%); */
  position: fixed;
  /* border: 1px solid black; */
  width: 100vw;
  height: 70px;
  line-height: 70px;
  top: 15vh;
  /* left: 15vw; */
}

.planebox {
  position: fixed;
  top: 5vh;
  right: 10vw;
}

.login {
  align-items: center;
  background-image: linear-gradient(-225deg, #FFE6FA 0%, #E3FDF5 100%);
  display: flex;
  font-family: Lato, Helvetica, sans-serif, '微软雅黑';
  justify-content: center;
  /* text-align: center; */
  height: 100%;
  width: 100%;
  color: #656565;
}

.login-bigbox {
  position: relative;
  width: 1100px;
  height: 300px;
}

.login-message {
  position: absolute;
  width: 550px;
  text-align: center;
  line-height: 1.75rem;
}

.login-picbox {
  position: absolute;
  margin-left: 100px;
  width: 550px;
  height: 365px;
}

.login-box {
  position: absolute;
  right: 0;
  height: 54px;
  width: 350px;
}



.login-box .logo img {
  max-height: 30px;
}

.login-box .body {
  padding: 15px 15px 2px 15px;
  background-color: rgba(255, 255, 255, 0.3);
}

.login-box .body .tips {
  font-size: 20px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-bottom: 10px;
}

.login-box .body .author {
  display: block;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #656565;
  margin-bottom: 10px;
  text-decoration: none;
}

.login-box .body .author a {
  text-decoration: none;
}
</style>
