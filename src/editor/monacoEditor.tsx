import React, { useEffect, useRef } from 'react';
import { useEditor } from "./editorContext";
import ReactBaseMonacoEditor, { Monaco } from "@monaco-editor/react";
import { BaseMonacoEditor, EditorApi, ModelInfoType } from '../types/monaco';
import {
  initTheme,
  registerLangs,
  initModels,
  registerCommandsAndActions,
  registerListeners,
} from './mountFunctions';
import TopBar from './components/topBar';

interface Props {
  modelInfos: ModelInfoType[]
}

function App({
  modelInfos
}: Props) {
  const { stateRef, dispatch, actions } = useEditor();
  const editorRef = useRef<BaseMonacoEditor>();
  const monacoRef = useRef<Monaco>();
  const editorApiRef = useRef<EditorApi>({} as EditorApi);

  function handleEditorDidMount(editor: BaseMonacoEditor, monaco: Monaco) {
    editorRef.current = editor;
    actions.updateMonaco(monaco);
    actions.updateEditor(editor);

    initTheme(monaco);
    initModels(monaco, editor, modelInfos, dispatch);

    registerCommandsAndActions(monaco, editor);
    registerListeners(editor, editorApiRef.current, stateRef.current);
  }

  function handleEditorBeforeMount(monaco: Monaco) {
    monacoRef.current = monaco;
    registerLangs(monaco, stateRef.current);
  }

  useEffect(() => {
    editorApiRef.current.addErrorMarker = () => {}
  }, [])

  return (
    <>
      <TopBar modelInfos={modelInfos} />
      <ReactBaseMonacoEditor
        height="90vh"
        onMount={handleEditorDidMount}
        beforeMount={handleEditorBeforeMount}
        defaultLanguage="solidity"
        defaultValue="// some comment"
      />
    </>
  )
}

export default App;