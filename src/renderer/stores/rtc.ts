import { ref } from 'vue'
import { defineStore } from 'pinia'

import { useAccountStore } from './account'
import type {
  RtcActionSignal,
  RtcAnswerSignal,
  RtcIceCandidateSignal,
  RtcOfferSignal,
} from '~/typings/app'
import { postRtcSignal } from '~/api/rtc'

export const useRtcStore = defineStore('rtc', () => {
  const accountStore = useAccountStore()

  const audioRtc = ref<Record<number, {
    rtcId: string
    status: 'waiting' | 'requested' | 'connected'
    conn?: RTCPeerConnection
    player?: HTMLAudioElement
    muted?: boolean
    offer?: RTCSessionDescriptionInit
    answer?: RTCSessionDescriptionInit
  } | undefined>>({})

  function closeAudioRtc(friendUid: number) {
    const rtcInfo = audioRtc.value[friendUid]
    if (!rtcInfo)
      return
    if (rtcInfo.conn)
      rtcInfo.conn.close()
    if (rtcInfo.player)
      rtcInfo.player.srcObject = null
    audioRtc.value[friendUid] = undefined
  }

  function muteAudioRtc(friendUid: number) {
    const rtcInfo = audioRtc.value[friendUid]
    if (!rtcInfo)
      return
    if (!rtcInfo.player)
      return
    rtcInfo.player.muted = true
    rtcInfo.muted = true
  }

  function unmuteAudioRtc(friendUid: number) {
    const rtcInfo = audioRtc.value[friendUid]
    if (!rtcInfo)
      return
    if (!rtcInfo.player)
      return
    rtcInfo.player.muted = false
    rtcInfo.muted = false
  }

  async function postOffer(friendUid: number, hostAndPort: string) {
    // 检查
    const myUid = accountStore.uid
    if (!myUid)
      throw new Error('当前 UID 为空值')
    // 创建 WebRTC 连接
    const rtcId = crypto.randomUUID()
    const conn = new RTCPeerConnection()
    // 设置 WebRTC 事件处理
    conn.onicecandidate = async (e) => {
      if (!e.candidate)
        return
      const iceCandidateSignal: RtcIceCandidateSignal = {
        type: 'ice-candidate',
        from: myUid,
        to: friendUid,
        timestamp: Date.now(),
        rtcId,
        candidate: e.candidate,
      }
      await postRtcSignal(hostAndPort, iceCandidateSignal)
    }
    conn.ontrack = (e) => {
      const rtcInfo = audioRtc.value[friendUid]
      if (!rtcInfo)
        return
      rtcInfo.player = rtcInfo.player ? rtcInfo.player : document.createElement('audio')
      rtcInfo.player.autoplay = true
      rtcInfo.player.srcObject = e.streams[0]
    }
    conn.onconnectionstatechange = () => {
      const state = conn.connectionState
      if (state === 'closed' || state === 'failed' || state === 'disconnected')
        closeAudioRtc(friendUid)
    }
    // 更新状态
    audioRtc.value[friendUid] = {
      status: 'waiting',
      rtcId,
      conn,
    }
    // 获取音频流
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    for (const track of stream.getTracks())
      conn.addTrack(track, stream)
    // 创建 WebRTC offer
    const offer = await conn.createOffer()
    conn.setLocalDescription(offer)
    // 发送 offer signal
    const offerSignal: RtcOfferSignal = {
      type: 'offer',
      from: myUid,
      to: friendUid,
      timestamp: Date.now(),
      rtcId,
      offer,
    }
    await postRtcSignal(hostAndPort, offerSignal)
  }

  async function postAnswer(friendUid: number, hostAndPort: string) {
    // 检查
    const myUid = accountStore.uid
    if (!myUid)
      throw new Error('当前 UID 为空值')
    const rtcInfo = audioRtc.value[friendUid]
    if (!rtcInfo || !rtcInfo.offer)
      throw new Error('rtcInfo 错误')
    // 创建 WebRTC 连接
    const conn = new RTCPeerConnection()
    // 设置 WebRTC 事件处理
    conn.onicecandidate = async (e) => {
      if (!e.candidate)
        return
      const iceCandidateSignal: RtcIceCandidateSignal = {
        type: 'ice-candidate',
        from: myUid,
        to: friendUid,
        timestamp: Date.now(),
        rtcId: rtcInfo.rtcId,
        candidate: e.candidate,
      }
      await postRtcSignal(hostAndPort, iceCandidateSignal)
    }
    conn.ontrack = (e) => {
      const rtcInfo = audioRtc.value[friendUid]
      if (!rtcInfo)
        return
      rtcInfo.player = rtcInfo.player ? rtcInfo.player : document.createElement('audio')
      rtcInfo.player.autoplay = true
      rtcInfo.player.srcObject = e.streams[0]
    }
    conn.onconnectionstatechange = () => {
      const state = conn.connectionState
      if (state === 'closed' || state === 'failed' || state === 'disconnected')
        closeAudioRtc(friendUid)
    }
    // 更新状态
    conn.setRemoteDescription(rtcInfo.offer)
    rtcInfo.status = 'connected'
    rtcInfo.conn = conn
    // 创建 WebRTC answer
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    for (const track of stream.getTracks())
      conn.addTrack(track, stream)
    const answer = await conn.createAnswer()
    conn.setLocalDescription(answer)
    // 发送 answer signal
    const answerSignal: RtcAnswerSignal = {
      type: 'answer',
      from: myUid,
      to: friendUid,
      timestamp: Date.now(),
      rtcId: rtcInfo.rtcId,
      answer,
    }
    await postRtcSignal(hostAndPort, answerSignal)
  }

  async function postAction(friendUid: number, hostAndPort: string, action: RtcActionSignal['action']) {
    // 检查
    const myUid = accountStore.uid
    if (!myUid)
      throw new Error('当前 UID 为空值')
    const rtcInfo = audioRtc.value[friendUid]
    if (!rtcInfo)
      throw new Error('rtcInfo 错误')
    // 发送 action signal
    const actionSignal: RtcActionSignal = {
      type: 'action',
      from: myUid,
      to: friendUid,
      timestamp: Date.now(),
      rtcId: rtcInfo.rtcId,
      action,
    }
    await postRtcSignal(hostAndPort, actionSignal)
  }

  window.electron.setRtcSignalHandler(async (signal) => {
    // 校验
    if (signal.to !== accountStore.uid)
      return
    // 处理不同的 signal
    switch (signal.type) {
      case 'offer': {
        // 更新状态
        audioRtc.value[signal.from] = {
          status: 'requested',
          rtcId: signal.rtcId,
          offer: signal.offer,
        }
        break
      }
      case 'action': {
        switch (signal.action) {
          case 'cancel':
          case 'reject':
          case 'close':
            closeAudioRtc(signal.from)
            break
        }
        break
      }
      case 'answer': {
        const rtcInfo = audioRtc.value[signal.from]
        if (!rtcInfo)
          break
        if (!rtcInfo.conn)
          return
        // 更新状态
        rtcInfo.conn.setRemoteDescription(signal.answer)
        rtcInfo.status = 'connected'
        rtcInfo.answer = signal.answer
        break
      }
      case 'ice-candidate': {
        const rtcInfo = audioRtc.value[signal.from]
        if (!rtcInfo)
          break
        if (!rtcInfo.conn)
          return
        rtcInfo.conn.addIceCandidate(signal.candidate)
        break
      }
    }
  })

  return {
    audioRtc,

    closeAudioRtc,
    muteAudioRtc,
    unmuteAudioRtc,
    postOffer,
    postAnswer,
    postAction,
  }
})
