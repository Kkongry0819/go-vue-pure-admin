<script setup lang="ts">
import { ref, onMounted,toRefs} from 'vue';
import { useColumns } from "./columns";
import Empty from "./empty.svg?component";
import Change from "./change.svg?component";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { defineComponent } from 'vue';
import AddFill from "@iconify-icons/ep/plus";
import Delete from "@iconify-icons/ep/delete";
// import Change from "icon-park-outline";
const { columns, dataList, onAdd, onDel,startEdit,confirmEdit } = toRefs(useColumns());
// 不需要重新声明columnsRef和dataListRef，直接使用上面onMounted中创建的引用
defineComponent({
  name: 'SystemUiconsCloudDownloadAlt',
});
</script>
<template>
  <div class="flex">
    <pure-table
      row-key="id"
      align-whole="center"
      :header-cell-style="{
        background: 'var(--el-fill-color-light)',
        color: 'var(--el-text-color-primary)'
      }"
      :data="dataList"
      :columns="columns"
      
    >
    <template #empty>
        <Empty fill="var(--el-svg-monochrome-grey)" class="m-auto" />
      </template>
      <template #append>
        <el-button
          plain
          class="w-full my-2"
          :icon="useRenderIcon(AddFill)"
          @click="onAdd"
        >
          添加一行数据
        </el-button>
      </template>
<template #operation="{ row, index }">
  <!-- 编辑按钮 -->
  <el-button
    v-if="!row.isEditing"
    class="reset-margin"
    link
    type="primary"
    :icon="useRenderIcon(Change)"
    @click="startEdit(row, index)"
  />
  <!-- 确认编辑按钮 -->
  <el-button
    v-if="row.isEditing"
    class="reset-margin"
    link
    type="success"
    :icon="useRenderIcon(Change)"
    @click="confirmEdit(row, index)"
  />
  <!-- 删除按钮保持不变 -->
  <el-button
    class="reset-margin"
    link
    type="primary"
    :icon="useRenderIcon(Delete)"
    @click="onDel(row)"
  />
</template>
    </pure-table>
  </div>
</template>

<style scoped>
:deep(.el-table__inner-wrapper::before) {
  height: 0;
}
</style>