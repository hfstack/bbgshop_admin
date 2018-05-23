<template lang="html">
  <div class="content-page">
      <div class="content-nav">
          <el-breadcrumb class="breadcrumb" separator="/">
              <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>订单中心</el-breadcrumb-item>
              <el-breadcrumb-item>待发货订单</el-breadcrumb-item>
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
                  <el-table-column sortable align="center" width="120" label="订单状态">
                    <template scope="scope">
                        <div class="one_row_overflow">
                          {{tableData[scope.$index].order_status_text}}
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
                  <el-table-column label="操作" width="400" align="center">
                      <template scope="scope">
                          <el-button size="small" v-if="scope.row.pay_id == 0" type="info" :plain="true" @click="Message(scope.$index, scope.row)">留言</el-button>
                          <el-button size="small" v-if="scope.row.pay_id == 0" type="info" :plain="true" @click="ChageAddress(scope.$index, scope.row)">改地址</el-button>
                          <el-button size="small" v-if="scope.row.pay_id == 0" type="info" @click="Sendout(scope.$index, scope.row)">发货</el-button>
                          <el-button size="small" v-if="scope.row.pay_id == 2 && scope.row.collage_is_success == 1" type="info" @click="Sendout(scope.$index, scope.row)">发货</el-button>
                          <el-button size="small" v-if="scope.row.pay_id == 0" type="info" :plain="true" @click="handleRowEdit(scope.$index, scope.row)">查看</el-button>

                          <el-button size="small" v-if="scope.row.pay_id == 0" type="danger" @click="handleRowDelete(scope.$index, scope.row)">删除</el-button>
                          <el-button size="small" v-if="scope.row.pay_id == 2 && scope.row.collage_is_success == 0" disabled type="info">拼团未成功</el-button>

                      </template>
                  </el-table-column>
              </el-table>
          </div>
          <div class="page-box">
              <el-pagination @current-change="handlePageChange" :current-page="page" :page-size="10" layout="total, prev, pager, next, jumper" :total="total">
              </el-pagination>
          </div>
      </div>
      <!-- //发货的弹层 -->
      <van-popup v-model="sendout_logistics_popup">
        <div class="sendout_area">
          <div class="sendout_title">
              发货订单
          </div>
          <div class="sendout_area_area">
            <div class="sendout_area_item" v-for="item in goodslist">
              <img class="sendout_area_item_img" :src="item.list_pic_url"></img>
              <div class="sendout_area_item_name">
                {{item.goods_name}}
              </div>
              <div class="sendout_area_item_sku">
                {{item.goods_specifition_name_value}} x{{item.number}}
              </div>
              <div class="sendout_area_item_price">
                <span style="font-size:12px;">￥</span>{{item.retail_price}}
              </div>
            </div>
          </div>
          <div class="sendout_area_length">
            共<span style="font-size:18px;color:#ff4444;padding:0 5px;">{{goodslist.length}}</span>件商品
          </div>
          <div class="sendout_area_send_logic">
            <div class="sendout_area_send_logic_value">
              填写物流单号:
            </div>
            <div class="sendout_area_send_logic_area">
              <el-form label-width="100px" :model="locgic_form">
                <el-form-item label="物流公司">
                  <!-- <el-input v-model="locgic_form.compy"></el-input> -->
                  <el-select style="width:230px;" v-model="locgic_form.compy" clearable placeholder="请选择物流公司">
                    <el-option
                      v-for="item in logic_comy_list"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="物流单号">
                  <el-input style="width:230px;" v-model="locgic_form.compycode"></el-input>
                </el-form-item>
              </el-form>

            </div>
          </div>
        </div>
        <div style="margin-bottom:15px;margin-right:20px;text-align:right">
          <el-button type="text" @click="canelsendout" style="margin-right:15px;">取消</el-button>
          <el-button type="primary" @click="submitsendout">确定</el-button>

        </div>
      </van-popup>


      <!-- // 修改收货地址弹层 -->
      <van-popup v-model="chage_address_popup">
        <div class="ChagePrice_area">
          <div class="ChagePrice_area_title">
            待付款订单商品列表 <span style="font-size:11px;font-weight:normal;color:#757575;"> (修改收货地址)</span>
          </div>
          <div class="ChageAddress_area">
              <div class="BuyPeople_Info">
                <span style="float:left">
                <span style="font-size:12px;color:#757575;">买家：</span>
                <span style="font-weight:bold">{{user_info.nickname}}</span>
              </span>
              <span style="float:right">
                <span style="font-size:12px;color:#757575;font-weight:bold">{{order_info.local_time}}</span>
                <!-- <span style="font-weight:bold">{{user_info.nickname}}</span> -->
              </span>
            </div>
            <div style="font-size:12px;color:#757575;width:95%;margin:auto;margin-top:15px;">订单编号：{{order_info.order_sn}}</div>
            <div style="font-size:12px;color:#757575;width:95%;margin:auto;margin-top:15px;">收货地址：</div>
            <div class="ChageAddress_area_item">
                <div class="ChageAddress_area_item_getname">
                  <!-- <span style="font-size:12px;color:#757575;">收货人:</span> -->
                  {{order_info.consignee}}
                </div>
                <div class="ChageAddress_area_item_getaddress">
                  {{order_info.full_region}} {{order_info.address}}
                </div>
                <div class="ChageAddress_area_item_getphone">
                  {{order_info.mobile}}
                </div>
                <!-- <div> -->
                  <el-button @click="open_chage_address" class="ChageAddress_area_item_chage_btn"
                  size="mini" type="danger" v-if="!enable_chage_address">修改</el-button>
                  <el-button @click="close_chage_address" class="ChageAddress_area_item_chage_btn"
                  size="mini" type="danger" v-if="enable_chage_address">取消</el-button>
                <!-- </div> -->
            </div>
            <transition name="el-fade-in-linear">

              <div v-if="enable_chage_address" class="ChageAddress_chage_item">
                  <div style="font-size:16px;color:#333;width:95%;margin:5px auto;margin-bottom:25px;font-weight:bold">
                    修改收货地址
                  </div>
                <el-form label-width="120px" :model="inputAddress">
                  <el-form-item label="收货人姓名：">
                    <el-input v-model="inputAddress.name"></el-input>
                  </el-form-item>
                  <el-form-item label="收货手机号：">
                    <el-input v-model="inputAddress.phone"></el-input>
                  </el-form-item>
                  <el-form-item label="收货人地址：">
                    <el-select class="ChageAddress_chage_item_select" v-model="firstRegionvalue" placeholder="选择省" @change="firstRegionChage">
                      <el-option
                        v-for="item in firstRegion"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <el-select class="ChageAddress_chage_item_select" v-model="secondRegionvalue" placeholder="选择市" @change="secondRegionChage">
                      <el-option
                        v-for="item in secondRegion"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                    <el-select class="ChageAddress_chage_item_select" v-model="thirdRegionvalue" placeholder="选择县" @change="thirdRegionChage">
                      <el-option
                        v-for="item in thirdRegion"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="详细地址：">
                    <el-input type="textarea" v-model="inputAddress.address" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
                  </el-form-item>
                </el-form>
                <div style="margin-bottom:15px;text-align:right">
                  <el-button type="text" @click="canelForm" style="margin-right:15px;">取消</el-button>
                  <el-button type="primary" @click="submitForm">确定</el-button>

                </div>

              </div>
            </transition>
          </div>
        </div>
      </van-popup>

      <!-- //查看的弹层 -->
      <van-popup v-model="seeorder_popup">
        <div class="see_area">
          <div class="ChagePrice_area_title">
            订单信息
          </div>
          <div style="font-size:12px;color:#757575;width:95%;margin:auto;margin-top:15px;margin-left:25px;">订单编号：{{order_info.order_sn}}</div>
          <div class="see_area_area">
            <el-form label-width="120px" :model="message">
              <el-form-item label="买家留言：">
                <el-input v-model="message.buy_mes" :placeholder="message.buy_mes_plase"></el-input>
              </el-form-item>
              <el-form-item label="卖家留言：">
                <el-input v-model="message.admin_mes" :placeholder="message.admin_mes_plase"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div style="margin-bottom:15px;margin-right:20px;text-align:right">
            <el-button type="text" @click="canelmessage" style="margin-right:15px;">取消</el-button>
            <el-button type="primary" @click="submitmessage">确定</el-button>

          </div>
        </div>
      </van-popup>



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
      message: {
        buy_mes:'',
        admin_mes:'',
        buy_mes_plase: "买家没有留言",
        admin_mes_plase: "卖家没有留言"
      },
      firstRegionvalue: '',
      secondRegionvalue: '',
      thirdRegionvalue: '',
      // chage_price_popup: false,
      chage_address_popup: false,
      seeorder_popup:false,
      user_info: '',
      order_info: '',
      inputAddress: {
        name:'',
        phone: '',
        address: '',
      },
      enable_chage_address: false,
      firstRegion:[],
      secondRegion: [],
      thirdRegion: [],
      RegionCode: {
        first:0,
        second:0,
        third:0,
      },
      goodslist: [],
      sendout_logistics_popup: false,
      filterForm:{
        order_sn_input:'',
        consignee_input:''
      },
      tableData: [],
      logic_comy: '',
      logic_comy_list: [],
      locgic_form: {
        compy: '',
        compycode: ''
      }
    }
  },
  methods:{
    handleRowEdit(index, row) {
      this.$router.push({ name: 'order_detail', query: { id: row.id } })
    },
    //以下为发货  ////////////////////////////////////////////////////////////////////////
    submitsendout(){
      console.log(this.order_info);
      console.log(this.goodslist);
      console.log(this.locgic_form);
      if (this.locgic_form.compycode == '' || this.locgic_form.compy == '') {
        this.$message.error("物流信息不完整！")
        return false
      }
      // let rex = '^[0-9]*$/g'
      let code = this.locgic_form.compycode
      let rex = /^[0-9]*$/g
      if (!rex.test(code)) {
        // console.log("213654789");
        this.$message.error("物流单号不正确！")
        return false
      }
      this.$confirm('此操作将永久此订单状态(谨慎操作！), 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('order/setlogiccompy',{
            orderinfo: this.order_info,
            goodslist: this.goodslist,
            locgic: this.locgic_form,
          }).then((res) => {
            console.log(res);
            if (res.data.errno === 0 ) {
              this.canelsendout()
              Toast('已发货！')
              this.$message({
                type: 'success',
                message: '成功发货！'
              });
              this.getList()
            }else {
              Toast('未知错误！')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消！'
          });
        });

    },
    canelsendout(){
      this.sendout_logistics_popup = false
      this.locgic_form.compy = ''
      this.locgic_form.compycode = ''
    },
    Sendout(index, row) {
      console.log(index, row);
      this.axios.post('order/findpendpaygoodslist',{
        orderid:row.id
      }).then((res) => {
        console.log(res);
        this.goodslist = res.data.data.goodslist
        this.order_info = res.data.data.goodsPrice
        this.logic_comy_list = res.data.data.logiclist
      })
      this.sendout_logistics_popup = true
    },

    //以下为查看  ////////////////////////////////////////////////////////////////////////
    submitmessage(){
      this.$confirm('此操作将永久修改此信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('order/setpendpaymessage',{
            message: this.message,
            orderid: this.order_info.id
          }).then((res) => {
            console.log(res);
            if (res.data.errno === 0) {
              this.canelmessage()
              this.getList()
              Toast("修改成功!")
            }else{
              this.$message.error("修改失败!")
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改!'
          });
        });
    },
    canelmessage(){
      this.seeorder_popup = false
    },
    Message(index,row){
      console.log(index,row);
      this.seeorder_popup = true
      this.order_info = row
      this.message.buy_mes = this.order_info.postscript
      this.message.admin_mes = this.order_info.admin_message

    },

    //以下为修改收货地址  ////////////////////////////////////////////////////////////////////////
    submitForm(){
      console.log(this.inputAddress);
      console.log(this.RegionCode);
      if (this.inputAddress.phone.length > 11) {
        this.$message.error("手机号错误！")
        return false
      }
      if (this.RegionCode.first == 0 || this.RegionCode.second == 0 ||this.RegionCode.third == 0 ||
      this.inputAddress.name == '' || this.inputAddress.phone == '' || this.inputAddress.address == '') {
        this.$message.error("信息不完整！")
        return false
      }
      this.$confirm('此操作将永久修改该信息(此操作不可逆，但可以多次修改), 是否继续?', '警告！', {
         confirmButtonText: '确定',
         cancelButtonText: '取消',
         type: 'warning'
       }).then(() => {
         this.axios.post('order/setpendpayaddress',{
           address:this.inputAddress,
           regioncode:this.RegionCode,
           orderid:this.order_info.id
         }).then((res) => {
           console.log(res);
           if (res.data.errno === 0) {
             this.enable_chage_address = false
             this.inputAddress.name = ''
             this.inputAddress.phone = ''
             this.inputAddress.address = ''
             this.chage_address_popup = false
             this.getList()
             Toast("修改成功!")
           }
         })
         this.$message({
           type: 'success',
           message: '修改成功!'
         });
       }).catch(() => {
         this.$message({
           type: 'info',
           message: '取消修改!'
         });
       });
    },
    canelForm(){
      this.enable_chage_address = false
      this.inputAddress.name = ''
      this.inputAddress.phone = ''
      this.inputAddress.address = ''
      this.chage_address_popup = false

    },
    firstRegionChage(e){
      console.log(e);
        this.secondRegionvalue = ''
        this.thirdRegionvalue = ''
        this.axios.post('order/findTypeRegion',{
          type: 2,
          id: e
        }).then((res) => {
          console.log(res);
          this.secondRegion = res.data.data.list
        })
        this.RegionCode.first = e
    },
    secondRegionChage(e){
      console.log(e);
        this.thirdRegionvalue = ''
        this.axios.post('order/findTypeRegion',{
          type: 3,
          id: e
        }).then((res) => {
          console.log(res);
          this.thirdRegion = res.data.data.list
        })
        this.RegionCode.second = e
    },
    thirdRegionChage(e){
      this.RegionCode.third = e
    },
    ChageAddress(index, row) {
      this.axios.post('order/findpendpaygoodslist', {
        orderid: row.id
      }).then((res) => {
        console.log(res);
        this.order_info = res.data.data.goodsPrice
        // let obj = {}
        this.order_info.local_time = this.timestampToTime(res.data.data.goodsPrice.add_time)

        this.user_info = res.data.data.user
        console.log(this.user_info);
        console.log(this.order_info);
      })
      this.chage_address_popup = true
    },
    open_chage_address() {
      this.axios.post('order/findTypeRegion',{
        type: 1
      }).then((res) => {
        console.log(res);
        this.firstRegion = res.data.data.list
      })
      this.inputAddress.name = this.order_info.consignee
      this.inputAddress.phone = this.order_info.mobile
      this.inputAddress.address = this.order_info.address
      this.enable_chage_address = true

    },
    close_chage_address() {
      this.inputAddress.name = ''
      this.inputAddress.phone = ''
      this.inputAddress.address = ''
      this.enable_chage_address = false
    },
    ////////////////////////////////////////////////////////////////////
    handlePageChange(val) {
      this.page = val;
      //保存到localStorage
      localStorage.setItem('orderPage', this.page)
      localStorage.setItem('orderFilterForm', JSON.stringify(this.filterForm));
      this.getList()
    },
    handleRowDelete(index, row) {
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.axios.post('order/destory', { id: row.id }).then((response) => {
          console.log(response.data)
          if (response.data.errno === 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });

            this.getList();
          }
        })


      });
    },
    onSubmitFilter() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.axios.post('order/pendoutorder', {
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
.sendout_area_send_logic_value {
  height: 45px;
  line-height: 45px;
  font-size: 15px;
  color: #222;
  font-weight: bold;
  width: 90%;
  margin: auto;
  border-bottom: 1px solid #f4f4f4;
  text-align: center;
}
.sendout_area_send_logic_area {
  /* border:1px solid black; */
  height: auto;
  padding: 10px 0px;
}
.sendout_area_send_logic {
  width: 90%;
  /* border:1px solid black; */
  margin: auto;
  height: auto;
  margin-bottom: 8px;

}
.sendout_area_length {
  /* border:1px solid black; */
  width: 90%;
  margin: auto;
  text-align: right;
  font-size: 12px;
  color: #757575;
  margin-bottom: 10px;
}
.sendout_area_item_price {
  position: absolute;
  /* border:1px solid black; */
  /* width:  */
  right: 2px;
  bottom: 1px;
  font-weight: bold;
  font-size: 18px;
  line-height: 9px;
  color: #ff4444;
}
.sendout_area_item_sku {
  position: absolute;
  /* border:1px solid black; */
  /* width:  */
  left: 58px;
  bottom: 1px;
  font-size: 10px;
  line-height: 10px;
  color: #757575;
  /* max-height: 36px; */
  /* right: 3px; */
}
.sendout_area_item_name {
  position: absolute;
  /* border:1px solid black; */
  /* width:  */
  left: 58px;
  top: 3px;
  font-size: 14px;
  line-height: 17px;
  max-height: 36px;
  right: 3px;
}
.sendout_area_item_img {
  position: absolute;
  width: 52px;
  height: 52px;
  margin: 2px;
}
.sendout_area_item {
  height: 56px;
  position: relative;
  border: 1px solid #f4f4f4;
}
.sendout_area_area {
  width: 90%;
  overflow-y: scroll;
  border: 1px solid #f4f4f4;
  margin: 10px auto;
  max-height: 88px;
}
.sendout_area {
  width: 400px;
  height: auto;
}
.sendout_title {
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
.one_row_overflow {
  /* color: #ff4444 */
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
/* //以下为查看  //////////////////////////////////////////////////////////////////////// */
.see_area {
  width: 400px;
  /* height: 200px; */
}
.see_area_area {
  width: 90%;
  margin-top: 20px;
}
/* //以下为修改收货地址  //////////////////////////////////////////////////////////////////////// */
.ChagePrice_area_title {
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
.ChagePrice_area {
  width: 512px;
  height: auto;
}
.van-modal {
  z-index: 1999 !important;
}
.van-popup {
  z-index: 2000 !important;
}

.ChageAddress_chage_item_select {
  width: 30%;
  float: left;
  margin-left: 7px;
  /* max-width: 30% */
}
.ChageAddress_chage_item {
  width: 90%;
  height: auto;
  padding-top: 10px;
  min-height: 68px;
  /* border: 1px solid black; */
  margin: auto;
  text-align: center;

}
.ChageAddress_area_item_chage_btn {
  position: absolute;
  /* border: 1px solid black; */
  bottom: 5%;
  right: 1%;
  width: 75px;
  font-size: 11px;
  /* line-height: 14px; */
  /* height: 14px; */
}
.ChageAddress_area_item_getphone{
  position: absolute;
  /* border: 1px solid black; */
  bottom: 1px;
  left: 21%;
  font-size: 13px;
  line-height: 14px;
  height: 14px;
}
.ChageAddress_area_item_getaddress {
  position: absolute;
  /* border: 1px solid black; */
  left: 21%;
  top: 1px;
  right: 4px;
  font-size: 14px;
  line-height: 20px;
  max-height: 40px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.ChageAddress_area_item_getname {
  position: absolute;
  left: 0;
  top: 0;
  width: 20%;
  /* border: 1px solid black; */
  height: 56px;
  line-height: 26px;
  text-align: center;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.ChageAddress_area_item {
  position: relative;
  border: 1px solid #ddd;
  height: 56px;
  width: 96%;
  margin: 5px auto;
  margin-bottom: 20px;
}
.ChageAddress_area {
  /* border: 1px solid black; */
  /* height: 55px; */
  height: auto;
  margin: auto;
  width: 95%;
}
.BuyPeople_Info {
  border-bottom: 1px solid #f4f4f4;
  height: 26px;
  line-height: 26px;
  font-size: 14px;
  width: 96%;
  margin: 5px auto;
}


</style>
