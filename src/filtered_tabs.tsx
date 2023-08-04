import React, {useEffect, useRef, useState} from "react"
import {Tab, TabGroup} from "~/src/utils/tab"
import * as storage from "~/src/utils/storage"
import {isCtrlKeyCombo, isPress, isShiftKeyCombo} from "./utils/keyboard"

function GroupedTabs({group, selectedTab}) {
  const {tabs: filteredTabs} = group as TabGroup

  // 仅在有过滤结果时进行渲染
  if (filteredTabs.length === 0) {
    return null
  }

  const handleTabClick = (tabId: number) => {
    chrome.tabs.update(tabId, {active: true})
  }

  return (
    <li>
      {group.title}
      <ul>
        {filteredTabs.map((tab: Tab) => (
          <li
            onClick={() => handleTabClick(tab.id)}
            style={{
              cursor: 'pointer',
              background: tab === selectedTab ? 'red' : 'none'
            }}
            key={tab.id}
          >
            {tab.title}
          </li>
        ))}
      </ul>
    </li>
  )
}

function TabGroups({groups, selectedTab}) {
  return (
    <ul>
      {groups.map((group: TabGroup) => (
        <GroupedTabs key={group.id} group={group} selectedTab={selectedTab} />
      ))}
    </ul>
  )
}

export function FilteredTabs({groups}) {
  const [filter, setFilter] = useState("")
  const [selected, setSelected] = useState(storage.selectedTabIndex())

  const inputRef = useRef(null)

  useEffect(() => {
    // 在组件渲染后自动选中输入框中的文本
    if (inputRef.current) {
      inputRef.current.focus()
      // inputRef.current.select()
    }
  }, [])

  const fuzzySearch = ({pinyinizedTitle: title}) => {
    return new RegExp(filter.replace(/\s+/, ".*"), "i").test(title)
  }

  // 为每个标签组添加过滤条件
  const filteredGroups = groups.map((group: TabGroup): TabGroup => {
    return {
      ...group,
      filter: filter,
      tabs: group.tabs.filter(fuzzySearch)
    }
  })

  const tabs = filteredGroups.flatMap((group: TabGroup) => group.tabs) as Tab[]
  const selectedTab = tabs[selected]

  const handleKeyDown = (event) => {
    const last = tabs.length - 1

    if (isPress(event, "Enter") && selectedTab) {
      event.preventDefault()
      storage.saveSelectedTabIndex(tabs.findIndex(tab => tab.active))
      chrome.tabs.update(selectedTab.id, {active: true})
    } else if (isPress(event, "ArrowUp") || isCtrlKeyCombo(event, "p")) {
      event.preventDefault()
      setSelected(selected - 1 < 0 ? last : selected - 1)
    } else if (isPress(event, "ArrowDown") || isCtrlKeyCombo(event, "n")) {
      event.preventDefault()
      setSelected(selected + 1 > last ? 0 : selected + 1)
    }
  }

  return (
    <div onKeyDown={handleKeyDown}>
      <input
        type="text"
        ref={inputRef}
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value)
          setSelected(0)
        }}
        style={{width: "100%"}}
        placeholder="Filter by group title"
      />
      <TabGroups groups={filteredGroups} selectedTab={selectedTab} />
    </div>
  )
}

