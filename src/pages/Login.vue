<template>
  <div class="container">
    <el-card class="box-card" v-loading="loading">
      <div slot="header" class="clearfix" style="text-align:center">
        <span>登录页面</span>
      </div>
      <div class="text item">
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item label="用户名" prop="name">
            <el-input placeholder="请输入用户名" v-model="loginForm.name"></el-input>
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
          <el-form-item>
            <el-button style="width:100%" type="primary" @click="submit('loginForm')" :loading="submitLoading">登录</el-button>
          </el-form-item>
          <el-form-item>
              <el-button style="width:100%" @click="$router.push('/register')">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>


<script>
import userApi from "../api/user";
import md5 from 'md5'
export default {
  name: "login",
  data() {
    return {
      loading:false,
      loginForm: {
        name: "",
        password: "",
      },
      submitLoading:false,
      rules: {
        name: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created(){

  },
  methods: {
    submit(formName) {
      this.submitLoading=true;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading=true;
          const { name, password } = this.loginForm
          userApi.login({
            name,
            password: md5(password)
          }).then(res => {
            console.log(res);
            this.$store.commit('addUserInfo',res);
            this.$router.push('/netdisk')
          }).finally(() => {
            this.loading = false
            this.submitLoading=false;
          });
        } else {
          console.log("error submit!!");
          this.submitLoading=false;
          return false;
        }
      });
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
