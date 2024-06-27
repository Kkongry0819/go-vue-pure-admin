import { message } from "@/utils/message";
import { ref, computed, reactive, onMounted } from 'vue';
import axios from 'axios';
import { getToken, formatToken } from '@/utils/auth';
import { clone } from '@pureadmin/utils';
import dayjs from 'dayjs';

const tokenData = getToken();
const token = tokenData.token;

export async function fetchTableData() {
  try {
    const response = await axios.get('http://127.0.0.1:8848/api/user/orders', {
      headers: {
        Authorization: formatToken(token)
      }
    });
    let format = response.data;
    console.log(format);
    for (let i = 0; i < format.length; i++)
    {
      format[i].Status = format[i].Status === "true" ? "正常" : "异常";
      format[i].Got = format[i].Got === "true" ? "取出" : "未取出";
    }
    return format;
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function useColumns() {
  const search = ref('');
  const tableData = ref([]); // 将 tableData 改为响应式 ref
  const cloneData = clone(tableData.value, true); // 直接克隆 tableData 的值
  const editingRow = reactive({
    index: null,
    data: null,
    originalData: null 
  });

  // 在组件挂载后调用 fetchTableData，确保数据已加载
  onMounted(async () => {
    const fetchedData = await fetchTableData();
    tableData.value = fetchedData; // 将获取的数据赋值给 tableData
  });

  const filterTableData = computed(() => 
    tableData.value.filter(data => 
      !search.value || String(data.OrderID).toLowerCase().includes(search.value.toLowerCase())
    )
  );

  const handleEdit = (index: number, row) => {
    editingRow.index = index;
    editingRow.data = { ...row };
    editingRow.originalData = { ...row }; // 复制原始数据
    console.log(`您正在编辑第 ${index} 行数据`);
  };
  const handleSaveEdit = () => {
    if (editingRow.index !== null) {
      tableData[editingRow.index - 1] = editingRow.data;
      message(`已保存第 ${editingRow.index} 行数据`, {
        type: "success"
      });
      editingRow.index = null;
      editingRow.data = null;
      editingRow.originalData = null;
    }
  };
  const handleCancelEdit = () => {
  if (editingRow.index !== null) {
    // 恢复原始数据
    tableData.value[editingRow.index - 1] = editingRow.originalData;
    editingRow.index = null;
    editingRow.data = null;
    editingRow.originalData = null;
  }
};

  const handleDelete = (index: number, row) => {
    // tableData.splice(index - 1, 1);
    message(`您已删除第 ${index} 行数据`, {
      type: "warning"
    });
  };

  const columns: TableColumnList = [
    {
      label: "订单ID",
      prop: "OrderID"
    },
    {
      label: "用户ID",
      prop: "UserID"
    },
    {
      label: "货物ID",
      prop: "CargoID"
    },
    {
      label: "订单状态",
      prop: "Status"
    },
    {
      label: "下单时间",
      prop: "OrderTime"
    },
    {
      label: "预计送达时间",
      prop: "ExpectedDeliveryTime"
    },
    {
      label: "实际送达时间",
      prop: "ActualDeliveryTime"
    },
    {
      label: "发货地",
      prop: "SendAddress"
    },
    {
      label: "收货地",
      prop: "ReceiveAddress"
    },
    {
      label: "货架地址",
      prop: "ShelfAddress"
    },
    {
      label: "是否取出",
      prop: "Got"
    },
    {
    align: "right",
    headerRenderer: () => (
      <el-input
        v-model={search.value}
        size="small"
        clearable
        placeholder="输入订单号搜索"
      />
    ),
    // cellRenderer: ({ index, row }) => (
    //   <>
    //     {editingRow.index === index ? (
    //       <>
    //         {/* 添加编辑界面，为每一列提供输入框 */}
    //         <el-input
    //           v-model={editingRow.data.UserID}
    //           size="small"
    //           placeholder="请输入用户ID"
    //         />
    //         <el-input
    //           v-model={editingRow.data.CargoID}
    //           size="small"
    //           placeholder="请输入货物ID"
    //         />
    //         <el-input
    //           v-model={editingRow.data.Status}
    //           size="small"
    //           placeholder="请输入状态"
    //         />
    //         {/* 其他列的输入框... */}
    //         <el-button size="small" onClick={handleSaveEdit}>
    //           保存
    //         </el-button>
    //         <el-button size="small" type="danger" onClick={handleCancelEdit}>
    //           取消
    //         </el-button>
    //       </>
    //     ) : (
    //       <>
    //         <el-button size="small" onClick={() => handleEdit(index, row)}>
    //           编辑
    //         </el-button>
    //         <el-button
    //           size="small"
    //           type="danger"
    //           onClick={() => handleDelete(index, row)}
    //         >
    //           删除
    //         </el-button>
    //       </>
    //     )}
    //   </>
    // )
  }
  ];

  return {
    columns,
    filterTableData,
    editingRow,
    handleSaveEdit,
    handleCancelEdit
  };
}
