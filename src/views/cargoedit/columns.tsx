import { ref, computed, reactive, onMounted } from 'vue';
import { getToken, formatToken } from '@/utils/auth';
import axios from 'axios';

const tokenData = getToken();
const token = tokenData.token;
const today = new Date(); // 获取当前日期
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的，所以需要+1
const day = String(today.getDate()).padStart(2, '0');
// 新增数据
export async function addData(data) {
  try {
    const response = await axios.post('http://127.0.0.1:8848/api/admin/orders', data, {
      headers: {
        Authorization: formatToken(token)
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 修改数据
export async function updateData(OrderID, data) {
  let formal = data;
  formal.OrderID = formal.OrderID === 0 || formal.OrderID === "" ? "" : parseInt(formal.OrderID, 10);
  formal.UserID = formal.UserID === 0 || formal.UserID === "" ? "" : parseInt(formal.UserID, 10);
  formal.CargoID = formal.CargoID === 0 || formal.CargoID === "" ? "" : parseInt(formal.CargoID, 10);
  formal.WarehouseID = formal.WarehouseID === 0 || formal.WarehouseID === "" ? "" : parseInt(formal.WarehouseID, 10);
  formal.Status = formal.Status === true ? 'true' : 'false'; // 如果Status为真，则转换为字符串'true'，否则为'false'
  formal.Got = formal.Got === true ? 'true' : 'false';
  try {
    const response = await axios.put(`http://127.0.0.1:8848/api/admin/orders/${OrderID}`, data, {
      headers: {
        Authorization: formatToken(token)
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 删除数据
export async function deleteData(OrderID) {
  try {
    const response = await axios.delete(`http://127.0.0.1:8848/api/admin/orders/${OrderID}`, {
      headers: {
        Authorization: formatToken(token)
      }
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function fetchTableData() {
  try {
    const response = await axios.get('http://127.0.0.1:8848/api/admin/orders', {
      headers: {
        Authorization: formatToken(token)
      }
    });
    // 将Status字段转换为布尔值
    const formattedData = response.data.map(item => ({
      ...item,
      Status: item.Status === 'true' ? true : false, // 如果Status是1，则转换为true，否则为false
      Got: item.Got === 'true' ? true : false, // 如果Got是1，则转换为true，否则为false
      UserID: item.UserID === 0 ? "" : item.UserID,
      CargoID: item.CargoID === 0 ? "" : item.CargoID,
      WarehouseID: item.Warehouse === 0 ? "" : item.WarehouseID,
    }));
    console.log(response.data);
    return formattedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchUserList() {
  try {
    // 假设响应结构调整为直接返回[{value: userId, label: userName}, ...]
    const response = await axios.get('http://127.0.0.1:8848/api/admin/usernames', {
      headers: {
        Authorization: formatToken(token)
      }
    });
    return response.data;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchCargoList() {
  try {
    // 假设响应结构调整为直接返回[{value: userId, label: userName}, ...]
    const response = await axios.get('http://127.0.0.1:8848/api/admin/cargo-names', {
      headers: {
        Authorization: formatToken(token)
      }
    });
    return response.data;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
async function fetchWarehouseList() {
  try {
    // 假设响应结构调整为直接返回[{value: userId, label: userName}, ...]
    const response = await axios.get('http://127.0.0.1:8848/api/admin/warehouse-names', {
      headers: {
        Authorization: formatToken(token)
      }
    });
    return response.data;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export function useColumns() {
  function startEdit(row, index) {
  // 复制当前行数据，以便于编辑
  dataList.value[index] = { ...row, isEditing: true };
}

  async function confirmEdit(row, index) {
  try {
    // 更新数据
    await onUpdate(row);
    // 更新行状态为非编辑状态
    dataList.value[index].isEditing = false;
  } catch (error) {
    console.error("Error confirming edit:", error);
    // 可能需要处理错误情况，比如回滚编辑状态
  }
}
  const dataList = ref([]);
  const list1 = ref([]);
  const list2 = ref([]);
  const list3 = ref([]);
  
  onMounted(async () => {
    const fetchedData = await fetchTableData();
    dataList.value = fetchedData; // 将获取的数据赋值给dataList
    const userlist = await fetchUserList();
    const cargolist = await fetchCargoList();
    const warehouselist = await fetchWarehouseList();
    list1.value = userlist;
    list2.value = cargolist;
    list3.value = warehouselist;
    console.log(list1);
  });
  // 立即加载数据


  const columns: TableColumnList = [
    {
      label: "订单ID",
      prop: "OrderID",
      cellRenderer: ({ row }) => <el-input v-model={row.OrderID} />
    },
    {
      label: "用户",
      prop: "UserID",
      cellRenderer: ({ row }) => (
        <el-select v-model={row.UserID}>
          {list1.value.map(item => {
            return (
              <el-option
                key={item.user_id}
                label={item.username}
                value={item.user_id}
              />
            );
          })}
        </el-select>
      )
    },
     {
      label: "货物ID",
      prop: "CargoID",
      cellRenderer: ({ row }) => (
        <el-select v-model={row.CargoID}>
          {list2.value.map(item => {
            return (
              <el-option
                key={item.cargo_id}
                label={item.cargo_name}
                value={item.cargo_id}
              />
            );
          })}
        </el-select>
      )
    },
    {
      label: "仓库ID",
      prop: "WarehouseID",
      cellRenderer: ({ row }) => (
        <el-select v-model={row.WarehouseID}>
          {list3.value.map(item => {
            return (
              <el-option
                key={item.warehouse_id}
                label={item.warehouse_name}
                value={item.warehouse_id}
              />
            );
          })}
        </el-select>
      )
    },
    {
      label: "订单状态",
      prop: "Status",
      cellRenderer: ({ row }) => (
  <el-switch
    v-model={row.Status}
    inline-prompt
    active-value={true}
    inactive-value={false}
    active-text="完成"
    inactive-text="未完成"
  />
),
    },
     {
      label: "发货地",
       prop: "SendAddress",
       cellRenderer: ({ row }) => <el-input v-model={row.SendAddress} />
    },
    {
      label: "收货地",
      prop: "ReceiveAddress",
      cellRenderer: ({ row }) => <el-input v-model={row.ReceiveAddress} />
    },
    {
      label: "货架地址",
      prop: "ShelfAddress",
      cellRenderer: ({ row }) => <el-input v-model={row.ShelfAddress} />
    },
    {
      label: "约定日期",
      prop: "OrderTime",
      cellRenderer: ({ row }) => (
        <el-date-picker
          v-model={row.OrderTime}
          type="date"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期"
        />
      ),
      minWidth: 110
    },
    {
      label: "预计日期",
      prop: "ExpectedDeliveryTime",
      cellRenderer: ({ row }) => (
        <el-date-picker
          v-model={row.ExpectedDeliveryTime}
          type="date"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期"
        />
      ),
      minWidth: 110
    },
    {
      label: "实际交付日期",
      prop: "ActualDeliveryTime",
      cellRenderer: ({ row }) => (
        <el-date-picker
          v-model={row.ActualDeliveryTime}
          type="date"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期"
        />
      ),
      minWidth: 110
    },
    {
      label: "是否取出",
      prop: "Got",
      cellRenderer: ({ row }) => (
        <el-switch
          v-model={row.Got}
          inline-prompt
          active-value={true}
          inactive-value={false}
          active-text="完成"
          inactive-text="未完成"
        />
      ),
    },
    {
      label: "操作",
      fixed: "right",
      width: 90,
      slot: "operation"
    }
  ];

  async function onAdd() {
  const newRowNumber = dataList.value.length + 1;
  // 初始化用户号为行号+100000
  const newRow = {
    OrderID: newRowNumber + 100000,
    UserID: 0,
    CargoID: 0,
    WarehouseID: 0,
    Status: "false", // 默认状态为未完成
    SendAddress: "",
    ReceiveAddress: "",
    ShelfAddress:"",
    OrderTime: `${year}-${month}-${day}`, // 格式化为YYYY-MM-DD
    ExpectedDeliveryTime: `${year}-${month}-${day}`,
    ActualDeliveryTime: `${year}-${month}-${day}`,
    Got:"false"
  };
  try {
    await addData(newRow);
  } catch (error) {
    console.error("Error adding data:", error);
  }
  newRow.UserID = newRow.UserID === 0 ? null : newRow.UserID;
  newRow.CargoID = newRow.CargoID === 0 ? null : newRow.CargoID;
  newRow.WarehouseID = newRow.WarehouseID === 0 ? null : newRow.WarehouseID;
  dataList.value.push(newRow);
}

  async function onDel(row) {
  const index = dataList.value.indexOf(row);
  if (index !== -1) {
    try {
      await deleteData(row.OrderID);
      dataList.value.splice(index, 1);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
}

  async function onUpdate(row) {
  try {
    await updateData(row.OrderID, row);
    dataList.value = await fetchTableData();
  } catch (error) {
    console.error("Error updating data:", error);
  }
  }
  
    return {
    columns,
    dataList,
    onAdd,
    onDel,
    onUpdate,
    startEdit,
    confirmEdit,
  };
  
}