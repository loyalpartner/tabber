import React, {useEffect, useRef, useState} from "react"
import {mapGroup, Tab, TabGroup} from "~tab"

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
            key={tab.id}>{tab.title}</li>
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

function FilteredTabs({groups}) {
  const [filter, setFilter] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef(null);

  useEffect(() => {
    // 在组件渲染后自动选中输入框中的文本
    if (inputRef.current) {
      inputRef.current.focus();
      // inputRef.current.select();
    }
  }, []);

  // 为每个标签组添加过滤条件
  const filteredGroups = (groups as TabGroup[]).map((group: TabGroup): TabGroup => {
    return {
      ...group,
      filter: filter,
      tabs: group.tabs.filter(({pinyinizedTitle: title}) => (
        title.toLowerCase().includes(filter.toLowerCase()))
      )
    }
  })

  let tabs = filteredGroups.flatMap((group: TabGroup) => group.tabs)
  let selectedTab = tabs[selectedIndex]

  const handleKeyDown = (e) => {
    const {key, altKey, shiftKey, ctrlKey} = e
    const lastIndex = tabs.length - 1;

    const isTabPress = key === "Tab" && !altKey && !shiftKey && !ctrlKey;
    const isShiftTabPress = key === "Tab" && !altKey && shiftKey && !ctrlKey;

    if (key === "Enter" && selectedTab) {
      chrome.tabs.update(selectedTab.id, {active: true});
    } else if (key === "ArrowUp" || isShiftTabPress) {
      setSelectedIndex(selectedIndex - 1 < 0 ? lastIndex : selectedIndex - 1);
    } else if (key === "ArrowDown" || isTabPress) {
      setSelectedIndex(selectedIndex + 1 > lastIndex ? 0 : selectedIndex + 1);
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
          setSelectedIndex(0)
        }}
        style={{width: "100%"}}
        placeholder="Filter by group title"
      />
      <TabGroups groups={filteredGroups} selectedTab={selectedTab} />
    </div>
  )
}

function IndexPopup() {
  const [tabGroups, setTabGroups] = useState([])

  const fetchTabGroups = async () => {
    const groups = await chrome.tabGroups.query({
      windowId: chrome.windows.WINDOW_ID_CURRENT,
    })

    const updatedGroups = await Promise.all(
      groups.map(mapGroup)
    )

    console.log(updatedGroups)

    setTabGroups(updatedGroups)
  }

  useEffect(() => {fetchTabGroups()}, [])

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: 500,
      }}
    >
      <FilteredTabs groups={tabGroups} />
    </div>
  )
}

export default IndexPopup
