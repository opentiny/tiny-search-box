// 生成大数据量数据源，用于演示二级面板数据选项的虚拟滚动效果

// 生成 1000 个单选选项
function generateRadioOptions(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    label: `选项-${String(i + 1).padStart(4, '0')}`,
    id: `radio-${i + 1}`
  }))
}

// 生成 500 个多选选项
function generateCheckboxOptions(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    label: `区域-${String(i + 1).padStart(4, '0')}`,
    id: `region-${i + 1}`
  }))
}

// 生成 200 个标签(map)选项，每个含 20 个子值
function generateMapOptions(groupCount: number, childCount: number) {
  return Array.from({ length: groupCount }, (_, i) => ({
    label: `标签组-${String(i + 1).padStart(3, '0')}`,
    id: `tag-group-${i + 1}`,
    options: Array.from({ length: childCount }, (_, j) => ({
      label: `值-${i + 1}-${j + 1}`,
      id: `tag-value-${i + 1}-${j + 1}`
    }))
  }))
}

export const virtualScrollDataSource = [
  {
    label: '单选项(1000条)',
    field: 'radioLarge',
    replace: true,
    options: generateRadioOptions(1000)
  },
  {
    label: '多选项(500条)',
    field: 'checkboxLarge',
    type: 'checkbox',
    options: generateCheckboxOptions(500)
  },
  {
    label: '标签(200组x20值)',
    field: 'mapLarge',
    type: 'map',
    searchKeys: ['label', 'id'],
    options: generateMapOptions(200, 20)
  }
]
