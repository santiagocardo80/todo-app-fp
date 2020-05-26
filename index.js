import { over, lensProp, remove, append } from 'ramda'

import { renderApp } from './ui'
import { Fn } from './types'
const { ask } = Fn

const L = { habits: lensProp('habits') }

const Merge = x =>
  ({
    x,
    concat: other => Merge(Object.assign({}, x, other.x))
  })

const create = habit => ask.map(over(L.habits, append(habit)))
const destroy = ({ idx }) => ask.map(over(L.habits, remove(idx, 1)))
const view = ({ idx }) => Fn.of({ page: 'show', index: idx })

const router = { create, destroy, view }

const appLoop = state =>
  renderApp(state, (action, payload) =>
    appLoop(
      Merge(state)
        .concat(Merge(router[action](payload).run(state)))
        .x
    )
  )

appLoop({ page: 'list', habits: [] })
