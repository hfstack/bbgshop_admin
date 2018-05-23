<template>
    <div class="content-page">
        <div class="content-nav">
            <el-breadcrumb class="breadcrumb" separator="/">
                <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>商品管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{infoForm.id ? '编辑分类' : '添加分类'}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="operation-nav">
                <el-button type="primary" @click="goBackPage" icon="arrow-left">返回列表</el-button>
            </div>
        </div>
        <div class="content-main">
            <div class="form-table-box">
                <el-form ref="infoForm" :rules="infoRules" :model="infoForm" label-width="120px">
                    <el-form-item label="上级分类" prop="name">
                        <el-select v-model="infoForm.parent_id" placeholder="请选择上级分类">
                            <el-option v-for="item in parentCategory" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="分类名称" prop="name">
                        <el-input v-model="infoForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="简短介绍" prop="front_name">
                        <el-input type="textarea" v-model="infoForm.front_name" :rows="1"></el-input>
                        <div class="form-tip"></div>
                    </el-form-item>
                    <el-form-item label="主页显示" v-if="showcatrey">
                      <el-switch v-model="is_showindex" >
                      </el-switch>
                    </el-form-item>
                    <el-form-item label="分类图标" v-if="is_showindex == true" >
                      <!-- :action="indexbaricon" -->
                      <el-upload
                        action="http://upload.qiniup.com"
                        list-type="picture-card"
                        :data="uploadToken"
                        :on-success="SmallImgSuccess"
                        :headers="uploaderHeader"
                        :file-list="GoodsSmallImg">
                        <i class="el-icon-plus"></i>
                      </el-upload>
                      <div class="form-tip">图片尺寸：250*250 && 请不要上传超过两张！！</div>
                    </el-form-item>

                    <el-form-item label="跳转地址"  v-if="is_showindex == true">
                      <el-select v-model="Goodsmallparentid" placeholder="请选择跳转分类" @change="Categorychange">
                          <el-option v-for="item in parentCategory" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                        <div class="form-tip">点击后跳转的分类</div>
                    </el-form-item>
                    <el-form-item label="图标排序"  v-if="is_showindex == true">
                        <el-input-number v-model="goodsmallsort_order" :min="1" :max="10"></el-input-number>
                        <div class="form-tip">最大为10，会覆盖排序为当前值的内容</div>
                    </el-form-item>

                    <el-form-item label="分类图片" prop="wap_banner_url">
                      <!-- :action="WapBannerPic"  :with-credentials='true'-->
                      <el-upload

                        action="http://upload.qiniup.com"
                        list-type="picture-card"
                        :data="uploadToken"
                        :headers="uploaderHeader"
                        :on-success="MainImgSuccess"
                        :file-list = "GoodsMainImg">
                        <i class="el-icon-plus"></i>
                      </el-upload>
                        <!-- <el-upload class="image-uploader" name="wap_banner_pic"
                                   action="http://127.0.0.1:8360/admin/upload/categoryWapBannerPic" :show-file-list="false"
                                   :on-success="handleUploadImageSuccess" :headers="uploaderHeader">
                            <img v-if="infoForm.wap_banner_url" :src="infoForm.wap_banner_url" class="image-show">
                            <i v-else class="el-icon-plus image-uploader-icon"></i>
                        </el-upload> -->
                        <div class="form-tip">图片尺寸：顶级分类为750*246 && 二级分类为250*250 && 请不要上传超过两张！！</div>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input-number v-model="infoForm.sort_order" :min="1" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="启用">
                        <el-switch v-model="infoForm.is_show"></el-switch>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmitInfo">确定保存</el-button>
                        <el-button @click="goBackPage">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <!-- <el-button type="primary" @click="abc">确定保存</el-button> -->
    </div>
</template>

<script>
  import api from '@/config/api';
  export default {
    data() {
      return {
        uploadToken:{
          token: "",
        },
        // WapBannerPic: '',
        // IndexBarPic: '',
        Goodsmallparentid: 0,
        goodsmallsort_order: 9,
        GoodsSmallImg:[],
        showcatrey:false,
        is_showindex:false,
        GoodsMainImg: [],
        uploaderHeader: {
          'X-Nideshop-Token': localStorage.getItem('token') || '',
        },
        parentCategory: [
          {
            id: 0,
            name: '顶级分类'
          }
        ],
        categoryId: 0,
        categoryName: "",
        categoryParent_id: 0,
        categoryFont_name: '',
        categorySort_order: 100,
        categoryIs_show: true,
        infoForm: {
          id: 0,
          name: "",
          parent_id: 0,
          front_name: '',
          sort_order: 100,
          is_show: true,
        },
        infoRules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
          ],
          front_name: [
            { required: true, message: '请输入简介', trigger: 'blur' },
          ],
          // wap_banner_url: [
          //   { required: true, message: '请选择分类图片', trigger: 'blur' },
          // ],
        },
      }
    },
    created(){
      // console.log("123456789");
      // this.WapBannerPic = String(api.api.WapBannerPic)
      // this.IndexBarPic = String(api.api.IndexBarPic)
      // console.log(this.wapbannerurl);
      // console.log(api.api.wapbannerurl);
      // console.log(api.api.indexbaricon);
      // console.log(this.$store.state.strict);
    },
    watch:{
      // is_showindex(a,b){
      //   console.log(a,b);
      //   if ( a == true) {
      //     //打开主页显示
      //     this.showsmall()
      //
      //     // console.log("987987987");
      //
      //   }
      // }
    },
    methods: {
      gettoken(){
        // console.log("12163546498764131");
        this.axios.post('upload/token').then((res) => {
          console.log(res);
          this.uploadToken.token = res.data.data.uploadToken
        })
      },
      showsmall(){
        // console.log(this.infoForm.id);
        this.axios.post('category/findsmallloop', {
            id: this.infoForm.id
        }).then((res) => {
          console.log(res);
          if (res.data.errno === 503) {
            console.log("不存在主页");
            this.is_showindex = false
          }else if(res.data.errno === 217){
            console.log("存在主页");
            this.is_showindex = true
            var info = res.data.data[0]
            this.goodsmallsort_order = info.sort_order
            let objj = {}
            let url = {}
            objj.url = info.icon_url
            // console.log(objj);
            this.GoodsSmallImg.push(objj)
            // var url = info.url
            // var value = info.category_id;
            // console.log(value);
            this.Goodsmallparentid = info.category_id
          }
          // console.log("99999999999999999999999999999999999");
          console.log(this.GoodsSmallImg[0]);
          // if ( typeof(res.data.data.sort_order) == 'undefined') {
          //   console.log("不存在主页");
          // //   // console.log("12345689");
          // //   // this.smallinfo = res.data.data
          //   this.is_showindex = false
          // }else{
          //   this.is_showindex = true
          //   console.log("存在主页");
          //   var info = res.data.data
          //   this.goodsmallsort_order = info.sort_order
          //   console.log(this.is_showindex);
          //   // this.Goodsmallparentid = info.sort_order
          // //   this.smallinfo.sort_order = info.sort_order
          // //   this.smallinfo.name = info.name
          //   let obj = {}
          //   let url = {}
          //   obj.url = info.icon_url
          //   this.GoodsSmallImg.push(obj)
          //   var url = info.url
          //   var value = url.replace(/[^0-9]/ig,"");
          //   console.log(value);
          //   this.Goodsmallparentid = value
          //   // this.smallinfo.parent_id = info
          // }
          // console.log(this.GoodsSmallImg);

          // console.log(this.smallinfo);
        })
      },
      postsmall(){
        console.log(this.GoodsSmallImg[0]);
        var parenter = "/pages/category/category?id="+this.Goodsmallparentid
        this.axios.post('category/setsmall',{
          name:this.infoForm.name,
          tourl:parenter,
          icon:this.GoodsSmallImg[0],
          sort:this.goodsmallsort_order,
          category_id:this.infoForm.id
        }).then((res) => {
          console.log(res);
        })
      },
      delsmall(){
        this.axios.post('category/delsmall',{
          id:this.infoForm.id
        }).then((res) => {
          console.log(res);
        })
      },
      Categorychange(e){
        console.log(e);
        this.Goodsmallparentid = e
      },
      SmallImgSuccess(res){
        console.log(res);
        this.GoodsSmallImg = []
        let objj = {}
        let url = {}
        objj.url = 'http://resource.bbgshop.com/'+ res.key
        this.GoodsSmallImg.push(objj)
        // this.GoodsSmallImg[0] = 'http://resource.bbgshop.com/'+ res.key
        console.log(this.GoodsSmallImg);
        this.$message.error("请勿上传超过一张！");
      },
      abc(){
        console.log(this.GoodsSmallImg);
        console.log(this.Goodsmallparentid);
        console.log(this.goodsmallsort_order);
      },
      MainImgSuccess(res){
        console.log(res);
        this.GoodsMainImg[0] = 'http://resource.bbgshop.com/'+ res.key
        console.log(this.GoodsMainImg);
      },
      goBackPage() {
        this.$router.go(-1);
      },
      onSubmitInfo() {
        if ( this.is_showindex == true) {
          if ( this.GoodsMainImg.length == 0 || this.GoodsSmallImg.length == 0) {
            this.$message.error('图片或图标不能为空！');
            return false
          }
        }else {
          if ( this.GoodsMainImg.length == 0 ) {
            this.$message.error('图片不能为空！');
            return false
          }
        }

        this.categoryName = this.infoForm.name
        this.categoryParent_id = this.infoForm.parent_id
        this.categoryFont_name = this.infoForm.front_name
        this.categorySort_order = this.infoForm.sort_order
        this.categoryIs_show = this.infoForm.is_show
        console.log(this.categoryName);
        console.log(this.categoryParent_id);
        console.log(this.categoryFont_name);
        console.log(this.categorySort_order);
        console.log(this.categoryIs_show);
        console.log(this.GoodsMainImg);
        if (this.infoForm.id <= 0) {


          this.axios.post('category/addstoreall',{
            categoryName:this.categoryName,
            categoryParent_id:this.categoryParent_id,
            categoryFont_name:this.categoryFont_name,
            categorySort_order:this.categorySort_order,
            categoryIs_show:this.categoryIs_show ? 1 : 0,
            GoodsMainImg:this.GoodsMainImg,

          }).then((res) => {
            console.log(res);
              this.$message({
                type: 'success',
                message: '保存成功'
              });
            this.$router.go(-1)
          })
        }else {
          if (this.is_showindex == true && this.Goodsmallparentid == 0) {
            this.$message.error('跳转地址不能为顶级分类！');
            return false
          }
          if (this.is_showindex == false) {
            this.delsmall()
          }else {
            this.postsmall();
          }
          this.categoryId = this.infoForm.id
          console.log(this.categoryId);
          this.axios.post('category/updatastoreall',{
            categoryId:this.categoryId,
            categoryName:this.categoryName,
            categoryParent_id:this.categoryParent_id,
            categoryFont_name:this.categoryFont_name,
            categorySort_order:this.categorySort_order,
            categoryIs_show:this.categoryIs_show ? 1 : 0,
            GoodsMainImg:this.GoodsMainImg,

          }).then((res) => {
            console.log(res);

              this.$message({
                type: 'success',
                message: '保存成功'
              });
            this.$router.go(-1)
          })
        }
      },
      getTopCategory() {
        this.axios.get('category/topCategory').then((response) => {
          this.parentCategory = this.parentCategory.concat(response.data.data);
        })
      },
      getsmall() {
        if (this.infoForm.parent_id == 0) {
          this.showcatrey = true
          this.showsmall()
        }else{
          this.showcatrey = false
        }
      },
      getInfo() {
        if (this.infoForm.id <= 0) {
          return false
        }else {
          this.axios.post('category/wapimage',{
            id:this.infoForm.id
          }).then((res) => {
            console.log(res);
            console.log(res.data.data.wap_banner_url);
            let obj = {}
            obj.url = res.data.data.wap_banner_url
            this.GoodsMainImg.push(obj)
            // this.GoodsMainImg.push(res.data.data.wap_banner_url)
          })
          //加载分类详情
          let that = this
          this.axios.get('category/info', {
            params: {
              id: that.infoForm.id
            }
          }).then((response) => {
            let resInfo = response.data.data;
            resInfo.is_show = resInfo.is_show ? true : false;
            that.infoForm = resInfo;
            this.getsmall();
          })

        }


      }

    },
    components: {},
    mounted() {
      this.getTopCategory();
      this.infoForm.id = this.$route.query.id || 0;
      this.getInfo();
      this.gettoken();

    }
  }

</script>

<style>
    .image-uploader{
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
        min-width: 105px;
        height: 105px;
        line-height: 105px;
        text-align: center;
    }

    .image-uploader .image-show {
        min-width: 105px;
        height: 105px;
        display: block;
    }

</style>
