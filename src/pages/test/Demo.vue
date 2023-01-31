<template>
  <n-button @click="createMessage"> 漏斗图标 </n-button>
</template>

<script lang="ts" setup>
import { NButton, useMessage } from "naive-ui";
const message = useMessage();
const createMessage = () => {
  message.warning("I never needed anybody's help in any way");
};
</script>
