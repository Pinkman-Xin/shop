<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === 'false'" style="color : lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
          <!-- 排序 -->
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditCate(scope.row.cat_id)">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeCateById(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisble" width="50%"
    @close="addCateDialogClosed">
        <!-- 添加分类的表单 -->
  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
  <el-form-item label="分类名称:" prop="cat_name">
    <el-input v-model="addCateForm.cat_name"></el-input>
  </el-form-item>
  <el-form-item label="父级分类:">
    <el-cascader
    clearable
    v-model="selectedKeys"
    :options="parentCateList"
    :props="{expandTrigger: 'hover', value: 'cat_id',label: 'cat_name',childrem: 'children' ,checkStrictly: true }"
    @change="parentCateChange"></el-cascader>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisble = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
  <!-- 编辑分类对话框 -->
  <el-dialog
  title="提示"
  :visible.sync="editDialogVisible"
  width="50%" @close="clearEdit">
  <el-form :model="editCateForm" :rules="addCateFormRules" ref="editCateFormRef" label-width="100px">
  <el-form-item label="分类名称:" prop="cat_name">
    <el-input v-model="editCateForm.cat_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data(){
    return{
      // 查询条件
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      // 商品分类的数据列表
      catelist:[],
      total : 0,
      // 为table指定列的定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name',
        },
      {
        label:'是否有效',
        // 是否有效
        type:'template',
        // 表示当前这一列使用模板名称
        template:'isok'
      },
      {
        label:'排序',
        // 是否有效
        type:'template',
        // 表示当前这一列使用模板名称
        template:'order'
      },
      {
        label:'操作',
        // 是否有效
        type:'template',
        // 表示当前这一列使用模板名称
        template:'opt'
      }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisble:false,
      editDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm:{
        cat_name:'',
        cat_pid:0,
        cat_level:0
      },
      // 添加分类表达的验证规则
      addCateFormRules:{
         cat_name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
          ],
      },
      // 父级分裂列表
      parentCateList:[],
      // 指定级联选择器的配置对象
      
      // 选中的父级分类id数组
      selectedKeys:[],
      editCateForm:{}
    }
  },
  created(){
    this.getCateList()
  },
  methods:{
    async getCateList(){
      const{data:res} = await this.$http.get('categories',{params:this.queryInfo})
      if (res.meta.status !==200) {
        return this.$message.error('获取商品分类失败')
      }
      this.catelist = res.data.result
      console.log(this.catelist);
      // 总数据条数
      this.total = res.data.total
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange(newapge){
      this.queryInfo.pagenum = newapge
      this.getCateList()
    },
    showAddCateDialog(){
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 展示对话框
      this.addCateDialogVisble = true
    },
    async getParentCateList(){
    const{data:res} = await this.$http.get('categories',{params:{type: 2}})
    if (res.meta.status !==200) {
      return this.$message.error('获取用户失败')
    }
    this.parentCateList = res.data
    
    },
    //选择项发生变化触发这个函数
    parentCateChange(){
      // 如果selectedKeys数组lenghth大于0说明选中的父级分类
      // 反之就说明没有选中父级分类
      if(this.selectedKeys > 0){
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length-1]
        // 为当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.lenght
        return
        }else{
          this.addCateForm.cat_pid = 0
          this.addCateForm.cat_level = 0
        }
    },
    addCate(){
      this.$refs.addCateFormRef.validate(async valid =>{
        if(!valid)return
        const{data:res} = await this.$http.post('categories',this.addCateForm)
        if(res.meta.status !== 201){
          return this.$message.error('添加分类失败')
        }
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisble = false
        
      })

    },
    // 监听对话框关闭事件，重置表单数据
    addCateDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0

    },
    async showEditCate(id){
      console.log(id);
      const { data: res } = await this.$http.get("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询分类信息失败！");
      }
      this.editCateForm = res.data;
      this.editDialogVisible = true;
    },
    editCate(){
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "categories/" + this.editCateForm.cat_id,
          { cat_name:this.editCateForm.cat_name }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新分类信息失败！");
        }
        // 关闭对话框
        this.editDialogVisible = false;
        // 刷新数据列表
        this.getCateList();
        // 修改成功
        this.$message.success("更新分类信息成功");
      });
    },
    clearEdit(){
      this.$refs.editCateFormRef.resetFields()
    },
    async removeCateById(id){
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除分类失败");
      }
      this.$message.success("删除分类成功");
      this.getCateList();
    }
  }
}

</script>
<style lang="less" scoped>
.treeTable{
  margin-top: 15px;
}
</style>