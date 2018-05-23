<template lang="html">
  <div class="content-page">
      <div class="content-nav">
          <el-breadcrumb class="breadcrumb" separator="/">
              <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item>订单中心</el-breadcrumb-item>
              <el-breadcrumb-item>待付款订单</el-breadcrumb-item>
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
                  <el-table-column prop="add_localtime" align="center" sortable width="180" label="下单时间">
                  </el-table-column>
                  <el-table-column align="center" sortable width="160" label="收货人">
                    <template scope="scope">
                        <div class="one_row_overflow">
                          {{tableData[scope.$index].consignee}}
                        </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="actual_localprice" align="center" sortable width="140"  label="订单金额(元)">
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
                  <el-table-column label="操作" align="center" width="400">
                      <template scope="scope">
                          <el-button size="small" type="info" :plain="true" @click="Message(scope.$index, scope.row)">留言</el-button>
                          <el-button size="small" type="info" :plain="true" @click="ChageAddress(scope.$index, scope.row)">改地址</el-button>
                          <!-- <el-button size="small" type="info" :plain="true" @click="ChagePrice(scope.$index, scope.row)">改价格</el-button> -->
                          <el-button size="small" type="info" :plain="true" @click="handleRowEdit(scope.$index, scope.row)">查看</el-button>

                          <el-button size="small" type="danger" @click="handleRowDelete(scope.$index, scope.row)">删除</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </div>
          <div class="page-box">
              <el-pagination @current-change="handlePageChange" :current-page="page" :page-size="10" layout="total, prev, pager, next, jumper" :total="total">
              </el-pagination>
          </div>
      </div>
    <!-- // 修改价格弹层 -->
      <van-popup v-model="chage_price_popup">
        <div class="ChagePrice_area">
          <div class="ChagePrice_area_title">
            待付款订单商品列表 <span style="font-size:11px;font-weight:normal;color:#757575;"> (修改价格)</span>
          </div>
          <div class="ChagePrice_area_table">
            <div class="ChagePrice_item" v-for="(item,index) in pendPayGoods_Local">
              <div class="ChagePrice_item_goods_area">
                <img class="ChagePrice_item_goodsimg" :src="item.list_pic_url"></img>
                <div class="ChagePrice_item_goodsname">
                  {{item.goods_name}}
                </div>
                <div class="ChagePrice_item_goodsnum">
                  x{{item.number}}
                </div>
                <div class="ChagePrice_item_goodsprice">
                  <span style="font-size:9px;color:#767676;" >商品原价:</span>
                   ￥{{true_goods_list[ index ].retail_price}}
                   <span v-if="item.morenumber">
                   <span style="font-size:9px;color:#767676;" > 总价:</span>
                   ￥{{true_goods_list[ index ].retail_price * item.number}}
                  </span>
                </div>
                <div class="ChagePrice_item_goodssku">
                  {{item.goods_specifition_name_value}}
                </div>
              </div>
                <div class="ChagePrice_item_chage_area">
                  <div class="ChagePrice_item_chage_area_rel_price" >
                   <span style="font-size:10px;color:#757575;font-weight:bold;" >订单价:</span>
                   <span style="font-weight:bold;color:#ff4444;">
                     ￥{{item.full_price}}</span>
                  </div>
                  <div class="ChagePrice_item_chage_area_chage_price" v-if="item.open_chage_price" >
                  <span style="font-size:10px;color:#333;font-weight:bold;">修改价:</span>
                  <span style="font-weight:bold;color:#ff4444;font-size:14px;">
                    ￥{{item.chaged_price}}</span>
                  </div>
                    <el-button v-if="item.open_chage_price" class="ChagePrice_item_chage_area_chage_btn" size="mini"
                    type="primary" @click="chage_pendGoods_price(item)">修改价格</el-button>
                    <div class="ChagePrice_item_chage_area_chage_price" v-if="!item.open_chage_price" >
                      <input type="number" :min="0" class="ChagePrice_item_chage_area_chage_price_input"
                      v-model="chage_price_input"></input>
                    </div>
                      <el-button v-if="!item.open_chage_price" class="ChagePrice_item_chage_area_chage_btn_sure" size="mini"
                      type="danger" @click="sure_chage_pendGoods_price(item)">完成</el-button>
                      <el-button v-if="!item.open_chage_price" class="ChagePrice_item_chage_area_chage_btn_canel" size="mini"
                      type="text" @click="hide_chage_pendGoods_price(item)">取消</el-button>
                </div>
            </div>
          </div>
          <div class="ChagePrice_area_bottom_lop">
            <span style="font-size:14px;color:#333;font-weight:bold;padding-left:5px;">修改订单总价</span>
            <span style="font-weight:bold;color:#ff4444;font-size:16px;float:right;padding-right:5px;">
              <el-input @change="chageallprice" placeholder="直接修改订单总价" type="number" :min="0" v-model="chage_price_all"></el-input>
              </span>
          </div>
          <div class="ChagePrice_area_bottom_rel">
            <span style="font-size:14px;color:#333;font-weight:bold;padding-left:5px;">订单总价
              <span style="font-size:11px;color:#757575">(未修改):</span></span>
            <span style="font-weight:bold;color:#ff4444;font-size:16px;float:right;padding-right:5px;">
              ￥{{pendFull_Goods_rel_Price}}</span>
          </div>
          <div class="ChagePrice_area_bottom_chaged">
            <span style="font-size:14px;color:#333;font-weight:bold;padding-left:5px;">订单总价
              <span style="font-size:11px;color:#757575">(修改后):</span></span>
            <span style="font-weight:bold;color:#ff4444;font-size:16px;float:right;padding-right:5px;">
              ￥{{pendFull_Goods_chg_Price}}</span>
          </div>
          <div class="ChagePrice_area_bottom_action_btn">
            <el-button size="small" :plain="true" type="primary" @click="reduct_chage_price">还原</el-button>
            <span style="float:right">
              <el-button size="small" :plain="true" type="primary" @click="close_chage_price_popup">取消</el-button>
              <el-button size="small" type="danger" @click="sure_chagePrice">确定</el-button>
            </span>

          </div>
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
              <el-input type="textarea" autosize v-model="message.buy_mes" :placeholder="message.buy_mes_plase"></el-input>
            </el-form-item>
            <el-form-item label="卖家留言：">
              <el-input type="textarea" v-model="message.admin_mes" :placeholder="message.admin_mes_plase"></el-input>
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
  name: "PendPayOrder",
  data() {
    return {
      page: 1,
      total: 0,
      chage_price_all:'',
      message: {
        buy_mes:'',
        admin_mes:'',
        buy_mes_plase: "买家没有留言",
        admin_mes_plase: "卖家没有留言"
      },
      firstRegionvalue: '',
      secondRegionvalue: '',
      thirdRegionvalue: '',
      chage_price_popup: false,
      chage_address_popup: false,
      seeorder_popup:false,
      filterForm: {
        order_sn_input: '',
        consignee_input: ''
      },
      inputAddress: {
        name:'',
        phone: '',
        address: '',
      },
      tableData: [],
      order_info: {},
      user_info: {},
      true_goods_list: [],
      pendPayGoods: [],
      pendPayGoods_Local: [],
      pendFull_Goods_rel_Price: 0,
      pendFull_Goods_chg_Price: 0,
      chage_price_input: '',
      enable_chage_address: false,
      firstRegion:[],
      secondRegion: [],
      thirdRegion: [],
      RegionCode: {
        first:0,
        second:0,
        third:0,
      },
      // firstRegionCode: 0,
      // secondRegionCode: 0,
      // thirdRegionCode: 0
    }
  },
  methods: {
    handleRowEdit(index, row) {
      this.$router.push({ name: 'order_detail', query: { id: row.id } })
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
    // 以下为修改商品价格 ////////////////////////////////////////////////////////////////////////
    chageallprice(e){
      console.log(e);
      for (var i = 0; i < this.pendPayGoods_Local.length; i++) {
        this.pendPayGoods_Local[i].open_chage_price = true
      }
      this.chage_price_all = e
      this.pendFull_Goods_chg_Price = this.chage_price_all
    },
    sure_chagePrice() {
      if (Number(this.pendFull_Goods_chg_Price) > Number(this.pendFull_Goods_rel_Price)) {
        Toast("修改价格大于订单总价，你是认真的吗？")
        return false
      }
      console.log(this.pendFull_Goods_chg_Price);
      this.$confirm('此操作将永久修改此信息(无法撤销且只能修改一次 ！！ ！！), 是否继续?', '警告!', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('order/setpendpaygoods', {
          list: this.pendPayGoods_Local,
          all_price: this.pendFull_Goods_chg_Price
        }).then((res) => {
          console.log(res);
          if (res.data.errno === 0) {
            Toast('修改成功!')
            this.close_chage_price_popup()

          }
        })
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改！'
        });
      });
      // }
    },
    reduct_chage_price() {
      console.log(this.pendPayGoods_Local);
      for (var i = 0; i < this.pendPayGoods_Local.length; i++) {
        // array[i]
        this.pendPayGoods_Local[i].chaged_price = this.pendPayGoods_Local[i].full_price
        this.pendFull_Goods_chg_Price = this.pendFull_Goods_rel_Price
        this.pendPayGoods_Local[i].open_chage_price = true
      }
      Toast("已还原")
      // console.log(this.pendPayGoods_Local_before);
      // console.logthis.pendPayGoods_Local_before
      // this.pendPayGoods_Local = this.pendPayGoods_Local_before
    },
    hide_chage_pendGoods_price(item) {
      for (var i = 0; i < this.pendPayGoods_Local.length; i++) {
        // array[i]
        if (this.pendPayGoods_Local[i].goods_id === item.goods_id) {
          this.pendPayGoods_Local[i].open_chage_price = true
          // console.log(this.pendPayGoods_Local);
        }
      }
    },
    chage_pendGoods_price(item) {
      console.log(item);
      for (var i = 0; i < this.pendPayGoods_Local.length; i++) {
        // array[i]
        if (this.pendPayGoods_Local[i].id === item.id) {
          this.pendPayGoods_Local[i].open_chage_price = false
        }
      }

    },
    close_chage_price_popup() {
      this.chage_price_popup = false
      this.getList()
    },
    chage_pendGoods_price(item) {
      console.log(item);
      for (var i = 0; i < this.pendPayGoods_Local.length; i++) {
        // array[i]
        if (this.pendPayGoods_Local[i].goods_id === item.goods_id) {
          this.pendPayGoods_Local[i].open_chage_price = false
          console.log(this.pendPayGoods_Local);

        }
      }
      this.chage_price_input = ''

    },
    sure_chage_pendGoods_price(item) {
      console.log(item);
      if (this.chage_price_input == '') {
        Toast('没有输入内容,请点击左侧取消！')
        // this.$message.error('没有内容,已取消修改！');
        return false
      }
      if (Number(this.chage_price_input) < 1) {
        Toast('修改价格不能小于 1！')
        this.chage_price_input = ''
        // this.$message.error('没有内容,已取消修改！');
        return false
      }
      // if (Number(this.chage_price_input) < 0) {
      //   Toast('修改价格不能小于零！')
      //   this.chage_price_input = ''
      //   // this.$message.error('没有内容,已取消修改！');
      //   return false
      // }

      for (var i = 0; i < this.pendPayGoods_Local.length; i++) {
        // array[i]
        if (this.pendPayGoods_Local[i].goods_id === item.goods_id) {
          // if (Number(this.chage_price_input) < Number(this.pendPayGoods_Local[i].number)) {
          //   Toast('修改价格不能小于该商品的最低件数！')
          //   return false
          // }else {
          this.pendPayGoods_Local[i].open_chage_price = true
          this.pendPayGoods_Local[i].chaged_price = this.chage_price_input
          let a = 0
          for (var j = 0; j < this.pendPayGoods_Local.length; j++) {
            a = Number(a) + Number(this.pendPayGoods_Local[j].chaged_price)
          }
          this.pendFull_Goods_chg_Price = a
          // }

        }
      }
      this.chage_price_input = ''
    },
    handlePageChange(val) {
      this.page = val;
      //保存到localStorage
      localStorage.setItem('orderPage', this.page)
      localStorage.setItem('orderFilterForm', JSON.stringify(this.filterForm));
      this.getList()
    },
    ChagePrice(index, row) {
      // this.$router.push({ name: 'order_detail', query: { id: row.id } })
      console.log(index, row);
      this.axios.post('order/findpendpaygoodslist', {
        orderid: row.id
      }).then((res) => {
        console.log(res);
        console.log(res.data.data.goodslist);
        this.pendPayGoods = res.data.data.goodslist
        this.true_goods_list = res.data.data.true_list
        this.pendPayGoods_Local = []
        // let a = 0
        for (var i = 0; i < res.data.data.goodslist.length; i++) {
          // array[i]
          let goods = res.data.data.goodslist[i]
          let obj = {}
          obj.list_pic_url = goods.list_pic_url
          obj.goods_name = goods.goods_name
          obj.number = goods.number
          obj.morenumber = goods.number > 1 ? true : false
          obj.retail_price = goods.retail_price
          obj.goods_specifition_name_value = goods.goods_specifition_name_value
          obj.order_id = goods.order_id
          obj.goods_id = goods.goods_id
          obj.goods_specifition_ids = goods.goods_specifition_ids
          obj.open_chage_price = true
          obj.id = goods.id
          obj.full_price = Number(goods.retail_price)
          obj.chaged_price = Number(goods.retail_price)
          this.pendPayGoods_Local.push(obj)
          // this.pendPayGoods_Local_before.push(obj)
          // a = Number(a) + Number(goods.retail_price) * Number(goods.number)
        }
        this.pendFull_Goods_rel_Price = res.data.data.goodsPrice.actual_price
        this.pendFull_Goods_chg_Price = res.data.data.goodsPrice.actual_price
      })
      this.chage_price_popup = true

    },
    handleRowDelete(index, row) {
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        this.axios.post('order/destory', {
          id: row.id
        }).then((response) => {
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
      this.axios.post('order/pendpayorder', {
        // params: {
        page: this.page,
        orderSn: this.filterForm.order_sn_input,
        consignee: this.filterForm.consignee_input,
        // }
      }).then((response) => {
        console.log(response);
        // Toast("已刷新！")
        this.$message({
          message: '已刷新！',
          type: 'success'
        });
        this.tableData = response.data.data.data
        for (var i = 0; i < this.tableData.length; i++) {
          this.tableData[i].add_localtime = this.timestampToTime(this.tableData[i].add_time)
          this.tableData[i].actual_localprice = (this.tableData[i].actual_price / 1).toFixed(2)
        }
        this.page = response.data.data.currentPage
        this.total = response.data.data.count
      })
    },
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + '/';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
      var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '  ';
      var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
      var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
      var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
      return Y + M + D + h + m + s;
    }
  },
  components: {

  },
  mounted() {
    this.getList();
  }
}
</script>

<style lang="css" >
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



/* // 以下为修改商品价格 //////////////////////////////////////////////////////////////////////// */
.van-modal {
  z-index: 1999 !important;
}
.van-popup {
  z-index: 2000 !important;
}
.el-input__inner {
  /* height: 18px !important; */
  /* text-align: center !important; */
  /* font-size: 12px !important; */
}
.ChagePrice_item_chage_area_chage_price_input {
  position: absolute;
  top: -2px;
  left: 5%;
  /* height: 18px !important;
  text-align: center !important;
  font-size: 12px !important; */
  width: 90% !important;

}
.ChagePrice_area_bottom_action_btn {
  width: 96%;
  margin: auto;
  /* border-bottom: 1px solid #ddd; */
  /* border:1px solid black; */
  /* margin: 5px 0; */
  margin-top: 11px;
  margin-bottom: 7px;
}
.ChagePrice_area_bottom_chaged {
  width: 96%;
  margin: auto;
  border-bottom: 1px solid #ddd;
  /* border:1px solid black; */
  /* margin: 5px 0; */
  margin-top: 11px;
}
.ChagePrice_area_bottom_rel {
  width: 96%;
  margin: auto;
  /* border:1px solid black; */
  border-bottom: 1px solid #ddd;
  /* margin: 5px 0; */
  margin-top: 25px;
}
.ChagePrice_area_bottom_lop {
  width: 96%;
  margin: auto;
  /* border:1px solid black; */
  border-bottom: 1px solid #ddd;
  /* margin: 5px 0; */
  margin-top: 25px;
  height:44px;
  line-height: 40px;
}
.ChagePrice_item_chage_area_chage_btn_canel {
  position: absolute;
  /* border:1px solid black; */
  font-size: 11px;
  width: 40%;
  height: 20px;
  line-height: 20px;
  text-align: center;
  bottom: 3px;
  left: 3px;
  padding: 0 !important;
  margin: 0 !important;
}
.ChagePrice_item_chage_area_chage_btn_sure {
  position: absolute;
  /* border:1px solid black; */
  font-size: 11px;
  width: 48%;
  height: 20px;
  line-height: 20px;
  text-align: center;
  bottom: 3px;
  right: 0;
  padding: 0;
}
.ChagePrice_item_chage_area_chage_btn {
  position: absolute;
  /* border:1px solid black; */
  font-size: 11px;
  width: 70%;
  height: 20px;
  line-height: 20px;
  text-align: center;
  bottom: 3px;
  right: 0;
  padding: 0;

}
.ChagePrice_item_chage_area_chage_price {
  position: absolute;
  /* border:1px solid black; */
  font-size: 12px;
  width: 100%;
  height: 16px;
  line-height: 16px;
  text-align: center;
  top: 24px;
  right: 0;
}
.ChagePrice_item_chage_area_rel_price {
  position: absolute;
  /* border:1px solid black; */
  font-size: 12px;
  width: 100%;
  height: 16px;
  line-height: 16px;
  text-align: center;
  top: 5px;
  right: 0;
}
.ChagePrice_item_goodssku {
  position: absolute;
  /* border:1px solid black; */
  left: 68px;
  bottom: 2px;
  /* right: 5px; */
  /* top: 22px; */
  font-size: 11px;
  color: #757575;
  /* color: #ff4444; */
  /* font-weight: bold; */
}
.ChagePrice_item_goodsprice {
  position: absolute;
  /* border:1px solid black; */
  /* left: 68px; */
  /* bottom: 0; */
  right: 5px;
  bottom: 2px;
  font-size: 15px;
  color: #ff4444;
  font-weight: bold;
}
.ChagePrice_item_goodsnum {
  position: absolute;
  /* border:1px solid black; */
  right: 5px;
  top: 35px;
  height: 15px;
  line-height: 15px;
  font-size: 13px;
  /* color: #ff4444; */
  /* font-weight: bold; */
}
.ChagePrice_item_goodsname {
  position: absolute;
  /* border:1px solid black; */
  left: 68px;
  top: 3px;
  right: 5px;
  font-size: 15px;
  line-height: 19px;
  max-height: 40px;
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

}
.ChagePrice_item_goodsimg {
  position: absolute;
  /* border:1px solid black; */
  width: 64px;
  height: 64px;
  margin: 2px;
}
.ChagePrice_item_chage_area {
  /* border: 1px solid black; */
  position: absolute;
  width: 20%;
  right: 0;
  top: 0;
  height: 68px;

}
.ChagePrice_item_goods_area{
  position: relative;
  width: 80%;
  height: 68px;
}
.ChagePrice_item {
  position: relative;
  width: 100%;
  height: 68px;
  border:1px solid #f1f1f1;
}
.ChagePrice_area_table {
  /* border:1px solid black; */
  width: 96%;
  max-height: 232px;
  margin: 5px auto;
  overflow-y: auto;
  /* overflow-y: hidden; */
}
/* .wp::-webkit-scrollbar {
    display: none;
} */
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
.one_row_overflow {
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
