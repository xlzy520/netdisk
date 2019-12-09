<template>
  <div class="container">
    <el-card class="box-card" v-loading="loading">
      <div slot="header" class="clearfix" style="text-align:center">
        <span>登录页面</span>
      </div>
      <div class="text item">
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item label="用户名" prop="username">
            <el-input placeholder="请输入用户名" v-model="loginForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="loginForm.password"
              autocomplete="off"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="captcha">
            <el-input placeholder="请输入验证码" v-model="loginForm.captcha" maxlength="5" @keyup.enter.native="submitLoginForm('loginForm')">
              <template slot="append">
                <el-image
                  :src="captchaImg"
                  style="width:120px;height:30px"
                  @click="changeCaptchaImg"
                ></el-image>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%" type="primary" @click="submitLoginForm('loginForm')" :disabled="loginDisabled">登录</el-button>
          </el-form-item>
          <el-form-item>
              <el-button style="width:100%" @click="$router.push('/user/register')">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>


<script>
import api from "../fetch/api";
import axios from "axios";
export default {
  name: "login",
  data() {
    return {
      loading:false,
      loginForm: {
        username: "",
        password: "",
        captcha: ""
      },
      loginDisabled:false,
      captchaImg: `${axios.defaults.baseURL}/captcha?${Math.random()}`,
      rules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        captcha: [
          { required: true, message: "验证码不能为空", trigger: "blur" },
          { min: 5, message: "验证码是5位数的！！！", trigger: "blur" }
        ]
      }
    };
  },
  created(){
    if(localStorage.getItem('token')!=null && localStorage.getItem('token')!=undefined){
      this.$store.commit('addUserInfo', JSON.parse(localStorage.getItem('token')));
      this.$router.replace('/netdisk/folder_id/0');
    }
  },
  methods: {
    submitLoginForm(formName) {
      this.loginDisabled=true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading=true;
          api.Login(this.loginForm).then(res => {
            if (res.code == 1) {
              console.log("登录成功的动作");
              let _this=this;
              this.$store.commit('addUserInfo',res.userInfo);
              this.$message({
                message: res.msg+",正在打开页面。。",
                type: "success",
                duration:1000,
                onClose(){
                  _this.loading=false;
                  _this.$router.replace('/netdisk/folder_id/0');
                }
              });
            } else {
              let _this=this;
              this.$message({
                message: res.msg,
                type: "warning",
                duration:1000,
                onClose(){
                  _this.loading=false;
                }
              })
              this.loginDisabled=false;
              this.$refs[formName].resetFields();              
            }
          });
        } else {
          console.log("error submit!!");
          this.loginDisabled=false;
          return false;
        }
      });
    },
    changeCaptchaImg() {
      this.captchaImg = `${axios.defaults.baseURL}/captcha?${Math.random()}`;
    }
  }
};
</script>


<style scoped>
html,
body {
  height: 100%;
  padding: 0;
  margin: 0;
  background-color: #f5f5f5;
}
.container {
  display: flex;
  justify-content: center;
}
.box-card {
  max-width: 100%;
  min-width: 23rem;
  margin: 5% auto;
}
</style>