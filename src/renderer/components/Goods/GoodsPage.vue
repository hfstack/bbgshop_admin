<template>
<div class="content-page">
  <div class="content-nav">
    <el-breadcrumb class="breadcrumb" separator="/">
      <el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="operation-nav">
      <router-link to="/dashboard/goods/add">
        <el-button type="primary" icon="plus">添加商品</el-button>
      </router-link>
    </div>
  </div>
  <div class="content-main">
    <div class="filter-box" style="float:left;">
      <el-form :inline="true" :model="filterForm" class="demo-form-inline">
        <el-form-item label="商品名称">
          <el-input v-model="filterForm.name" @keyup.13.native="show()" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitFilter">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="filter-box" style="float:right;">
      <!-- <el-form ref="infoForm"  label-width="120px"> -->
      <!-- <el-form-item label="所属分类" > -->
      <el-select v-model="FirstCategoryName" placeholder="请选择所属一级分类" @change="firstCategorychange">
        <el-option v-for="item in FirstCategory" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-select v-model="SecondCategoryName" placeholder="请选择所属二级分类" @change="secondCategorychange">
        <el-option v-for="item in SecondCategory" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <!-- <el-button type="primary"  @click="onClear">清空</el-button> -->
      <el-button type="info" plain @click="onClear">清空</el-button>
      <!-- <el-button type="warning" icon="el-icon-star-off" circle></el-button> -->

      <!-- </el-form-item> -->
      <!-- </el-form> -->
    </div>
    <div class="form-table-box">
      <el-table :data="tableData" :default-sort="{prop: 'date', order: 'descending'}" style="width: 100%" border stripe>
        <!-- <el-table-column prop="id" align="center" sortable label="ID" width="100">
        </el-table-column> -->
        <el-table-column prop="name" label="商品名称">
        </el-table-column>
        <el-table-column prop="retail_price" align="center" sortable label="售价" width="100">
        </el-table-column>
        <el-table-column prop="goods_number" label="库存" align="center" sortable width="90">
        </el-table-column>
        <el-table-column prop="is_new" label="新品" align="center" width="80">
          <template scope="scope">
                          <el-switch v-model="row[scope.$index].is_new" @change="changeIsnew(scope.$index, scope.row)">
                          </el-switch>
                            <!-- {{ scope.row.is_new == 1 ? '是' : '否' }} -->
                        </template>
        </el-table-column>
        <el-table-column prop="is_new" label="人气" align="center" width="80">
          <template scope="scope">
                          <!-- v-model="scope.row.is_hot == 1 ? true : false" -->
                          <el-switch v-model="row[scope.$index].is_hot" @change="changeIshot(scope.$index, scope.row)">
                          </el-switch>
                            <!-- {{ scope.row.is_hot == 1 ? 'true' : 'false' }} -->
                        </template>
        </el-table-column>
        <el-table-column prop="is_show" label="上架" align="center" width="80">
          <template scope="scope">
                          <el-switch v-model="row[scope.$index].is_on_sale" @change="changeIsonsale(scope.$index, scope.row)">
                          </el-switch>
                            <!-- {{ scope.row.is_on_sale == 1 ? '是' : '否' }} -->
                        </template>
        </el-table-column>
        <!-- <el-table-column prop="sort_order" label="排序" align="center" sortable width="90">
        </el-table-column> -->
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template scope="scope">
                            <el-button size="small" @click="handleRowEdit(scope.$index, scope.row)">编辑</el-button>
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
</div>
</template>

<script>
export default {
  data() {
    return {
      FirstCategoryName: '',
      SecondCategoryName: '',
      SecondCategoryId: '',
      FirstCategory: [],
      SecondCategory: [],
      issearch: false, //是否处于搜索状态
      row: [],
      page: 1,
      total: 0,
      filterForm: {
        name: ''
      },
      tableData: []
    }
  },
  methods: {
    show() {
      this.onSubmitFilter()
    },
    onClear() {
      this.issearch = false
      this.filterForm.name = ''
      // this.filterForm.name = ''
      // this.page = 1
      this.getList()
      // this.FirstCategoryName = ''
      // this.SecondCategoryName = ''
    },
    firstCategorychange(item) {
      console.log(item);
      this.SecondCategoryName = ''
      this.axios.post('goods/secondCategory', {
        id: item
      }).then((res) => {
        console.log(res);
        this.SecondCategory = res.data.data
      })
    },
    secondCategorychange(item) {
      console.log(item);
      this.issearch = true
      this.SecondCategoryId = item
      this.getcatelist(item)
    },
    getcatelist(item) {
      this.axios.get('goods/findsecondgoods', {
        params: {
          page: this.page,
          id: item
        }
      }).then((res) => {
        console.log(res);
        this.tableData = res.data.data.data
        for (var i = 0; i < this.tableData.length; i++) {
          // array[i]
          let obj = {}
          obj.is_hot = this.tableData[i].is_hot == 1 ? true : false
          obj.is_new = this.tableData[i].is_new == 1 ? true : false
          obj.is_on_sale = this.tableData[i].is_on_sale == 1 ? true : false
          this.row.push(obj)
        }
        // console.log(this.row);
        // this.row.is_hot = response.data.data.data
        this.page = res.data.data.currentPage
        this.total = res.data.data.count
        // this.SecondCategory = res.data.data
      })
    },
    changeIsnew(index, row) {
      console.log(index, row);
      this.$confirm('是否修改' + row.name + '的新品状态吗' + '?', '修改实时生效！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('goods/setisnew', {
          id: row.id,
          data: this.row[index].is_new ? 1 : 0
        }).then((response) => {
          console.log(response.data)
          if (response.data.errno === 0) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          }
        })
      }).catch(() => {
        this.row[index].is_new = !this.row[index].is_new
        this.$message({
          type: 'info',
          message: '已取消修改！'
        });
      });
    },
    changeIshot(index, row) {
      console.log(index, row);
      this.$confirm('是否修改' + row.name + '的人气状态吗' + '?', '修改实时生效！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('goods/setishot', {
          id: row.id,
          data: this.row[index].is_hot ? 1 : 0
        }).then((response) => {
          console.log(response.data)
          if (response.data.errno === 0) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          }
        })
      }).catch(() => {
        this.row[index].is_hot = !this.row[index].is_hot
        this.$message({
          type: 'info',
          message: '已取消修改！'
        });
      });
    },
    changeIsonsale(index, row) {
      console.log(index, row);
      this.$confirm('是否修改' + row.name + '的上架状态吗' + '?', '修改实时生效！', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('goods/setisonsale', {
          id: row.id,
          data: this.row[index].is_on_sale ? 1 : 0
        }).then((response) => {
          console.log(response.data)
          if (response.data.errno === 0) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          }
        })
      }).catch(() => {
        this.row[index].is_on_sale = !this.row[index].is_on_sale
        this.$message({
          type: 'info',
          message: '已取消修改！'
        });
      });
    },
    handlePageChange(val) {
      this.page = val;
      //保存到localStorage
      localStorage.setItem('goodsPage', this.page)
      localStorage.setItem('goodsFilterForm', JSON.stringify(this.filterForm));
      // this.getList()
      if (this.issearch == false) {
        this.getList()
      } else {
        this.getcatelist(this.SecondCategoryId)
      }
    },
    handleRowEdit(index, row) {
      this.$router.push({
        name: 'goods_add',
        query: {
          id: row.id
        }
      })
    },
    handleRowDelete(index, row) {

      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post('goods/destory', {
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除！'
        });
      });
    },
    onSubmitFilter() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.axios.get('goods', {
        params: {
          page: this.page,
          name: this.filterForm.name
        }
      }).then((response) => {
        // console.log(response);
        this.tableData = response.data.data.data
        this.row = []
        for (var i = 0; i < this.tableData.length; i++) {
          // array[i]
          let obj = {}
          obj.is_hot = this.tableData[i].is_hot == 1 ? true : false
          obj.is_new = this.tableData[i].is_new == 1 ? true : false
          obj.is_on_sale = this.tableData[i].is_on_sale == 1 ? true : false
          this.row.push(obj)
        }
        // console.log(this.row);
        // this.row.is_hot = response.data.data.data
        this.page = response.data.data.currentPage
        this.total = response.data.data.count
      })
      this.getcategory()
    },
    getcategory() {
      this.axios.get('category/topCategory').then((res) => {
        console.log(res);
        this.FirstCategory = res.data.data
      })
    },
  },
  components: {

  },
  mounted() {
    this.getList();

  }
}
</script>

<style scoped>

</style>
