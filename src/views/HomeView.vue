<template>
  <main class="container">
    <h1>Todo list</h1>
    <h3>tables</h3>
    <div v-if="tdata.length > 0" class="d-flex justify-content-between gap-4 my-4" v-for="(table, i) in tdata" :key="table.title">
      <div class="d-flex gap-4 align-items-center">
        <h4 class="m-0" v-text="table.title"></h4>
        <p class="m-0" v-text="table.desc"></p>
        <span class="m-0 fw-lighter" style="color: #777;font-size: 0.8rem;"
          v-text="`${new Date(table.created).toLocaleString()}`"></span>
      </div>
      <div class="d-flex gap-4 align-items-center">
        <span class="text-danger" style="cursor: pointer;" @click="del(i)">delete</span>
        <RouterLink :to="`/${table.title}`" class="text-primary">view</RouterLink>
      </div>
    </div>
    <div v-else>no table exists</div>
    <form class="d-flex flex-column align-items-start gap-2">
      <h3>Create table</h3>
      <label for="name">name</label>
      <input class="w-100" name="name" v-model="form.title">
      <label for="description">description</label>
      <textarea class="w-100" name="desc" v-model="form.desc"></textarea>
      <button class="mt-4" @click.prevent="submit">create table</button>
    </form>
  </main>
</template>
<script setup>
import { reactive, ref } from "vue";
import { tables } from "@/includes/default.js";

const form = reactive({ title: "", desc: "" })
const tdata = ref(tables());

function submit() {
  if (!form.title || !form.desc) return;
  let t = tables()
  t.push({
    title: form.title,
    desc: form.desc,
    created: Date.now(),
    cols: [
      { name: "title", show: true, default: true },
      { name: "description", show: true, default: true },
      { name: "due date", show: true, default: true },
      { name: "priority", show: true, default: true }
    ],
    data: []
  });
  sessionStorage.tables = JSON.stringify(t);
  tdata.value = tables();
  form.title = "";
  form.desc = "";
}
function del(i) {
  if (!confirm("Delete table?")) return;
  let t = tables();
  t.splice(i, 1);
  sessionStorage.tables = JSON.stringify(t);
  tdata.value = tables();
}
</script>