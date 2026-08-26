<template>
  <div
    :class="[
      'tvp-search-box',
      size === 'small' ? 'tvp-search-box--small' : '',
      showPrefixIcon ? '' : 'hide-prefix-icon'
    ]"
    @click.stop="showPopover(state, false)"
  >
    <tiny-icon-search
      v-if="showPrefixIcon"
      class="tvp-search-box__prefix"
    />
    <tiny-tag
      v-for="(tag, index) in modelValue"
      :key="tag.field + index"
      :closable="!isTagDisabled(tag)"
      class="tvp-search-box__tag"
      :class="editable && tag.type !== 'map' ? 'tvp-search-box__tag-editor' : ''"
      :title="`${tag.label} ${tag.operator || ':'} ${tag.value}`"
      @close="deleteTag(tag)"
      @click.stop="editTag(tag, index, $event)"
    >
      <span class="tvp-search-box__tag-value">{{ tag.label }} {{ tag.operator || ':' }} {{ tag.value }} </span>
    </tiny-tag>
    <span
      v-if="modelValue.length"
      class="tvp-search-box__placeholder"
    ></span>
    <div class="tvp-search-box__form">
      <div class="tvp-search-box__input-wrapper">
        <section class="tvp-search-box__prop">
          <span v-show="state.propItem.label"
            >{{ state.propItem.label }}&nbsp;{{ `${state.operatorValue ? state.operatorValue : ''}&nbsp;` }}</span
          >
          <span v-show="state.propItem.value">{{ state.propItem.value }}</span>
        </section>
        <tiny-popover
          ref="dropdownRef"
          v-model="state.visible"
          trigger="manual"
          placement="bottom-start"
          class="tvp-search-box__dropdown"
          popper-class="tvp-search-box__dropdown-menu"
          :visible-arrow="false"
          :append-to-body="appendToBody"
        >
          <template #reference>
            <tiny-input
              ref="inputRef"
              v-model="state.inputValue"
              class="tvp-search-box__input"
              :placeholder="state.placeholder"
              :maxlength="maxlength && maxlength + 1"
              @keydown.delete.stop="backspaceDeleteTag"
              @keydown.enter.stop="createTag"
              @input="handleInput"
              @click="handleClick"
            >
              <template #suffix>
                <tiny-icon-close
                  v-show="isShowClose"
                  class="tvp-search-box__input-close"
                  @click.stop="clearTag"
                />
                <span
                  v-show="
                    isShowClose &&
                    (showHelp || state.instance?.$slots?.['suffix-icon'] || state.instance?.slots?.['suffix-icon'])
                  "
                  class="tvp-search-box__input-separator"
                ></span>
                <span
                  v-if="state.instance?.$slots?.['suffix-icon'] || state.instance?.slots?.['suffix-icon']"
                  :class="showHelp ? 'tvp-search-box__suffix-icon-slot' : 'tvp-search-box__suffix-icon-slot-no-help'"
                >
                  <slot name="suffix-icon"></slot>
                </span>
                <tiny-tooltip
                  v-if="showHelp"
                  effect="light"
                  :content="t('tvp.tvpSearchbox.help')"
                  placement="top"
                >
                  <tiny-icon-help-query
                    class="tvp-search-box__input-help"
                    @click.stop="helpClick"
                  />
                </tiny-tooltip>
                <tiny-icon-search
                  class="tvp-search-box__input-search"
                  @click.stop="createTag"
                />
              </template>
            </tiny-input>
          </template>
          <div
            class="tvp-search-box__dropdown"
            :style="{ 'max-height': panelMaxHeight }"
            @mouseup.stop="() => {}"
          >
            <div v-show="!state.propItem.label || state.inputValue?.trim()">
              <slot
                v-if="state.instance?.slots['first-panel']"
                name="first-panel"
                v-bind="{
                  state,
                  handleEvents
                }"
                @click.stop
              ></slot>
              <TinySearchBoxFirstLevelPanel
                v-else
                :state="state"
                :handleEvents="handleEvents"
              >
              </TinySearchBoxFirstLevelPanel>
            </div>
            <div v-show="state.propItem.label">
              <slot
                v-if="state.instance?.slots['second-panel']"
                name="second-panel"
                v-bind="{
                  state,
                  pickerOptions,
                  handleEvents,
                  back: () => resetInput(state)
                }"
                @click.stop
              ></slot>
              <TinySearchBoxSecondLevelPanel
                v-else-if="state.prevItem.type !== 'custom'"
                :state="state"
                :picker-options="pickerOptions"
                :panel-max-height="panelMaxHeight"
                @events="handleEvents"
              ></TinySearchBoxSecondLevelPanel>
              <div
                v-else
                class="tvp-search-box__panel-box"
                @click="showDropdown(state)"
              >
                <slot
                  :name="state.prevItem.slotName"
                  v-bind="{
                    showDropdown: () => showDropdown(state),
                    onConfirm: handleConfirm
                  }"
                  @click.stop
                ></slot>
              </div>
            </div>
          </div>
        </tiny-popover>
      </div>

      <template v-if="editable">
        <tiny-popover
          ref="popoverRef"
          v-model="state.popoverVisible"
          placement="bottom-start"
          :visible-arrow="false"
          trigger="manual"
          popper-class="tvp-search-box__popover"
          class="tvp-search-box__form-popover"
          :append-to-body="appendToBody"
        >
          <template v-if="state.prevItem.type !== 'custom'">
            <div class="tvp-search-box__date-wrap">
              <div class="tvp-search-box__dropdown-start">
                {{ t('tvp.tvpSearchbox.attributeType') }}
              </div>
              <div class="tvp-search-box__number-item">
                <tiny-select
                  v-model="state.selectValue"
                  searchable
                  :disabled="state.prevItem.editAttrDisabled || state.prevItem.disableDelete"
                >
                  <tiny-option
                    v-if="state.selectValue === state.allTypeAttri.label"
                    :key="state.allTypeAttri.label"
                    :label="t('tvp.tvpSearchbox.allProperty')"
                    :value="state.allTypeAttri.label"
                    :disabled="selectItemIsDisable(state.allTypeAttri)"
                    @click="selectPropChange(state.allTypeAttri, selectItemIsDisable(state.allTypeAttri))"
                  >
                  </tiny-option>
                  <tiny-option
                    v-for="item in state.recordItems"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                    :disabled="selectItemIsDisable(item)"
                    @click="selectPropChange(item, selectItemIsDisable(item))"
                  >
                  </tiny-option>
                </tiny-select>
              </div>
              <div
                v-if="state.prevItem.operators"
                class="tvp-search-box__dropdown-end"
              >
                {{ t('tvp.tvpSearchbox.operator') }}
              </div>
              <div
                v-if="state.prevItem.operators"
                class="tvp-search-box__number-item"
              >
                <tiny-select v-model="state.operatorValue">
                  <tiny-option
                    v-for="item in state.currentOperators"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </tiny-option>
                </tiny-select>
              </div>
              <div
                v-if="state.prevItem.type !== 'numRange'"
                class="tvp-search-box__dropdown-end"
              >
                {{ t('tvp.tvpSearchbox.tagValue') }}
              </div>
              <div
                v-if="!['numRange', 'dateRange', 'datetimeRange', 'custom'].includes(state.prevItem.type)"
                class="tvp-search-box__number-item"
                :class="{ 'is-error': state.formErrors.inputEditValue }"
              >
                <tiny-select
                  v-if="state.currentEditValue?.length > 0"
                  v-model="state.inputEditValue"
                  class="tvp-search-box-select"
                  :multiple="Boolean(state.prevItem.mergeTag)"
                  :allow-create="state.prevItem?.allowCreate"
                  filterable
                  default-first-option
                  clearable
                >
                  <tiny-option
                    v-for="item in state.currentEditValue"
                    :key="item.label"
                    :label="item.label"
                    :value="item.label"
                  >
                  </tiny-option>
                </tiny-select>
                <tiny-input
                  v-else
                  v-model="state.inputEditValue"
                  clearable
                ></tiny-input>
                <div v-if="state.formErrors.inputEditValue" class="tvp-search-box__error-msg">
                  {{ state.formErrors.inputEditValue }}
                </div>
              </div>
              <div
                v-if="state.prevItem.type === 'numRange'"
                class="tvp-search-box__number"
              >
                <div class="tvp-search-box__dropdown-start">
                  {{ t('tvp.tvpSearchbox.minValueText') }}{{ state.prevItem.unit ? `(${state.prevItem.unit})` : '' }}
                </div>
                <div
                  :class="['tvp-search-box__number-item', { 'is-error': state.formErrors[state.curMinNumVar] }]"
                >
                  <tiny-input
                    v-model="state[state.curMinNumVar]"
                    type="number"
                    class="tvp-search-box__number-input"
                  ></tiny-input>
                  <div v-if="state.formErrors[state.curMinNumVar] && state.numberShowMessage" class="tvp-search-box__error-msg">
                    {{ state.formErrors[state.curMinNumVar] }}
                  </div>
                </div>
                <div class="tvp-search-box__dropdown-end">
                  {{ t('tvp.tvpSearchbox.maxValueText') }}{{ state.prevItem.unit ? `(${state.prevItem.unit})` : '' }}
                </div>
                <div
                  :class="['tvp-search-box__number-item', { 'is-error': state.formErrors[state.curMaxNumVar] }]"
                >
                  <tiny-input
                    v-model="state[state.curMaxNumVar]"
                    type="number"
                    class="tvp-search-box__number-input"
                  ></tiny-input>
                  <div v-if="state.formErrors[state.curMaxNumVar]" class="tvp-search-box__error-msg">
                    {{ state.formErrors[state.curMaxNumVar] }}
                  </div>
                </div>
              </div>
              <div
                v-if="state.prevItem.type === 'dateRange'"
                class="tvp-search-box__date-wrap"
              >
                <div class="tvp-search-box__dropdown-title">
                  {{
                    state.prevItem.maxTimeLength > 0
                      ? t('tvp.tvpSearchbox.timeLengthTitle', {
                          value: (state.prevItem.maxTimeLength / 86400000).toFixed(1)
                        })
                      : t('tvp.tvpSearchbox.rangeDateTitle')
                  }}
                </div>
                <div class="tvp-search-box__dropdown-start">
                  {{ t('tvp.tvpSearchbox.rangeBeginLabel') }}
                </div>
                <div
                  :class="['tvp-search-box__date-item', { 'is-error': state.formErrors.startDate }]"
                >
                  <tiny-date-picker
                    v-model="state.startDate"
                    :format="state.prevItem.format || state.dateRangeFormat"
                    :value-format="state.prevItem.format || state.dateRangeFormat"
                    :picker-options="pickerOptions(state.startDate, 'endDate')"
                    class="tvp-search-box__date-picker"
                    @change="checkFormValidation()"
                  ></tiny-date-picker>
                  <div v-if="state.formErrors.startDate && state.prevItem.maxTimeLength" class="tvp-search-box__error-msg">
                    {{ state.formErrors.startDate }}
                  </div>
                </div>
                <div class="tvp-search-box__dropdown-end">
                  {{ t('tvp.tvpSearchbox.rangeEndLabel') }}
                </div>
                <div
                  :class="['tvp-search-box__date-item', { 'is-error': state.formErrors.endDate }]"
                >
                  <tiny-date-picker
                    v-model="state.endDate"
                    :format="state.prevItem.format || state.dateRangeFormat"
                    :value-format="state.prevItem.format || state.dateRangeFormat"
                    :picker-options="pickerOptions(state.startDate)"
                    class="tvp-search-box__date-picker"
                    @change="checkFormValidation()"
                  ></tiny-date-picker>
                  <div v-if="state.formErrors.endDate" class="tvp-search-box__error-msg">
                    {{ state.formErrors.endDate }}
                  </div>
                </div>
              </div>
              <div
                v-if="state.prevItem.type === 'datetimeRange'"
                class="tvp-search-box__date-wrap"
              >
                <div class="tvp-search-box__dropdown-title">
                  {{
                    state.prevItem.maxTimeLength > 0
                      ? t('tvp.tvpSearchbox.timeLengthTitle', {
                          value: (state.prevItem.maxTimeLength / 86400000).toFixed(1)
                        })
                      : t('tvp.tvpSearchbox.rangeDateTitle')
                  }}
                </div>
                <div class="tvp-search-box__dropdown-start">
                  {{ t('tvp.tvpSearchbox.rangeBeginLabel') }}
                </div>
                <div
                  :class="['tvp-search-box__date-item', { 'is-error': state.formErrors.startDateTime }]"
                >
                  <tiny-date-picker
                    v-model="state.startDateTime"
                    type="datetime"
                    :isutc8="true"
                    :format="state.prevItem.format || state.datetimeRangeFormat"
                    :value-format="state.prevItem.format || state.datetimeRangeFormat"
                    :picker-options="pickerOptions(state.startDateTime, 'endDateTime')"
                    class="tvp-search-box__date-picker"
                    @change="checkFormValidation()"
                  ></tiny-date-picker>
                  <div v-if="state.formErrors.startDateTime && state.prevItem.maxTimeLength" class="tvp-search-box__error-msg">
                    {{ state.formErrors.startDateTime }}
                  </div>
                </div>
                <div class="tvp-search-box__dropdown-end">
                  {{ t('tvp.tvpSearchbox.rangeEndLabel') }}
                </div>
                <div
                  :class="['tvp-search-box__date-item', { 'is-error': state.formErrors.endDateTime }]"
                >
                  <tiny-date-picker
                    v-model="state.endDateTime"
                    type="datetime"
                    :isutc8="true"
                    :format="state.prevItem.format || state.datetimeRangeFormat"
                    :value-format="state.prevItem.format || state.datetimeRangeFormat"
                    :picker-options="pickerOptions(state.startDateTime)"
                    class="tvp-search-box__date-picker"
                    @change="checkFormValidation()"
                  ></tiny-date-picker>
                  <div v-if="state.formErrors.endDateTime" class="tvp-search-box__error-msg">
                    {{ state.formErrors.endDateTime }}
                  </div>
                </div>
              </div>
            </div>
            <div class="tvp-search-box__bottom-btn">
              <tiny-button
                size="mini"
                @click="confirmEditTag(false)"
              >
                {{ t('tvp.tvpSearchbox.cancel') }}
              </tiny-button>
              <tiny-button
                size="mini"
                :disabled="state.hasFormError"
                @click="confirmEditTag(true)"
              >
                {{ t('tvp.tvpSearchbox.confirm') }}
              </tiny-button>
            </div>
          </template>
          <div
            v-else-if="state.popoverVisible"
            class="tvp-search-box__panel-box"
          >
            <slot
              :name="`${state.prevItem.slotName}-edit`"
              v-bind="{
                showDropdown: () => showPopover(state),
                onConfirm: handleEditConfirm
              }"
              @click.stop
            ></slot>
          </div>
        </tiny-popover>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
// Vue2 版本，使用 tiny-vue 的 renderless 架构
import { defineComponent, setup, $props, isVue2, hooks } from '@opentiny/vue-common'
import { renderless, api } from './renderless'
// 导入组件
import {
  TinyTag,
  TinyInput,
  TinyDropdown,
  TinyDropdownMenu,
  TinyButton,
  TinyTooltip,
  TinyDatePicker,
  TinyPopover,
  TinySelect,
  TinyOption,
} from '@opentiny/vue'
import { iconSearch, iconClose, iconHelpQuery } from '@opentiny/vue-icon'

import TinySearchBoxFirstLevelPanel from './components/first-level-panel.vue'
import TinySearchBoxSecondLevelPanel from './components/second-level-panel.vue'
// 样式通过构建工具自动导入，开发环境使用别名导入
import '@opentiny/vue-search-box-theme'

export default defineComponent({
  model: {
    prop: 'modelValue',
    event: 'update:modelValue'
  },
  props: {
    ...$props,
    tiny_mode: {
      type: String,
      default: 'pc'
    },
    modelValue: {
      type: Array,
      default: () => []
    },
    items: {
      type: Array,
      default: () => []
    },
    emptyPlaceholder: {
      type: String,
      default: ''
    },
    potentialOptions: {
      type: Object,
      default: () => null
    },
    showHelp: {
      type: Boolean,
      default: true
    },
    showPrefixIcon: {
      type: Boolean,
      default: true
    },
    idMapKey: {
      type: String,
      default: 'id'
    },
    defaultField: {
      type: String,
      default: ''
    },
    defaultFieldReplace: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: undefined
    },
    panelMaxHeight: {
      type: String,
      default: '999px'
    },
    splitInputValue: {
      type: String,
      default: ','
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    // 尺寸
    size: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'change', 'search', 'exceed', 'first-level-select', 'second-level-enter', 'clear', 'tag-click', 'help', 'validate-error'],
  components: {
    TinyTag,
    TinyInput,
    TinyDropdown,
    TinyDropdownMenu,
    TinyButton,
    TinyTooltip,
    TinyDatePicker,
    TinyPopover,
    TinySelect,
    TinyOption,
    TinySearchBoxFirstLevelPanel,
    TinySearchBoxSecondLevelPanel,
    // 图标组件
    TinyIconSearch: iconSearch(),
    TinyIconClose: iconClose(),
    TinyIconHelpQuery: iconHelpQuery()
  },
  setup(props, context) {
    const instance = hooks.getCurrentInstance()

    // 找到真正的父级实例（与 vue-common 的 getRealParent 逻辑一致）
    // 父级如果是 AsyncComponentWrapper 则跳过
    const directParent = instance?.parent
    const realParent =
      directParent?.type?.name === 'AsyncComponentWrapper' && directParent?.parent
        ? directParent.parent
        : directParent

    // 保存父级的 setupState.state
    // vue-common 的 setup 内部会通过 setParentAttribute 将 search-box 的 state 写入父级，
    // 由于 search-box 和 form-item 的 api 数组都包含 "state"，会导致父级 state 被覆盖
    const savedParentState = realParent?.setupState?.state

    // 调用 vue-common 的 setup（内部会调用 setParentAttribute 覆盖父级 state）
    const attrs = setup({ props, context, renderless, api })

    // 恢复父级的 setupState.state，防止 form-item 丢失 form/labelWidth/rules 等
    if (realParent?.setupState && savedParentState) {
      realParent.setupState.state = savedParentState
    }
    // 清除父级 ctx 上被 setParentAttribute 写入的 state
    if (realParent?.ctx && 'state' in realParent.ctx) {
      delete realParent.ctx.state
    }

    // 为内部组件（tiny-input 等）提供 form 上下文
    // tiny-input 通过 form.size / form.disabled 直接访问（非 form.state.size）
    // form 的 size/disabled 是 prop，需从 parentForm.size / parentForm.disabled 获取
    // 使用 getter 函数确保响应式：每次访问时重新求值，依赖 props 和 parentForm 的变化
    const parentForm = hooks.inject('form', null)
    const getFormSize = () => props.size || parentForm?.state?.size || parentForm?.size || ''
    const getFormDisabled = () => parentForm?.state?.disabled ?? parentForm?.disabled ?? false

    const formState = hooks.reactive({
      get size() { return getFormSize() },
      get disabled() { return getFormDisabled() },
      get labelWidth() { return parentForm?.state?.labelWidth },
      get labelSuffix() { return parentForm?.state?.labelSuffix },
      get showMessage() { return parentForm?.state?.showMessage },
      get rules() { return parentForm?.state?.rules ?? parentForm?.rules }
    })

    hooks.provide('form', {
      get size() { return getFormSize() },
      get disabled() { return getFormDisabled() },
      get displayOnly() { return parentForm?.displayOnly },
      get rules() { return parentForm?.rules },
      get labelWidth() { return parentForm?.labelWidth },
      get labelSuffix() { return parentForm?.labelSuffix },
      get showMessage() { return parentForm?.showMessage },
      get state() { return formState }
    })

    return attrs
  }
})
</script>
