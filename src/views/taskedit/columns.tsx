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
  // data.userID = data.userID == "" ? null : parseInt(data.userID);
  // data.ActualDeliveryTime = data.ActualDeliveryTime == "" ? null : data.ActualDeliveryTime;
  // data.ExpectedDeliveryTime = data.ExpectedDeliveryTime == "" ? null : data.ExpectedDeliveryTime;
  // data.OrderTime=data.ExpectedDeliveryTime=="" ? null : data.ExpectedDeliveryTime;
  try {
    const response = await axios.post('http://127.0.0.1:8848/api/admin/transport_tasks', data, {
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
export async function updateData(TaskID, data) {
  let formal = data;
  formal.TaskID = formal.TaskID === 0 || formal.TaskID === "" ? "" : parseInt(formal.TaskID, 10);
  formal.OrderID = formal.OrderID === 0 || formal.OrderID === "" ? "" : parseInt(formal.OrderID, 10);
  formal.DriverID = formal.DriverID === 0 || formal.DriverID === "" ? "" : parseInt(formal.DriverID, 10);
  formal.VehicleID = formal.VehicleID === 0 || formal.VehicleID === "" ? "" : parseInt(formal.VehicleID, 10);
  formal.TransportStatus = formal.TransportStatus === true ? 'true' : 'false'; // 如果Status为真，则转换为字符串'true'，否则为'false'
  try {
    const response = await axios.put(`http://127.0.0.1:8848/api/admin/transport_tasks/${TaskID}`, data, {
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
export async function deleteData(TaskID) {
  try {
    const response = await axios.delete(`http://127.0.0.1:8848/api/admin/transport_tasks/${TaskID}`, {
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
    const response = await axios.get('http://127.0.0.1:8848/api/admin/transport_tasks', {
      headers: {
        Authorization: formatToken(token)
      }
    });
    // 将Status字段转换为布尔值
    const formattedData = response.data.map(item => ({
      ...item,
      TransportStatus: item.TransportStatus === 'true' ? true : false, // 如果Status是1，则转换为true，否则为false
      OrderID: item.OrderID === 0 ? "" : item.OrderID,
      DriverID: item.DriverID === 0 ? "" : item.DriverID,
      VehicleID: item.VehicleID === 0 ? "" : item.VehicleID,
    }));
    console.log(response.data);
    return formattedData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchDriverList() {
  try {
    // 假设响应结构调整为直接返回[{value: userId, label: userName}, ...]
    const response = await axios.get('http://127.0.0.1:8848/api/admin/driver-names', {
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

async function fetchVehicleList() {
  try {
    // 假设响应结构调整为直接返回[{value: userId, label: userName}, ...]
    const response = await axios.get('http://127.0.0.1:8848/api/admin/vehicle-plates', {
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

async function fetchOrderList() {
  try {
    // 假设响应结构调整为直接返回[{value: userId, label: userName}, ...]
    const response = await axios.get('http://127.0.0.1:8848/api/admin/order-ids', {
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
    const driverlist = await fetchDriverList();
    const vehiclelist = await fetchVehicleList();
    const orderlist = await fetchOrderList();
    list1.value = driverlist;
    list2.value = vehiclelist;
    list3.value = orderlist;
    console.log(list1);
  });
  // 立即加载数据


  const columns: TableColumnList = [
    {
      label: "任务ID",
      prop: "TaskID",
      cellRenderer: ({ row }) => <el-input v-model={row.TaskID} />
    },
    {
      label: "订单ID",
      prop: "OrderID",
      cellRenderer: ({ row }) => (
        <el-select v-model={row.OrderID}>
          {list3.value.map(item => {
            return (
              <el-option
                key={item.order_id}
                label={item.order_id}
                value={item.order_id}
              />
            );
          })}
        </el-select>
      )
    },
    {
      label: "司机ID",
      prop: "DriverID",
      cellRenderer: ({ row }) => (
        <el-select v-model={row.DriverID}>
          {list1.value.map(item => {
            return (
              <el-option
                key={item.driver_id}
                label={item.full_name}
                value={item.driver_id}
              />
            );
          })}
        </el-select>
      )
    },
    {
      label: "车辆ID",
      prop: "VehicleID",
      cellRenderer: ({ row }) => (
        <el-select v-model={row.VehicleID}>
          {list2.value.map(item => {
            return (
              <el-option
                key={item.vehicle_id}
                label={item.license_plate}
                value={item.vehicle_id}
              />
            );
          })}
        </el-select>
      )
    },
    // {
    //   label: "仓库ID",
    //   prop: "WarehouseID",
    //   cellRenderer: ({ row }) => (
    //     <el-select v-model={row.WarehouseID}>
    //       {list3.value.map(item => {
    //         return (
    //           <el-option
    //             key={item.warehouse_id}
    //             label={item.warehouse_name}
    //             value={item.warehouse_id}
    //           />
    //         );
    //       })}
    //     </el-select>
    //   )
    // },
//     {
//       label: "订单状态",
//       prop: "Status",
//       cellRenderer: ({ row }) => (
//   <el-switch
//     v-model={row.Status}
//     inline-prompt
//     active-value={true}
//     inactive-value={false}
//     active-text="完成"
//     inactive-text="未完成"
//   />
// ),
//     },
//      {
//       label: "发货地",
//        prop: "SendAddress",
//        cellRenderer: ({ row }) => <el-input v-model={row.SendAddress} />
//     },
//     {
//       label: "收货地",
//       prop: "ReceiveAddress",
//       cellRenderer: ({ row }) => <el-input v-model={row.ReceiveAddress} />
//     },
//     {
//       label: "货架地址",
//       prop: "ShelfAddress",
//       cellRenderer: ({ row }) => <el-input v-model={row.ReceiveAddress} />
//     },
    {
      label: "出发日期",
      prop: "DepartureTime",
      cellRenderer: ({ row }) => (
        <el-date-picker
          v-model={row.DepartureTime}
          type="date"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期"
        />
      ),
      minWidth: 110
    },
    {
      label: "到达日期",
      prop: "ArrivalTime",
      cellRenderer: ({ row }) => (
        <el-date-picker
          v-model={row.ArrivalTime}
          type="date"
          format="YYYY/MM/DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择日期"
        />
      ),
      minWidth: 110
    },
    {
      label: "运输状态",
      prop: "TransportStatus",
      cellRenderer: ({ row }) => (
        <el-switch
          v-model={row.TransportStatus}
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
    TaskID: newRowNumber + 100000,
    OrderID: 0,
    DriverID: 0,
    VehicleID: 0,
    DepartureTime: `${year}-${month}-${day}`,
    ArrivalTime: `${year}-${month}-${day}`,
    TransportStatus: "false", // 默认状态为未完成
  };
  try {
    await addData(newRow);
  } catch (error) {
    console.error("Error adding data:", error);
  }
  newRow.OrderID = newRow.OrderID === 0 ? null : newRow.OrderID;
  newRow.DriverID = newRow.DriverID === 0 ? null : newRow.DriverID;
  newRow.VehicleID = newRow.VehicleID === 0 ? null : newRow.VehicleID;
  dataList.value.push(newRow);
}

  async function onDel(row) {
  const index = dataList.value.indexOf(row);
  if (index !== -1) {
    try {
      await deleteData(row.TaskID);
      dataList.value.splice(index, 1);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
}

  async function onUpdate(row) {
  try {
    await updateData(row.TaskID, row);
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