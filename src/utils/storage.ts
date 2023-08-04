const SELECTED_TAB_INDEX = "selected.tab.index"

export function selectedTabIndex(){
  let item = localStorage.getItem(SELECTED_TAB_INDEX)
  return parseInt(item) || 0
}

export function saveSelectedTabIndex(item: any) {
  localStorage.setItem(SELECTED_TAB_INDEX, "" + item)
}
