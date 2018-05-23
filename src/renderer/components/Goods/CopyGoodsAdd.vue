<template>
<div class="content-page" ref="element">
  <div class="content-nav">
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{infoForm.id ? '编辑商品' : '添加商品'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="operation-nav">
      <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
    </div>
  </div>
  <div class="content-main">
    <div class="form-table-box">
      <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
        <el-form-item label="所属分类">
          <el-select v-model="FirstCategoryName" placeholder="请选择所属一级分类" @change="firstCategorychange">
            <el-option v-for="item in FirstCategory" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="SecondCategoryName" placeholder="请选择所属二级分类" @change="secondCategorychange">
            <el-option v-for="item in SecondCategory" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input type="textarea" v-model="GoodsName"></el-input>
        </el-form-item>
        <el-form-item label="商品简介">
          <el-input type="textarea" v-model="GoodsDesc" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="商品主图">
          <el-upload action="http://upload.qiniup.com" :data="uploadToken" list-type="picture-card" limit=1 :onError="MainImguploadError" :on-success="MainImgSuccess" :headers="uploaderHeader" :file-list="GoodsMainImg">
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- <el-dialog :visible.sync="dialogVisibletwo">
              <img width="100%" :src="GoodsMainImg" alt="">
            </el-dialog> -->
          <div class="form-tip">图片尺寸：750*420 && 请不要上传超过两张！！</div>
        </el-form-item>
        <el-form-item label="商品主页轮播图">
          <el-upload action="http://upload.qiniup.com" list-type="picture-card" :data="uploadToken" :on-preview="loophandlePictureCardPreview1" :on-remove="loophandleRemove" :on-success="loophandlesuccess" :file-list="LoopList">
            <!-- <el-upload
              action="http://upload.qiniup.com"
              list-type="picture-card"
              :data="uploadToken"
              :headers = "uploaderHeader"
              :on-preview="handlePictureCardPreview1"
              :on-remove="LoophandleRemove"
              :on-success="Loophandlesuccess"
              :file-list="LoopList"
              > -->
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
          <!-- <el-upload
              action="http://127.0.0.1:8360/admin/upload/brandPic"
              list-type="picture-card"
              :headers="uploaderHeader"
              :on-success="LoopImgSuccess"
              :file-list = "GoodsLoopImg">
              <i class="el-icon-plus"></i>
            </el-upload> -->
          <!-- <el-dialog :visible.sync="dialogVisibletwo">
              <img width="100%" :src="GoodsLoopImg" alt="">
            </el-dialog> -->
          <div class="form-tip">图片尺寸：750*420</div>
        </el-form-item>
        <el-form-item label="商品详情">
          <!-- <quill-editor ref="myTextEditor"
               :content="GoodsParticEdit"
               @change="onEditorChange($event)">
            </quill-editor> -->



          <template>
                <div>
                    <!-- 图片上传组件辅助-->
                    <el-upload
                            class="avatar-uploader"
                            action="http://upload.qiniup.com"
                            :data="uploadToken"
                            :headers="header"
                            :show-file-list="false"
                            :on-success="detailhandlesuccess"
                            :on-error="uploadError"
                            :before-upload="beforeUpload">
                    </el-upload>
                    <!--富文本编辑器组件-->
                   <el-row v-loading="quillUpdateImg">
                    <quill-editor
                            v-model="GoodsParticEdit"
                            ref="myQuillEditor"
                            :options="editorOption"
                            @change="onEditorChange($event)"
                    >
                    </quill-editor>
                   </el-row>
                </div>
            </template>










        </el-form-item>
        <el-form-item label="删除原有规格">
          <template>
              <el-radio-group v-model="radio">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="2">否</el-radio>
              </el-radio-group>
            </template>
          <!-- <el-button @click="abc" type="success">成功按钮</el-button> -->
          <div class="form-tip">
            此版本只支持删除重建，查看规格和修改规格将在下个版本开启！ 请谨慎操作！
          </div>
        </el-form-item>
        <el-form-item v-if="radio == 1" label="商品规格">
          <el-row :gutter="3">
            <el-col :span="7" v-show="showFirst">
              <el-form-item>
                <el-input placeholder="请输入第一种规格名" @keyup.native="show()" v-model="dynamicFirstForm.name"></el-input>
              </el-form-item>
              <el-form-item v-for="(list, index) in dynamicFirstForm.list">
                <el-input v-model="list.value" @keyup.native="show()" :placeholder="'规格值'+index" style="width:80%;float:left;margin-top:5px;"></el-input>
                <el-button style="width:20%;padding:10px 0;margin-top:5px;" v-if="index > 0" @click.prevent="removefirstList(list)">删除</el-button>

              </el-form-item>
              <el-button size="small" style="float:left;margin-top:8.5px;" @click="addlistfirst">新增规格值</el-button>
              <el-button size="small" style="float:right;margin-top:8.5px;" @click="addSpecfirst">新增规格</el-button>
            </el-col>
            <el-col :span="7" v-show="showSecond">
              <el-form-item>
                <el-input placeholder="请输入第二种规格名" @keyup.native="show()" v-model="dynamicSecondForm.name"></el-input>
              </el-form-item>
              <el-form-item v-for="(list, index) in dynamicSecondForm.list">
                <el-input v-model="list.value" @keyup.native="show()" :placeholder="'规格值'+index" style="width:80%;float:left;margin-top:5px;"></el-input>
                <el-button style="width:20%;padding:10px 0;margin-top:5px;" v-if="index > 0" @click.prevent="removesecondList(list)">删除</el-button>

              </el-form-item>
              <el-button size="small" style="float:left;margin-top:8.5px;" @click="addlistsecond">新增规格值</el-button>
              <el-button size="small" style="float:right;margin-top:8.5px;" @click="delSpecsecond('second')">删除规格</el-button>
            </el-col>
            <el-col :span="7" v-show="showThird">
              <el-form-item>
                <el-input placeholder="请输入第三种规格名" @keyup.native="show()" v-model="dynamicThirdForm.name"></el-input>
              </el-form-item>
              <el-form-item v-for="(list, index) in dynamicThirdForm.list">
                <!-- :key="list.key"
                :prop="'list.' + index + '.value'" -->
                <el-input v-model="list.value" @keyup.native="show()" :placeholder="'规格值'+index" style="width:80%;float:left;margin-top:5px;"></el-input>
                <el-button style="width:20%;padding:10px 0;margin-top:5px;" v-if="index > 0" @click.prevent="removethirdList(list)">删除</el-button>

              </el-form-item>
              <el-button size="small" style="float:left;margin-top:8.5px;" @click="addlistthird">新增规格值</el-button>
              <el-button size="small" style="float:right;margin-top:8.5px;" @click="delSpecsecond('third')">删除规格</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="radio == 1">
          <div class="form-tip">
            提示：务必先确定商品规格名称和规格值再修改规格明细，否则会导致规格明细内容消失！
          </div>
        </el-form-item>
        <el-form-item v-if="radio == 1" label="规格明细">
          <el-table :data="tableData" class="tb-edit" style="width: 100%" highlight-current-row>
            <el-table-column :label="first1" prop="first1" v-model="first1prop">
            </el-table-column>
            <el-table-column :label="first2" prop="first2" v-model="first2prop" v-if="showSecond">
            </el-table-column>
            <el-table-column :label="first3" prop="first3" v-model="first3prop" v-if="showThird">
            </el-table-column>
            <el-table-column label="价格" prop="price">
              <template slot-scope="scope">
                                <!-- @keyup.native="pricekeyp()"  -->
                                <el-input size="small"   type="number" @change="SyncPrice()"  v-model="tableData[scope.$index].price"
                                  placeholder="请输入价格" >
                                </el-input>
                              </template>
            </el-table-column>
            <el-table-column label="库存" prop="stock">
              <template scope="scope">
                                <el-input size="small" type="number" @change="SyncStock()" v-model="tableData[scope.$index].stock"
                                  placeholder="请输入库存">
                                </el-input>
                              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item v-if="radio == 1" label="批量设置">
          <el-row>
            <el-col :span="6">
              <el-input type="number" @change="SetAllPrice()" v-model="setallprice" placeholder="批量设置价格">
              </el-input>
            </el-col>
            <el-col :span="6" style="margin-left:20px;">
              <el-input type="number" @change="SetAllStock()" v-model="setallstock" placeholder="批量设置库存">
              </el-input>
            </el-col>
          </el-row>


          <div class="form-tip">
            修改规格名称和规格值之后请重新设置，请输入整数
          </div>
        </el-form-item>
        <el-form-item label="价格">
          <el-input type="number" :min="1" v-model="GoodsPrice" @change="changePrices()" placeholder="设置价格"></el-input>
          <div class="form-tip">
            此价格为显示在商品列表中的价格，<span style="color:#ff6666;">默认为规格种类的价格最小值</span>
          </div>
        </el-form-item>
        <el-form-item label="划线价">
          <el-input type="number" :min="1" v-model="GoodsExprice" placeholder="设置划线价"></el-input>
          <div class="form-tip">
            此价格为显示在商品页中的<span style="color:#ff6f00;">真实价格旁边被划掉的价格,例如
                  <span style="color:#757575;text-decoration:line-through;">￥988</span></span> ，
            <span style="color:#ff6666;">默认为价格值增加100</span>
          </div>
        </el-form-item>
        <el-form-item label="库存">
          <el-input type="number" :min="0" v-model="GoodsStock" placeholder="设置库存"></el-input>
          <div class="form-tip">
            此库存为显示在商品列表中的库存，<span style="color:#ff6666;">默认为规格种类的库存最小值</span>
          </div>
        </el-form-item>
        <el-form-item label="上架">
          <el-switch on-text="" off-text="" v-model="GoodsIsOnSale"></el-switch>
        </el-form-item>
        <el-form-item label="新品">
          <el-switch on-text="" off-text="" v-model="GoodsIsNew"></el-switch>
          <!-- <div class="form-tip">勾选新品会让其显示在首页</div> -->
        </el-form-item>
        <el-form-item label="人气">
          <el-switch on-text="" off-text="" v-model="GoodsIsHot"></el-switch>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="GoodsSortOrder" :min="1" :max="1000"></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitInfo">确定保存</el-button>
          <el-button @click="goBackPage">取消</el-button>
        </el-form-item>
      </el-form>
      <div id="editorElem" style="text-align:left"></div>
      <!-- <button v-on:click="getContent">查看内容</button> -->
    </div>
    <div id='goTop' @click='goTop' v-show='toTop'>
      <i class="el-icon-d-arrow-right"></i>
    </div>
    <div id='goBottom' @click='goBottom' v-show='toBottom'>
      <i class="el-icon-d-arrow-right"></i>
    </div>
  </div>


</div>
</template>

<script>
import api from '@/config/api';
import E from 'wangeditor';
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  // ['blockquote', 'code-block'],

  [{
    'header': 1
  }, {
    'header': 2
  }], // custom button values
  [{
    'list': 'ordered'
  }, {
    'list': 'bullet'
  }],
  [{
    'script': 'sub'
  }, {
    'script': 'super'
  }], // superscript/subscript
  // [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
  // [{'direction': 'rtl'}],                         // text direction

  // [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
  // [{'header': [1, 2, 3, 4, 5, 6, false]}],

  // [{'color': []}, {'background': []}],          // dropdown with defaults from theme
  // [{'font': []}],
  [{
    'align': 'center'
  }],
  ['image', 'video'],
  ['clean'] // remove formatting button
]
export default {
  data() {
    return {
      // stop:false,                               // 全局变量,坑处
      // timer:null,
      toTop: false,
      toBottom: true,
      setallprice: '',
      GoodsExprice: 1,
      setallstock: '',
      uploadToken: {
        token: "",
      },
      // GoodsMainImg: api.api.GoodsMainImg,
      // GoodsLoopImg: api.api.GoodsLoopImg,
      // GoodsDetailImg: api.api.GoodsDetailImg,
      // GoodsMainImgUrl: "",
      // GoodsLoopImgUrl: "",
      // GoodsDetailImgUrl: "",
      dialogImageUrl: '',
      LoopList: [],
      LoopListRes: [],
      dialogVisible: false,
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      //        serverUrl: '',  // 这里写你要上传的图片服务器地址
      //        header: {token: sessionStorage.token},  // 有的图片服务器要求请求头需要有token之类的参数，写在这里
      //        detailContent: '', // 富文本内容
      //        editorOption: {},  // 富文本编辑器配置
      // 这里写你要上传的图片服务器地址
      header: {
        'X-Nideshop-Token': localStorage.getItem('token') || '',
      }, // 有的图片服务器要求请求头需要有token之类的参数，写在这里
      // detailContent: '', // 富文本内容
      editorOption: {
        placeholder: '',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              'image': function(value) {
                if (value) {
                  // 触发input框选择图片文件
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false);
                }
              }
            }
          }
        }
      },





      chushilength: 0,
      FirstCategoryName: '',
      SecondCategoryName: '',
      // editorOption:'',
      radio: 2,
      LoopImgLength: 0,
      GoodsId: 0,
      titleData: [],
      FirstCategory: [],
      SecondCategory: [],
      FirstCategoryId: '',
      // FirstCategoryName:'',
      SecondCategoryId: '',
      SecondSecondCategoryId: '',
      // SecondCategoryName: '',
      GoodsDetailInfo: "",
      GoodsName: '',
      GoodsDesc: '',
      GoodsStock: 1,
      GoodsPrice: 1,
      GoodsSortOrder: 1,
      GoodsIsOnSale: true,
      GoodsIsNew: false,
      GoodsIsHot: false,
      GoodsMainImg: [],
      GoodsLoopImg: [],
      GoodsParticEdit: "",
      dialogVisible: false,
      dialogVisibletwo: false,
      SecondCategory: [],
      tableData: [],
      columnData: {},
      first1prop: [],
      first2prop: [],
      first3prop: [],
      looprow: 0,
      first1: "",
      first2: "",
      first3: "",
      showFirst: true,
      showSecond: false,
      showThird: false,
      dynamicForm: {},
      dynamicFirstForm: {
        list: [{
          value: ''
        }],
        name: ''
      },
      dynamicSecondForm: {
        list: [{
          value: ''
        }],
        name: ''
      },
      dynamicThirdForm: {
        list: [{
          value: ''
        }],
        name: ''
      },
      uploaderHeader: {
        'X-Nideshop-Token': localStorage.getItem('token') || '',
        // 'Access-Control-Allow-Origin:*',
      },
      parentCategory: [],
      checkList: [],
      infoForm: {
        id: 0,
        name: "",
        retail_price: 0,
        list_pic_url: '',
        simple_desc: '',
        pic_url: '',
        sort_order: 100,
        is_show: true,
        floor_price: 0,
        app_list_pic_url: '',
        is_new: false,
        new_pic_url: "",
        new_sort_order: 10
      },
      infoRules: {
        name: [{
          required: true,
          message: '请输入',
          trigger: 'blur'
        }, ],
        // table: [
        //   { required: true, message: '请输入', trigger: 'blur' },
        // ],
        // price: [
        //   { required: true, message: '请输入价格', trigger: 'blur' },
        // ],

        // parent_id: [
        //   { required: true, message: '请选择分类', trigger: 'blur' },
        // ],
        goods_brief: [{
          required: true,
          message: '请输入简介',
          trigger: 'blur'
        }, ],
        // list_pic_url: [
        //   { required: true, message: '请选择商品图片', trigger: 'blur' },
        // ],
      },
    }
  },
  created() {
    // console.log(api.api.GoodsMainImg);
    // console.log(api.api.GoodsLoopImg);
    // console.log(api.api.GoodsDetailImg);

    // console.log(this.GoodsMainImg);
    // console.log(this.GoodsLoopImg);
    // console.log(this.GoodsDetailImg);
    // console.log(this.GoodsMainImg);
    this.GoodsMainImgUrl = String(api.api.GoodsMainImg);
    this.GoodsLoopImgUrl = String(api.api.GoodsLoopImg);
    this.GoodsDetailImgUrl = String(api.api.GoodsDetailImg);
    console.log(this.GoodsMainImgUrl);
    console.log(this.GoodsLoopImgUrl);
    console.log(this.GoodsDetailImgUrl);
    // console.log(this.GoodsDetailImg);
  },
  updated() {
    let dynamicForm = {}
    dynamicForm.FirstForm = this.dynamicFirstForm
    dynamicForm.SecondForm = this.dynamicSecondForm
    dynamicForm.ThirdForm = this.dynamicThirdForm
    this.dynamicForm = dynamicForm
    this.first1 = dynamicForm.FirstForm.name
    this.first2 = dynamicForm.SecondForm.name
    this.first3 = dynamicForm.ThirdForm.name
    this.looprow = dynamicForm.FirstForm.list.length * dynamicForm.SecondForm.list.length * dynamicForm.ThirdForm.list.length
    this.first1prop = dynamicForm.FirstForm.list
    this.first2prop = dynamicForm.SecondForm.list
    this.first3prop = dynamicForm.ThirdForm.list
    // this.modepricestock()
  },
  methods: {
    goBottom() {
      var height = this.$refs.element.getBoundingClientRect().height;
      console.log(height);
      // let allHeight = document.documentElement.scrollTop || document.body.scrollTop;  // 得到当前高度
      // console.log(allHeight);
      console.log(document.body.scrollTop + document.body.clientHeight);
      if ((document.body.scrollTop + document.body.clientHeight) == (height + 90)) {
        // console.log("到达底部");
      }
      console.log("xiahua ");

      let stop = false; // 全局变量,坑处
      let timer = null;
      clearInterval(timer);
      timer = setInterval(function() {
        // this.toTop = false

        let curHeight = document.documentElement.scrollTop || document.body.scrollTop; // 得到当前高度
        var now = curHeight;
        var speed = (height - curHeight - 100) / 12; // 随着高度减速
        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
        console.log(`当前的高度应该是:` + curHeight);

        if ((document.body.scrollTop + document.body.clientHeight) == (height + 90)) {
          //当前高度为零,停止这次计时器
          clearInterval(timer); // C1
        }
        document.documentElement.scrollTop = curHeight + speed; //直接给高度赋值,会调用needtotop方法
        document.body.scrollTop = curHeight + speed; //谷歌的
        stop = false; // A
      }, 30);
    },
    needToTop() {
      if (document.documentElement.scrollTop > 300 || document.body.scrollTop > 300) {
        this.toTop = true
        this.toBottom = false
      } else {
        this.toTop = false
        this.toBottom = true
      }
      var height = this.$refs.element.getBoundingClientRect().height;
      console.log(height);
      if ((document.body.scrollTop + document.body.clientHeight) > (height - 90)) {
        // console.log("到达底部");
        this.toTop = true
        this.toBottom = false
      } else {
        this.toTop = false
        this.toBottom = true
      }
      // console.log("111");
    },
    goTop() {
      let stop = false; // 全局变量,坑处
      let timer = null;
      clearInterval(timer);
      timer = setInterval(function() {
        let curHeight = document.documentElement.scrollTop || document.body.scrollTop; // 得到当前高度
        var now = curHeight;
        var speed = (0 - now) / 10; // 随着高度减速
        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
        console.log(`当前的高度应该是:` + curHeight);
        if (curHeight === 0) { //当前高度为零,停止这次计时器
          clearInterval(timer); // C1
        }
        document.documentElement.scrollTop = curHeight + speed; //直接给高度赋值,会调用needtotop方法
        document.body.scrollTop = curHeight + speed; //谷歌的
        stop = false; // A
      }, 30);
    },
    changePrices() {
      this.GoodsExprice = parseInt(this.GoodsPrice) + 100
    },
    SyncPrice() {
      // console.log(this.tableData);
      // var PriceList = []
      var minprice = this.tableData[0].price
      for (var i = 0; i < this.tableData.length; i++) {
        // console.log(this.tableData[i].price);
        if ((this.tableData[i].price - minprice) < 0) {
          minprice = this.tableData[i].price
          // console.log("hahah "+this.tableData[i].price);
        }
        // let opi = {}
        // opi = this.tableData[i].price
        // PriceList.push(opi)
      }
      // console.log(minprice);
      this.GoodsPrice = minprice
      this.GoodsExprice = parseInt(minprice) + 100
      // console.log(PriceList);
    },
    SyncStock() {
      // console.log(this.tableData);
      // var PriceList = []
      var minstock = this.tableData[0].stock
      for (var i = 0; i < this.tableData.length; i++) {
        // console.log(this.tableData[i].price);
        if ((this.tableData[i].stock - minstock) < 0) {
          minstock = this.tableData[i].stock
          // console.log("hahah "+this.tableData[i].price);
        }
        // let opi = {}
        // opi = this.tableData[i].price
        // PriceList.push(opi)
      }
      // console.log(minstock);
      this.GoodsStock = minstock
      // console.log(PriceList);
    },
    // syncinfo(){
    //   console.log("123");
    // },
    SetAllPrice() {
      // console.log(this.SetAllStock);
      for (var i = 0; i < this.tableData.length; i++) {
        this.tableData[i].price = this.setallprice
      }
      this.GoodsPrice = this.setallprice
      // var price = Number(this.setallprice)
      this.GoodsExprice = parseInt(this.setallprice) + 100
      // console.log(this.GoodsExprice);
    },
    SetAllStock() {
      for (var i = 0; i < this.tableData.length; i++) {
        this.tableData[i].stock = this.setallstock
      }
      this.GoodsStock = this.setallstock
    },
    loophandlesuccess(res, file) {
      console.log(res);
      var imageUrl = 'http://resource.bbgshop.com/' + res.key
      let fileUrl = {}
      let list = {}
      list.fileUrl = imageUrl
      this.LoopListRes.push(list)
      console.log(this.LoopListRes);

    },
    loophandleRemove(file, fileList) {
      console.log(fileList);
      this.LoopListRes = []
      for (var i = 0; i < fileList.length; i++) {
        // array[i]
        let list = {}
        let fileUrl = {}
        list.fileUrl = fileList[i].url
        // console.log(fileList[0].response);
        this.LoopListRes.push(list)

      }
      console.log(this.LoopListRes);
    },
    loophandlePictureCardPreview1(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    gettoken() {
      // console.log("12163546498764131");
      this.axios.post('upload/token').then((res) => {
        console.log(res);
        this.uploadToken.token = res.data.data.uploadToken
      })
    },
    // GoodsMainImg(){
    //   return api.api.GoodsMainImg
    // },
    // GoodsLoopImg(){
    //   return api.api.GoodsLoopImg
    // },
    // GoodsDetailImg(){
    //   return api.api.GoodsDetailImg
    // },

    beforeUpload() {
      // 显示loading动画
      this.quillUpdateImg = true
    },

    detailhandlesuccess(res, file) {
      // res为图片服务器返回的数据
      console.log(res, file);
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill
      // 如果上传成功
      if (res) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, 'image', 'http://resource.bbgshop.com/' + res.key)
        // 调整光标到最后
        quill.setSelection(length + 1)
      } else {
        this.$message.error('图片插入失败')
      }
      // loading动画消失
      this.quillUpdateImg = false
    },

    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false
      this.$message.error('图片插入失败as asd asd ')
    },





    onEditorChange(e) {
      this.GoodsParticEdit = e.html
      console.log(this.GoodsParticEdit);
    },
    MainImgSuccess(res, file) {
      console.log(res);
      this.GoodsMainImg[0] = 'http://resource.bbgshop.com/' + res.key
    },
    // LoopImgSuccess(response, file, fileList){
    //   this.GoodsLoopImg = []
    //   var filerrr = fileList
    //   for (var i = 0; i < this.LoopImgLength; i++) {
    //     filerrr[i].response = {}
    //     filerrr[i].response.data = {}
    //     filerrr[i].response.data.fileUrl = filerrr[i].url
    //     console.log(filerrr[i]);
    //     this.GoodsLoopImg.push(filerrr[i])
    //   }
    //   for (var j = 0; j < (filerrr.length - this.LoopImgLength); j++) {
    //     this.GoodsLoopImg.push(filerrr[j])
    //   }
    //   console.log(this.GoodsLoopImg);
    // },
    MainImguploadError(e, file, filelist) {
      console.log(e, file, filelist);
    },
    secondCategorychange(secondId) {
      this.SecondCategoryId = secondId
    },
    show() {
      var len = this.looprow;
      for (var i = 0; i < len; i++) {
        var item = {
          price: '',
          stock: ''
        };
        this.tableData.push(item);
      }

      function Cartesian(a, b) {
        var ret = [];
        // console.log(a+" "+b);
        for (var i = 0; i < a.length; i++) {
          for (var j = 0; j < b.length; j++) {
            ret.push(array(a[i], b[j]));
          }
        }
        return ret;
      }

      function array(a, b) {
        var ret = [];
        if (!(a instanceof Array)) {
          ret = Array.call(null, a);
        } else {
          ret = Array.apply(null, a);
        }
        ret.push(b);
        return ret;
      }

      function multiCartesian(data) {
        var len = data.length;
        // console.log(len);
        if (len == 0) {
          return [];
        } else if (len == 1) {
          return data[0];
        } else {
          var ret = data[0];
          for (var i = 1; i < len; i++) {
            ret = Cartesian(ret, data[i]);
          }
          return ret;
        }
      }
      if (this.showFirst == true && this.showSecond == false && this.showThird == false) {
        var data = [this.first1prop];

      } else if (this.showFirst == true && this.showSecond == true && this.showThird == false) {
        var data = [this.first1prop, this.first2prop];
      } else if (this.showFirst == true && this.showSecond == false && this.showThird == true) {
        var data = [this.first1prop, this.first3prop];
      } else if (this.showFirst == true && this.showSecond == true && this.showThird == true) {
        var data = [this.first1prop, this.first2prop, this.first3prop];
      }
      var arr = multiCartesian(data);
      // console.log(arr);
      // console.log(arr.length);
      var data = []
      for (var i = 0; i < arr.length; i++) {
        // console.log(arr[i][0].value);
        // console.log(arr[i][1].value);
        // console.log(arr[i][2].value);
        // console.log(arr[i][1].value);
        let obj = {}
        if (this.showFirst == true && this.showSecond == false && this.showThird == false) {
          obj.first1 = arr[i].value
          obj.price = ''
          obj.stock = ''
        } else if (this.showFirst == true && this.showSecond == true && this.showThird == false) {
          obj.first1 = arr[i][0].value
          obj.first2 = arr[i][1].value
          obj.price = ''
          obj.stock = ''
        } else if (this.showFirst == true && this.showSecond == false && this.showThird == true) {
          obj.first1 = arr[i][0].value
          obj.first3 = arr[i][1].value
          obj.price = ''
          obj.stock = ''
        } else if (this.showFirst == true && this.showSecond == true && this.showThird == true) {
          obj.first1 = arr[i][0].value
          obj.first2 = arr[i][1].value
          obj.first3 = arr[i][2].value
          obj.price = ''
          obj.stock = ''
        }
        data[i] = obj
      }
      this.tableData = data
      // var min = this.tableData[0].price

      // console.log(this.tableData);
      //
      var Titledata = []
      var columdata = []
      if (this.showFirst == true && this.showSecond == false && this.showThird == false) {
        // for (var i = 0; i < 1; i++) {
        // array[i]
        columdata.push(this.first1prop)
        Titledata.push(this.first1)
        // }
      } else if (this.showFirst == true && this.showSecond == true && this.showThird == false) {
        columdata.push(this.first1prop)
        columdata.push(this.first2prop)
        Titledata.push(this.first1)
        Titledata.push(this.first2)
      } else if (this.showFirst == true && this.showSecond == false && this.showThird == true) {
        columdata.push(this.first1prop)
        columdata.push(this.first3prop)
        Titledata.push(this.first1)
        Titledata.push(this.first3)
      } else if (this.showFirst == true && this.showSecond == true && this.showThird == true) {
        columdata.push(this.first1prop)
        columdata.push(this.first2prop)
        columdata.push(this.first3prop)
        Titledata.push(this.first1)
        Titledata.push(this.first2)
        Titledata.push(this.first3)
      }
      this.titleData = Titledata
      this.columnData = columdata
      // console.log(this.titleData);
      // var Titledata = []
      // for (var i = 0; i < 2; i++) {
      //   let titleobj = {}
      //   titleobj.title1 = this.first1
      //   titleobj.title2 = this.first2
      //   titleobj.title3 = this.first3
      //   Titledata[i] = titleobj
      // //
      // // }
      //
      //
      // this.titleData = titleobj
      // show: function (ev) {
      //     if(ev.keyCode==13){
      //       alert('你按了回车键！')
      //     }
      //   }
      // console.log("1");
    },
    delSpecsecond(e) {
      if (e == "second") {
        this.showSecond = false
        this.dynamicSecondForm.list.length = 1
      }
      if (e == "third") {
        this.showThird = false
        this.dynamicThirdForm.list.length = 1
      }
    },
    addSpecfirst() {
      if (this.showSecond == false) {
        this.showSecond = true
      } else if (this.showSecond == true) {
        this.showThird = true
      } else {
        // this.$message.error('最大支持三种分类规格！');
      }
      if (this.showFirst == true && this.showSecond == true && this.showThird == true) {
        this.$message.error('最大支持三种分类规格！');
      }
    },
    removefirstList(item) {
      var index = this.dynamicFirstForm.list.indexOf(item)
      if (index !== 0) {
        this.dynamicFirstForm.list.splice(index, 1)
      }
    },
    removesecondList(item) {
      var index = this.dynamicSecondForm.list.indexOf(item)
      if (index !== 0) {
        this.dynamicSecondForm.list.splice(index, 1)
      }
    },
    removethirdList(item) {
      var index = this.dynamicThirdForm.list.indexOf(item)
      if (index !== 0) {
        this.dynamicThirdForm.list.splice(index, 1)
      }
    },
    addlistfirst() {
      this.dynamicFirstForm.list.push({
        value: '',
        // key: Date.now()
      });
    },
    addlistsecond() {
      this.dynamicSecondForm.list.push({
        value: '',
        // key: Date.now()
      });
      // console.log("123");
    },
    addlistthird() {
      this.dynamicThirdForm.list.push({
        value: '',
        // key: Date.now()
      });
    },
    goBackPage() {
      this.$router.go(-1);
    },
    onSubmitInfo() {
      //
      // this.axios.post('goods/findTopfindTopCategoryName',{
      //   name:this.FirstCategoryId
      // }).then((res) => {
      //   this.FirstCategoryId = res.data.data.id
      //   this.axios.post('goods/findsecondsecondCategory',{
      //     name:this.SecondCategoryId
      //   }).then((res) => {
      //     console.log(res);
      //     this.SecondCategoryId = res.data.data.id

      console.log(this.GoodsExprice);
      console.log(this.FirstCategoryId);
      console.log(this.SecondCategoryId);
      console.log(this.GoodsMainImg);
      console.log(this.LoopListRes);
      console.log(this.GoodsName);
      console.log(this.GoodsDesc);
      console.log(this.GoodsParticEdit);
      // var GoodsLopp = this.GoodsLoopImg
      // var a = this.GoodsLoopImg.length
      // if (this.chushilength == a) {
      //   this.GoodsLoopImg = []
      //   let list = {}
      //   let data = {}
      //   let response = {}
      //   let fileUrl = {}
      //   for (var i = 0; i < a; i++) {
      //     fileUrl = GoodsLopp[i].url
      //     data.fileUrl = fileUrl
      //     response.data = data
      //     list.response = response
      //     this.GoodsLoopImg.push(list)
      //     console.log(list);
      //   }
      //   console.log(this.LoopImgLength);
      //   console.log(this.GoodsLoopImg);
      // }

      //
      if (this.FirstCategoryId == '' || this.SecondCategoryId == '' || this.GoodsMainImg == [] || this.LoopListRes.length == 0 ||
        this.GoodsName == '' || this.GoodsDesc == '' || this.GoodsParticEdit == '') {
        this.$message.error('内容不完整！');
        return false;
      }
      //
      //      if (!re.test(this.FirstCategoryId)) {
      //        this.axios.post('goods/findTopfindTopCategoryName',{
      //          name:this.FirstCategoryId
      //        }).then((res) => {
      //          this.FirstCategoryId = res.data.data.id
      //          console.log(this.FirstCategoryId);
      //         })
      // 　  　}
      //      if (!re.test(this.SecondCategoryId)) {
      //        this.axios.post('goods/findsecondsecondCategory',{
      //          name:this.SecondCategoryId
      //        }).then((res) => {
      //          this.SecondCategoryId = res.data.data.id
      //         })
      // 　  　}
      var re = /^[0-9]+.?[0-9]*$/;
      if (!re.test(this.FirstCategoryId) || !re.test(this.SecondCategoryId)) {
        console.log(this.FirstCategoryId);
        console.log(this.SecondCategoryId);
        // console.log("12456798"+this.SecondCategoryId);
        　　　　
        this.$message.error('请重新选择分类！');　　　　
        return false;　　
      }
      if (this.GoodsId == 0) {
        let mengchunmei = new Date().getTime() +''+ Math.round(Math.random() * 999)
        this.GoodsId = mengchunmei
        if (this.radio !== 1) {
          this.$message.error('添加商品必须要有规格!');
          return false
        }
        if (this.showFirst == true && this.showSecond == false && this.showThird == false) {
          if (this.first1 == "") {
            this.$message.error('商品规格名称不完整！');
            return false;
          }
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].first1 == '' || this.tableData[i].price == '' || this.tableData[i].stock == '') {
              this.$message.error('商品规格不完整！');
              return false;
            }
          }
        } else if (this.showFirst == true && this.showSecond == true && this.showThird == false) {
          if (this.first1 == "" || this.first2 == "") {
            this.$message.error('商品规格名称不完整！');
            return false;
          }
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].first1 == '' || this.tableData[i].price == '' || this.tableData[i].stock == '') {
              this.$message.error('商品规格不完整！');
              return false;
            }
          }
        } else if (this.showFirst == true && this.showSecond == false && this.showThird == true) {
          if (this.first1 == "" || this.first3 == "") {
            this.$message.error('商品规格名称不完整！');
            return false;
          }
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].first1 == '' || this.tableData[i].price == '' || this.tableData[i].stock == '') {
              this.$message.error('商品规格不完整！');
              return false;
            }
          }
        } else if (this.showFirst == true && this.showSecond == true && this.showThird == true) {
          if (this.first1 == "" || this.first2 == "" || this.first3 == "") {
            this.$message.error('商品规格名称不完整！');
            return false;
          }
          for (var i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].first1 == '' || this.tableData[i].price == '' || this.tableData[i].stock == '') {
              this.$message.error('商品规格不完整！');
              return false;
            }
          }
        }
        this.axios.post('brand/addspec', {
          columnData: this.columnData,
          goodsid: this.GoodsId,
          titleData: this.titleData,
          tableData: this.tableData,
        }).then((res) => {
          console.log(res);
        })
        this.axios.post('goods/addgoods', {
          Goodsid: this.GoodsId,
          FirstCategoryId: this.FirstCategoryId,
          SecondCategoryId: this.SecondCategoryId,
          GoodsMainImg: this.GoodsMainImg,
          GoodsParticEdit: this.GoodsParticEdit,
          GoodsLoopImg: this.LoopListRes,
          GoodsName: this.GoodsName,
          GoodsDesc: this.GoodsDesc,
          GoodsStock: this.GoodsStock,
          GoodsPrice: this.GoodsPrice,
          GoodsExprice: this.GoodsExprice,
          GoodsSortOrder: this.GoodsSortOrder,
          GoodsIsNew: this.GoodsIsNew ? 1 : 0,
          GoodsOnSale: this.GoodsIsOnSale ? 1 : 0,
          GoodsIsHot: this.GoodsIsHot ? 1 : 0,
        }).then((resd) => {
          console.log(resd);
          this.$message({
            type: 'success',
            message: '保存成功'
          });
          this.$router.go(-1)
        })


      } else {
        //有商品
        if (this.radio == 1) {
          if (this.showFirst == true && this.showSecond == false && this.showThird == false) {
            if (this.first1 == "") {
              this.$message.error('商品规格名称不完整！');
              return false;
            }
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].first1 == '' || this.tableData[i].price == '' || this.tableData[i].stock == '') {
                this.$message.error('商品规格不完整！');
                return false;
              }
            }
          } else if (this.showFirst == true && this.showSecond == true && this.showThird == false) {
            if (this.first1 == "" || this.first2 == "") {
              this.$message.error('商品规格名称不完整！');
              return false;
            }
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].first1 == '' || this.tableData[i].price == '' || this.tableData[i].stock == '') {
                this.$message.error('商品规格不完整！');
                return false;
              }
            }
          } else if (this.showFirst == true && this.showSecond == false && this.showThird == true) {
            if (this.first1 == "" || this.first3 == "") {
              this.$message.error('商品规格名称不完整！');
              return false;
            }
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].first1 == '' || this.tableData[i].price == '' || this.tableData[i].stock == '') {
                this.$message.error('商品规格不完整！');
                return false;
              }
            }
          } else if (this.showFirst == true && this.showSecond == true && this.showThird == true) {
            if (this.first1 == "" || this.first2 == "" || this.first3 == "") {
              this.$message.error('商品规格名称不完整！');
              return false;
            }
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].first1 == '' || this.tableData[i].price == '' || this.tableData[i].stock == '') {
                this.$message.error('商品规格不完整！');
                return false;
              }
            }
          }
          this.axios.post('brand/addspec', {
            columnData: this.columnData,
            goodsid: this.GoodsId,
            titleData: this.titleData,
            tableData: this.tableData,
          }).then((res) => {
            console.log(res);
          })
          this.axios.post('goods/upgoods', {
            Goodsid: this.GoodsId,
            LoopImgLength: this.LoopImgLength,
            FirstCategoryId: this.FirstCategoryId,
            SecondCategoryId: this.SecondCategoryId,
            GoodsMainImg: this.GoodsMainImg,
            GoodsParticEdit: this.GoodsParticEdit,
            GoodsLoopImg: this.LoopListRes,
            GoodsName: this.GoodsName,
            GoodsDesc: this.GoodsDesc,
            GoodsStock: this.GoodsStock,
            GoodsPrice: this.GoodsPrice,
            GoodsExprice: this.GoodsExprice,
            GoodsSortOrder: this.GoodsSortOrder,
            GoodsIsNew: this.GoodsIsNew ? 1 : 0,
            GoodsOnSale: this.GoodsIsOnSale ? 1 : 0,
            GoodsIsHot: this.GoodsIsHot ? 1 : 0,
          }).then((resq) => {
            console.log(resq);
            this.$message({
              type: 'success',
              message: '保存成功'
            });
            this.$router.go(-1)
          })


        } else {
          //没有改规格直接更新
          this.axios.post('goods/upgoods', {
            Goodsid: this.GoodsId,
            LoopImgLength: this.LoopImgLength,
            FirstCategoryId: this.FirstCategoryId,
            SecondCategoryId: this.SecondCategoryId,
            GoodsMainImg: this.GoodsMainImg,
            GoodsParticEdit: this.GoodsParticEdit,
            GoodsLoopImg: this.LoopListRes,
            GoodsName: this.GoodsName,
            GoodsDesc: this.GoodsDesc,
            GoodsStock: this.GoodsStock,
            GoodsPrice: this.GoodsPrice,
            GoodsExprice: this.GoodsExprice,
            GoodsSortOrder: this.GoodsSortOrder,
            GoodsIsNew: this.GoodsIsNew ? 1 : 0,
            GoodsOnSale: this.GoodsIsOnSale ? 1 : 0,
            GoodsIsHot: this.GoodsIsHot ? 1 : 0,
          }).then((resR) => {
            console.log(resR);
            this.$message({
              type: 'success',
              message: '保存成功'
            });
            this.$router.go(-1)
          })
        }
      }
      // })
      //           })
    },
    getTopCategory() {
      this.axios.get('goods/topCategory').then((res) => {
        this.FirstCategory = res.data.data;
      })
    },
    firstCategorychange(firstid) {
      console.log(firstid);
      this.FirstCategoryId = firstid
      this.axios.post('goods/secondCategory', {
        id: firstid
      }).then((res) => {
        console.log(res);
        this.SecondCategory = res.data.data
      })
    },
    getInfo() {
      if (this.GoodsId == 0) {
        this.getTopCategory()
      } else if (this.GoodsId > 0) {
        this.axios.post("brand/info", {
          id: this.GoodsId
        }).then((res) => {
          console.log(res);
          this.GoodsDetailInfo = res.data.data
          this.SecondCategoryId = this.GoodsDetailInfo.category_id
          // this.SecondSecondCategoryId = this.GoodsDetailInfo.category_id
          // this.SecondCategoryId = this.GoodsDetailInfo.category_id
          // console.log(this.SecondSecondCategoryId);
          this.findCategory()
          this.GoodsStock = res.data.data.goods_number
          this.GoodsPrice = res.data.data.retail_price
          this.GoodsName = res.data.data.name
          this.GoodsDesc = res.data.data.goods_brief
          this.GoodsExprice = res.data.data.extra_price
          this.GoodsIsOnSale = res.data.data.is_on_sale ? true : false;
          this.GoodsIsNew = res.data.data.is_new ? true : false;
          this.GoodsIsHot = res.data.data.is_hot ? true : false;
          this.GoodsSortOrder = res.data.data.sort_order;
          let obj1 = {}
          obj1.url = res.data.data.list_pic_url
          this.GoodsMainImg.push(obj1)
          this.findLoopImg()
          // console.log(res.data.data.goods_desc);
          this.GoodsParticEdit = res.data.data.goods_desc
          console.log(this.GoodsParticEdit);
          this.findSpecifications()
        })
      }
    },
    findLoopImg() {
      this.axios.post("goods/findLoopImg", {
        id: this.GoodsId
      }).then((res) => {
        // console.log(res);
        var resas = res.data.data
        this.LoopImgLength = resas.length
        console.log(this.LoopImgLength);
        for (var i = 0; i < resas.length; i++) {
          let obj2 = {}
          let obj3 = {}
          obj2.url = resas[i].img_url
          this.LoopList.push(obj2)
          obj3.fileUrl = resas[i].img_url
          this.LoopListRes.push(obj3)

        }

        this.chushilength = this.LoopList.length
        // this.uploadimgchange(this.LoopList)
        // console.log(this.GoodsLoopImg);
      })
    },
    findCategory() {
      this.getTopCategory()
      console.log(this.SecondCategoryId);
      this.axios.post('goods/findTopCategory', {
        id: this.SecondCategoryId
      }).then((res) => {
        console.log(res);
        this.SecondCategoryName = res.data.data[0].name
        this.FirstCategoryId = res.data.data[0].parent_id
        this.axios.post('goods/findTopCategoryName', {
          id: this.FirstCategoryId
        }).then((ress) => {
          console.log(ress);
          this.FirstCategoryName = ress.data.data.name
        })
      })
      // console.log(this.FirstCategoryId);
      // this.SecondId = this.SecondCategoryId
      // this.axios.post('goods/findSecondCategory',{
      //   id: this.SecondCategoryId
      // }).then((res) => {
      //   this.SecondCategoryName = res.data.data.name
      //   var parentid = res.data.data.parent_id
      //   this.axios.post('goods/aaacategory',{
      //     id:parentid
      //   }).then((resss) => {
      //     this.SecondCategory = resss.data.data
      //     this.axios.post('goods/findTopCategory',{
      //       id:this.SecondCategory[0].parent_id
      //     }).then((reaa) => {
      //       this.FirstCategoryName = reaa.data.data[0].name
      //     })
      //   })
      // })
    },
    findSpecifications() {
      this.axios.post("goods/findSpec", {
        id: this.GoodsId
      }).then((res) => {})
    }
  },
  components: {},
  mounted() {
    this.GoodsId = this.$route.query.id || 0;
    // this.infoForm.id = this.$route.query.id || 0;
    // console.log(this.infoForm.id);
    // console.log(this.GoodsId);
    // if (this.GoodsId <= 0 ){
    this.getInfo();
    this.gettoken();
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    this.$nextTick(function() {
      window.addEventListener('scroll', this.needToTop); //滚动事件监听
    });

    // var editor = new E('#editorElem')
    //  editor.customConfig.onchange = (html) => {
    //    this.editorContent = html
    //  }
    //  editor.customConfig.uploadImgServer = 'http://127.0.0.1:8360/admin/upload/brandPic'  // 上传图片到服务器
    //  editor.customConfig.debug = true
    //  editor.customConfig.uploadFileName = 'file'
    //  editor.customConfig.uploadImgHeaders = {
    //      'X-Nideshop-Token': localStorage.getItem('token') || '',
    //  }
    //  editor.create()

    // var vm =this
    // var imgHandler = async function(image) {
    // vm.addImgRange = vm.$refs.myTextEditor.quill.getSelection()
    // if (image) {
    //  var fileInput = document.getElementById(vm.uniqueId) //隐藏的file文本ID
    //  fileInput.click() //加一个触发事件
    // }
    // }
    // vm.$refs.myTextEditor.quill.getModule("toolbar").addHandler("image", imgHandler)
    // }else {
    //    this.getTopCategory()
    // }

    // console.log(api)
  }
}
</script>

<style>
#goBottom {
  position: fixed;
  padding: 10px;
  right: 8vw;
  bottom: 16vh;
  /* top: 1vh; */
  transform: rotate(90deg);
}

#goTop {
  /* border: 1px solid black; */
  /* position: absolute; */
  position: fixed;
  padding: 10px;
  right: 8vw;
  bottom: 16vh;
  /* top: 1vh; */
  transform: rotate(-90deg);

  /* position: fixed; */
}

/* .tiptixe {
  color: #a4a5a6;
} */

.colorArrayitem {
  border: 1px solid black;
}

.checkbox123 {
  /* border: 1px solid #000; */
  float: left;
  /* position: relative; */
  padding: 5px;
  width: 30%;
}

.image-uploader {
  height: 105px;
}

.image-uploader .el-upload {
  border: 1px solid #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.image-uploader .el-upload:hover {
  border-color: #20a0ff;
}

.image-uploader .image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 187px;
  height: 105px;
  line-height: 105px;
  text-align: center;
}

.image-uploader .image-show {
  width: 187px;
  height: 105px;
  display: block;
}

.image-uploader.new-image-uploader {
  font-size: 28px;
  color: #8c939d;
  width: 165px;
  height: 105px;
  line-height: 105px;
  text-align: center;
}

.image-uploader.new-image-uploader .image-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 165px;
  height: 105px;
  line-height: 105px;
  text-align: center;
}

.image-uploader.new-image-uploader .image-show {
  width: 165px;
  height: 105px;
  display: block;
}
</style>
