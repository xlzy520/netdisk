<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-row type="flex" class="row-bg">
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <el-link @click="$router.push('/user/login')">
                <i class="el-icon-back">返回</i>
              </el-link>
            </div>
          </el-col>
          <el-col :span="5">
            <div class="grid-content bg-purple-light"></div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content bg-purple">注册页面</div>
          </el-col>
        </el-row>
      </div>
      <div class="text item">
        <el-form :model="registerForm" status-icon :rules="rules" ref="registerForm">
          <el-form-item label="用户名" prop="name">
            <el-input placeholder="请输入用户名" v-model="registerForm.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              placeholder="请输入密码"
              v-model="registerForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword">
            <el-input
              type="password"
              placeholder="请再次输入密码"
              v-model="registerForm.checkPassword"
              autocomplete="off"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button style="width:100%" type="primary" @click="submitForm('registerForm')">注册</el-button>
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
  name: "register",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.registerForm.checkPassword !== "") {
          this.$refs.registerForm.validateField("checkPassword");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        name: "",
        password: "",
        checkPassword: "",
      },
      rules: {
        name: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          { min: 4, message: "用户名长度不能少于4位", trigger: "blur" }
        ],
        password: [
          { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        checkPassword: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ],
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { name, password } = this.registerForm
          userApi.register({
            name,
            password: md5(password)
          }).then(res => {
            this.$message1000('注册成功')
            this.$router.push("/login");
          })
        } else {
          console.log("registerForm error submit!!");
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
  width: 23rem;
  margin: 5% auto;
}
@media only screen and (max-width: 796px) {
  .box-card {
    width: 100%;
  }
}
</style>
