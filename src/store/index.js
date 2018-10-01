import Vuex from 'vuex'
import Vue from 'vue'

import uuidv1 from 'uuid/v1'

Vue.use(Vuex)

let state = {
  name: '',
  uuid: uuidv1(),
  users: [],
  incomingCall: {
    from: null
  },
  outgoingCall: {
    to: null
  },
  call: {
    partner: {
      uuid: null,
      candidate: null
    },
    answered: false
  }
}

let mutations = {
  setName (state, name) {
    state.name = name
  },
  setUsers (state, users) {
    state.users = users
  },
  setIncomingCall (state, from) {
    state.incomingCall.from = from
  },
  setOutgoingCall (state, to) {
    state.outgoingCall.to = to
  }
}

let actions = {
  setName ({commit}, name) {
    commit('setName', name)
  },
  updateUsers ({commit, state}, users) {
    commit('setUsers', users)
    if (state.incomingCall.from && !state.users.find((u) => u.uuid === state.incomingCall.from)) {
      commit('setIncomingCall', null)
    }
    if (state.outgoingCall.to && !state.users.find((u) => u.uuid === state.outgoingCall.to)) {
      commit('setOutgoingCall', null)
    }
  },
  setIncomingCall ({commit}, from) {
    commit('setIncomingCall', from)
  },
  setOutgoingCall ({commit}, to) {
    commit('setOutgoingCall', to)
  },
  answerCall ({commit}) {

  }
}

let getters = {}

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
