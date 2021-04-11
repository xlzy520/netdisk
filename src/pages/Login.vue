<template>
  <div class="container">
    <el-card v-loading="loading" class="box-card">
      <div slot="header" class="clearfix" style="text-align:center">
        <span>登录页面</span>
      </div>
      <div class="text item">
        <el-form ref="loginForm" :model="loginForm" :rules="rules">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="loginForm.name" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              autocomplete="off"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button style="width:100%" type="primary" :loading="submitLoading" @click="submit('loginForm')">登录</el-button>
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
import userApi from '../api/user'
import md5 from 'md5'
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      loginForm: {
        name: '',
        password: ''
      },
      submitLoading: false,
      rules: {
        name: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {

  },
  methods: {
    submit(formName) {
      this.submitLoading = true
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const { name, password } = this.loginForm
          userApi.login({
            name,
            password: md5(password)
          }).then(res => {
            console.log(res)
            this.$store.commit('addUserInfo', res)
            this.$router.push('/netdisk')
          }).finally(() => {
            this.loading = false
            this.submitLoading = false
          })
        } else {
          console.log('error submit!!')
          this.submitLoading = false
          return false
        }
      })
    }
  }
}
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
