import pinyin from 'pinyin'

export interface Tab {
  id: number
  title: string
  pinyinizedTitle: string
  url?: string | undefined
  active: boolean
}

export interface TabGroup {
  id: number
  title?: string | undefined
  windowId: number
  tabs: Tab[]
  filter: string
}

const pinyinize = (text: string) => pinyin(text, {style: "normal"}).flat().join("")

function mapTab(tab: chrome.tabs.Tab): Tab {
  const {id, title, url, active} = tab
  return {
    id,
    title: title,
    pinyinizedTitle: pinyinize(title),
    url, active
  }
}

export async function tabsFromGroup(group: chrome.tabGroups.TabGroup) {
  const tabs = await chrome.tabs.query({
    groupId: group.id,
    windowId: group.windowId,
  })
  return tabs.map(mapTab)
}

export async function mapGroup(group: chrome.tabGroups.TabGroup): Promise<TabGroup> {
  const {id, title, windowId} = group;
  const tabs = await tabsFromGroup(group)
  return {
    id, title: title, windowId, tabs,
    filter: ""
  }
}
