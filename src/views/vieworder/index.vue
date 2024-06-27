<template>
  <div style="position: sticky; top: 0;">
    <pure-table :data="filterTableData" :columns="columns">
      <template #nameHeader>
        <span class="flex items-center">
          <img :src="GenshinImpactSvg" class="w-5 h-5 mr-2" />
          角色
        </span>
      </template>
    </pure-table>
  </div>
</template>

<script setup lang="ts">
import { useColumns } from "./columns";
import GenshinImpactSvg from "@/assets/svg/genshin.svg";

const { columns, filterTableData } = useColumns();
</script>