import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { IconButton, Menu, Divider } from 'react-native-paper';
import { WebView } from 'react-native-webview';

interface RichTextWebEditorProps {
  value: string;
  onChangeText: (text: string) => void;
}

const FONT_FAMILIES = [
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
];

export default function RichTextWebEditor({
  value,
  onChangeText,
}: RichTextWebEditorProps) {
  const webViewRef = useRef<WebView>(null);
  const [fontMenuVisible, setFontMenuVisible] = useState(false);
  const contentRef = useRef(value);
  const updateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialContent = useRef(value);

  const executeCommand = useCallback((command: string, value?: string) => {
    const script = value 
      ? `document.execCommand('${command}', false, '${value}'); true;`
      : `document.execCommand('${command}', false, null); true;`;
    webViewRef.current?.injectJavaScript(script);
  }, []);

  const handleMessage = useCallback((event: any) => {
    const content = event.nativeEvent.data;
    contentRef.current = content;
    
    // Solo actualizar el padre después de 1 segundo de inactividad
    if (updateTimerRef.current) {
      clearTimeout(updateTimerRef.current);
    }
    
    updateTimerRef.current = setTimeout(() => {
      onChangeText(contentRef.current);
    }, 1000);
  }, [onChangeText]);

  // Actualizar el contenido cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) {
        clearTimeout(updateTimerRef.current);
      }
      if (contentRef.current) {
        onChangeText(contentRef.current);
      }
    };
  }, [onChangeText]);

  const editorHTML = useMemo(() => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Times New Roman', serif;
      font-size: 13px;
      line-height: 1.6;
      padding: 16px;
      color: #000;
    }
    #editor {
      min-height: 500px;
      outline: none;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    #editor:empty:before {
      content: 'Escribe el contrato aquí...';
      color: #999;
    }
  </style>
</head>
<body>
  <div id="editor" contenteditable="true">${initialContent.current}</div>
  <script>
    const editor = document.getElementById('editor');
    
    editor.addEventListener('input', function() {
      window.ReactNativeWebView.postMessage(editor.innerHTML);
    });
    
    // Prevenir zoom en iOS
    document.addEventListener('gesturestart', function(e) {
      e.preventDefault();
    });
  </script>
</body>
</html>
  `, []);

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: editorHTML }}
        onMessage={handleMessage}
        style={styles.webView}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      />

      <View style={styles.toolbar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolbarContent}>
          <Menu
            visible={fontMenuVisible}
            onDismiss={() => setFontMenuVisible(false)}
            anchor={
              <IconButton
                icon="format-font"
                size={20}
                onPress={() => setFontMenuVisible(!fontMenuVisible)}
                style={styles.toolbarButton}
              />
            }
            contentStyle={{ backgroundColor: '#fff' }}
          >
            {FONT_FAMILIES.map((font) => (
              <Menu.Item
                key={font.value}
                onPress={() => {
                  executeCommand('fontName', font.value.split(',')[0]);
                  setTimeout(() => setFontMenuVisible(false), 100);
                }}
                title={font.label}
              />
            ))}
          </Menu>

          <Divider style={styles.divider} />

          <IconButton
            icon="format-bold"
            size={20}
            onPress={() => executeCommand('bold')}
            style={styles.toolbarButton}
          />

          <IconButton
            icon="format-italic"
            size={20}
            onPress={() => executeCommand('italic')}
            style={styles.toolbarButton}
          />

          <IconButton
            icon="format-underline"
            size={20}
            onPress={() => executeCommand('underline')}
            style={styles.toolbarButton}
          />

          <Divider style={styles.divider} />

          <IconButton
            icon="format-align-left"
            size={20}
            onPress={() => executeCommand('justifyLeft')}
            style={styles.toolbarButton}
          />

          <IconButton
            icon="format-align-center"
            size={20}
            onPress={() => executeCommand('justifyCenter')}
            style={styles.toolbarButton}
          />

          <IconButton
            icon="format-align-right"
            size={20}
            onPress={() => executeCommand('justifyRight')}
            style={styles.toolbarButton}
          />

          <IconButton
            icon="format-align-justify"
            size={20}
            onPress={() => executeCommand('justifyFull')}
            style={styles.toolbarButton}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  toolbar: {
    backgroundColor: '#F5F6FA',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingVertical: 4,
  },
  toolbarContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
    gap: 4,
  },
  toolbarButton: {
    margin: 0,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  webView: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
