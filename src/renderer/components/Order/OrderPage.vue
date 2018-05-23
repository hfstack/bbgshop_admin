<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>订单中心</el-breadcrumb-item>
                <el-breadcrumb-item>订单列表</el-breadcrumb-item>
            </el-breadcrumb>
            <!-- <div class="operation-nav">
                <router-link to="/dashboard/order/add">
                    <el-button type="primary" icon="plus">添加订单</el-button>
                </router-link>
            </div> -->
        </div>
        <div class="content-main">
            <div class="filter-box" style="float:left;">
                <el-form :inline="true" :model="filterForm" class="demo-form-inline">
                    <el-form-item label="订单号">
                        <el-input v-model="filterForm.order_sn" placeholder="请输入订单号"></el-input>
                    </el-form-item>
                    <el-form-item label="收货人">
                        <el-input v-model="filterForm.consignee" placeholder="请输入收货人"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmitFilter">查询</el-button>
                    </el-form-item>
                </el-form>

            </div>
            <div class="filter-box" style="float:right;">
              <!-- <el-form ref="infoForm"  label-width="120px"> -->
              <!-- <el-form-item label="所属分类" > -->
              <el-select v-model="ordertype" placeholder="请选择订单状态" @change="changeorder_type">
                <el-option
                  v-for="item in typelist"
                  :key="item.id"
                  :label="item.value"
                  :value="item.code">
                </el-option>
              </el-select>
              <el-button type="primary" @click="onSubmitSelect">清除</el-button>
            </div>
            <div class="form-table-box">
                <el-table :data="tableData" :default-sort = "{prop: 'date', order: 'descending'}" style="width: 100%" border stripe>
                    <!-- <el-table-column prop="id" label="ID" align="center" sortable  width="80">
                    </el-table-column> -->
                    <el-table-column prop="order_sn"  width="200" sortable align="center" label="订单号" >
                    </el-table-column>
                    <el-table-column prop="add_localtime" align="center" sortable width="180" label="下单时间">
                    </el-table-column>
                    <el-table-column align="center" sortable width="150" label="收货人">
                      <template scope="scope">
                        <div class="one_row_overflow">
                          {{tableData[scope.$index].consignee}}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column prop="mobile" align="center" sortable width="130" label="手机号">
                    </el-table-column>
                    <el-table-column prop="actual_localprice" align="center" sortable width="140"  label="订单金额(元)">
                    </el-table-column>
                    <el-table-column sortable align="center" width="160" label="订单状态">
                      <template scope="scope">
                        <div class="one_row_overflow">
                          {{tableData[scope.$index].order_status_text}}
                          <span class="one_row_overflow_refund">{{tableData[scope.$index].refund_is_success == 0 ?"":" 退款成功 "}}</span>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column sortable align="center" width="170" label="订单类型">
                      <template scope="scope">
                        <div class="one_row_overflow">
                          {{tableData[scope.$index].pay_name == ''? "普通订单":tableData[scope.$index].pay_name}}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="留言">
                      <template scope="scope">
                        <div class="one_row_overflow">
                          {{tableData[scope.$index].postscript}}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" width="140" align="center">
                        <template scope="scope">
                            <el-button size="small" @click="handleRowEdit(scope.$index, scope.row)">查看</el-button>
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

  export default {
    data() {
      return {
        page: 1,
        total: 0,
        filterForm: {
          name: ''
        },
        tableData: [],
        ordertype: '',

        typelist: [
          {
            id:1,
            value:"待付款",
            code: 0
          },{
            id:2,
            value:"待发货",
            code: 201
          },{
            id:3,
            value:"待收货",
            code: 300
          },{
            id:4,
            value:"已完成",
            code: 301
          },{
            id:5,
            value:"处理中",
            code: 400
          },
        ]
      }
    },
    methods: {
      onSubmitSelect (){
        this.ordertype = ''
        this.getList()
      },
      changeorder_type(e){
        console.log(e);
        this.ordertype = e
        this.getList()
      },
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
      //
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
        this.axios.get('order', {
          params: {
            page: this.page,
            orderSn: this.filterForm.order_sn,
            consignee: this.filterForm.consignee,
            status:this.ordertype
          }
        }).then((response) => {
          console.log(response);
          this.tableData = response.data.data.data
          for (var i = 0; i < this.tableData.length; i++) {
            this.tableData[i].add_localtime = this.timestampToTime(this.tableData[i].add_time)
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
      }
    },
    components: {

    },
    mounted() {
      this.getList();
    }
  }

</script>

<style scoped>
.one_row_overflow_refund {
  color: #ff4444;
  font-weight: bold;
}
.one_row_overflow {
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
