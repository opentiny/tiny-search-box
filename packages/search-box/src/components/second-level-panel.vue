<template>
  <div tiny_mode="pc">
    <div v-if="state.currentOperators?.length">
      <span class="tvp-search-box__filter-type">{{
        t("tvp.tvpSearchbox.operator")
      }}</span>
      <tiny-dropdown-item
        v-for="(item, index) in state.currentOperators"
        v-show="item.includes(state.inputValue)"
        :key="item + index"
        class="tvp-search-box__dropdown-item"
        :item-data="{ label: item }"
        @item-click="() => setOperator(item)"
      >
        {{ item }}
      </tiny-dropdown-item>
    </div>
    <div
      v-else-if="!state.prevItem.type || state.prevItem.type === 'radio'"
      v-loading="isLoading"
      :class="['tvp-search-box__radio-wrap', 'tvp-search-box__virtual-list', isLoading && 'tvp-search-box__loading-box']"
      :style="{ maxHeight: panelMaxHeight }"
      ref="vsScrollEl"
      @scroll="vsHandleScroll"
    >
      <div class="tvp-search-box__virtual-phantom" :style="{ height: vsTotalHeight + 'px' }">
        <div
          class="tvp-search-box__virtual-content"
          :style="{ transform: 'translateY(' + vsOffsetY + 'px)' }"
        >
          <tiny-dropdown-item
            v-for="(item, vsIndex) in vsVisibleItems"
            :key="vsStartIndex + vsIndex + (item.field || item.label)"
            :disabled="item.isChecked"
            class="tvp-search-box__dropdown-item"
            :item-data="item"
            @item-click="() => selectRadioItem(item)"
          >
            <span v-if="item.match" :title="item.label">
              <span v-for="text in item.match" :key="text">
                <span
                  v-if="text.toLowerCase() === item.hightlighStr"
                  class="tvp-search-box__text-highlight"
                  >{{ text }}</span
                >
                <span v-else>{{ text }}</span>
              </span>
            </span>
            <span v-else :title="item.label">{{ item.label }}</span>
          </tiny-dropdown-item>
        </div>
      </div>
    </div>
    <div
      v-else-if="state.prevItem.type === 'checkbox'"
      v-loading="isLoading"
      :class="isLoading && 'tvp-search-box__loading-box'"
    >
      <div v-if="showCheckBoxList" class="tvp-search-box__checkbox-wrap" :style="{ maxHeight: panelMaxHeight }">
        <div ref="vsScrollEl" class="tvp-search-box__virtual-list tvp-search-box__checkbox-scroll" @scroll="vsHandleScroll">
          <tiny-checkbox-group v-model="state.checkAll" class="tvp-search-box__checkbox">
            <tiny-dropdown-item class="tvp-search-box__dropdown-item tvp-search-box__checkbox-item">
              <tiny-checkbox
                v-model="state.checkAll"
                :indeterminate="state.isIndeterminate"
              >
                {{ t("tvp.tvpSearchbox.selectAll") }}
              </tiny-checkbox>
            </tiny-dropdown-item>
          </tiny-checkbox-group>
          <tiny-checkbox-group
            v-model="state.checkboxGroup"
            class="tvp-search-box__checkbox"
          >
            <div class="tvp-search-box__virtual-phantom" :style="{ height: vsTotalHeight + 'px' }">
              <div
                class="tvp-search-box__virtual-content"
                :style="{ transform: 'translateY(' + vsOffsetY + 'px)' }"
              >
                <tiny-dropdown-item
                  v-for="(item, vsIndex) in vsVisibleItems"
                  :key="(item.field || item.label) + vsStartIndex + vsIndex"
                  class="tvp-search-box__dropdown-item tvp-search-box__checkbox-item"
                >
                  <tiny-checkbox
                    :label="state.prevItem.label + item.label"
                    :title="item.label"
                    class="tvp-search-box__checkbox-item-label"
                  >
                    {{ item.label }}
                  </tiny-checkbox>
                </tiny-dropdown-item>
              </div>
            </div>
          </tiny-checkbox-group>
        </div>
        <div class="tvp-search-box__checkbox-btn">
          <tiny-button size="mini" @click="selectCheckbox(false)">
            {{ t("tvp.tvpSearchbox.cancel") }}
          </tiny-button>
          <tiny-button size="mini" @click="selectCheckbox(true)">
            {{ t("tvp.tvpSearchbox.confirm") }}
          </tiny-button>
        </div>
      </div>
    </div>
    <div v-else-if="state.prevItem.type === 'numRange'" class="tvp-search-box__panel-box">
      <div class="tvp-search-box__number">
        <div class="tvp-search-box__dropdown-title">
          {{ t("tvp.tvpSearchbox.rangeNumberTitle") }}
        </div>
        <div class="tvp-search-box__dropdown-start">
          {{ t("tvp.tvpSearchbox.minValueText") }}{{ state.prevItem.unit ? `(${state.prevItem.unit})` : '' }}
        </div>
        <tiny-form-item
          :prop="state.curMinNumVar"
          class="tvp-search-box__number-item"
          :show-message="state.numberShowMessage"
        >
          <tiny-input
            v-model="state[state.curMinNumVar]"
            type="number"
            class="tvp-search-box__number-input"
          ></tiny-input>
        </tiny-form-item>
        <div class="tvp-search-box__dropdown-end">
          {{ t("tvp.tvpSearchbox.maxValueText") }}{{ state.prevItem.unit ? `(${state.prevItem.unit})` : '' }}
        </div>
        <tiny-form-item :prop="state.curMaxNumVar" class="tvp-search-box__number-item">
          <tiny-input
            v-model="state[state.curMaxNumVar]"
            type="number"
            class="tvp-search-box__number-input"
          ></tiny-input>
        </tiny-form-item>
      </div>
      <div class="tvp-search-box__bottom-btn">
        <tiny-button size="mini" @click="sizeChange(false)">{{
          t("tvp.tvpSearchbox.cancel")
        }}</tiny-button>
        <tiny-button size="mini" @click.stop="sizeChange(true)">
          {{ t("tvp.tvpSearchbox.confirm") }}
        </tiny-button>
      </div>
    </div>
    <div
      v-else-if="state.prevItem.type === 'dateRange'"
      class="tvp-search-box__panel-box"
    >
      <div class="tvp-search-box__date-wrap">
        <div class="tvp-search-box__dropdown-title">
          {{
            state.prevItem.maxTimeLength > 0
              ? t("tvp.tvpSearchbox.timeLengthTitle", {
                  value: (state.prevItem.maxTimeLength / 86400000).toFixed(1),
                })
              : t("tvp.tvpSearchbox.rangeDateTitle")
          }}
        </div>
        <div class="tvp-search-box__dropdown-start">
          {{ t("tvp.tvpSearchbox.rangeBeginLabel") }}
        </div>
        <tiny-form-item
          prop="startDate"
          :show-message="Boolean(state.prevItem.maxTimeLength)"
          class="tvp-search-box__date-item"
        >
          <tiny-date-picker
            v-model="state.startDate"
            :format="state.prevItem.format || state.dateRangeFormat"
            :value-format="state.prevItem.format || state.dateRangeFormat"
            :picker-options="pickerOptions(state.startDate, 'endDate')"
            class="tvp-search-box__date-picker"
            @visible-change="handleDateShow"
          ></tiny-date-picker>
        </tiny-form-item>
        <div class="tvp-search-box__dropdown-end">
          {{ t("tvp.tvpSearchbox.rangeEndLabel") }}
        </div>
        <tiny-form-item prop="endDate" class="tvp-search-box__date-item">
          <tiny-date-picker
            v-model="state.endDate"
            :format="state.prevItem.format || state.dateRangeFormat"
            :value-format="state.prevItem.format || state.dateRangeFormat"
            :picker-options="pickerOptions(state.startDate)"
            class="tvp-search-box__date-picker"
            @change="handleDateShow"
            @blur="handleDateShow"
          ></tiny-date-picker>
        </tiny-form-item>
      </div>
      <div class="tvp-search-box__bottom-btn">
        <tiny-button size="mini" @click="onConfirmDate(false)">
          {{ t("tvp.tvpSearchbox.cancel") }}
        </tiny-button>
        <tiny-button size="mini" @click="onConfirmDate(true)">
          {{ t("tvp.tvpSearchbox.confirm") }}
        </tiny-button>
      </div>
    </div>

    <div
      v-else-if="state.prevItem.type === 'datetimeRange'"
      class="tvp-search-box__panel-box"
    >
      <div class="tvp-search-box__date-wrap">
        <div class="tvp-search-box__dropdown-title">
          {{
            state.prevItem.maxTimeLength > 0
              ? t("tvp.tvpSearchbox.timeLengthTitle", {
                  value: (state.prevItem.maxTimeLength / 86400000).toFixed(1),
                })
              : t("tvp.tvpSearchbox.rangeDateTitle")
          }}
        </div>
        <div class="tvp-search-box__dropdown-start">
          {{ t("tvp.tvpSearchbox.rangeBeginLabel") }}
        </div>
        <tiny-form-item
          prop="startDateTime"
          :show-message="Boolean(state.prevItem.maxTimeLength)"
          class="tvp-search-box__date-item"
        >
          <tiny-date-picker
            v-model="state.startDateTime"
            type="datetime"
            :isutc8="true"
            :format="state.prevItem.format || state.datetimeRangeFormat"
            :value-format="state.prevItem.format || state.datetimeRangeFormat"
            :picker-options="pickerOptions(state.startDateTime, 'endDateTime')"
            class="tvp-search-box__date-picker"
            @change="handleDateShow"
            @blur="handleDateShow"
          ></tiny-date-picker>
        </tiny-form-item>
        <div class="tvp-search-box__dropdown-end">
          {{ t("tvp.tvpSearchbox.rangeEndLabel") }}
        </div>
        <tiny-form-item prop="endDateTime" class="tvp-search-box__date-item">
          <tiny-date-picker
            v-model="state.endDateTime"
            type="datetime"
            :isutc8="true"
            :format="state.prevItem.format || state.datetimeRangeFormat"
            :value-format="state.prevItem.format || state.datetimeRangeFormat"
            :picker-options="pickerOptions(state.startDateTime)"
            class="tvp-search-box__date-picker"
            @change="handleDateShow"
            @blur="handleDateShow"
          ></tiny-date-picker>
        </tiny-form-item>
      </div>
      <div class="tvp-search-box__bottom-btn">
        <tiny-button size="mini" @click="onConfirmDate(false, true)">
          {{ t("tvp.tvpSearchbox.cancel") }}
        </tiny-button>
        <tiny-button size="mini" @click="onConfirmDate(true, true)">
          {{ t("tvp.tvpSearchbox.confirm") }}
        </tiny-button>
      </div>
    </div>

    <div v-else-if="state.prevItem.type === 'map'" v-loading="isLoading">
      <div
        ref="vsScrollEl"
        class="tvp-search-box__virtual-list"
        :style="{ maxHeight: panelMaxHeight }"
        @scroll="vsHandleScroll"
      >
        <span v-if="state.isShowTagKey" class="tvp-search-box__filter-type">{{
          t("tvp.tvpSearchbox.tagKey")
        }}</span>
        <span v-else class="tvp-search-box__filter-type">{{
          t("tvp.tvpSearchbox.tagValue")
        }}</span>
        <div class="tvp-search-box__virtual-phantom" :style="{ height: vsTotalHeight + 'px' }">
          <div
            class="tvp-search-box__virtual-content"
            :style="{ transform: 'translateY(' + vsOffsetY + 'px)' }"
          >
            <tiny-dropdown-item
              v-for="(item, vsIndex) in vsVisibleItems"
              :key="item.label + item.value + vsStartIndex + vsIndex"
              :disabled="item.isChecked"
              class="tvp-search-box__dropdown-item"
              :item-data="item"
              @item-click="() => selectFirstMap(item, state.isShowTagKey)"
            >
              <span :title="item.label">{{ item.label }}</span>
            </tiny-dropdown-item>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Vue2 版本，使用 tiny-vue 的 renderless 架构
import { defineComponent, setup, $props, $prefix } from '@opentiny/vue-common'
import { 
  TinyFormItem,
  TinyDropdownItem,
  TinyCheckbox,
  TinyCheckboxGroup,
  TinyDatePicker,
  TinyInput,
  TinyButton,
  TinyLoading
} from '@opentiny/vue'
import { t } from '../utils/i18n.ts'
import { useVirtualScroll } from '../composables/use-virtual-scroll.ts'

// 简单的 renderless 函数
const renderless = (props, hooks, { emit, nextTick, refs }) => {
  const { computed, reactive, watch, onMounted } = hooks

  // 优先使用传入的 events/handleEvents 函数，如果没有则使用 emit
  const handleEvents = props.handleEvents || props.events || ((eventName, p1, p2) => {
    emit('events', eventName, p1, p2)
  })

  const setOperator = (e) => {
    handleEvents('setOperator', e)
  }

  const selectRadioItem = (e) => {
    handleEvents('selectRadioItem', e)
  }

  const selectCheckbox = (e) => {
    handleEvents('selectCheckbox', e)
  }

  const sizeChange = (e) => {
    handleEvents('sizeChange', e)
  }

  const onConfirmDate = (e, b) => {
    handleEvents('onConfirmDate', e, b)
  }

  const selectFirstMap = (e, b) => {
    handleEvents('selectFirstMap', e, b)
  }

  const handleDateShow = (e) => {
    handleEvents('handleDateShow', e)
  }

  const isLoading = computed(() => {
    return props.state.hasBackupList && props.state.backupList?.length === 0
  })

  const showCheckBoxList = computed(() => {
    return props.state.backupList?.find((item) => !item.isFilter)
  })

  // 虚拟滚动：根据当前类型计算过滤后的列表
  const currentFilteredList = computed(() => {
    const type = props.state.prevItem.type
    const backupList = props.state.backupList || []

    // radio 类型无输入时显示全部
    if (!type || type === 'radio') {
      if (!props.state.inputValue) return backupList
      return backupList.filter((item) => !item.isFilter)
    }

    // checkbox 和 map 始终过滤 isFilter
    return backupList.filter((item) => !item.isFilter)
  })

  const vs = useVirtualScroll(
    { reactive, computed },
    {
      getList: () => currentFilteredList.value,
      itemHeight: 32,
      bufferSize: 5,
      headerHeight: () => {
        const type = props.state.prevItem.type
        // checkbox 的"全选"和 map 的标题在滚动容器内，占 32px
        if (type === 'checkbox' || type === 'map') return 32
        return 0
      }
    }
  )

  // 输入变化时重置滚动位置
  watch(
    () => props.state.inputValue,
    () => {
      vs.vsState.scrollTop = 0
      nextTick(() => {
        if (refs.vsScrollEl) {
          refs.vsScrollEl.scrollTop = 0
        }
      })
    }
  )

  // 切换面板类型时重置滚动位置并重新测量视口高度
  watch(
    () => props.state.prevItem,
    () => {
      vs.vsState.scrollTop = 0
      nextTick(() => {
        if (refs.vsScrollEl) {
          refs.vsScrollEl.scrollTop = 0
          vs.handleScroll({ target: refs.vsScrollEl })
        }
      })
    },
    { deep: true }
  )

  // 挂载后测量实际视口高度，确保首次渲染数量正确
  onMounted(() => {
    if (refs.vsScrollEl) {
      vs.handleScroll({ target: refs.vsScrollEl })
    }
  })

  return {
    setOperator,
    selectRadioItem,
    selectCheckbox,
    sizeChange,
    onConfirmDate,
    selectFirstMap,
    handleDateShow,
    isLoading,
    showCheckBoxList,
    vsTotalHeight: vs.totalHeight,
    vsStartIndex: vs.startIndex,
    vsOffsetY: vs.offsetY,
    vsVisibleItems: vs.visibleItems,
    vsHandleScroll: vs.handleScroll,
    t
  }
}

const api = [
  'setOperator',
  'selectRadioItem',
  'selectCheckbox',
  'sizeChange',
  'onConfirmDate',
  'selectFirstMap',
  'handleDateShow',
  'isLoading',
  'showCheckBoxList',
  'vsTotalHeight',
  'vsStartIndex',
  'vsOffsetY',
  'vsVisibleItems',
  'vsHandleScroll',
  't'
]

export default defineComponent({
  name: $prefix + 'SearchBoxSecondLevelPanel',
  emits: ['events', 'click'],
  components: {
    TinyFormItem,
    TinyDropdownItem,
    TinyCheckbox,
    TinyCheckboxGroup,
    TinyDatePicker,
    TinyInput,
    TinyButton
  },
  directives: {
    loading: TinyLoading.directive
  },
  props: {
    ...$props,
    state: {
      type: Object,
      default: () => ({}),
    },
    pickerOptions: {
      type: Function,
      default: () => {
        // do nothing.
      }
    },
    events: {
      type: Function,
      default: null
    },
    handleEvents: {
      type: Function,
      default: null
    },
    panelMaxHeight: {
      type: String,
      default: '999px'
    }
  },
  setup(props, context) {
    return setup({ props, context, renderless, api })
  }
})
</script>
