<template>
    <main id="todomain" class="container">
        <h1 v-text="$route.params.title"></h1>
        <p v-text="tables($route.params.title).desc"></p>
        <div class="d-flex align-items-stretch flex-wrap gap-2 py-4">
            <span>filter</span>
            <input v-model="filter.text" placeholder="match">
            <select v-model="filter.col">
                <option v-for="i in cols" :value="i.name" v-text="i.name"></option>
            </select>
            <button @click="addFilter">add filter</button>
            <button @click="clearFilters">clear filters</button>
        </div>
        <section>
            <div
                :style='{ overflow: "auto", display: "grid", "grid-template": `auto / repeat(${cols.length + 1}, auto)`, rowGap: "0.6rem" }'>
                <template v-for="(i, idx) in cols">
                    <span class="d-flex align-items-center" style="border-bottom: 1px dashed silver;">
                        <div v-text="i.name"></div>
                        <span class="text-primary" style="cursor: pointer;" @click="togglehide(idx)">show/hide</span>
                        <span v-if="!i.default" class="text-danger" style="cursor: pointer;" @click="deleteCol(idx)">
                            delete
                        </span>
                    </span>
                </template>
                <div>
                    <span @click="addingCol = true" v-if="!addingCol">+</span>
                    <div v-else>
                        <input v-model="colName">
                        <button @click="addCol">add</button>
                    </div>
                </div>
                <template v-for="(i, idx) in data" class="d-flex gap-3">
                    <div v-for="(v, vdx) in i" style="width: fit-content;white-space: nowrap;">
                        <div v-if="showCols.includes(vdx)" style="display: flex;gap: 1rem;" d>
                            <span v-text="v" v></span>
                            <span e @click="startEditRow" class="text-primary">edit</span>
                        </div>
                        <div style="display: none;" o>
                            <input>
                            <button @click="editRow(idx, vdx, $event)">edit</button>
                        </div>
                    </div>
                    <span class="text-danger" style="cursor: pointer;" @click="deleteRow(idx)">delete</span>
                </template>
            </div>
        </section>
        <form class="pt-4">
            <h3>add task</h3>
            <template v-for="i in cols">
                <input v-if="i.name != 'due date'" class="w-100 my-2" :placeholder="i.name">
            </template>
            <button @click.prevent="submit">add task</button>
        </form>
    </main>
</template>
<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { tables } from "@/includes/default.js";

let route = useRoute();

const cols = ref(tables(route.params.title).cols);
const data = ref(tables(route.params.title).data);

function submit() {
    let list = [];
    document.forms[0].querySelectorAll("input").forEach(i => {
        list.push(i.value)
    });
    list.splice(2, 0, new Date().toLocaleString());
    data.value.push(list);
    let ts = tables();
    ts[ts.findIndex(i => i.title == route.params.title)].data = data.value;
    sessionStorage.tables = JSON.stringify(ts);
    document.forms[0].querySelectorAll("input").forEach(i => {
        i.value = "";
    });
}

const addingCol = ref(false);
const colName = ref("");
const showCols = ref(Array.from(Array(cols.value.length).keys()));
const filter = ref({ text: "", col: cols.value[0].name });

function addFilter() {
    data.value = data.value.filter(i => i[cols.value.findIndex(j => j.name == filter.value.col)].match(RegExp(filter.value.text)));
}
function clearFilters() {
    data.value = tables(route.params.title).data;
}
function addCol() {
    if (!colName.value || !tables(route.params.title).cols.filter(i => i.name == colName.value).length == 0) return
    cols.value.push({ name: colName.value, show: true, default: false });
    let ts = tables();
    ts[ts.findIndex(i => i.title == route.params.title)].cols = cols.value;
    for (const i of data.value) i.push("");
    ts[ts.findIndex(i => i.title == route.params.title)].data = data.value;
    sessionStorage.tables = JSON.stringify(ts);
    addingCol.value = false;
    colName.value = "";
}
function deleteCol(i) {
    cols.value.splice(i, 1);
    let ts = tables();
    ts[ts.findIndex(i => i.title == route.params.title)].cols = cols.value;
    for (const ix of data.value) ix.splice(i, 1);
    ts[ts.findIndex(i => i.title == route.params.title)].data = data.value;
    console.log(i);
    sessionStorage.tables = JSON.stringify(ts);
    showCols.value = Array.from(Array(cols.value.length).keys());
}
function togglehide(idx) {
    if (showCols.value.includes(idx)) showCols.value = showCols.value.filter(i => i != idx);
    else showCols.value.push(idx);
}
function startEditRow(e) {
    let el = e.target.parentNode;
    el.style.display = "none";
    el.parentNode.querySelector("[o]").style.display = "flex";
    el.parentNode.querySelector("input").value = el.querySelector("[v]").innerText;
    el.parentNode.querySelector("input").focus();
}

function editRow(idx, vdx, e) {
    let el = e.target.parentNode;
    data.value[idx][vdx] = el.querySelector("input").value;
    let ts = tables();
    ts[ts.findIndex(i => i.title == route.params.title)].data = data.value;
    sessionStorage.tables = JSON.stringify(ts);
    el.style.display = "none";
    el.parentNode.querySelector("[d]").style.display = "flex";
}

function deleteRow(idx) {
    data.value.splice(idx, 1);
    let ts = tables();
    ts[ts.findIndex(i => i.title == route.params.title)].data = data.value;
    sessionStorage.tables = JSON.stringify(ts);
}
</script>
<style lang="scss">
#todomain>section>div {
    &>span {
        &:hover>span {
            visibility: visible;
        }

        &>span {
            visibility: hidden;
            padding: 0.4rem;
        }
    }

    &>div>div {
        &:hover>span[e] {
            visibility: visible;
        }

        &>span[e] {
            visibility: hidden;
        }
    }
}
</style>