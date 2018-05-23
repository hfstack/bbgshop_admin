<template lang="html">
  <div class="content-page">
      <div class="content-nav">
          <el-breadcrumb class="breadcrumb" separator="/">
              <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>店铺管理</el-breadcrumb-item>
              <el-breadcrumb-item>商品页常见问题管理</el-breadcrumb-item>
          </el-breadcrumb>

      </div>
      <div class="content-page">
        <el-row :gutter="20">
          <el-col :span="6"  v-for="item in issueData">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span><el-input v-model="item.question" placeholder="请输入问题"></el-input></span>
                <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
              </div>
              <div class="text item">
                <el-input
                prefix-icon="el-icon-search"
                  type="textarea"
                  autosize
                  placeholder="请输入回答"
                  v-model="item.answer">
                </el-input>
                <!-- <span><el-input v-model="item.answer"  placeholder="请输入内容"></el-input></span> -->
                <!-- <el-input v-model="item.answer" style="width:500px;" placeholder="请输入内容"> -->
              </div>
            </el-card>

          </el-col>
        </el-row>
        <br>
        <br>
        <br>
        <el-button style="float: right; margin: 3px 0" @click="setissue" type="primary">保存</el-button>

      </div>
    </div>
</template>

<script>
export default {
  name:"GoodsQuestionPage",
  data() {
     return {
       issueData:[],
     };
   },
   mounted(){
     this.getissue()
   },
   methods: {
     getissue(){
       this.axios.post('index/findissue').then((res) => {
         console.log(res);
         this.issueData = res.data.data
       })
     },
     setissue(){
       for (var i = 0; i < this.issueData.length; i++) {
         let obj = this.issueData[i]
         if (obj.question == "" || obj.answer == "") {
           this.$message.error("请填写完整！")
           return false
         }
       }
       this.$confirm('是否执行此操作?', '提示', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(() => {
         this.axios.post('index/setissue',{
           issue:this.issueData
         }).then((res) => {
           console.log(res);
           this.$message({
             type: 'success',
             message: '修改成功!'
           });
           // this.issueData = []
           // this.getissue()
         })
       }).catch(() => {
         this.$message({
           type: 'info',
           message: '已取消修改！'
         });
       });
       console.log(this.issueData);
     }
   }
  }
  </script>

<style lang="css" scoped>

</style>
