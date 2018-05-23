<template lang="html">
  <div class="content-page">
      <div class="content-nav">
          <el-breadcrumb class="breadcrumb" separator="/">
              <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>订单中心</el-breadcrumb-item>
              <el-breadcrumb-item>退款订单</el-breadcrumb-item>
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
                  <el-table-column align="center" sortable width="180" label="退款时间">
                    <template scope="scope">
                        <div class="one_row_overflow">
                          {{tableData[scope.$index].refund.creat_localtime}}
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" sortable width="120" label="退款方式">
                    <template scope="scope">
                        <div class="one_row_overflow">
                          {{tableData[scope.$index].refund.way_value}}
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" sortable width="140" label="退款理由">
                    <template scope="scope">
                        <div class="one_row_overflow">
                          {{tableData[scope.$index].refund.reson_value}}
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" sortable width="160" label="收货人">
                    <template scope="scope">
                        <div class="one_row_overflow">
                          {{tableData[scope.$index].consignee}}
                        </div>
                    </template>
                  </el-table-column>

                  </el-table-column>
                  <el-table-column sortable align="center" width="170" label="订单类型">
                    <template scope="scope">
                      <div class="one_row_overflow">
                        {{tableData[scope.$index].pay_name == ''? "普通订单":tableData[scope.$index].pay_name}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column sortable align="center" width="170" label="申请次数">
                    <template scope="scope">
                        {{tableData[scope.$index].refund.rerund_num}}
                    </template>
                  </el-table-column>
                  <el-table-column align="center" sortable width="140" label="退款金额(元)">
                    <template scope="scope">
                        <div class="one_row_overflow">
                          {{tableData[scope.$index].refund.refund_price}}
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="order_status_text" sortable align="center" width="120" label="订单状态">
                  </el-table-column>
                  <el-table-column sortable align="center" width="120" label="退款状态">
                    <template scope="scope">
                        <div class="one_row_overflow">
                          {{tableData[scope.$index].refund.state_text}}
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80" align="center">
                      <template scope="scope">
                          <el-button v-if="tableData[scope.$index].refund.state == 1001" size="small" type="info" :plain="true" @click="refund(scope.$index, scope.row)">退款</el-button>
                          <!-- <el-button size="small" type="info" :plain="true" @click="ChageAddress(scope.$index, scope.row)">改地址</el-button> -->
                          <!-- <el-button size="small" type="info" @click="Sendout(scope.$index, scope.row)">发货</el-button> -->
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
      <!-- ////////////////////////////////////////////////////////退款弹出层 -->
            <van-popup class="RefundPopover" v-model="seeRefundPopover">
              <div class="RefundTitle">
                退款订单
              </div>
               <div class="RefundArea">
                 <div class="RefundArea_item">
                  <div class="RefundArea_item_left">买家：<span style="color:#333;font-size:16px;font-weight:bold;height:">{{userInfo.nickname}}</span></div>
                  <div class="RefundArea_item_right">{{refundInfo.creat_localtime}}</div>
                </div>
                <div class="RefundArea_item">
                  <div class="RefundArea_item_right">{{refundInfo.refund_sn}}</div>
                </div>
                <div class="RefundArea_item">
                  <div class="RefundArea_item_right">{{mainInfo.consignee}}</div>
                </div>
                <div class="RefundArea_item">
                  <div class="RefundArea_item_right">{{mainInfo.full_region}}{{mainInfo.address}}</div>
                </div>
                <div class="RefundArea_item">
                  <div class="RefundArea_item_right">{{refundInfo.reson_value}}</div>
                </div>
                <div class="RefundArea_item">
                  <div class="RefundArea_item_right">{{refundInfo.way_value}}</div>
                </div>
                <div class="RefundArea_reson_item">
                 <div class="RefundArea_reson_item_left">退款理由：</div>
                 <div class="RefundArea_reson_item_right">{{refundInfo.reson}}</div>
               </div>
               <!-- {{refund_img}} -->
               <div class="RefundArea_reson_item">
                <div class="RefundArea_reson_item_left">图片凭证：</div>
                <div class="RefundArea_reson_item_imgright">
                  <div class="RefundArea_reson_item_imgrightext" v-if="refundInfo.refund_img == ''">
                    未上传图片
                  </div>
                  <!-- <div class="RefundArea_reson_item_imgrightext" v-if="refundtype == 2">
                    未发货前退款，没有图片
                  </div> -->
                  <img class="RefundArea_reson_item_img" @click="imgclick(img)" v-if="refundInfo.refund_img !== ''" v-for="img in refund_img"
                  :src="img"></img>
                </div>
              </div>
              <div class="hr">

              </div>
                 <div class="RefundArea_item">
                  <div class="RefundArea_item_right">总金额 ￥
                    <span style="font-size:20px;font-weight:bold;color:#F56C6C">{{mainInfo.actual_price}}</span>
                  </div>
                </div>
                <div class="RefundArea_item">
                  <div class="RefundArea_item_right">退款金额 ￥
                    <span style="font-size:20px;font-weight:bold;color:#F56C6C">{{refundInfo.refund_price}}</span>
                  </div>
                </div>
              </div>
              <div class="Refund_btn">
                <el-button size="small" type="info" :plain="true" @click="canelrefund">拒绝</el-button>
                <el-button size="small" type="danger" @click="refundSure">确认退款</el-button>
              </div>
            </van-popup>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>

  </div>
</template>

<script>
import {
  Toast
} from 'vant'
export default {
  name:"RefundOrder",
  data(){
    return {
      page: 1,
      total: 0,
      refundtype: 0,
      dialogVisible: false,
      seeRefundPopover: false,
      dialogImageUrl: '',
      filterForm:{
        order_sn_input:'',
        consignee_input:''
      },
      tableData: [],
      mainInfo: {},
      userInfo: {},
      refundInfo: {},
      refund_img: [],
    }
  },
  methods:{
    imgclick(url){
      // console.log(url);
      this.dialogImageUrl = url;
      this.dialogVisible = true;
    },
    // 以下为退款///////////////////////////////////////////////////////////
    refund(index,row){
      // this.getList()
      // console.log(this.rowinfo);
      this.seeRefundPopover = true
      this.mainInfo = row
      this.userInfo = row.user
      this.refundInfo = row.refund

    },
    refundSure(){
      console.log("确认退款");
      this.$confirm('同意请求即按照退款规则将支付款按原路退到买家帐号上！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(255, 255, 255, 0.7)'
        });
          this.axios.post("pay/prerefund",{
            orderId:this.mainInfo.id
          }).then((res) => {
            console.log(res);
            let refund_time = Number(res.data.timeStamp * 1000)
            if (res.status === 200 && res.data.errno === 0) {
              this.axios.post('order/refundSuccess',{
                orderId:this.mainInfo.id,
                time: refund_time
              }).then((res) => {
                console.log(res);
              })
              this.$message({
                type: 'success',
                message: '退款成功!'
              });
              loading.close()
              this.getList()
              this.seeRefundPopover = false
            }
          })
        }).catch(() => {
        });
    },
    canelrefund(){
      console.log("拒绝退款");
      this.$confirm('此操作将拒绝   '+this.rowinfo.user.nickname+'   的退款操作此操作不可逆（但可以重复提交申请）, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('order/canelrefund',{
            orderid: this.rowinfo.id,
          }).then((res) => {
            console.log(res);
            if (res.data.errno == 0) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              });
              this.getList()
              this.seeRefundPopover = false
            }
          })

        }).catch(() => {
        });

    },
    ////////////////////////////////////////////////////////////////////
    handlePageChange(val) {
      this.page = val;
      //保存到localStorage
      localStorage.setItem('orderPage', this.page)
      localStorage.setItem('orderFilterForm', JSON.stringify(this.filterForm));
      this.getList()
    },
    onSubmitFilter() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.axios.post('order/refundorder', {
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
          this.tableData[i].refund = this.tableData[i].refund
          this.tableData[i].refund.creat_localtime = this.timestampToTime(this.tableData[i].refund.creat_time)
          console.log(this.tableData[i].refund.refund_img);
          // if (this.tableData[i].refund.refund_img) {
            // this.refundtype = 1
            let refund_img = this.tableData[i].refund.refund_img
            console.log(refund_img);
            this.refund_img = refund_img.split(",")
          // }else {
          //   this.refundtype = 2
          //   let refund_img = ''
          //   this.refund_img = refund_img.split(",")
          // }
        }
        this.page = response.data.data.currentPage
        this.total = response.data.data.count
        this.rowinfo = this.tableData[0]
        console.log(this.rowinfo);
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
.RefundArea_reson_item_imgrightext {
  line-height: 20px;
}
.hr {
  border-top:1px solid #ddd;
  margin-bottom: 20px;
}
.RefundArea_reson_item_img {
  width: 85px;
  height: 85px;
  margin: 0 5px;
}
.RefundArea_reson_item_imgright {
  text-align: right;
  width: 100%;
  font-size: 12px;
  color: #757575;
  /* line-height: 18px; */
  /* float: right; */
}
.RefundArea_reson_item_left {
  /* position: absolute; */
  /* position: absolute; */
  /* border:1px solid black; */
  width: 100px;
  font-size: 14px;
  color: #757575;
  float: left;
  font-weight: bold;
}
.RefundArea_reson_item_right {
  /* border:1px solid black; */
  /* position: absolute; */
  /* text-align: right; */
  width: 100%;
  font-size: 12px;
  color: #757575;
  line-height: 18px;
  /* float: right; */
}
.RefundArea_reson_item {
  /* border:1px solid black; */
  /* position: relative; */
  display: block;
  padding: 4px 1px;
  border-top:1px solid #ddd;
  min-height: 26px;
  /* position: relative; */
  /* height: auto; */
}
.Refund_btn {
  /* border:1px solid black; */
  /* margin:  */
  text-align: right;
  width: 95%;
  height: 32px;
  line-height: 28px;
  margin: 0 auto;
  margin-bottom: 10px;
}
.RefundArea_item_left {
  float: left;
  /* border: 1px solid black; */
  font-size: 12px;
  color: #757575;
}
.RefundArea_item_right {
  float: right;
  font-size: 12px;
  color: #757575;
}
.RefundArea_item {
  width: 100%;
  display: inline-block;
  /* border: 1px solid black; */
  height: 22px;
  line-height: 22px;
}
.RefundArea {
  width: 95%;
  min-height: 100px;
  margin: 0 auto;
  margin-top: 15px;
  margin-bottom: 11px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f4f4f4;
  /* border:1px solid black; */
}
.RefundPopover {
  width: 450px;
  height: auto;
}
.RefundTitle {
  height: 45px;
  line-height: 45px;
  font-size: 18px;
  color: #222;
  font-weight: bold;
  width: 90%;
  margin: auto;
  border-bottom: 1px solid #f4f4f4;
  text-align: center;
}
</style>
