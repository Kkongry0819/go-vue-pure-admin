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
    const response = await axios.post('http://127.0.0.1:8848/api/register', data, {
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
export async function updateData(UserID, data) {
  let formal = data;
  formal.UserID = formal.UserID === 0 || formal.UserID === "" ? "" : parseInt(formal.UserID, 10);
  // formal.Password = formal.Password === "***********"  ? "" : parseInt(formal.UserID, 10);
  formal.Role = formal.Role === true ? '1' : '3'; // 如果Status为真，则转换为字符串'true'，否则为'false'

  try {
    const response = await axios.put(`http://127.0.0.1:8848/api/admin/users/${UserID}`, formal, {
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
export async function deleteData(UserID) {
  try {
    const response = await axios.delete(`http://127.0.0.1:8848/api/admin/users/${UserID}`, {
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
    const response = await axios.get('http://127.0.0.1:8848/api/admin/users', {
      headers: {
        Authorization: formatToken(token)
      }
    });
    // 将role字段转换为布尔值
    const formattedData = response.data.map(item => ({
      ...item,
      Role: item.Role === "1" ? true : false, // 如果Status是1，则转换为true，否则为false
    }));
    console.log(response.data);
    return formattedData;
  } catch (error) {
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
  // const originpassword;
  onMounted(async () => {
    const fetchedData = await fetchTableData();
    dataList.value = fetchedData; // 将获取的数据赋值给dataList
  });
  // 立即加载数据


  const columns: TableColumnList = [
   {
      label: "用户ID",
      prop: "UserID",
      cellRenderer: ({ row }) => <el-input v-model={row.UserID} />
    },
    {
      label: "用户名",
      prop: "Username",
      cellRenderer: ({ row }) => <el-input v-model={row.Username} />
    },
    {
      label: "姓名",
      prop: "FullName",
      cellRenderer: ({ row }) => <el-input v-model={row.FullName} />
    },
    {
      label: "密码",
      prop: "Password",
      
      cellRenderer: ({ row }) => <el-input v-model={row.Password}
        type="password" />
    },
    {
      label: "联系电话",
      prop: "PhoneNumber",
      cellRenderer: ({ row }) => <el-input v-model={row.PhoneNumber} />
    },
    {
      label: "邮箱",
      prop: "Email",
      cellRenderer: ({ row }) => <el-input v-model={row.Email} />
    },
    {
      label: "地址",
      prop: "Address",
      cellRenderer: ({ row }) => <el-input v-model={row.Address} />
    },
    {
      label: "角色",
      prop: "Role",
      cellRenderer: ({ row }) => (
  <el-switch
    v-model={row.Role}
    inline-prompt
    active-value={true}
    inactive-value={false}
    active-text="管理员"
    inactive-text="用户"
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
    UserID: newRowNumber + 100000,
    Username: "",
    FullName: "",
    Password: "",
    PhoneNumber: "",
    Email: "",
    Address: "",
    Role: "3", // 默认状态为用户
  };
  try {
    await addData(newRow);
  } catch (error) {
    console.error("Error adding data:", error);
  }
  dataList.value.push(newRow);
}

  async function onDel(row) {
  const index = dataList.value.indexOf(row);
  if (index !== -1) {
    try {
      await deleteData(row.UserID);
      dataList.value.splice(index, 1);
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  }
}

  async function onUpdate(row) {
  try {
    await updateData(row.UserID, row);
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