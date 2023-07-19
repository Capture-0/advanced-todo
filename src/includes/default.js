function tables(t = null) {
    // get tables, if <t> provided return table with title <t> else return all tables
    if (!sessionStorage.tables) return [];
    let arr = JSON.parse(sessionStorage.tables);
    if (t) for (const i of arr) if (i.title == t) return i;
    return arr;
  }
  
export { tables };