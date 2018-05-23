<template>
	<div class="content-page">
		<div class="content-nav">
			<el-breadcrumb class="breadcrumb" separator="/">
				<el-breadcrumb-item :to="{ path: '/dashboard' }">首页</el-breadcrumb-item>
				<el-breadcrumb-item>商品管理</el-breadcrumb-item>
				<el-breadcrumb-item>会员列表</el-breadcrumb-item>
			</el-breadcrumb>
			<div class="operation-nav">
				<router-link to="/dashboard/user/add">
					<!--<el-button type="primary" icon="plus">添加会员</el-button>-->
				</router-link>
			</div>
		</div>
		<div class="content-main">
			<div class="filter-box">
				<el-form :inline="true" :model="filterForm" class="demo-form-inline">
					<el-form-item label="用户名称">
						<el-input v-model="filterForm.name" placeholder="用户名称"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="onSubmitFilter">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="form-table-box">
				<el-table :data="tableData" :default-sort = "{prop: 'date', order: 'descending'}" style="width: 100%" border stripe>
					<el-table-column prop="id" label="ID" width="90" sortable align="center">
					</el-table-column>
					<!-- <el-table-column prop="username" label="会员名称" width="120" align="center">
					</el-table-column> -->
					<el-table-column prop="nickname" label="呢称" width="180" align="center">
					</el-table-column>
					<!-- <el-table-column prop="weixin_openid" label="OpenId"  align="center">
					</el-table-column> -->
					<el-table-column prop="gender" label="性别" sortable width="90" align="center">
						<template scope="scope">
							{{ scope.row.gender == 0 ? '女' : '男' }}
						</template>
					</el-table-column>
					<el-table-column prop="mobile" label="手机号" sortable align="center">
					</el-table-column>
					<el-table-column prop="register_localtime" label="注册时间" sortable width="180" align="center">
					</el-table-column>
					<el-table-column prop="last_login_localtime" label="最后登录时间" sortable width="180" align="center">
					</el-table-column>
					<el-table-column label="操作" width="180" align="center">
						<template scope="scope">
							<!--<el-button size="small" @click="handleRowEdit(scope.$index, scope.row)">编辑</el-button>-->
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
			page: 1,
			total: 0,
			filterForm: {
				name: ''
			},
			tableData: [ ],
		}
	},
	methods: {
		handlePageChange(val) {
			this.page = val;
			//保存到localStorage
			localStorage.setItem('userPage', this.page)
			localStorage.setItem('userFilterForm', JSON.stringify(this.filterForm));
			this.getList()
		},
		handleRowEdit(index, row) {
			this.$router.push({ name: 'user_add', query: { id: row.id } })
		},
		handleRowDelete(index, row) {

			this.$confirm('确定要删除?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {

				this.axios.post('user/destory', { id: row.id }).then((response) => {
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
			this.axios.get('user', {
				params: {
					page: this.page,
					name: this.filterForm.name
				}
			}).then((response) => {
				console.log(response);
        this.tableData = response.data.data.data
				// console.log(new Date(this.tableData.register_time).toLocaleString());
				// console.log(this.timestampToTime(this.tableData[0].register_time));
				for (var i = 0; i < this.tableData.length; i++) {
					this.tableData[i].register_localtime = this.timestampToTime(this.tableData[i].register_time)
					this.tableData[i].last_login_localtime = this.timestampToTime(this.tableData[i].last_login_time)
				}
        this.page = response.data.data.currentPage
        this.total = response.data.data.count
			})
		},
		timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
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

</style>
