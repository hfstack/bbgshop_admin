<template lang="html">
  <div class="content-page">
      <div class="content-nav">
          <el-breadcrumb class="breadcrumb" separator="/">
              <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>订单中心</el-breadcrumb-item>
              <el-breadcrumb-item>已发货订单</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- <div class="operation-nav">
              <router-link to="/dashboard/order/add">
                  <el-button type="primary" icon="plus">添加订单</el-button>
              </router-link>
          </div> -->
      </div>
      <div class="content-main">
          <div class="filter-box">
              <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                  <el-form-item label="订单号">
                      <el-input v-model="filterForm.order_sn_input" placeholder="请输入订单号"></el-input>
                  </el-form-item>
                  <el-form-item label="收货人">
                      <el-input v-model="filterForm.consignee_input" placeholder="请输入收货人"></el-input>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" @click="onSubmitFilter">查询</el-button>
                  </el-form-item>
              </el-form>
          </div>
          <div class="form-table-box">
              <el-table :data="tableData" :default-sort = "{prop: 'date', order: 'descending'}" style="width: 100%" border stripe>
                  <el-table-column prop="order_sn" align="center" sortable width="200"  sortable  label="订单号" >
                  </el-table-column>
                  <el-table-column prop="pay_localtime" align="center" sortable width="180" label="付款时间">
                  </el-table-column>
                  <el-table-column align="center" sortable width="160" label="收货人">
                    <template scope="scope">
                        <div class="one_row_overflow">
                          {{tableData[scope.$index].consignee}}
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="actual_localprice" align="center" sortable width="140"  label="付款金额(元)">
                  </el-table-column>
                  <el-table-column prop="order_status_text" sortable align="center" width="120" label="订单状态">
                  </el-table-column>
                  <el-table-column sortable align="center" width="170" label="订单类型">
                    <template scope="scope">
                      <div class="one_row_overflow">
                        {{tableData[scope.$index].pay_name == ''? "普通订单":tableData[scope.$index].pay_name}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="200" align="center">
                      <template scope="scope">
                          <!-- <el-button size="small" type="info" :plain="true" @click="Message(scope.$index, scope.row)">留言</el-button> -->
                          <!-- <el-button size="small" type="info" :plain="true" @click="ChageAddress(scope.$index, scope.row)">改地址</el-button> -->
                          <el-button size="small" type="info" @click="handleRowEdit(scope.$index, scope.row)">查看</el-button>
                          <!-- <el-button size="small" type="danger" @click="handleRowDelete(scope.$index, scope.row)">删除</el-button> -->
                      </template>
                  </el-table-column>
              </el-table>
          </div>
          <div class="page-box">
              <el-pagination @current-change="handlePageChange" :current-page="page" :page-size="10" layout="total, prev, pager, next, jumper" :total="total">
              </el-pagination>
          </div>
      </div>
  </div>
</template>

<script>
import {
  Toast
} from 'vant'
export default {
  name:"PendOutOrder",
  data(){
    return {
      page: 1,
      total: 0,
      filterForm:{
        order_sn_input:'',
        consignee_input:''
      },
      tableData: [],
    }
  },
  methods:{
    ////////////////////////////////////////////////////////////////////
    handlePageChange(val) {
      this.page = val;
      //保存到localStorage
      localStorage.setItem('orderPage', this.page)
      localStorage.setItem('orderFilterForm', JSON.stringify(this.filterForm));
      this.getList()
    },
    handleRowEdit(index, row) {
      this.$router.push({ name: 'order_detail', query: { id: row.id } })
    },
    // handleRowDelete(index, row) {
    //   this.$confirm('确定要删除?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //
    //     this.axios.post('order/destory', { id: row.id }).then((response) => {
    //       console.log(response.data)
    //       if (response.data.errno === 0) {
    //         this.$message({
    //           type: 'success',
    //           message: '删除成功!'
    //         });
    //
    //         this.getList();
    //       }
    //     })
    //
    //
    //   });
    // },
    onSubmitFilter() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.axios.post('order/alreadyoutorder', {
        // params: {
          page: this.page,
          orderSn: this.filterForm.order_sn_input,
          consignee: this.filterForm.consignee_input,
        // }
      }).then((response) => {
        console.log(response);
        this.$message({
          message: '已刷新！',
          type: 'success'
        });
        this.tableData = response.data.data.data
        for (var i = 0; i < this.tableData.length; i++) {
          this.tableData[i].pay_localtime = this.timestampToTime(this.tableData[i].pay_time)
          this.tableData[i].actual_localprice = (this.tableData[i].actual_price/1).toFixed(2)
        }
        this.page = response.data.data.currentPage
        this.total = response.data.data.count

      })
    },
    timestampToTime(timestamp) {
        var date = new Date(timestamp * 1);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '/';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
        var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + '  ';
        var h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s;
    },

  },
  components: {

  },
  mounted() {
    this.getList();
  }
}
</script>

<style lang="css">
</style>
