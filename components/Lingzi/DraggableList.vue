<template>
  <div>
    <div class="simple-page">
      <Container
        :orientation="horizontal ? 'horizontal' : 'vertical'"
        @drop="onDrop"
      >
        <Draggable
          v-for="item, index in items"
          :key="item.id"
        >
          <div class="draggable-item">
            <slot
              :item="item"
              :index="index"
              name="item"
            >
              {{ item }}
            </slot>
          </div>
        </Draggable>
      </Container>
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd'

export const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult
  if (removedIndex === null && addedIndex === null) { return arr }

  const result = [...arr]
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0]
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd)
  }

  return result
}

export const generateItems = (count, creator) => {
  const result = []
  for (let i = 0; i < count; i++) {
    result.push(creator(i))
  }
  return result
}
export default {
  name: 'Simple',
  components: { Container, Draggable },
  props: {
    horizontal: {
      type: Boolean,
      default: false
    },
    dragItems: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      items: []
    }
  },
  watch: {
    dragItems: {
      deep: true,
      handler () {
        this.items = this.dragItems
      }
    }
  },
  mounted () {
    this.items = [...this.dragItems]
  },
  methods: {
    onDrop (dropResult) {
      this.items = applyDrag(this.items, dropResult)
      this.$emit('dragged', this.items)
    }
  }
}
</script>
