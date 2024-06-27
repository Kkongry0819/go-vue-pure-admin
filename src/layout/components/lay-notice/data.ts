export interface ListItem {
  avatar: string;
  title: string;
  datetime: string;
  type: string;
  description: string;
  status?: "primary" | "success" | "warning" | "info" | "danger";
  extra?: string;
}

export interface TabItem {
  key: string;
  name: string;
  list: ListItem[];
  emptyText: string;
}

export const noticesData: TabItem[] = [
  {
    key: "1",
    name: "通知",
    list: [],
    emptyText: "暂无通知"
  },
  {
    key: "2",
    name: "消息",
    list: [
      {
        avatar: "https://xiaoxian521.github.io/hyperlink/svg/smile1.svg",
        title: "王小二 评论了你",
        description: "诚在于心，信在于行，诚信在于心行合一。",
        datetime: "今天",
        type: "2"
      },
      {
        avatar: "https://xiaoxian521.github.io/hyperlink/svg/smile2.svg",
        title: "陈一 回复了你",
        description: "长风破浪会有时，直挂云帆济沧海。",
        datetime: "昨天",
        type: "2"
      },
      {
        avatar: "https://xiaoxian521.github.io/hyperlink/svg/smile5.svg",
        title: "张三",
        description: "成事不说，遂事不谏，既往不咎。—— 论语·八佾篇",
        datetime: "三天前",
        type: "2"
      }
    ],
    emptyText: "暂无消息"
  },
  {
    key: "3",
    name: "待办",
    list: [
      {
        avatar: "",
        title: "对于订单表的代码变更",
        description:
          "李四提交于 2024-06-05，需在 2024-06-07 前完成代码变更任务",
        datetime: "",
        extra: "马上到期",
        status: "danger",
        type: "3"
      },
      {
        avatar: "",
        title: "新功能开发",
        description: "运输计划表的创建",
        datetime: "",
        extra: "进行中",
        type: "3"
      },
      {
        avatar: "",
        title: "数据建模",
        description: "任务需要在 2024-06-07 10:00 前完成",
        datetime: "",
        extra: "进行中",
        status: "info",
        type: "3"
      }
    ],
    emptyText: "暂无待办"
  }
];
