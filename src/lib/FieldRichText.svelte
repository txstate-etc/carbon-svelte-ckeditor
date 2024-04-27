<script lang="ts">
  import WarningAlt from 'carbon-icons-svelte/lib/WarningAlt.svelte'
  import type { EditorConfig } from '@ckeditor/ckeditor5-core'
  import type { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic'
  import type { SourceEditing } from '@ckeditor/ckeditor5-source-editing'
  import { feedbackTypeToKind } from '@txstate-mws/carbon-svelte'
  import { ScreenReaderOnly } from '@txstate-mws/svelte-components'
  import { FORM_CONTEXT, FORM_INHERITED_PATH, nullableDeserialize, nullableSerialize, type FormStore, Field } from '@txstate-mws/svelte-forms'
  import { InlineNotification } from 'carbon-components-svelte'
  import { getContext, onDestroy, onMount, tick } from 'svelte'
  import { isNotBlank, randomid } from 'txstate-utils'
  import { getParserElement } from './util'
  import { type ConfigType, getConfig } from './RichTextTypes'

  import './richstyles.css'

  export let path: string
  export let maxlength: number | undefined = undefined
  export let configType: ConfigType = 'default'
  export let config: EditorConfig | undefined = undefined
  export let editor: ClassicEditor | undefined = undefined
  export let compact: boolean = false
  export let labelText: string
  export let helpText: string | undefined = undefined
  export let notNull = false
  export let conditional = true
  export let defaultValue: string | undefined = notNull ? '' : undefined

  const ssr = typeof document === 'undefined'

  const formStore = getContext<FormStore>(FORM_CONTEXT)
  const inheritedPath = getContext<string>(FORM_INHERITED_PATH)
  const finalPath = [inheritedPath, path].filter(isNotBlank).join('.')
  const value = formStore.getField<string>(finalPath)

  const editorId = randomid()
  const helpTextId = helpText ? randomid() : undefined
  const errMsgId = randomid()

  const presetConfig = getConfig(configType)

  let element: HTMLElement
  let wrapper: HTMLElement
  let skipReaction = false
  let mounted = false
  onMount(async () => {
    mounted = true
    if (ssr) return
    const Editor = (await import('@dosgato/ckeditor')).default as typeof ClassicEditor
    editor = await Editor.create(element, {
      ...presetConfig,
      ...config
    })
    editor.ui.focusTracker.on('change:isFocused', (evt, name, isFocused) => { if (!isFocused) formStore.dirtyField(finalPath) })
    editor.model.document.on('change:data', () => {
      skipReaction = true
      void formStore.setField(finalPath, nullableDeserialize(editor!.getData()))
      void tick().then(() => { skipReaction = false })
    })
    reactToValue()
    setModalZ()

    // updating CKEditor 5 hardcoded sr-only label and set aria-describedby to help text
    const richEditorLabel = wrapper?.querySelector('label')
    if (richEditorLabel) richEditorLabel.innerHTML = labelText
    const editorDiv = wrapper.querySelector('> .ck-editor')
    if (editorDiv && helpTextId) editorDiv.setAttribute('aria-describedby', helpTextId)
  })
  onDestroy(async () => await editor?.destroy())

  function setModalZ () {
    const modalz = getComputedStyle(element).getPropertyValue('--modal-z')
    document.documentElement.style.setProperty('--ck-z-default', modalz || '1')
    document.documentElement.style.setProperty('--ck-z-modal', String(Number(modalz) + 1 || '1'))
  }

  let charlength: number = 0
  function reactToValue (..._: any) {
    if (!mounted) return
    const serialized = nullableSerialize($value)
    if (serialized.trim().length > 0) {
      const testEl = getParserElement()
      testEl.innerHTML = serialized
      charlength = testEl.innerText.trim().length
    }
    if (skipReaction) return
    if (editor && !editor.plugins.get('SourceEditing')?.isSourceEditingMode && editor.getData() !== serialized) {
      editor.setData(serialized)
    }
  }
  $: reactToValue($value)
  $: exceeded = maxlength && maxlength > 0 && charlength > maxlength
</script>

<Field {path} {notNull} {conditional} {defaultValue} let:messages let:invalid let:path={fullpath}>
  {@const errMsgs = messages.filter(m => m.type === 'error').map(m => m.message)}
  {@const restMsgs = messages.filter(m => m.type !== 'error')}
  <label for={editorId} class="bx--label">{labelText}</label>
  <div bind:this={wrapper} class='ck-wrapper' class:compact>
    <textarea id={editorId} name={fullpath} bind:this={element} aria-describedby={helpTextId} />
  </div>
  <div class="field-richtext-footer">
    <div id={helpTextId} class="bx--form__helper-text">{#if !errMsgs.length && helpText}<ScreenReaderOnly>{helpText ?? ''}</ScreenReaderOnly>{:else}{helpText ?? ''}{/if}</div>
    <div class="bx--text-input__field-wrapper" data-invalid={invalid}></div>
    <div id={errMsgId} class="bx--form-requirement">{errMsgs.join('<br>\n')}</div>
    {#if maxlength}
      <div class="field-richtext-charcount">
        <span class="field-richtext-count" class:exceeded>
          {#if exceeded}<WarningAlt aria-hidden />{/if}
          {charlength}
        </span>
        /
        <span class="field-richtext-max">{maxlength}</span>
      </div>
    {/if}
  </div>
  {#each restMsgs as message}
    <InlineNotification kind={feedbackTypeToKind(message.type)} subtitle={message.message} hideCloseButton />
  {/each}
</Field>

<style>
  .field-richtext-footer {
    display: flex;
    align-items: flex-start;
  }
  .field-richtext-footer > * {
    width: auto;
  }

  .field-richtext-charcount {
    margin-left: auto;
    white-space: nowrap;
  }
  .field-richtext-count.exceeded {
    color: var(--cds-text-error, #da1e28);
  }
  .field-richtext-count :global(svg) {
    vertical-align: -0.125em;
    width: 1em;
    height: 1em;
  }

  .ck-wrapper :global(.ck-editor .ck-content) {
    min-height: 400px;
    max-height: 75vh;
    overflow: auto;
  }

  .ck-wrapper.compact :global(.ck-editor .ck-content) {
    min-height: 150px;
    resize: vertical;
  }

  .ck-wrapper :global(.ck-content figure.table) {
    display: block;
  }
  .ck-wrapper :global(figure.table table) {
    width: 100%;
    overflow-x: auto;
  }
  .ck-wrapper :global(figure.table.auto-width table) {
    width: auto;
  }

  .ck-wrapper :global(figure.table.full-width table) {
    width: 100%;
  }

  .ck-wrapper :global(figure.table.ck-widget.border table),
  .ck-wrapper :global(.table.ck-widget.border table th),
  .ck-wrapper :global(.table.ck-widget.border table td) {
    border-width: 2px;
    border-style: solid;
  }

  .ck-wrapper :global(.ck.ck-label.dialog-field-label) {
    display: block;
    margin-bottom: 0.3em;
    font-weight: 500;
  }
  .bx--text-input__field-wrapper {
    display: none;
  }
</style>
