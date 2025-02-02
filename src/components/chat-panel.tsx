'use client'

import * as React from 'react'
import Image from 'next/image'
import Textarea from 'react-textarea-autosize'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'

import BrushIcon from '@/assets/images/brush.svg'
import ChatIcon from '@/assets/images/chat.svg'
import VisualSearchIcon from '@/assets/images/visual-search.svg'
import SendIcon from '@/assets/images/send.svg'
import PinIcon from '@/assets/images/pin.svg'
import PinFillIcon from '@/assets/images/pin-fill.svg'

import { useBing } from '@/lib/hooks/use-bing'

export interface ChatPanelProps
  extends Pick<
    ReturnType<typeof useBing>,
    | 'generating'
    | 'input'
    | 'setInput'
    | 'sendMessage'
    | 'resetConversation'
  > {
  id?: string
  className?: string
}

export function ChatPanel({
  generating,
  input,
  setInput,
  className,
  sendMessage,
  resetConversation
}: ChatPanelProps) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const {formRef, onKeyDown} = useEnterSubmit()
  const [focused, setFocused] = React.useState(false)
  const [active, setActive] = React.useState(false)
  const [pin, setPin] = React.useState(false)
  const [tid, setTid] = React.useState<any>()

  const setBlur = React.useCallback(() => {
    clearTimeout(tid)
    setActive(false)
    const _tid = setTimeout(() => setFocused(false), 2000);
    setTid(_tid);
  }, [tid])

  const setFocus = React.useCallback(() => {
    setFocused(true)
    setActive(true)
    clearTimeout(tid)
    inputRef.current?.focus()
  }, [tid])

  React.useEffect(() => {
    if (input) {
      setFocus()
    }
  }, [input])

  return (
    <form
      className={cn('chat-panel', className)}
      onSubmit={async e => {
        e.preventDefault()
        if (generating) {
          return;
        }
        if (!input?.trim()) {
          return
        }
        setInput('')
        setPin(false)
        await sendMessage(input)
      }}
      ref={formRef}
    >
      <div className="action-bar pb-4">
        <div className={cn('action-root', { focus: active || pin })} speech-state="hidden" visual-search="" drop-target="">
          <div className="fade bottom">
            <div className="background"></div>
          </div>
          <div className={cn('outside-left-container', { collapsed: focused })}>
            <div className="button-compose-wrapper">
              <button className="body-2 button-compose" type="button" aria-label="新主题" onClick={resetConversation}>
                <div className="button-compose-content">
                  <Image className="pl-2" alt="brush" src={BrushIcon} width={40} />
                  <div className="button-compose-text">新主题</div>
                </div>
              </button>
            </div>
          </div>
          <div
            className={cn('main-container', { active: active || pin })}
            style={{ minHeight: pin ? '360px' : undefined }}
            onClickCapture={setFocus}
            onBlurCapture={setBlur}
          >
            <div className="main-bar">
              <Image alt="chat" src={ChatIcon} width={20} color="blue" />
              <Textarea
                ref={inputRef}
                tabIndex={0}
                onKeyDown={onKeyDown}
                rows={1}
                value={input}
                onChange={e => setInput(e.target.value.slice(0, 4000))}
                placeholder="Shift + Enter 换行"
                spellCheck={false}
                className="message-input min-h-[24px] -mx-1 w-full text-base resize-none bg-transparent focus-within:outline-none"
              />
              <Image alt="visual-search" src={VisualSearchIcon} width={20} />
              <button type="submit">
                <Image alt="send" src={SendIcon} width={20} style={{ marginTop: '2px' }} />
              </button>
            </div>
            <div className="body-1 bottom-bar">
              <div className="letter-counter"><span>{input.length}</span>/4000</div>
              <button onClick={() => {
                console.log('onclick')
                setPin(!pin)
              }} className="pr-2">
               <Image alt="pin" src={pin ? PinFillIcon : PinIcon} width={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
