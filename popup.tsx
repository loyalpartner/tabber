import React, {useEffect, useState} from "react"
import {mapGroup} from "~/src/utils/tab"
import {FilteredTabs} from "~/src/filtered_tabs"

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
